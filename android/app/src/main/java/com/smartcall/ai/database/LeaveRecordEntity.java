package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Index;
import androidx.room.PrimaryKey;

@Entity(
    tableName = "leave_records",
    indices = {
        @Index(value = {"contactId"}),
        @Index(value = {"periodId"})
    }
)
public class LeaveRecordEntity {
    @PrimaryKey
    @NonNull
    public String leaveId;

    public String contactId;
    public String periodId;
    public String startDate;
    public String endDate;
    public String reason;
    public String status; // APPROVED | PENDING | REJECTED
    public String requestedBy;
    public String approvedBy;
    public String createdAt;
    public String updatedAt;

    public LeaveRecordEntity(@NonNull String leaveId, String contactId, String periodId, String startDate, String endDate, String status) {
        this.leaveId = leaveId;
        this.contactId = contactId;
        this.periodId = periodId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }
}
