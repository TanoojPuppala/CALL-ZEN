package com.smartcallai.app.ui.calling

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class CallingViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    val activeSession: StateFlow<CallingSession?> = repository.getActiveSession()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val currentQueue: StateFlow<List<CallingQueueItem>> = activeSession.flatMapLatest { session ->
        if (session != null) repository.getCallingQueue(session.sessionId) else flowOf(emptyList())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val leaveRecords: StateFlow<List<LeaveRecord>> = repository.getLeaveRecords()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentQueueItem: StateFlow<CallingQueueItem?> = combine(activeSession, currentQueue) { session, queue ->
        if (session != null && queue.isNotEmpty()) {
            val idx = session.currentQueueIndex.coerceIn(0, queue.size - 1)
            queue.getOrNull(idx)
        } else null
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val currentContact: StateFlow<Contact?> = currentQueueItem.flatMapLatest { item ->
        if (item != null) repository.getContactById(item.contactId) else flowOf(null)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    private val _isCallActive = MutableStateFlow(false)
    val isCallActive: StateFlow<Boolean> = _isCallActive.asStateFlow()

    private val _callStartTime = MutableStateFlow<Long?>(null)

    private val _pendingReport = MutableStateFlow<CallReport?>(null)
    val pendingReport: StateFlow<CallReport?> = _pendingReport.asStateFlow()

    private val _pendingLog = MutableStateFlow<CallLog?>(null)
    val pendingLog: StateFlow<CallLog?> = _pendingLog.asStateFlow()

    private val _selectedNumberType = MutableStateFlow(NumberUsedType.PRIMARY)
    val selectedNumberType: StateFlow<NumberUsedType> = _selectedNumberType.asStateFlow()

    fun setSelectedNumberType(type: NumberUsedType) {
        _selectedNumberType.value = type
    }

    fun startCallingSession(periodId: String, selectedContacts: List<Contact>) {
        viewModelScope.launch {
            if (selectedContacts.isEmpty() || periodId.isBlank()) return@launch
            repository.createCallingSession(periodId, selectedContacts)
            _selectedNumberType.value = NumberUsedType.PRIMARY
        }
    }

    fun dialCurrentContact(context: Context, contact: Contact, numberType: NumberUsedType) {
        val phoneNumber = if (numberType == NumberUsedType.PRIMARY) contact.primaryPhone else contact.alternatePhone
        if (phoneNumber.isBlank()) return

        _selectedNumberType.value = numberType
        _isCallActive.value = true
        _callStartTime.value = System.currentTimeMillis()

        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:${phoneNumber.replace(" ", "")}")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun onCallEnded(outcome: CallOutcome, userNotes: String = "") {
        _isCallActive.value = false
        val session = activeSession.value ?: return
        val contact = currentContact.value ?: return

        val duration = if (_callStartTime.value != null) {
            ((System.currentTimeMillis() - _callStartTime.value!!) / 1000).toInt()
        } else 0

        val numberUsed = if (_selectedNumberType.value == NumberUsedType.PRIMARY) contact.primaryPhone else contact.alternatePhone

        val logId = "log_${System.currentTimeMillis()}"
        val log = CallLog(
            logId = logId,
            sessionId = session.sessionId,
            contactId = contact.contactId,
            numberUsed = numberUsed,
            numberUsedType = _selectedNumberType.value,
            callTime = System.currentTimeMillis(),
            durationSeconds = duration,
            outcomeStatus = outcome,
            notes = userNotes
        )

        val (defaultReason, defaultFollowUp) = when (outcome) {
            CallOutcome.ANSWERED, CallOutcome.COMPLETED ->
                Pair("Call connected successfully.", "Follow up if needed")
            CallOutcome.NO_ANSWER ->
                Pair("Unanswered call attempt.", "Retry later")
            CallOutcome.BUSY ->
                Pair("Line was busy.", "Retry in 1 hour")
            CallOutcome.SWITCHED_OFF ->
                Pair("Phone switched off or unreachable.", "Try alternate number")
            CallOutcome.CALLBACK_REQUIRED ->
                Pair("Callback requested.", "Schedule callback")
            else ->
                Pair("Outcome recorded: ${outcome.displayName}", "None")
        }

        val report = CallReport(
            reportId = "report_${System.currentTimeMillis()}",
            logId = logId,
            contactId = contact.contactId,
            aiStatus = outcome,
            aiReason = userNotes.ifBlank { defaultReason },
            followUpAction = defaultFollowUp,
            followUpDate = if (outcome in listOf(CallOutcome.NO_ANSWER, CallOutcome.BUSY, CallOutcome.CALLBACK_REQUIRED)) "Tomorrow" else null,
            isConfirmed = false
        )

        _pendingLog.value = log
        _pendingReport.value = report
    }

    fun updatePendingReport(status: CallOutcome, reason: String, followUp: String) {
        val current = _pendingReport.value ?: return
        _pendingReport.value = current.copy(
            aiStatus = status,
            aiReason = reason,
            followUpAction = followUp
        )
        val log = _pendingLog.value
        if (log != null) {
            _pendingLog.value = log.copy(outcomeStatus = status)
        }
    }

    fun confirmReportAndProceedNext() {
        viewModelScope.launch {
            val log = _pendingLog.value ?: return@launch
            val report = _pendingReport.value ?: return@launch
            val session = activeSession.value ?: return@launch
            val queue = currentQueue.value
            val currentItem = currentQueueItem.value ?: return@launch

            repository.recordCallLogAndReport(log, report.copy(isConfirmed = true, confirmedAt = System.currentTimeMillis()))

            val itemStatus = if (log.outcomeStatus in listOf(CallOutcome.ANSWERED, CallOutcome.COMPLETED)) {
                QueueItemStatus.COMPLETED
            } else {
                QueueItemStatus.RETRY_REQUIRED
            }
            repository.updateQueueItemStatus(currentItem.queueItemId, itemStatus, log.logId)

            _pendingLog.value = null
            _pendingReport.value = null

            val nextIdx = session.currentQueueIndex + 1
            if (nextIdx < queue.size) {
                repository.pauseSession(session.sessionId, session.isPaused, nextIdx)
            } else {
                repository.pauseSession(session.sessionId, isPaused = true, currentQueueIndex = queue.size)
            }
        }
    }

    fun pauseCallingSession() {
        viewModelScope.launch {
            val session = activeSession.value ?: return@launch
            repository.pauseSession(session.sessionId, isPaused = true, session.currentQueueIndex)
        }
    }

    fun resumeCallingSession() {
        viewModelScope.launch {
            val session = activeSession.value ?: return@launch
            repository.pauseSession(session.sessionId, isPaused = false, session.currentQueueIndex)
        }
    }
}
