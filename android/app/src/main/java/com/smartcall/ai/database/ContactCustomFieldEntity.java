package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "contact_custom_fields")
public class ContactCustomFieldEntity {
    @PrimaryKey
    @NonNull
    public String fieldId;

    public String contactId;
    public String fieldName;
    public String fieldValue;

    public ContactCustomFieldEntity(@NonNull String fieldId, String contactId, String fieldName, String fieldValue) {
        this.fieldId = fieldId;
        this.contactId = contactId;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }
}
