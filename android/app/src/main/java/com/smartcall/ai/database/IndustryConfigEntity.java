package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "industry_configs")
public class IndustryConfigEntity {
    @PrimaryKey
    @NonNull
    public String configId;

    public String industryType;
    public String displayName;
    public String entityLabel;
    public String entityPluralLabel;
    public String idColumnHeader;
    public String statusColumnHeader;
    public String primaryCampaignName;

    public IndustryConfigEntity(@NonNull String configId, String industryType, String displayName) {
        this.configId = configId;
        this.industryType = industryType;
        this.displayName = displayName;
    }
}
