package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "periods")
public class PeriodEntity {
    @PrimaryKey
    @NonNull
    public String periodId;

    public String organizationId;
    public String name;
    public String year;
    public String semesterOrPeriod;
    public String departmentOrClass;
    public String assignedCallerId;
    public String assignedCallerName;
    public boolean isArchived;
    public int totalContacts;
    public String createdAt;

    public PeriodEntity(@NonNull String periodId, String organizationId, String name, String year, String departmentOrClass) {
        this.periodId = periodId;
        this.organizationId = organizationId;
        this.name = name;
        this.year = year;
        this.departmentOrClass = departmentOrClass;
    }
}
