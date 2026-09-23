package com.smartcallai.app.ui.reports

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.theme.*
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(
    navController: NavController,
    viewModel: ReportsViewModel
) {
    val summary by viewModel.analyticsSummary.collectAsState()
    val auditLogs by viewModel.auditLogs.collectAsState()
    val retries by viewModel.retryAttempts.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                title = { Text(text = "Reports & Analytics", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CardSurface)
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(LightBackground)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Completion Metrics Card
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderLight, RoundedCornerShape(18.dp))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(text = "Overall Completion Percentage", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextSecondary)
                        Spacer(modifier = Modifier.height(6.dp))

                        val pct = summary?.completionPercentage ?: 0f
                        Text(text = "${String.format(Locale.getDefault(), "%.1f", pct)}%", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = RoyalBluePrimary)

                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { (pct / 100f).coerceIn(0f, 1f) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(10.dp),
                            color = RoyalBluePrimary,
                            trackColor = SoftBlueContainer
                        )

                        Spacer(modifier = Modifier.height(16.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text(text = "Org Completion Rate", fontSize = 11.sp, color = TextMuted)
                                Text(text = "${String.format(Locale.getDefault(), "%.1f", summary?.organizationCompletionRate ?: 0f)}%", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                            }
                            Column {
                                Text(text = "Employee / Caller Rate", fontSize = 11.sp, color = TextMuted)
                                Text(text = "${String.format(Locale.getDefault(), "%.1f", summary?.employeeCompletionRate ?: 0f)}%", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = RoyalBluePrimary)
                            }
                        }
                    }
                }
            }

            // Breakdown Grid
            item {
                Text(text = "Metrics Breakdown", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
            }

            item {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    MetricCard(title = "Assigned", value = "${summary?.totalAssigned ?: 0}", icon = Icons.Default.People, modifier = Modifier.weight(1f))
                    MetricCard(title = "Selected", value = "${summary?.totalSelected ?: 0}", icon = Icons.Default.CheckBox, modifier = Modifier.weight(1f))
                }
            }

            item {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    MetricCard(title = "Approved Leave", value = "${summary?.totalApprovedLeave ?: 0}", icon = Icons.Default.EventAvailable, iconBgColor = Color(0xFFE0F2FE), iconTint = Color(0xFF0284C7), modifier = Modifier.weight(1f))
                    MetricCard(title = "Called", value = "${summary?.totalCalled ?: 0}", icon = Icons.Default.Call, iconBgColor = SuccessGreenContainer, iconTint = SuccessGreen, modifier = Modifier.weight(1f))
                }
            }

            item {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
                    MetricCard(title = "Answered", value = "${summary?.totalAnswered ?: 0}", icon = Icons.Default.CheckCircle, iconBgColor = SuccessGreenContainer, iconTint = SuccessGreen, modifier = Modifier.weight(1f))
                    MetricCard(title = "No Answer / Busy", value = "${(summary?.totalNoAnswer ?: 0) + (summary?.totalBusy ?: 0)}", icon = Icons.Default.CallMissed, iconBgColor = WarningOrangeContainer, iconTint = WarningOrange, modifier = Modifier.weight(1f))
                }
            }

            // Retry Queue
            if (retries.isNotEmpty()) {
                item {
                    Text(text = "Retry Queue (${retries.size})", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                }
                items(retries.take(5)) { retry ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = CardSurface),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderLight, RoundedCornerShape(12.dp))
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Replay, contentDescription = null, tint = WarningOrange)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(text = "Contact #${retry.contactId} • ${retry.previousOutcome.displayName}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                Text(text = "Scheduled: ${retry.scheduledTime} • ${retry.notes}", fontSize = 11.sp, color = TextSecondary)
                            }
                        }
                    }
                }
            }

            // Audit Feed Header with Delete/Clear History Button
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "System Audit History", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)

                    if (auditLogs.isNotEmpty()) {
                        IconButton(onClick = { viewModel.clearAuditHistory() }) {
                            Icon(Icons.Default.Delete, contentDescription = "Clear Audit History", tint = DangerRed)
                        }
                    }
                }
            }

            if (auditLogs.isEmpty()) {
                item {
                    Text(text = "No audit log entries recorded yet.", fontSize = 12.sp, color = TextMuted)
                }
            } else {
                items(auditLogs.take(15)) { audit ->
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = CardSurface),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderLight, RoundedCornerShape(12.dp))
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Text(text = audit.action, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = RoyalBluePrimary)
                                Text(text = "User: ${audit.userId}", fontSize = 11.sp, color = TextMuted)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = audit.details, fontSize = 12.sp, color = TextSecondary)
                        }
                    }
                }
            }
        }
    }
}
