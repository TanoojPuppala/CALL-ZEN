package com.smartcall.ai.database;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface SmartCallDao {
    // Organization
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertOrganization(OrganizationEntity org);

    @Query("SELECT * FROM organizations LIMIT 1")
    OrganizationEntity getOrganization();

    // User
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertUser(UserEntity user);

    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    UserEntity getUserByEmail(String email);

    // Contact
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertContacts(List<ContactEntity> contacts);

    @Query("SELECT * FROM contacts WHERE periodId = :periodId")
    List<ContactEntity> getContactsByPeriod(String periodId);

    @Query("SELECT * FROM contacts")
    List<ContactEntity> getAllContacts();

    @Query("DELETE FROM contacts WHERE contactId = :contactId")
    void deleteContact(String contactId);

    // Leave Record
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertLeaveRecord(LeaveRecordEntity leave);

    @Query("SELECT * FROM leave_records WHERE contactId = :contactId AND status = 'APPROVED'")
    List<LeaveRecordEntity> getApprovedLeavesForContact(String contactId);

    @Query("SELECT * FROM leave_records WHERE status = 'APPROVED'")
    List<LeaveRecordEntity> getAllApprovedLeaves();

    // Call Log
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertCallLog(CallLogEntity callLog);

    @Query("SELECT * FROM call_logs ORDER BY startedAt DESC")
    List<CallLogEntity> getAllCallLogs();

    // Period
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertPeriod(PeriodEntity period);

    @Query("SELECT * FROM periods")
    List<PeriodEntity> getAllPeriods();

    // Audit Log
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAuditLog(AuditLogEntity auditLog);

    @Query("SELECT * FROM audit_logs ORDER BY timestamp DESC")
    List<AuditLogEntity> getAllAuditLogs();
}
