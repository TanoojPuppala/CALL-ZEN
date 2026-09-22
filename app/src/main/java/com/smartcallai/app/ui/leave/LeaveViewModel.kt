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

    val contacts: StateFlow<List<Contact>> = repository.getCurrentPeriod().flatMapLatest { period ->
        if (period != null) repository.getContacts(period.periodId) else flowOf(emptyList())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addLeaveRequest(
        contactId: String,
        leaveType: String,
        startDate: String,
        endDate: String,
        durationDays: Int,
        reason: String,
        notes: String,
        autoApprove: Boolean = true
    ) {
        viewModelScope.launch {
            val user = repository.getCurrentUser().first()
            val org = repository.getCurrentOrganization().first()
            val period = repository.getCurrentPeriod().first()

            if (org == null || period == null) return@launch

            val requesterName = user?.name ?: "Authorized User"

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
                requestedBy = requesterName,
                approvedBy = if (autoApprove) requesterName else null,
                approvedAt = if (autoApprove) System.currentTimeMillis() else null
            )
            repository.addLeaveRecord(leave)
        }
    }

    fun approveLeave(leaveId: String) {
        viewModelScope.launch {
            val user = repository.getCurrentUser().first()
            val approverName = user?.name ?: "Authorized Admin"
            repository.updateLeaveStatus(leaveId, LeaveStatus.APPROVED, approverName)
        }
    }

    fun rejectLeave(leaveId: String) {
        viewModelScope.launch {
            val user = repository.getCurrentUser().first()
            val reviewerName = user?.name ?: "Authorized Admin"
            repository.updateLeaveStatus(leaveId, LeaveStatus.REJECTED, reviewerName)
        }
    }

    fun extendLeave(leaveId: String, newEndDate: String, extraDays: Int) {
        viewModelScope.launch {
            val leave = leaveRecords.value.find { it.leaveId == leaveId } ?: return@launch
            val updatedDuration = leave.durationDays + extraDays
            repository.extendLeave(leaveId, newEndDate, updatedDuration)
        }
    }

    fun cancelLeave(leaveId: String) {
        viewModelScope.launch {
            repository.cancelLeave(leaveId)
        }
    }
}
