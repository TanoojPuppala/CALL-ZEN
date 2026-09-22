package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "retry_attempts")
public class RetryAttemptEntity {
    @PrimaryKey
    @NonNull
    public String retryId;

    public String contactId;
    public String contactName;
    public String contactPhone;
    public String externalId;
    public String department;
    public String campaignId;
    public String reason;
    public String outcome;
    public int retryCount;
    public int maxRetries;
    public String status;
    public String timestamp;

    public RetryAttemptEntity(@NonNull String retryId, String contactId, String contactName, String outcome) {
        this.retryId = retryId;
        this.contactId = contactId;
        this.contactName = contactName;
        this.outcome = outcome;
    }
}
