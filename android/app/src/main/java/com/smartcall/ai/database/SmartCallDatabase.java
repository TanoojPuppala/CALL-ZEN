package com.smartcall.ai.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

@Database(
    entities = {
        OrganizationEntity.class,
        UserEntity.class,
        ContactEntity.class,
        ContactCustomFieldEntity.class,
        IndustryConfigEntity.class,
        PeriodEntity.class,
        CampaignEntity.class,
        AssignmentEntity.class,
        CallingSessionEntity.class,
        CallingQueueItemEntity.class,
        CallLogEntity.class,
        CallReportEntity.class,
        FollowUpEntity.class,
        RetryAttemptEntity.class,
        LeaveRecordEntity.class,
        AuditLogEntity.class
    },
    version = 1,
    exportSchema = false
)
public abstract class SmartCallDatabase extends RoomDatabase {
    private static volatile SmartCallDatabase INSTANCE;

    public abstract SmartCallDao smartCallDao();

    public static SmartCallDatabase getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (SmartCallDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                        context.getApplicationContext(),
                        SmartCallDatabase.class,
                        "smartcall_db"
                    ).fallbackToDestructiveMigration().build();
                }
            }
        }
        return INSTANCE;
    }
}
