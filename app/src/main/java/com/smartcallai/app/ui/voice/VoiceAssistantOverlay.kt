package com.smartcallai.app.ui.voice

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.theme.*

@Composable
fun VoiceAssistantOverlay(
    viewModel: VoiceAssistantViewModel
) {
    val voiceState by viewModel.voiceState.collectAsState()
    var showOverlay by remember { mutableStateOf(false) }
    var inputQuery by remember { mutableStateOf("") }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.BottomEnd
    ) {
        // Floating Voice Assistant Trigger
        FloatingActionButton(
            onClick = { showOverlay = true },
            containerColor = AiPurple,
            contentColor = Color.White,
            shape = CircleShape,
            modifier = Modifier.padding(16.dp)
        ) {
            Icon(Icons.Default.Mic, contentDescription = "Voice Assistant", modifier = Modifier.size(28.dp))
        }

        if (showOverlay) {
            AlertDialog(
                onDismissRequest = {
                    showOverlay = false
                    viewModel.resetVoiceState()
                },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = AiPurple)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("SmartCall Voice Assistant", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Try commands like: 'Call Rahul', 'Pause calling', 'Resume calling', 'Show progress', or 'Find Priya'", fontSize = 12.sp, color = TextSecondary)

                        OutlinedTextField(
                            value = inputQuery,
                            onValueChange = { inputQuery = it },
                            placeholder = { Text("Enter voice command...") },
                            trailingIcon = {
                                IconButton(onClick = {
                                    if (inputQuery.isNotBlank()) {
                                        viewModel.processVoiceCommand(inputQuery)
                                    }
                                }) {
                                    Icon(Icons.Default.Send, contentDescription = "Send", tint = AiPurple)
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Voice Result
                        when (val state = voiceState) {
                            is VoiceCommandResult.Success -> {
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = SuccessGreenContainer),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessGreen)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(state.message, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                    }
                                }
                            }
                            is VoiceCommandResult.Error -> {
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = DangerRedContainer),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.Error, contentDescription = null, tint = DangerRed)
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(state.message, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                    }
                                }
                            }
                            VoiceCommandResult.Idle -> {}
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = {
                        showOverlay = false
                        viewModel.resetVoiceState()
                    }) {
                        Text("Close")
                    }
                }
            )
        }
    }
}
