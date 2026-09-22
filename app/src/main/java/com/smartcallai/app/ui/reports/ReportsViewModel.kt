package com.smartcallai.app.ui.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*

@OptIn(ExperimentalCoroutinesApi::class)
class ReportsViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    val currentPeriod: StateFlow<Period?> = repository.getCurrentPeriod()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val analyticsSummary: StateFlow<AnalyticsSummary?> = currentPeriod.flatMapLatest { period ->
        if (period != null) repository.getAnalyticsSummary(period.periodId) else flowOf(
            AnalyticsSummary(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0f, 0f, 0f)
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val auditLogs: StateFlow<List<AuditLog>> = repository.getAuditLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val retryAttempts: StateFlow<List<RetryAttempt>> = repository.getRetryAttempts()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
}
