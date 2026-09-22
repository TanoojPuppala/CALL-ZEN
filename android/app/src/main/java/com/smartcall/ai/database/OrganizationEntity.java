package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "organizations")
public class OrganizationEntity {
    @PrimaryKey
    @NonNull
    public String organizationId;

    public String name;
    public String industry;
    public String code;
    public String adminName;
    public String contactEmail;
    public String contactPhone;
    public String timezone;
    public String workingHours;
    public String createdAt;
    public String updatedAt;

    public OrganizationEntity(@NonNull String organizationId, String name, String industry, String code) {
        this.organizationId = organizationId;
        this.name = name;
        this.industry = industry;
        this.code = code;
    }
}
