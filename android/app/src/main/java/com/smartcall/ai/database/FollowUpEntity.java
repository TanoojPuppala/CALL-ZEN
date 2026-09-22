package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "follow_ups")
public class FollowUpEntity {
    @PrimaryKey
    @NonNull
    public String followUpId;

    public String contactId;
    public String contactName;
    public String contactPhone;
    public String externalId;
    public String dueDate;
    public String dueTime;
    public String reason;
    public String notes;
    public String assignedCallerId;
    public String assignedCallerName;
    public String status;

    public FollowUpEntity(@NonNull String followUpId, String contactId, String contactName, String dueDate) {
        this.followUpId = followUpId;
        this.contactId = contactId;
        this.contactName = contactName;
        this.dueDate = dueDate;
    }
}
