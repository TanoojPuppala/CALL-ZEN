package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Index;
import androidx.room.PrimaryKey;

@Entity(
    tableName = "contacts",
    indices = {
        @Index(value = {"organizationId"}),
        @Index(value = {"periodId"}),
        @Index(value = {"externalId"})
    }
)
public class ContactEntity {
    @PrimaryKey
    @NonNull
    public String contactId;

    public String organizationId;
    public String periodId;
    public String name;
    public String primaryPhone;
    public String alternatePhone;
    public String externalId;
    public String department;
    public String category;
    public double overallAttendance;
    public String status;
    public String notes;
    public String createdAt;
    public String updatedAt;

    public ContactEntity(@NonNull String contactId, String organizationId, String periodId, String name, String primaryPhone, String externalId) {
        this.contactId = contactId;
        this.organizationId = organizationId;
        this.periodId = periodId;
        this.name = name;
        this.primaryPhone = primaryPhone;
        this.externalId = externalId;
    }
}
