package com.smartcallai.app.data.remote

import com.google.gson.Gson
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

object SupabaseConfig {
    const val SUPABASE_URL = "https://eyoszuowvipdalrjxjvj.supabase.co"
    const val SUPABASE_KEY = "sb_publishable_vWrDcsBDYrbPukmoi5dYIQ_h0tNUw8a"
}

class SupabaseService {

    private val gson = Gson()
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val original = chain.request()
            val requestBuilder = original.newBuilder()
                .header("apikey", SupabaseConfig.SUPABASE_KEY)
                .header("Authorization", "Bearer ${SupabaseConfig.SUPABASE_KEY}")
                .header("Content-Type", "application/json")
                .header("Prefer", "return=representation")
            chain.proceed(requestBuilder.build())
        }
        .build()

    suspend fun testConnection(): Boolean = withContext(Dispatchers.IO) {
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/")
            .get()
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful || response.code == 400 || response.code == 200
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun syncOrganization(org: Organization): Boolean = withContext(Dispatchers.IO) {
        val json = gson.toJson(
            mapOf(
                "organization_id" to org.organizationId,
                "name" to org.name,
                "industry_type" to org.industryType.name,
                "code" to org.code
            )
        )
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/organizations")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun syncContact(contact: Contact): Boolean = withContext(Dispatchers.IO) {
        val json = gson.toJson(
            mapOf(
                "contact_id" to contact.contactId,
                "organization_id" to contact.organizationId,
                "period_id" to contact.periodId,
                "roll_number" to contact.rollOrIdNumber,
                "name" to contact.name,
                "primary_phone" to contact.primaryPhone,
                "alternate_phone" to contact.alternatePhone,
                "overall_attendance" to contact.overallAttendance,
                "status" to contact.currentStatus,
                "group_name" to contact.groupName
            )
        )
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/contacts")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun syncLeaveRecord(leave: LeaveRecord): Boolean = withContext(Dispatchers.IO) {
        val json = gson.toJson(
            mapOf(
                "leave_id" to leave.leaveId,
                "contact_id" to leave.contactId,
                "organization_id" to leave.organizationId,
                "period_id" to leave.periodId,
                "leave_type" to leave.leaveType,
                "start_date" to leave.startDate,
                "end_date" to leave.endDate,
                "duration_days" to leave.durationDays,
                "reason" to leave.reason,
                "status" to leave.status.name,
                "requested_by" to leave.requestedBy,
                "approved_by" to leave.approvedBy
            )
        )
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/leave_records")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun syncCallLog(log: CallLog): Boolean = withContext(Dispatchers.IO) {
        val json = gson.toJson(
            mapOf(
                "log_id" to log.logId,
                "session_id" to log.sessionId,
                "contact_id" to log.contactId,
                "number_used" to log.numberUsed,
                "number_type" to log.numberUsedType.name,
                "outcome" to log.outcomeStatus.name,
                "duration_seconds" to log.durationSeconds,
                "notes" to log.notes
            )
        )
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/call_logs")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
