package com.smartcallai.app.data.local

import android.content.Context
import com.google.gson.Gson
import com.smartcallai.app.domain.model.User
import com.smartcallai.app.domain.model.UserRole

class UserSessionManager(context: Context) {

    private val prefs = context.getSharedPreferences("callzen_user_session", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun saveUserSession(user: User, token: String = "token_${System.currentTimeMillis()}") {
        val json = gson.toJson(user)
        prefs.edit()
            .putString("active_user_json", json)
            .putString("auth_token", token)
            .putBoolean("is_logged_in", true)
            .apply()
    }

    fun getUserSession(): User? {
        val json = prefs.getString("active_user_json", null) ?: return null
        return try {
            gson.fromJson(json, User::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun isLoggedIn(): Boolean {
        return prefs.getBoolean("is_logged_in", false)
    }

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
