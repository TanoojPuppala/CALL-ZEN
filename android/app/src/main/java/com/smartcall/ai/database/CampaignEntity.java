package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "campaigns")
public class CampaignEntity {
    @PrimaryKey
    @NonNull
    public String campaignId;

    public String organizationId;
    public String periodId;
    public String name;
    public String type;
    public String assignedCallerId;
    public String assignedCallerName;
    public int totalContacts;
    public int completedCount;
    public String status;
    public String createdAt;

    public CampaignEntity(@NonNull String campaignId, String organizationId, String name) {
        this.campaignId = campaignId;
        this.organizationId = organizationId;
        this.name = name;
    }
}
