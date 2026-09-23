package com.smartcallai.app.data.remote

import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody

object SupabaseConfig {
    const val SUPABASE_URL = "https://eyoszuowvipdalrjxjvj.supabase.co"
    const val SUPABASE_KEY = "sb_publishable_vWrDcsBDYrbPukmoi5dYIQ_h0tNUw8a"
    private const val TAG = "SupabaseService"
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
                .header("Prefer", "return=representation,resolution=merge-duplicates")
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
                Log.d("SupabaseService", "Test connection response code: ${response.code}")
                response.isSuccessful || response.code == 400 || response.code == 200
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "Test connection failed: ${e.message}", e)
            false
        }
    }

    suspend fun syncOrganization(org: Organization): Boolean = withContext(Dispatchers.IO) {
        val payload = mapOf(
            "organization_id" to org.organizationId,
            "name" to org.name,
            "industry" to org.industryType.name,
            "code" to org.code
        )
        val json = gson.toJson(payload)
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/organizations")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                Log.d("SupabaseService", "syncOrganization status: ${response.code}, body: ${response.body?.string()}")
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "syncOrganization error: ${e.message}", e)
            false
        }
    }

    suspend fun syncContact(contact: Contact): Boolean = withContext(Dispatchers.IO) {
        val payload = mapOf(
            "contact_id" to contact.contactId,
            "roll_number" to contact.rollOrIdNumber.ifBlank { "N/A" },
            "name" to contact.name,
            "primary_phone" to contact.primaryPhone,
            "alternate_phone" to contact.alternatePhone,
            "overall_attendance" to contact.overallAttendance,
            "current_status" to contact.currentStatus,
            "is_selected" to contact.isSelected,
            "group_name" to contact.groupName,
            "notes" to contact.notes
        )
        val json = gson.toJson(payload)
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/contacts")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                val responseBodyStr = response.body?.string()
                Log.d("SupabaseService", "syncContact status: ${response.code}, response: $responseBodyStr")
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "syncContact error: ${e.message}", e)
            false
        }
    }

    suspend fun syncLeaveRecord(leave: LeaveRecord): Boolean = withContext(Dispatchers.IO) {
        val payload = mapOf(
            "leave_id" to leave.leaveId,
            "contact_id" to leave.contactId,
            "leave_type" to leave.leaveType,
            "start_date" to leave.startDate,
            "end_date" to leave.endDate,
            "duration_days" to leave.durationDays,
            "reason" to leave.reason,
            "notes" to leave.notes,
            "status" to leave.status.name,
            "requested_by" to leave.requestedBy,
            "approved_by" to leave.approvedBy
        )
        val json = gson.toJson(payload)
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/leave_records")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                Log.d("SupabaseService", "syncLeaveRecord status: ${response.code}, body: ${response.body?.string()}")
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "syncLeaveRecord error: ${e.message}", e)
            false
        }
    }

    suspend fun syncCallLog(log: CallLog): Boolean = withContext(Dispatchers.IO) {
        val payload = mapOf(
            "log_id" to log.logId,
            "session_id" to log.sessionId,
            "contact_id" to log.contactId,
            "number_used" to log.numberUsed,
            "number_used_type" to log.numberUsedType.name,
            "outcome_status" to log.outcomeStatus.name,
            "duration_seconds" to log.durationSeconds,
            "notes" to log.notes
        )
        val json = gson.toJson(payload)
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/call_logs")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                Log.d("SupabaseService", "syncCallLog status: ${response.code}, body: ${response.body?.string()}")
                response.isSuccessful
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "syncCallLog error: ${e.message}", e)
            false
        }
    }

    suspend fun fetchRemoteContacts(): List<Map<String, Any>> = withContext(Dispatchers.IO) {
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/contacts?select=*")
            .get()
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                val bodyStr = response.body?.string() ?: ""
                if (response.isSuccessful && bodyStr.isNotBlank()) {
                    val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                    gson.fromJson(bodyStr, type) ?: emptyList()
                } else emptyList()
            }
        } catch (e: Exception) {
            Log.e("SupabaseService", "fetchRemoteContacts error: ${e.message}", e)
            emptyList()
        }
    }

    suspend fun logAuditAction(userId: String, action: String, details: String): Boolean = withContext(Dispatchers.IO) {
        val payload = mapOf(
            "audit_id" to "audit_${System.currentTimeMillis()}_${(100..999).random()}",
            "user_id" to userId,
            "action" to action,
            "entity_type" to "USER_ACTION",
            "entity_id" to userId,
            "details" to details
        )
        val json = gson.toJson(payload)
        val body = json.toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("${SupabaseConfig.SUPABASE_URL}/rest/v1/audit_logs")
            .post(body)
            .build()

        try {
            okHttpClient.newCall(request).execute().use { response ->
                response.isSuccessful
            }
        } catch (e: Exception) {
            false
        }
    }
}
