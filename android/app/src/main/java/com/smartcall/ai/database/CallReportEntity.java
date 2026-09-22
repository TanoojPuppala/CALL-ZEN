package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "call_reports")
public class CallReportEntity {
    @PrimaryKey
    @NonNull
    public String reportId;

    public String sessionId;
    public String contactId;
    public String contactName;
    public String contactPhone;
    public String externalId;
    public String callerId;
    public String callerName;
    public String campaignName;
    public int durationSeconds;
    public String outcome;
    public String reason;
    public boolean followUpRequired;
    public String followUpDate;
    public String followUpTime;
    public String followUpNotes;
    public String timestamp;

    public CallReportEntity(@NonNull String reportId, String contactId, String contactName, String outcome) {
        this.reportId = reportId;
        this.contactId = contactId;
        this.contactName = contactName;
        this.outcome = outcome;
    }
}
