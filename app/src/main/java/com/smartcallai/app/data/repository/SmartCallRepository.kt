package com.smartcallai.app.data.repository

import com.smartcallai.app.data.local.*
import com.smartcallai.app.data.remote.SupabaseService
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.utils.SecurityUtils
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

interface SmartCallRepository {
    fun getOrganizations(): Flow<List<Organization>>
    fun getCurrentOrganization(): Flow<Organization?>
    suspend fun updateOrganization(org: Organization)
    suspend fun registerOrganizationAndAdmin(
        orgName: String,
        industryType: IndustryType,
        orgCode: String,
        adminName: String,
        email: String,
        rawPassword: String
    ): Organization

    fun getCurrentUser(): Flow<User?>
    suspend fun setCurrentUser(user: User)

    fun getIndustryConfigs(): Flow<List<IndustryConfig>>
    fun getIndustryConfig(type: IndustryType): Flow<IndustryConfig?>
    suspend fun saveIndustryConfig(config: IndustryConfig)

    fun getPeriods(orgId: String): Flow<List<Period>>
    fun getCurrentPeriod(): Flow<Period?>
    suspend fun addPeriod(period: Period)
    suspend fun selectPeriod(periodId: String)

    fun getContacts(periodId: String): Flow<List<Contact>>
    fun getContactById(contactId: String): Flow<Contact?>
    suspend fun addContact(contact: Contact)
    suspend fun updateContactSelection(contactId: String, isSelected: Boolean)
    suspend fun selectAllContacts(periodId: String, isSelected: Boolean)
    suspend fun importContacts(contacts: List<Contact>)
    suspend fun deleteContact(contactId: String)

    fun getLeaveRecords(): Flow<List<LeaveRecord>>
    fun getLeaveRecordsForContact(contactId: String): Flow<List<LeaveRecord>>
    suspend fun addLeaveRecord(leave: LeaveRecord)
    suspend fun updateLeaveStatus(leaveId: String, status: LeaveStatus, approvedBy: String?)
    suspend fun extendLeave(leaveId: String, newEndDate: String, newDurationDays: Int)
    suspend fun cancelLeave(leaveId: String)
    suspend fun isContactCoveredByApprovedLeave(contactId: String, dateStr: String): Boolean

    suspend fun createCallingSession(periodId: String, selectedContacts: List<Contact>): CallingSession
    fun getActiveSession(): Flow<CallingSession?>
    fun getCallingQueue(sessionId: String): Flow<List<CallingQueueItem>>
    suspend fun updateQueueItemStatus(itemId: String, status: QueueItemStatus, logId: String?)
    suspend fun pauseSession(sessionId: String, isPaused: Boolean, currentQueueIndex: Int)

    suspend fun recordCallLogAndReport(log: CallLog, report: CallReport)
    fun getCallLogsForContact(contactId: String): Flow<List<CallLog>>
    suspend fun getCallReportForLog(logId: String): CallReport?

    fun getRetryAttempts(): Flow<List<RetryAttempt>>
    suspend fun addRetryAttempt(retry: RetryAttempt)
    suspend fun updateRetryStatus(retryId: String, status: String)

    fun getFollowUps(): Flow<List<FollowUp>>
    suspend fun addFollowUp(followUp: FollowUp)

    fun getAuditLogs(): Flow<List<AuditLog>>
    suspend fun addAuditLog(action: String, entityType: String, entityId: String, details: String)

    fun getAnalyticsSummary(periodId: String): Flow<AnalyticsSummary>

    suspend fun testSupabaseConnection(): Boolean
}

