package com.smartcall.ai.database;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "users")
public class UserEntity {
    @PrimaryKey
    @NonNull
    public String userId;

    public String organizationId;
    public String name;
    public String email;
    public String role;
    public String roleTitle;
    public String passwordHash;
    public String avatarUrl;
    public String createdAt;

    public UserEntity(@NonNull String userId, String organizationId, String name, String email, String role) {
        this.userId = userId;
        this.organizationId = organizationId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
