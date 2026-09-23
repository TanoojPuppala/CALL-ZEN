package com.smartcallai.app.data.local

import androidx.room.*
import com.smartcallai.app.domain.model.LeaveStatus
import com.smartcallai.app.domain.model.QueueItemStatus
import kotlinx.coroutines.flow.Flow

@Dao
interface OrganizationDao {
    @Query("SELECT * FROM organizations")
    fun getAllOrganizations(): Flow<List<OrganizationEntity>>

    @Query("SELECT * FROM organizations WHERE organizationId = :id")
    suspend fun getOrganizationById(id: String): OrganizationEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrganization(org: OrganizationEntity)
}

@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAllUsers(): Flow<List<UserEntity>>

    @Query("SELECT * FROM users WHERE userId = :id")
    suspend fun getUserById(id: String): UserEntity?

    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)
}

@Dao
interface IndustryConfigDao {
    @Query("SELECT * FROM industry_configs")
    fun getAllIndustryConfigs(): Flow<List<IndustryConfigEntity>>

    @Query("SELECT COUNT(*) FROM industry_configs")
    suspend fun countIndustryConfigs(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIndustryConfig(config: IndustryConfigEntity)
}

@Dao
interface PeriodDao {
    @Query("SELECT * FROM periods WHERE organizationId = :orgId")
    fun getPeriodsForOrg(orgId: String): Flow<List<PeriodEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPeriod(period: PeriodEntity)
}

@Dao
interface ContactDao {
    @Query("SELECT * FROM contacts")
    fun getAllContacts(): Flow<List<ContactEntity>>

    @Query("SELECT * FROM contacts WHERE periodId = :periodId")
    fun getContactsForPeriod(periodId: String): Flow<List<ContactEntity>>

    @Query("SELECT * FROM contacts WHERE contactId = :id")
    suspend fun getContactById(id: String): ContactEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContacts(contacts: List<ContactEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertContact(contact: ContactEntity)

    @Query("UPDATE contacts SET isSelected = :isSelected WHERE contactId = :contactId")
    suspend fun updateSelection(contactId: String, isSelected: Boolean)

    @Query("UPDATE contacts SET isSelected = :isSelected WHERE periodId = :periodId")
    suspend fun updateAllSelectionForPeriod(periodId: String, isSelected: Boolean)

    @Query("DELETE FROM contacts WHERE contactId = :contactId")
    suspend fun deleteContact(contactId: String)

    @Query("DELETE FROM contacts")
    suspend fun deleteAllContacts()
}

@Dao
interface LeaveRecordDao {
    @Query("SELECT * FROM leave_records")
    fun getAllLeaveRecords(): Flow<List<LeaveRecordEntity>>

    @Query("SELECT * FROM leave_records WHERE contactId = :contactId")
    fun getLeaveRecordsForContact(contactId: String): Flow<List<LeaveRecordEntity>>

    @Query("SELECT * FROM leave_records WHERE leaveId = :leaveId")
    suspend fun getLeaveRecordById(leaveId: String): LeaveRecordEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLeaveRecord(leaveRecord: LeaveRecordEntity)

    @Query("UPDATE leave_records SET status = :status, approvedBy = :approvedBy, approvedAt = :approvedAt WHERE leaveId = :leaveId")
    suspend fun updateLeaveStatus(leaveId: String, status: LeaveStatus, approvedBy: String?, approvedAt: Long)

    @Query("UPDATE leave_records SET endDate = :newEndDate, durationDays = :newDuration, updatedAt = :updatedAt WHERE leaveId = :leaveId")
    suspend fun extendLeave(leaveId: String, newEndDate: String, newDuration: Int, updatedAt: Long)

    @Query("UPDATE leave_records SET status = 'CANCELLED', cancelledAt = :cancelledAt, updatedAt = :cancelledAt WHERE leaveId = :leaveId")
    suspend fun cancelLeave(leaveId: String, cancelledAt: Long)
}

@Dao
interface CallingSessionDao {
    @Query("SELECT * FROM calling_sessions ORDER BY createdAt DESC LIMIT 1")
    fun getLatestSession(): Flow<CallingSessionEntity?>

    @Query("SELECT * FROM calling_sessions WHERE sessionId = :sessionId")
    suspend fun getSessionById(sessionId: String): CallingSessionEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: CallingSessionEntity)

    @Query("UPDATE calling_sessions SET isPaused = :isPaused, currentQueueIndex = :currentIndex, completedCount = :completed, pendingCount = :pending, retryCount = :retries, updatedAt = :updatedAt WHERE sessionId = :sessionId")
    suspend fun updateSessionState(sessionId: String, isPaused: Boolean, currentIndex: Int, completed: Int, pending: Int, retries: Int, updatedAt: Long)
}

@Dao
interface CallingQueueDao {
    @Query("SELECT * FROM calling_queue_items WHERE sessionId = :sessionId ORDER BY queueOrder ASC")
    fun getQueueItems(sessionId: String): Flow<List<CallingQueueItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertQueueItems(items: List<CallingQueueItemEntity>)

    @Query("UPDATE calling_queue_items SET status = :status, lastCallLogId = :logId WHERE queueItemId = :itemId")
    suspend fun updateQueueItemStatus(itemId: String, status: QueueItemStatus, logId: String?)

    @Query("DELETE FROM calling_queue_items WHERE sessionId = :sessionId")
    suspend fun clearQueue(sessionId: String)
}

@Dao
interface CallLogDao {
    @Query("SELECT * FROM call_logs ORDER BY callTime DESC")
    fun getAllCallLogs(): Flow<List<CallLogEntity>>

    @Query("SELECT * FROM call_logs WHERE contactId = :contactId ORDER BY callTime DESC")
    fun getCallLogsForContact(contactId: String): Flow<List<CallLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCallLog(log: CallLogEntity)
}

@Dao
interface CallReportDao {
    @Query("SELECT * FROM call_reports WHERE logId = :logId")
    suspend fun getReportForLog(logId: String): CallReportEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCallReport(report: CallReportEntity)
}

@Dao
interface RetryAttemptDao {
    @Query("SELECT * FROM retry_attempts ORDER BY scheduledTime ASC")
    fun getAllRetryAttempts(): Flow<List<RetryAttemptEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRetryAttempt(retry: RetryAttemptEntity)

    @Query("UPDATE retry_attempts SET status = :status WHERE retryId = :retryId")
    suspend fun updateRetryStatus(retryId: String, status: String)
}

@Dao
interface FollowUpDao {
    @Query("SELECT * FROM follow_ups ORDER BY scheduledDate ASC")
    fun getAllFollowUps(): Flow<List<FollowUpEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFollowUp(followUp: FollowUpEntity)
}

@Dao
interface AuditLogDao {
    @Query("SELECT * FROM audit_logs ORDER BY timestamp DESC")
    fun getAllAuditLogs(): Flow<List<AuditLogEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAuditLog(audit: AuditLogEntity)
}