@OptIn(DelicateCoroutinesApi::class)
class SmartCallRepositoryImpl(
    private val db: AppDatabase,
    private val supabaseService: SupabaseService = SupabaseService()
) : SmartCallRepository {

    private val activePeriodIdState = MutableStateFlow<String?>(null)

    init {
        // Seed default Industry Configs in Room if empty
        GlobalScope.launch {
            try {
                if (db.industryConfigDao().countIndustryConfigs() == 0) {
                    seedDefaultIndustryConfigs()
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private suspend fun seedDefaultIndustryConfigs() {
        val configs = listOf(
            IndustryConfigEntity(IndustryType.EDUCATION, "Student", "Class / Section", "Roll Number,Parent Name,Attendance %"),
            IndustryConfigEntity(IndustryType.BANKING, "Customer", "Branch / Account Type", "Account Number,EMI Overdue Days,Credit Score"),
            IndustryConfigEntity(IndustryType.POST_OFFICE, "Recipient", "Delivery Route", "Tracking ID,Parcel Status"),
            IndustryConfigEntity(IndustryType.CORPORATE, "Employee", "Department / Team", "Employee ID,Designation,Shift"),
            IndustryConfigEntity(IndustryType.RECRUITMENT, "Candidate", "Job Campaign", "Application ID,Interview Stage"),
            IndustryConfigEntity(IndustryType.HEALTHCARE, "Patient", "Ward / Specialty", "Patient ID,Doctor Name,Slot"),
            IndustryConfigEntity(IndustryType.GOVERNMENT, "Citizen", "District / Scheme", "Application ID,Scheme Name"),
            IndustryConfigEntity(IndustryType.CUSTOMER_SERVICE, "Subscriber", "Service Segment", "Ticket ID,Issue Category"),
            IndustryConfigEntity(IndustryType.OTHER, "Contact", "Group", "Reference ID")
        )
        configs.forEach { db.industryConfigDao().insertIndustryConfig(it) }
    }

    override suspend fun testSupabaseConnection(): Boolean {
        return supabaseService.testConnection()
    }

    override fun getOrganizations(): Flow<List<Organization>> {
        return db.organizationDao().getAllOrganizations().map { list ->
            list.map { Organization(it.organizationId, it.name, it.industryType, it.code) }
        }
    }

    override fun getCurrentOrganization(): Flow<Organization?> {
        return db.organizationDao().getAllOrganizations().map { list ->
            list.firstOrNull()?.let {
                Organization(it.organizationId, it.name, it.industryType, it.code)
            }
        }
    }

    override suspend fun updateOrganization(org: Organization) {
        db.organizationDao().insertOrganization(
            OrganizationEntity(org.organizationId, org.name, org.industryType, org.code)
        )
        GlobalScope.launch {
            supabaseService.syncOrganization(org)
        }
    }

    override suspend fun registerOrganizationAndAdmin(
        orgName: String,
        industryType: IndustryType,
        orgCode: String,
        adminName: String,
        email: String,
        rawPassword: String
    ): Organization {
        val orgId = "org_${System.currentTimeMillis()}"
        val orgEntity = OrganizationEntity(orgId, orgName, industryType, orgCode)
        db.organizationDao().insertOrganization(orgEntity)

        val userId = "user_${System.currentTimeMillis()}"
        val passHash = SecurityUtils.hashPassword(rawPassword)
        val userEntity = UserEntity(userId, adminName, email, passHash, UserRole.ORG_ADMIN, orgId)
        db.userDao().insertUser(userEntity)

        val defaultPeriodId = "period_${System.currentTimeMillis()}"
        val periodEntity = PeriodEntity(
            periodId = defaultPeriodId,
            organizationId = orgId,
            name = "${Calendar.getInstance().get(Calendar.YEAR)} - Current Term",
            startDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()),
            endDate = "2026-12-31",
            isCurrent = true
        )
        db.periodDao().insertPeriod(periodEntity)
        activePeriodIdState.value = defaultPeriodId

        val org = Organization(orgId, orgName, industryType, orgCode)
        val user = User(userId, adminName, email, UserRole.ORG_ADMIN, orgId)
        val period = Period(defaultPeriodId, orgId, periodEntity.name, periodEntity.startDate, periodEntity.endDate, true)

        // Sync Organization, User Profile, and Period to Supabase
        GlobalScope.launch {
            supabaseService.syncOrganization(org)
            supabaseService.syncProfile(user)
            supabaseService.syncPeriod(period)
        }

        addAuditLog("REGISTER_ORG", "Organization", orgId, "Registered organization '$orgName' and Admin '$adminName'")

        return org
    }

    override fun getCurrentUser(): Flow<User?> {
        return db.userDao().getAllUsers().map { list ->
            list.firstOrNull()?.let {
                User(it.userId, it.name, it.email, it.role, it.organizationId)
            }
        }
    }

    override suspend fun setCurrentUser(user: User) {
        db.userDao().insertUser(
            UserEntity(user.userId, user.name, user.email, "", user.role, user.organizationId)
        )
        GlobalScope.launch {
            supabaseService.syncProfile(user)
        }
    }

    override fun getIndustryConfigs(): Flow<List<IndustryConfig>> {
        return db.industryConfigDao().getAllIndustryConfigs().map { list ->
            list.map {
                IndustryConfig(
                    it.industryType,
                    it.contactLabel,
                    it.groupLabel,
                    if (it.customFieldsJson.isBlank()) emptyList() else it.customFieldsJson.split(",")
                )
            }
        }
    }

    override fun getIndustryConfig(type: IndustryType): Flow<IndustryConfig?> {
        return getIndustryConfigs().map { configs ->
            configs.find { it.industryType == type }
        }
    }

    override suspend fun saveIndustryConfig(config: IndustryConfig) {
        db.industryConfigDao().insertIndustryConfig(
            IndustryConfigEntity(
                config.industryType,
                config.contactLabel,
                config.groupLabel,
                config.customFields.joinToString(",")
            )
        )
    }

    override fun getPeriods(orgId: String): Flow<List<Period>> {
        return db.periodDao().getPeriodsForOrg(orgId).map { list ->
            list.map { Period(it.periodId, it.organizationId, it.name, it.startDate, it.endDate, it.isCurrent) }
        }
    }

    override fun getCurrentPeriod(): Flow<Period?> {
        return getCurrentOrganization().flatMapLatest { org ->
            if (org != null) {
                db.periodDao().getPeriodsForOrg(org.organizationId).map { list ->
                    list.find { it.isCurrent } ?: list.firstOrNull()
                }.map { entity ->
                    entity?.let {
                        Period(it.periodId, it.organizationId, it.name, it.startDate, it.endDate, it.isCurrent)
                    }
                }
            } else flowOf(null)
        }
    }

    override suspend fun addPeriod(period: Period) {
        db.periodDao().insertPeriod(
            PeriodEntity(period.periodId, period.organizationId, period.name, period.startDate, period.endDate, period.isCurrent)
        )
        if (period.isCurrent) {
            activePeriodIdState.value = period.periodId
        }
        GlobalScope.launch {
            supabaseService.syncPeriod(period)
        }
        addAuditLog("ADD_PERIOD", "Period", period.periodId, "Added period '${period.name}'")
    }

    override suspend fun selectPeriod(periodId: String) {
        activePeriodIdState.value = periodId
    }

    override fun getContacts(periodId: String): Flow<List<Contact>> {
        if (periodId.isBlank()) return flowOf(emptyList())
        return db.contactDao().getContactsForPeriod(periodId).map { list ->
            list.map {
                Contact(
                    it.contactId, it.organizationId, it.periodId, it.rollOrIdNumber,
                    it.name, it.primaryPhone, it.alternatePhone, it.weeklyAttendance,
                    it.monthlyAttendance, it.overallAttendance, it.currentStatus,
                    it.isSelected, it.groupName, it.notes
                )
            }
        }
    }

    override fun getContactById(contactId: String): Flow<Contact?> {
        return db.contactDao().getAllContacts().map { list ->
            list.find { it.contactId == contactId }?.let {
                Contact(
                    it.contactId, it.organizationId, it.periodId, it.rollOrIdNumber,
                    it.name, it.primaryPhone, it.alternatePhone, it.weeklyAttendance,
                    it.monthlyAttendance, it.overallAttendance, it.currentStatus,
                    it.isSelected, it.groupName, it.notes
                )
            }
        }
    }

    override suspend fun addContact(contact: Contact) {
        db.contactDao().insertContact(
            ContactEntity(
                contact.contactId, contact.organizationId, contact.periodId, contact.rollOrIdNumber,
                contact.name, contact.primaryPhone, contact.alternatePhone, contact.weeklyAttendance,
                contact.monthlyAttendance, contact.overallAttendance, contact.currentStatus,
                contact.isSelected, contact.groupName, contact.notes
            )
        )
        GlobalScope.launch {
            supabaseService.syncContact(contact)
        }
        addAuditLog("ADD_CONTACT", "Contact", contact.contactId, "Added contact '${contact.name}' (${contact.rollOrIdNumber})")
    }

    override suspend fun updateContactSelection(contactId: String, isSelected: Boolean) {
        db.contactDao().updateSelection(contactId, isSelected)
    }

    override suspend fun selectAllContacts(periodId: String, isSelected: Boolean) {
        db.contactDao().updateAllSelectionForPeriod(periodId, isSelected)
    }

    override suspend fun importContacts(contacts: List<Contact>) {
        val entities = contacts.map {
            ContactEntity(
                it.contactId, it.organizationId, it.periodId, it.rollOrIdNumber,
                it.name, it.primaryPhone, it.alternatePhone, it.weeklyAttendance,
                it.monthlyAttendance, it.overallAttendance, it.currentStatus,
                it.isSelected, it.groupName, it.notes
            )
        }
        db.contactDao().insertContacts(entities)
        GlobalScope.launch {
            contacts.forEach { supabaseService.syncContact(it) }
        }
        addAuditLog("IMPORT_CONTACTS", "Contact", "bulk", "Imported ${contacts.size} contacts")
    }

    override suspend fun deleteContact(contactId: String) {
        db.contactDao().deleteContact(contactId)
        GlobalScope.launch {
            supabaseService.deleteContact(contactId)
        }
        addAuditLog("DELETE_CONTACT", "Contact", contactId, "Deleted contact $contactId")
    }

    override fun getLeaveRecords(): Flow<List<LeaveRecord>> {
        return db.leaveRecordDao().getAllLeaveRecords().map { list ->
            list.map {
                LeaveRecord(
                    it.leaveId, it.contactId, it.organizationId, it.periodId,
                    it.leaveType, it.startDate, it.endDate, it.durationDays,
                    it.reason, it.notes, it.status, it.requestedBy,
                    it.approvedBy, it.createdAt, it.updatedAt, it.approvedAt, it.cancelledAt
                )
            }
        }
    }

    override fun getLeaveRecordsForContact(contactId: String): Flow<List<LeaveRecord>> {
        return db.leaveRecordDao().getLeaveRecordsForContact(contactId).map { list ->
            list.map {
                LeaveRecord(
                    it.leaveId, it.contactId, it.organizationId, it.periodId,
                    it.leaveType, it.startDate, it.endDate, it.durationDays,
                    it.reason, it.notes, it.status, it.requestedBy,
                    it.approvedBy, it.createdAt, it.updatedAt, it.approvedAt, it.cancelledAt
                )
            }
        }
    }

    override suspend fun addLeaveRecord(leave: LeaveRecord) {
        db.leaveRecordDao().insertLeaveRecord(
            LeaveRecordEntity(
                leave.leaveId, leave.contactId, leave.organizationId, leave.periodId,
                leave.leaveType, leave.startDate, leave.endDate, leave.durationDays,
                leave.reason, leave.notes, leave.status, leave.requestedBy,
                leave.approvedBy, leave.createdAt, leave.updatedAt, leave.approvedAt, leave.cancelledAt
            )
        )
        GlobalScope.launch {
            supabaseService.syncLeaveRecord(leave)
        }
        addAuditLog("ADD_LEAVE", "LeaveRecord", leave.leaveId, "Created leave for contact ${leave.contactId}")
    }

    override suspend fun updateLeaveStatus(leaveId: String, status: LeaveStatus, approvedBy: String?) {
        val now = System.currentTimeMillis()
        db.leaveRecordDao().updateLeaveStatus(leaveId, status, approvedBy, if (status == LeaveStatus.APPROVED) now else 0L)
        addAuditLog("UPDATE_LEAVE_STATUS", "LeaveRecord", leaveId, "Updated leave status to $status by $approvedBy")
    }

    override suspend fun extendLeave(leaveId: String, newEndDate: String, newDurationDays: Int) {
        val now = System.currentTimeMillis()
        db.leaveRecordDao().extendLeave(leaveId, newEndDate, newDurationDays, now)
        addAuditLog("EXTEND_LEAVE", "LeaveRecord", leaveId, "Extended leave to $newEndDate ($newDurationDays days)")
    }

    override suspend fun cancelLeave(leaveId: String) {
        val now = System.currentTimeMillis()
        db.leaveRecordDao().cancelLeave(leaveId, now)
        addAuditLog("CANCEL_LEAVE", "LeaveRecord", leaveId, "Cancelled leave")
    }

    override suspend fun isContactCoveredByApprovedLeave(contactId: String, dateStr: String): Boolean {
        val allLeaves = db.leaveRecordDao().getAllLeaveRecords().first()
        return allLeaves.any {
            it.contactId == contactId &&
            it.status == LeaveStatus.APPROVED &&
            it.startDate <= dateStr &&
            it.endDate >= dateStr
        }
    }

    override suspend fun createCallingSession(periodId: String, selectedContacts: List<Contact>): CallingSession {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val allLeaves = db.leaveRecordDao().getAllLeaveRecords().first()

        val eligibleContacts = selectedContacts.filter { contact ->
            val isCovered = allLeaves.any { leave ->
                leave.contactId == contact.contactId &&
                leave.status == LeaveStatus.APPROVED &&
                leave.startDate <= todayStr &&
                leave.endDate >= todayStr
            }
            !isCovered
        }

        val sessionId = "session_${System.currentTimeMillis()}"
        val user = getCurrentUser().first()
        val userId = user?.userId ?: "system"
        val org = getCurrentOrganization().first()
        val orgId = org?.organizationId ?: "org_0"

        val session = CallingSession(
            sessionId = sessionId,
            organizationId = orgId,
            periodId = periodId,
            createdByUserId = userId,
            totalSelected = selectedContacts.size,
            totalEligibleCalls = eligibleContacts.size,
            completedCount = 0,
            pendingCount = eligibleContacts.size,
            retryCount = 0,
            isPaused = false,
            currentQueueIndex = 0
        )

        db.callingSessionDao().insertSession(
            CallingSessionEntity(
                session.sessionId, session.organizationId, session.periodId,
                session.createdByUserId, session.totalSelected, session.totalEligibleCalls,
                session.completedCount, session.pendingCount, session.retryCount,
                session.isPaused, session.currentQueueIndex, session.createdAt, session.updatedAt
            )
        )

        val queueItems = eligibleContacts.mapIndexed { index, contact ->
            CallingQueueItemEntity(
                queueItemId = "item_${sessionId}_$index",
                sessionId = sessionId,
                contactId = contact.contactId,
                queueOrder = index,
                status = QueueItemStatus.PENDING,
                preferredPhoneType = NumberUsedType.PRIMARY,
                lastCallLogId = null
            )
        }
        db.callingQueueDao().insertQueueItems(queueItems)
        addAuditLog("CREATE_SESSION", "CallingSession", sessionId, "Created calling session with ${selectedContacts.size} selected")

        return session
    }

    override fun getActiveSession(): Flow<CallingSession?> {
        return db.callingSessionDao().getLatestSession().map { entity ->
            entity?.let {
                CallingSession(
                    it.sessionId, it.organizationId, it.periodId, it.createdByUserId,
                    it.totalSelected, it.totalEligibleCalls, it.completedCount,
                    it.pendingCount, it.retryCount, it.isPaused, it.currentQueueIndex,
                    it.createdAt, it.updatedAt
                )
            }
        }
    }

    override fun getCallingQueue(sessionId: String): Flow<List<CallingQueueItem>> {
        if (sessionId.isBlank()) return flowOf(emptyList())
        return db.callingQueueDao().getQueueItems(sessionId).map { list ->
            list.map {
                CallingQueueItem(
                    it.queueItemId, it.sessionId, it.contactId, it.queueOrder,
                    it.status, it.preferredPhoneType, it.lastCallLogId
                )
            }
        }
    }

    override suspend fun updateQueueItemStatus(itemId: String, status: QueueItemStatus, logId: String?) {
        db.callingQueueDao().updateQueueItemStatus(itemId, status, logId)
    }

    override suspend fun pauseSession(sessionId: String, isPaused: Boolean, currentQueueIndex: Int) {
        val queue = db.callingQueueDao().getQueueItems(sessionId).first()
        val completed = queue.count { it.status == QueueItemStatus.COMPLETED }
        val pending = queue.count { it.status == QueueItemStatus.PENDING || it.status == QueueItemStatus.IN_PROGRESS }
        val retries = queue.count { it.status == QueueItemStatus.RETRY_REQUIRED }

        db.callingSessionDao().updateSessionState(
            sessionId = sessionId,
            isPaused = isPaused,
            currentIndex = currentQueueIndex,
            completed = completed,
            pending = pending,
            retries = retries,
            updatedAt = System.currentTimeMillis()
        )
        addAuditLog(if (isPaused) "PAUSE_SESSION" else "RESUME_SESSION", "CallingSession", sessionId, "Session at queue index $currentQueueIndex")
    }

    override suspend fun recordCallLogAndReport(log: CallLog, report: CallReport) {
        db.callLogDao().insertCallLog(
            CallLogEntity(
                log.logId, log.sessionId, log.contactId, log.numberUsed,
                log.numberUsedType, log.callTime, log.durationSeconds,
                log.outcomeStatus, log.notes
            )
        )
        db.callReportDao().insertCallReport(
            CallReportEntity(
                report.reportId, report.logId, report.contactId,
                report.aiStatus, report.aiReason, report.followUpAction,
                report.followUpDate, report.voiceNoteUrl, report.isConfirmed,
                report.confirmedAt, report.editedByUserId
            )
        )

        GlobalScope.launch {
            supabaseService.syncCallLog(log)
        }

        if (log.outcomeStatus in listOf(CallOutcome.NO_ANSWER, CallOutcome.BUSY, CallOutcome.SWITCHED_OFF, CallOutcome.CALLBACK_REQUIRED)) {
            val retry = RetryAttempt(
                retryId = "retry_${System.currentTimeMillis()}",
                contactId = log.contactId,
                sessionId = log.sessionId,
                attemptNumber = 1,
                previousOutcome = log.outcomeStatus,
                scheduledTime = report.followUpDate ?: "Next Call Loop / Tomorrow",
                status = "PENDING",
                notes = report.aiReason
            )
            addRetryAttempt(retry)
        }

        if (!report.followUpAction.isBlank() && report.followUpAction != "None") {
            addFollowUp(
                FollowUp(
                    followUpId = "fu_${System.currentTimeMillis()}",
                    contactId = log.contactId,
                    scheduledDate = report.followUpDate ?: "Tomorrow",
                    reason = report.followUpAction,
                    status = "PENDING"
                )
            )
        }
        addAuditLog("RECORD_CALL_LOG", "CallLog", log.logId, "Recorded call outcome ${log.outcomeStatus}")
    }

    override fun getCallLogsForContact(contactId: String): Flow<List<CallLog>> {
        return db.callLogDao().getCallLogsForContact(contactId).map { list ->
            list.map {
                CallLog(
                    it.logId, it.sessionId, it.contactId, it.numberUsed,
                    it.numberUsedType, it.callTime, it.durationSeconds,
                    it.outcomeStatus, it.notes
                )
            }
        }
    }

    override suspend fun getCallReportForLog(logId: String): CallReport? {
        val entity = db.callReportDao().getReportForLog(logId) ?: return null
        return CallReport(
            entity.reportId, entity.logId, entity.contactId, entity.aiStatus,
            entity.aiReason, entity.followUpAction, entity.followUpDate,
            entity.voiceNoteUrl, entity.isConfirmed, entity.confirmedAt, entity.editedByUserId
        )
    }

    override fun getRetryAttempts(): Flow<List<RetryAttempt>> {
        return db.retryAttemptDao().getAllRetryAttempts().map { list ->
            list.map {
                RetryAttempt(
                    it.retryId, it.contactId, it.sessionId, it.attemptNumber,
                    it.previousOutcome, it.scheduledTime, it.status, it.notes
                )
            }
        }
    }

    override suspend fun addRetryAttempt(retry: RetryAttempt) {
        db.retryAttemptDao().insertRetryAttempt(
            RetryAttemptEntity(
                retry.retryId, retry.contactId, retry.sessionId, retry.attemptNumber,
                retry.previousOutcome, retry.scheduledTime, retry.status, retry.notes
            )
        )
    }

    override suspend fun updateRetryStatus(retryId: String, status: String) {
        db.retryAttemptDao().updateRetryStatus(retryId, status)
    }

    override fun getFollowUps(): Flow<List<FollowUp>> {
        return db.followUpDao().getAllFollowUps().map { list ->
            list.map {
                FollowUp(it.followUpId, it.contactId, it.scheduledDate, it.reason, it.status)
            }
        }
    }

    override suspend fun addFollowUp(followUp: FollowUp) {
        db.followUpDao().insertFollowUp(
            FollowUpEntity(followUp.followUpId, followUp.contactId, followUp.scheduledDate, followUp.reason, followUp.status)
        )
    }

    override fun getAuditLogs(): Flow<List<AuditLog>> {
        return db.auditLogDao().getAllAuditLogs().map { list ->
            list.map {
                AuditLog(it.auditId, it.userId, it.action, it.entityType, it.entityId, it.details, it.timestamp)
            }
        }
    }

    override suspend fun addAuditLog(action: String, entityType: String, entityId: String, details: String) {
        val user = getCurrentUser().first()
        val userId = user?.userId ?: "system"
        db.auditLogDao().insertAuditLog(
            AuditLogEntity(
                auditId = "audit_${System.currentTimeMillis()}_${(100..999).random()}",
                userId = userId,
                action = action,
                entityType = entityType,
                entityId = entityId,
                details = details,
                timestamp = System.currentTimeMillis()
            )
        )
    }

    override fun getAnalyticsSummary(periodId: String): Flow<AnalyticsSummary> {
        if (periodId.isBlank()) {
            return flowOf(
                AnalyticsSummary(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0f, 0f, 0f)
            )
        }

        return combine(
            getContacts(periodId),
            getLeaveRecords(),
            db.callLogDao().getAllCallLogs(),
            db.retryAttemptDao().getAllRetryAttempts()
        ) { contacts, leaves, logs, retries ->
            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

            val totalAssigned = contacts.size
            val totalSelected = contacts.count { it.isSelected }

            val approvedLeaves = leaves.filter { leave ->
                leave.status == LeaveStatus.APPROVED &&
                leave.startDate <= todayStr &&
                leave.endDate >= todayStr
            }
            val pendingLeaves = leaves.filter { it.status == LeaveStatus.PENDING }
            val rejectedLeaves = leaves.filter { it.status == LeaveStatus.REJECTED }

            val approvedLeaveContactIds = approvedLeaves.map { it.contactId }.toSet()
            val selectedOnApprovedLeave = contacts.count { it.isSelected && approvedLeaveContactIds.contains(it.contactId) }

            val totalCalled = logs.map { it.contactId }.distinct().size
            val totalAnswered = logs.count { it.outcomeStatus == CallOutcome.ANSWERED }
            val totalNoAnswer = logs.count { it.outcomeStatus == CallOutcome.NO_ANSWER }
            val totalBusy = logs.count { it.outcomeStatus == CallOutcome.BUSY }
            val totalSwitchedOff = logs.count { it.outcomeStatus == CallOutcome.SWITCHED_OFF }
            val totalCallback = logs.count { it.outcomeStatus == CallOutcome.CALLBACK_REQUIRED }
            val totalCompleted = logs.count { it.outcomeStatus == CallOutcome.COMPLETED || it.outcomeStatus == CallOutcome.ANSWERED }

            val totalEligibleForCall = totalSelected - selectedOnApprovedLeave
            val totalPending = (totalEligibleForCall - totalCalled).coerceAtLeast(0)
            val totalRetry = retries.count { it.status == "PENDING" }

            val completionPct = if (totalAssigned > 0) (totalCompleted.toFloat() / totalAssigned.toFloat()) * 100f else 0f
            val orgComp = if (totalAssigned > 0) ((totalCompleted + selectedOnApprovedLeave).toFloat() / totalAssigned.toFloat()) * 100f else 0f
            val empComp = if (totalEligibleForCall > 0) (totalCompleted.toFloat() / totalEligibleForCall.toFloat()) * 100f else 0f

            AnalyticsSummary(
                totalAssigned = totalAssigned,
                totalSelected = totalSelected,
                totalCalled = totalCalled,
                totalAnswered = totalAnswered,
                totalNoAnswer = totalNoAnswer,
                totalBusy = totalBusy,
                totalSwitchedOff = totalSwitchedOff,
                totalCallbackRequired = totalCallback,
                totalCompleted = totalCompleted,
                totalPending = totalPending,
                totalRetry = totalRetry,
                totalApprovedLeave = selectedOnApprovedLeave,
                totalPendingLeave = pendingLeaves.size,
                totalRejectedLeave = rejectedLeaves.size,
                completionPercentage = completionPct,
                organizationCompletionRate = orgComp,
                employeeCompletionRate = empComp
            )
        }
    }
}
