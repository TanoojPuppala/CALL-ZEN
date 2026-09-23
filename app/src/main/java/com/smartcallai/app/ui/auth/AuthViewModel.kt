package com.smartcallai.app.ui.auth

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.local.UserSessionManager
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val user: User) : AuthState()
    data class Error(val message: String) : AuthState()
}

class AuthViewModel(
    private val repository: SmartCallRepository,
    context: Context
) : ViewModel() {

    private val sessionManager = UserSessionManager(context)

    private val _authState = MutableStateFlow<AuthState>(
        if (sessionManager.isLoggedIn()) {
            val user = sessionManager.getUserSession()
            if (user != null) AuthState.Success(user) else AuthState.Idle
        } else AuthState.Idle
    )
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    fun signIn(email: String, rawPassword: String) {
        if (email.isBlank() || rawPassword.isBlank()) {
            _authState.value = AuthState.Error("Please enter email and password")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val org = repository.getCurrentOrganization()
                val user = User(
                    userId = "user_${System.currentTimeMillis()}",
                    name = email.substringBefore("@").replace(".", " ").capitalize(),
                    email = email,
                    role = UserRole.ORG_ADMIN,
                    organizationId = org.toString()
                )
                sessionManager.saveUserSession(user)
                repository.setCurrentUser(user)
                repository.addAuditLog("USER_SIGN_IN", "User", user.userId, "User signed in: ${user.email}")
                _authState.value = AuthState.Success(user)
            } catch (e: Exception) {
                _authState.value = AuthState.Error("Sign in failed: ${e.message}")
            }
        }
    }

    fun signUp(
        orgName: String,
        industryType: IndustryType,
        adminName: String,
        email: String,
        rawPassword: String
    ) {
        if (orgName.isBlank() || adminName.isBlank() || email.isBlank() || rawPassword.isBlank()) {
            _authState.value = AuthState.Error("Please fill in all required fields")
            return
        }

        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val org = repository.registerOrganizationAndAdmin(
                    orgName = orgName,
                    industryType = industryType,
                    orgCode = "ORG-${(1000..9999).random()}",
                    adminName = adminName,
                    email = email,
                    rawPassword = rawPassword
                )

                val user = User(
                    userId = "user_${System.currentTimeMillis()}",
                    name = adminName,
                    email = email,
                    role = UserRole.ORG_ADMIN,
                    organizationId = org.organizationId
                )
                sessionManager.saveUserSession(user)
                repository.setCurrentUser(user)
                repository.addAuditLog("USER_SIGN_UP", "User", user.userId, "Created account & organization: ${org.name}")
                _authState.value = AuthState.Success(user)
            } catch (e: Exception) {
                _authState.value = AuthState.Error("Sign up failed: ${e.message}")
            }
        }
    }

    fun signOut() {
        sessionManager.clearSession()
        _authState.value = AuthState.Idle
    }
}
