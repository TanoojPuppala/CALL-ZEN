package com.smartcallai.app.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.smartcallai.app.domain.model.*

@Entity(tableName = "organizations")
data class OrganizationEntity(
    @PrimaryKey val organizationId: String,
    val name: String,
    val industryType: IndustryType,
    val code: String
)

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val userId: String,
    val name: String,
    val email: String,
    val passwordHash: String,
    val role: UserRole,
    val organizationId: String
)

@Entity(tableName = "industry_configs")
data class IndustryConfigEntity(
    @PrimaryKey val industryType: IndustryType,
    val contactLabel: String,
    val groupLabel: String,
    val customFieldsJson: String
)

@Entity(tableName = "periods")
data class PeriodEntity(
    @PrimaryKey val periodId: String,
    val organizationId: String,
    val name: String,
    val startDate: String,
    val endDate: String,
    val isCurrent: Boolean
)

@Entity(tableName = "contacts")
data class ContactEntity(
    @PrimaryKey val contactId: String,
    val organizationId: String,
    val periodId: String,
    val rollOrIdNumber: String,
    val name: String,
    val primaryPhone: String,
    val alternatePhone: String,
    val weeklyAttendance: Float,
    val monthlyAttendance: Float,
    val overallAttendance: Float,
    val currentStatus: String,
    val isSelected: Boolean,
    val groupName: String,
    val notes: String
)

@Entity(tableName = "leave_records")
data class LeaveRecordEntity(
    @PrimaryKey val leaveId: String,
    val contactId: String,
    val organizationId: String,
    val periodId: String,
    val leaveType: String,
    val startDate: String,
    val endDate: String,
    val durationDays: Int,
    val reason: String,
    val notes: String,
    val status: LeaveStatus,
    val requestedBy: String,
    val approvedBy: String?,
    val createdAt: Long,
    val updatedAt: Long,
    val approvedAt: Long?,
    val cancelledAt: Long?
)

@Entity(tableName = "calling_sessions")
data class CallingSessionEntity(
    @PrimaryKey val sessionId: String,
    val organizationId: String,
    val periodId: String,
    val createdByUserId: String,
    val totalSelected: Int,
    val totalEligibleCalls: Int,
    val completedCount: Int,
    val pendingCount: Int,
    val retryCount: Int,
    val isPaused: Boolean,
    val currentQueueIndex: Int,
    val createdAt: Long,
    val updatedAt: Long
)

@Entity(tableName = "calling_queue_items")
data class CallingQueueItemEntity(
    @PrimaryKey val queueItemId: String,
    val sessionId: String,
    val contactId: String,
    val queueOrder: Int,
    val status: QueueItemStatus,
    val preferredPhoneType: NumberUsedType,
    val lastCallLogId: String?
)

@Entity(tableName = "call_logs")
data class CallLogEntity(
    @PrimaryKey val logId: String,
    val sessionId: String,
    val contactId: String,
    val numberUsed: String,
    val numberUsedType: NumberUsedType,
    val callTime: Long,
    val durationSeconds: Int,
    val outcomeStatus: CallOutcome,
    val notes: String
)

@Entity(tableName = "call_reports")
data class CallReportEntity(
    @PrimaryKey val reportId: String,
    val logId: String,
    val contactId: String,
    val aiStatus: CallOutcome,
    val aiReason: String,
    val followUpAction: String,
    val followUpDate: String?,
    val voiceNoteUrl: String?,
    val isConfirmed: Boolean,
    val confirmedAt: Long,
    val editedByUserId: String?
)

@Entity(tableName = "retry_attempts")
data class RetryAttemptEntity(
    @PrimaryKey val retryId: String,
    val contactId: String,
    val sessionId: String,
    val attemptNumber: Int,
    val previousOutcome: CallOutcome,
    val scheduledTime: String,
    val status: String,
    val notes: String
)

@Entity(tableName = "follow_ups")
data class FollowUpEntity(
    @PrimaryKey val followUpId: String,
    val contactId: String,
    val scheduledDate: String,
    val reason: String,
    val status: String
)

@Entity(tableName = "audit_logs")
data class AuditLogEntity(
    @PrimaryKey val auditId: String,
    val userId: String,
    val action: String,
    val entityType: String,
    val entityId: String,
    val details: String,
    val timestamp: Long
)
