package com.smartcallai.app.ui.reports

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class ReportsViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    private val periodIdFlow = repository.getCurrentPeriod().map { it?.periodId ?: "" }

    val analyticsSummary: StateFlow<AnalyticsSummary?> = periodIdFlow.flatMapLatest { periodId ->
        if (periodId.isNotBlank()) repository.getAnalyticsSummary(periodId) else flowOf(
            AnalyticsSummary(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0f, 0f, 0f)
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val auditLogs: StateFlow<List<AuditLog>> = repository.getAuditLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val retryAttempts: StateFlow<List<RetryAttempt>> = repository.getRetryAttempts()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun clearAuditHistory() {
        viewModelScope.launch {
            repository.clearAuditLogs()
        }
    }
}
