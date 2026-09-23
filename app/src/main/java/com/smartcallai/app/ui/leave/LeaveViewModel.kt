package com.smartcallai.app.ui.leave

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class LeaveViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    val leaveRecords: StateFlow<List<LeaveRecord>> = repository.getLeaveRecords()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val periodIdFlow = repository.getCurrentPeriod().map { it?.periodId ?: "" }

    val contacts: StateFlow<List<Contact>> = periodIdFlow.flatMapLatest { pId ->
        if (pId.isNotBlank()) repository.getContacts(pId) else flowOf(emptyList())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addLeaveRequest(
        contactId: String,
        leaveType: String,
        startDate: String,
        endDate: String,
        durationDays: Int,
        reason: String,
        notes: String = "",
        autoApprove: Boolean = true
    ) {
        viewModelScope.launch {
            val period = repository.getCurrentPeriod().first() ?: return@launch
            val org = repository.getCurrentOrganization().first() ?: return@launch
            val user = repository.getCurrentUser().first()

            val leave = LeaveRecord(
                leaveId = "leave_${System.currentTimeMillis()}",
                contactId = contactId,
                organizationId = org.organizationId,
                periodId = period.periodId,
                leaveType = leaveType,
                startDate = startDate,
                endDate = endDate,
                durationDays = durationDays,
                reason = reason,
                notes = notes,
                status = if (autoApprove) LeaveStatus.APPROVED else LeaveStatus.PENDING,
                requestedBy = user?.name ?: "Admin",
                approvedBy = if (autoApprove) user?.name ?: "Admin" else null,
                approvedAt = if (autoApprove) System.currentTimeMillis() else null
            )
            repository.addLeaveRecord(leave)
        }
    }

    fun approveLeave(leaveId: String) {
        viewModelScope.launch {
            val user = repository.getCurrentUser().first()
            repository.updateLeaveStatus(leaveId, LeaveStatus.APPROVED, user?.name ?: "Admin")
        }
    }

    fun rejectLeave(leaveId: String) {
        viewModelScope.launch {
            val user = repository.getCurrentUser().first()
            repository.updateLeaveStatus(leaveId, LeaveStatus.REJECTED, user?.name ?: "Admin")
        }
    }

    fun extendLeave(leaveId: String, currentEndDate: String, extraDays: Int) {
        viewModelScope.launch {
            repository.extendLeave(leaveId, currentEndDate, extraDays)
        }
    }

    fun cancelLeave(leaveId: String) {
        viewModelScope.launch {
            repository.cancelLeave(leaveId)
        }
    }

    fun deleteLeaveRecord(leaveId: String) {
        viewModelScope.launch {
            repository.deleteLeaveRecord(leaveId)
        }
    }
}
