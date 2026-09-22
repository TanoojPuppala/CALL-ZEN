package com.smartcallai.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class MainViewModel(
    val repository: SmartCallRepository
) : ViewModel() {

    val currentOrg: StateFlow<Organization?> = repository.getCurrentOrganization()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val currentUser: StateFlow<User?> = repository.getCurrentUser()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val currentPeriod: StateFlow<Period?> = repository.getCurrentPeriod()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val activeSession: StateFlow<CallingSession?> = repository.getActiveSession()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val industryConfig: StateFlow<IndustryConfig?> = currentOrg.flatMapLatest { org ->
        if (org != null) repository.getIndustryConfig(org.industryType) else flowOf(null)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val analyticsSummary: StateFlow<AnalyticsSummary?> = currentPeriod.flatMapLatest { period ->
        if (period != null) repository.getAnalyticsSummary(period.periodId) else flowOf(
            AnalyticsSummary(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0f, 0f, 0f)
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    fun createOrganizationAndAdmin(
        orgName: String,
        industryType: IndustryType,
        orgCode: String,
        adminName: String,
        email: String,
        password: String
    ) {
        viewModelScope.launch {
            repository.registerOrganizationAndAdmin(
                orgName = orgName,
                industryType = industryType,
                orgCode = orgCode,
                adminName = adminName,
                email = email,
                rawPassword = password
            )
        }
    }

    fun switchIndustry(type: IndustryType) {
        viewModelScope.launch {
            val org = currentOrg.value ?: return@launch
            val updatedOrg = org.copy(industryType = type)
            repository.updateOrganization(updatedOrg)
        }
    }

    fun switchRole(role: UserRole) {
        viewModelScope.launch {
            val user = currentUser.value ?: return@launch
            val updatedUser = user.copy(role = role)
            repository.setCurrentUser(updatedUser)
        }
    }
}
