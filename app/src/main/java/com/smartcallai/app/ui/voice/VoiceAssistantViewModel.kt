package com.smartcallai.app.ui.voice

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Locale

sealed class VoiceCommandResult {
    data class Success(val message: String, val actionType: String) : VoiceCommandResult()
    data class Error(val message: String) : VoiceCommandResult()
    object Idle : VoiceCommandResult()
}

class VoiceAssistantViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    private val _voiceState = MutableStateFlow<VoiceCommandResult>(VoiceCommandResult.Idle)
    val voiceState: StateFlow<VoiceCommandResult> = _voiceState.asStateFlow()

    fun processVoiceCommand(inputCommand: String) {
        val command = inputCommand.trim().lowercase(Locale.getDefault())
        viewModelScope.launch {
            val period = repository.getCurrentPeriod().first()
            if (period == null) {
                _voiceState.value = VoiceCommandResult.Error("No active organization/period configured. Create one first.")
                return@launch
            }

            val contacts = repository.getContacts(period.periodId).first()
            val activeSession = repository.getActiveSession().first()

            when {
                command.contains("call next") || command == "next person" -> {
                    if (activeSession != null) {
                        val queue = repository.getCallingQueue(activeSession.sessionId).first()
                        val nextIdx = activeSession.currentQueueIndex + 1
                        if (nextIdx < queue.size) {
                            repository.pauseSession(activeSession.sessionId, isPaused = false, nextIdx)
                            _voiceState.value = VoiceCommandResult.Success("Moving to next contact in queue", "NEXT")
                        } else {
                            _voiceState.value = VoiceCommandResult.Error("Reached the end of current calling queue")
                        }
                    } else {
                        _voiceState.value = VoiceCommandResult.Error("No active calling session found")
                    }
                }
                command.startsWith("call ") -> {
                    val searchName = command.removePrefix("call ").trim()
                    val match = contacts.find { it.name.lowercase(Locale.getDefault()).contains(searchName) }
                    if (match != null) {
                        if (match.isSelected) {
                            _voiceState.value = VoiceCommandResult.Success("Ready to call ${match.name} (${match.primaryPhone})", "DIAL_CONTACT")
                        } else {
                            _voiceState.value = VoiceCommandResult.Error("${match.name} is NOT in the selected calling queue. Select them from Data tab first.")
                        }
                    } else {
                        _voiceState.value = VoiceCommandResult.Error("Contact '$searchName' not found")
                    }
                }
                command.startsWith("find ") -> {
                    val searchName = command.removePrefix("find ").trim()
                    val match = contacts.find { it.name.lowercase(Locale.getDefault()).contains(searchName) }
                    if (match != null) {
                        _voiceState.value = VoiceCommandResult.Success("Found ${match.name} | Roll/ID #${match.rollOrIdNumber} | Status: ${match.currentStatus}", "FIND")
                    } else {
                        _voiceState.value = VoiceCommandResult.Error("No contact found matching '$searchName'")
                    }
                }
                command.contains("pause") -> {
                    if (activeSession != null) {
                        repository.pauseSession(activeSession.sessionId, isPaused = true, activeSession.currentQueueIndex)
                        _voiceState.value = VoiceCommandResult.Success("Calling session paused at queue item ${activeSession.currentQueueIndex + 1}", "PAUSE")
                    } else {
                        _voiceState.value = VoiceCommandResult.Error("No active session to pause")
                    }
                }
                command.contains("resume") -> {
                    if (activeSession != null) {
                        repository.pauseSession(activeSession.sessionId, isPaused = false, activeSession.currentQueueIndex)
                        _voiceState.value = VoiceCommandResult.Success("Calling session resumed at position ${activeSession.currentQueueIndex + 1}", "RESUME")
                    } else {
                        _voiceState.value = VoiceCommandResult.Error("No active session to resume")
                    }
                }
                command.contains("progress") || command.contains("status") -> {
                    val analytics = repository.getAnalyticsSummary(period.periodId).first()
                    val msg = "Today's Progress: ${analytics.totalCompleted} Completed, ${analytics.totalPending} Pending, ${analytics.totalApprovedLeave} On Approved Leave (${String.format(Locale.getDefault(), "%.1f", analytics.completionPercentage)}% Complete)"
                    _voiceState.value = VoiceCommandResult.Success(msg, "PROGRESS")
                }
                else -> {
                    _voiceState.value = VoiceCommandResult.Error("Command not recognized. Try 'Call Rahul', 'Pause calling', 'Show progress', or 'Find Priya'")
                }
            }
        }
    }

    fun resetVoiceState() {
        _voiceState.value = VoiceCommandResult.Idle
    }
}
