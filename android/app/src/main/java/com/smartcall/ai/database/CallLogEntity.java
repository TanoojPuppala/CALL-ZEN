package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "call_logs")
public class CallLogEntity {
    @PrimaryKey
    @NonNull
    public String callId;

    public String contactId;
    public String sessionId;
    public String numberUsedType; // PRIMARY | ALTERNATE
    public String phoneNumber;
    public String outcome;
    public String reason;
    public String startedAt;
    public String endedAt;
    public int durationSeconds;
    public String createdBy;

    public CallLogEntity(@NonNull String callId, String contactId, String phoneNumber, String outcome, int durationSeconds) {
        this.callId = callId;
        this.contactId = contactId;
        this.phoneNumber = phoneNumber;
        this.outcome = outcome;
        this.durationSeconds = durationSeconds;
    }
}
