package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "audit_logs")
public class AuditLogEntity {
    @PrimaryKey
    @NonNull
    public String logId;

    public String organizationId;
    public String actorName;
    public String actorRole;
    public String action;
    public String details;
    public String timestamp;

    public AuditLogEntity(@NonNull String logId, String actorName, String action, String details) {
        this.logId = logId;
        this.actorName = actorName;
        this.action = action;
        this.details = details;
    }
}
