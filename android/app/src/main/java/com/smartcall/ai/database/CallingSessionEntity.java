package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "calling_sessions")
public class CallingSessionEntity {
    @PrimaryKey
    @NonNull
    public String sessionId;

    public String organizationId;
    public String periodId;
    public String createdBy;
    public String campaignId;
    public String campaignName;
    public String status;
    public int currentQueueIndex;
    public int completedCount;
    public int retryCount;
    public String startedAt;
    public String pausedAt;
    public String completedAt;

    public CallingSessionEntity(@NonNull String sessionId, String organizationId, String periodId, String createdBy) {
        this.sessionId = sessionId;
        this.organizationId = organizationId;
        this.periodId = periodId;
        this.createdBy = createdBy;
    }
}
