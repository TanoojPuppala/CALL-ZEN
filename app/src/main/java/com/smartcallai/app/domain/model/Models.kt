package com.smartcallai.app.domain.model

data class User(
    val userId: String,
    val name: String,
    val email: String,
    val role: UserRole,
    val organizationId: String
)

data class Organization(
    val organizationId: String,
    val name: String,
    val industryType: IndustryType,
    val code: String
)

data class IndustryConfig(
    val industryType: IndustryType,
    val contactLabel: String,      // e.g. "Student", "Customer", "Applicant"
    val groupLabel: String,        // e.g. "Class / Section", "Branch", "Department"
    val customFields: List<String> = emptyList()
)

data class Period(
    val periodId: String,
    val organizationId: String,
    val name: String,             // e.g. "2024-2025 Semester 1 - Class 10A"
    val startDate: String,
    val endDate: String,
    val isCurrent: Boolean = true
)

data class Contact(
    val contactId: String,
    val organizationId: String,
    val periodId: String,
    val rollOrIdNumber: String,
    val name: String,
    val primaryPhone: String,
    val alternatePhone: String,
    val weeklyAttendance: Float,
    val monthlyAttendance: Float,
    val overallAttendance: Float,
    val currentStatus: String,     // e.g. "Absent Today", "Present", "On Leave"
    val isSelected: Boolean = false,
    val groupName: String = "Class 10A",
    val notes: String = ""
)

data class LeaveRecord(
    val leaveId: String,
    val contactId: String,
    val organizationId: String,
    val periodId: String,
    val leaveType: String,         // e.g. "Sick Leave", "Permission", "Casual"
    val startDate: String,        // YYYY-MM-DD
    val endDate: String,          // YYYY-MM-DD
    val durationDays: Int,
    val reason: String,
    val notes: String = "",
    val status: LeaveStatus,
    val requestedBy: String,
    val approvedBy: String? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val approvedAt: Long? = null,
    val cancelledAt: Long? = null
)

data class CallingSession(
    val sessionId: String,
    val organizationId: String,
    val periodId: String,
    val createdByUserId: String,
    val totalSelected: Int,
    val totalEligibleCalls: Int,   // totalSelected minus those on approved leave
    val completedCount: Int = 0,
    val pendingCount: Int = 0,
    val retryCount: Int = 0,
    val isPaused: Boolean = false,
    val currentQueueIndex: Int = 0,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)

data class CallingQueueItem(
    val queueItemId: String,
    val sessionId: String,
    val contactId: String,
    val queueOrder: Int,
    val status: QueueItemStatus,
    val preferredPhoneType: NumberUsedType = NumberUsedType.PRIMARY,
    val lastCallLogId: String? = null
)

data class CallLog(
    val logId: String,
    val sessionId: String,
    val contactId: String,
    val numberUsed: String,
    val numberUsedType: NumberUsedType,
    val callTime: Long = System.currentTimeMillis(),
    val durationSeconds: Int = 0,
    val outcomeStatus: CallOutcome,
    val notes: String = ""
)

data class CallReport(
    val reportId: String,
    val logId: String,
    val contactId: String,
    val aiStatus: CallOutcome,
    val aiReason: String,
    val followUpAction: String,
    val followUpDate: String? = null,
    val voiceNoteUrl: String? = null,
    val isConfirmed: Boolean = true,
    val confirmedAt: Long = System.currentTimeMillis(),
    val editedByUserId: String? = null
)

data class RetryAttempt(
    val retryId: String,
    val contactId: String,
    val sessionId: String,
    val attemptNumber: Int,
    val previousOutcome: CallOutcome,
    val scheduledTime: String,
    val status: String = "PENDING", // PENDING, COMPLETED, CANCELLED
    val notes: String = ""
)

data class FollowUp(
    val followUpId: String,
    val contactId: String,
    val scheduledDate: String,
    val reason: String,
    val status: String = "PENDING"
)

data class AuditLog(
    val auditId: String,
    val userId: String,
    val action: String,
    val entityType: String,
    val entityId: String,
    val details: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class ImportPreviewItem(
    val rowNumber: Int,
    val rollOrIdNumber: String,
    val name: String,
    val primaryPhone: String,
    val alternatePhone: String,
    val groupName: String,
    val isValid: Boolean,
    val validationMessage: String = "OK"
)

data class AnalyticsSummary(
    val totalAssigned: Int,
    val totalSelected: Int,
    val totalCalled: Int,
    val totalAnswered: Int,
    val totalNoAnswer: Int,
    val totalBusy: Int,
    val totalSwitchedOff: Int,
    val totalCallbackRequired: Int,
    val totalCompleted: Int,
    val totalPending: Int,
    val totalRetry: Int,
    val totalApprovedLeave: Int,
    val totalPendingLeave: Int,
    val totalRejectedLeave: Int,
    val completionPercentage: Float,
    val organizationCompletionRate: Float,
    val employeeCompletionRate: Float
)
