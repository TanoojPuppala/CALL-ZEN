package com.smartcallai.app.data.local

import androidx.room.TypeConverter
import com.smartcallai.app.domain.model.*

class Converters {
    @TypeConverter
    fun fromIndustryType(value: IndustryType): String = value.name

    @TypeConverter
    fun toIndustryType(value: String): IndustryType = try {
        IndustryType.valueOf(value)
    } catch (e: Exception) {
        IndustryType.EDUCATION
    }

    @TypeConverter
    fun fromUserRole(value: UserRole): String = value.name

    @TypeConverter
    fun toUserRole(value: String): UserRole = try {
        UserRole.valueOf(value)
    } catch (e: Exception) {
        UserRole.CALLER_STAFF
    }

    @TypeConverter
    fun fromLeaveStatus(value: LeaveStatus): String = value.name

    @TypeConverter
    fun toLeaveStatus(value: String): LeaveStatus = try {
        LeaveStatus.valueOf(value)
    } catch (e: Exception) {
        LeaveStatus.PENDING
    }

    @TypeConverter
    fun fromCallOutcome(value: CallOutcome): String = value.name

    @TypeConverter
    fun toCallOutcome(value: String): CallOutcome = try {
        CallOutcome.valueOf(value)
    } catch (e: Exception) {
        CallOutcome.NO_ANSWER
    }

    @TypeConverter
    fun fromNumberUsedType(value: NumberUsedType): String = value.name

    @TypeConverter
    fun toNumberUsedType(value: String): NumberUsedType = try {
        NumberUsedType.valueOf(value)
    } catch (e: Exception) {
        NumberUsedType.PRIMARY
    }

    @TypeConverter
    fun fromQueueItemStatus(value: QueueItemStatus): String = value.name

    @TypeConverter
    fun toQueueItemStatus(value: String): QueueItemStatus = try {
        QueueItemStatus.valueOf(value)
    } catch (e: Exception) {
        QueueItemStatus.PENDING
    }
}
