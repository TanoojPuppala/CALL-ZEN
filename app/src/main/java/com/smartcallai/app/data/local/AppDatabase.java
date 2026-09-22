package com.smartcallai.app.data.local;

import android.content.Context;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.room.TypeConverters;

@Database(
    entities = {
        OrganizationEntity.class,
        UserEntity.class,
        IndustryConfigEntity.class,
        PeriodEntity.class,
        ContactEntity.class,
        LeaveRecordEntity.class,
        CallingSessionEntity.class,
        CallingQueueItemEntity.class,
        CallLogEntity.class,
        CallReportEntity.class,
        RetryAttemptEntity.class,
        FollowUpEntity.class,
        AuditLogEntity.class
    },
    version = 1,
    exportSchema = false
)
@TypeConverters({Converters.class})
public abstract class AppDatabase extends RoomDatabase {
    public abstract OrganizationDao organizationDao();
    public abstract UserDao userDao();
    public abstract IndustryConfigDao industryConfigDao();
    public abstract PeriodDao periodDao();
    public abstract ContactDao contactDao();
    public abstract LeaveRecordDao leaveRecordDao();
    public abstract CallingSessionDao callingSessionDao();
    public abstract CallingQueueDao callingQueueDao();
    public abstract CallLogDao callLogDao();
    public abstract CallReportDao callReportDao();
    public abstract RetryAttemptDao retryAttemptDao();
    public abstract FollowUpDao followUpDao();
    public abstract AuditLogDao auditLogDao();

    private static volatile AppDatabase INSTANCE;

    public static AppDatabase getDatabase(Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(
                        context.getApplicationContext(),
                        AppDatabase.class,
                        "smartcall_ai_db"
                    )
                    .fallbackToDestructiveMigration()
                    .build();
                }
            }
        }
        return INSTANCE;
    }
}
