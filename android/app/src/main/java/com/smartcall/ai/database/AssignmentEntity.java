package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "assignments")
public class AssignmentEntity {
    @PrimaryKey
    @NonNull
    public String assignmentId;

    public String organizationId;
    public String periodId;
    public String callerId;
    public String callerName;
    public String assignedAt;

    public AssignmentEntity(@NonNull String assignmentId, String organizationId, String periodId, String callerId) {
        this.assignmentId = assignmentId;
        this.organizationId = organizationId;
        this.periodId = periodId;
        this.callerId = callerId;
    }
}
