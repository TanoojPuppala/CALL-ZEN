package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "calling_queue_items")
public class CallingQueueItemEntity {
    @PrimaryKey
    @NonNull
    public String queueItemId;

    public String sessionId;
    public String contactId;
    public int position;
    public String status;
    public int attemptCount;
    public String createdAt;

    public CallingQueueItemEntity(@NonNull String queueItemId, String sessionId, String contactId, int position) {
        this.queueItemId = queueItemId;
        this.sessionId = sessionId;
        this.contactId = contactId;
        this.position = position;
    }
}
