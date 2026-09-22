package com.smartcallai.app.utils

import java.security.MessageDigest

object SecurityUtils {
    fun hashPassword(password: String): String {
        if (password.isBlank()) return ""
        val bytes = password.toByteArray(Charsets.UTF_8)
        val md = MessageDigest.getInstance("SHA-256")
        val digest = md.digest(bytes)
        return digest.joinToString("") { "%02x".format(it) }
    }

    fun verifyPassword(password: String, hash: String): Boolean {
        return hashPassword(password) == hash
    }
}
