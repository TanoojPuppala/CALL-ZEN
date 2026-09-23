package com.smartcallai.app.ui.leave

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
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
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeaveManagementScreen(
    navController: NavController,
    viewModel: LeaveViewModel
) {
    val leaveRecords by viewModel.leaveRecords.collectAsState()
    val contacts by viewModel.contacts.collectAsState()

    var showAddLeaveDialog by remember { mutableStateOf(false) }
    var selectedFilter by remember { mutableStateOf("ALL") }

    val filteredLeaves = leaveRecords.filter { leave ->
        when (selectedFilter) {
            "APPROVED" -> leave.status == LeaveStatus.APPROVED
            "PENDING" -> leave.status == LeaveStatus.PENDING
            "REJECTED" -> leave.status == LeaveStatus.REJECTED
            "CANCELLED" -> leave.status == LeaveStatus.CANCELLED
            else -> true
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Leave Management & Sanctions", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
                actions = {
                    Button(
                        onClick = { showAddLeaveDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.padding(end = 12.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Sanction Leave", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CardSurface)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(LightBackground)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Filter Chips
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("ALL" to "All (${leaveRecords.size})", "APPROVED" to "Approved", "PENDING" to "Pending", "CANCELLED" to "Cancelled").forEach { (key, label) ->
                    FilterChip(
                        selected = selectedFilter == key,
                        onClick = { selectedFilter = key },
                        label = { Text(text = label, fontSize = 12.sp) }
                    )
                }
            }

            // Leave Records List or Empty State
            if (filteredLeaves.isEmpty()) {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 24.dp)
                        .border(1.dp, BorderLight, RoundedCornerShape(16.dp))
                ) {
                    Column(
                        modifier = Modifier.padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Default.EventNote, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(text = "No Leave Records Found", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Sanction multi-day leave for contacts to exclude them from unnecessary calls.",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Button(
                            onClick = { showAddLeaveDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Sanction Leave")
                        }
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(filteredLeaves) { leave ->
                        val contact = contacts.find { it.contactId == leave.contactId }

                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = CardSurface),
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, BorderLight, RoundedCornerShape(16.dp))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(text = contact?.name ?: "Contact #${leave.contactId}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
                                        Text(text = "ID #${contact?.rollOrIdNumber ?: "N/A"} • ${leave.leaveType}", fontSize = 12.sp, color = TextSecondary)
                                    }
                                    StatusBadge(text = leave.status.displayName)
                                }

                                HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = BorderLight)

                                Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                    Text(text = "Duration: ${leave.startDate} to ${leave.endDate} (${leave.durationDays} Days)", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = RoyalBluePrimary)
                                }

                                Spacer(modifier = Modifier.height(4.dp))
                                Text(text = "Reason: ${leave.reason}", fontSize = 12.sp, color = TextSecondary)
                                if (leave.notes.isNotBlank()) {
                                    Text(text = "Notes: ${leave.notes}", fontSize = 11.sp, color = TextMuted)
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // Actions Row
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    if (leave.status == LeaveStatus.PENDING) {
                                        Button(
                                            onClick = { viewModel.approveLeave(leave.leaveId) },
                                            colors = ButtonDefaults.buttonColors(containerColor = SuccessGreenContainer, contentColor = SuccessGreen),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(text = "Approve", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                        Button(
                                            onClick = { viewModel.rejectLeave(leave.leaveId) },
                                            colors = ButtonDefaults.buttonColors(containerColor = DangerRedContainer, contentColor = DangerRed),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(text = "Reject", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }

                                    if (leave.status == LeaveStatus.APPROVED) {
                                        OutlinedButton(
                                            onClick = { viewModel.extendLeave(leave.leaveId, leave.endDate, 2) },
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(text = "Extend +2 Days", fontSize = 11.sp)
                                        }
                                        OutlinedButton(
                                            onClick = { viewModel.cancelLeave(leave.leaveId) },
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(text = "Cancel Leave", fontSize = 11.sp, color = DangerRed)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Add Leave Dialog
        if (showAddLeaveDialog) {
            var selectedContactId by remember { mutableStateOf(contacts.firstOrNull()?.contactId ?: "") }
            var leaveType by remember { mutableStateOf("Sick Leave") }
            var reason by remember { mutableStateOf("") }
            var durationDays by remember { mutableStateOf(3) }

            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val cal = Calendar.getInstance()
            val startDate = sdf.format(cal.time)
            cal.add(Calendar.DAY_OF_YEAR, durationDays - 1)
            val endDate = sdf.format(cal.time)

            AlertDialog(
                onDismissRequest = { showAddLeaveDialog = false },
                title = { Text(text = "Sanction Multi-Day Leave", fontWeight = FontWeight.Bold) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        if (contacts.isEmpty()) {
                            Text(text = "No contacts available. Add contacts in Data tab first.", fontSize = 13.sp, color = DangerRed)
                        } else {
                            Text(text = "Select Contact:", fontWeight = FontWeight.Bold, fontSize = 12.sp)

                            contacts.take(5).forEach { c ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    RadioButton(
                                        selected = selectedContactId == c.contactId,
                                        onClick = { selectedContactId = c.contactId }
                                    )
                                    Text(text = "${c.name} (ID #${c.rollOrIdNumber})", fontSize = 13.sp)
                                }
                            }

                            Text(text = "Duration Preset:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                listOf(1 to "1 Day", 3 to "3 Days", 7 to "1 Week").forEach { (days, label) ->
                                    FilterChip(
                                        selected = durationDays == days,
                                        onClick = { durationDays = days },
                                        label = { Text(text = label, fontSize = 12.sp) }
                                    )
                                }
                            }

                            Text(text = "Calculated Dates: $startDate to $endDate", fontSize = 12.sp, color = RoyalBluePrimary, fontWeight = FontWeight.Bold)

                            Text(text = "Reason for Leave:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            OutlinedTextField(
                                value = reason,
                                onValueChange = { reason = it },
                                placeholder = { Text("e.g., Medical leave / High fever") },
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }
                },
                confirmButton = {
                    if (contacts.isNotEmpty()) {
                        Button(
                            onClick = {
                                val targetContactId = selectedContactId.ifBlank { contacts.first().contactId }
                                if (reason.isNotBlank()) {
                                    viewModel.addLeaveRequest(
                                        contactId = targetContactId,
                                        leaveType = leaveType,
                                        startDate = startDate,
                                        endDate = endDate,
                                        durationDays = durationDays,
                                        reason = reason,
                                        notes = "Sanctioned via Leave Module",
                                        autoApprove = true
                                    )
                                    showAddLeaveDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                        ) {
                            Text(text = "Sanction & Approve")
                        }
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddLeaveDialog = false }) {
                        Text(text = "Cancel")
                    }
                }
            )
        }
    }
}
