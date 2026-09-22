package com.smartcallai.app.ui.calling

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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.data.DataViewModel
import com.smartcallai.app.ui.navigation.Screen
import com.smartcallai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CallingScreen(
    navController: NavController,
    callingViewModel: CallingViewModel,
    dataViewModel: DataViewModel
) {
    val context = LocalContext.current
    val activeSession by callingViewModel.activeSession.collectAsState()
    val queue by callingViewModel.currentQueue.collectAsState()
    val currentQueueItem by callingViewModel.currentQueueItem.collectAsState()
    val currentContact by callingViewModel.currentContact.collectAsState()
    val selectedNumberType by callingViewModel.selectedNumberType.collectAsState()
    val pendingReport by callingViewModel.pendingReport.collectAsState()
    val leaveRecords by callingViewModel.leaveRecords.collectAsState()

    val selectedContacts by dataViewModel.selectedContacts.collectAsState()

    val approvedLeaveContacts = selectedContacts.filter { contact ->
        leaveRecords.any { leave -> leave.contactId == contact.contactId && leave.status == LeaveStatus.APPROVED }
    }
    val eligibleContacts = selectedContacts.filter { contact ->
        !approvedLeaveContacts.contains(contact)
    }

    var editReportStatus by remember(pendingReport) { mutableStateOf(pendingReport?.aiStatus ?: CallOutcome.ANSWERED) }
    var editReportReason by remember(pendingReport) { mutableStateOf(pendingReport?.aiReason ?: "") }
    var editReportFollowUp by remember(pendingReport) { mutableStateOf(pendingReport?.followUpAction ?: "") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(text = "Calling Session", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text(
                            text = if (activeSession != null) "Queue Progress: ${(activeSession?.currentQueueIndex ?: 0) + 1} / ${activeSession?.totalEligibleCalls ?: 0}" else "Ready to Call Confirmation",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                },
                actions = {
                    if (activeSession != null) {
                        IconButton(onClick = {
                            if (activeSession?.isPaused == true) callingViewModel.resumeCallingSession() else callingViewModel.pauseCallingSession()
                        }) {
                            Icon(
                                imageVector = if (activeSession?.isPaused == true) Icons.Default.PlayArrow else Icons.Default.Pause,
                                contentDescription = "Pause / Resume",
                                tint = RoyalBluePrimary
                            )
                        }
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            if (activeSession == null || queue.isEmpty()) {
                if (selectedContacts.isEmpty()) {
                    // Empty State Card
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
                            Icon(Icons.Default.Call, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(text = "No Contacts Selected for Calling", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Rule: Queue contains selected contacts only.\nGo to Data tab to filter and select contacts requiring calls.",
                                fontSize = 13.sp,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.height(20.dp))
                            Button(
                                onClick = { navController.navigate(Screen.DataManagement.route) },
                                colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                            ) {
                                Icon(Icons.Default.Storage, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = "Go to Data Tab")
                            }
                        }
                    }
                } else {
                    // Ready to Call Confirmation Review
                    Text(text = "Ready to Call — Confirmation Review", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SoftBlueContainer),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderLight, RoundedCornerShape(16.dp))
                    ) {
                        Row(
                            modifier = Modifier
                                .padding(16.dp)
                                .fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${selectedContacts.size}", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = RoyalBluePrimary)
                                Text(text = "Total Selected", fontSize = 11.sp, color = TextSecondary)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${approvedLeaveContacts.size}", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = Color(0xFF0284C7))
                                Text(text = "Approved Leave", fontSize = 11.sp, color = TextSecondary)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${eligibleContacts.size}", fontWeight = FontWeight.Bold, fontSize = 20.sp, color = SuccessGreen)
                                Text(text = "Calling Queue", fontSize = 11.sp, color = TextSecondary)
                            }
                        }
                    }

                    PrimaryButton(
                        text = "Start Calling (${eligibleContacts.size} Contacts)",
                        onClick = { callingViewModel.startCallingSession("current_period", selectedContacts) },
                        icon = Icons.Default.Call,
                        modifier = Modifier.fillMaxWidth()
                    )

                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxWidth()
                    ) {
                        item {
                            Text(text = "Eligible Contacts in Dialing Queue (${eligibleContacts.size}):", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                        items(eligibleContacts) { contact ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = CardSurface),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, BorderLight, RoundedCornerShape(12.dp))
                            ) {
                                Row(
                                    modifier = Modifier
                                        .padding(12.dp)
                                        .fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(text = contact.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text(text = "ID #${contact.rollOrIdNumber} • ${contact.primaryPhone}", fontSize = 12.sp, color = TextSecondary)
                                    }
                                    StatusBadge(text = "In Queue")
                                }
                            }
                        }

                        if (approvedLeaveContacts.isNotEmpty()) {
                            item {
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(text = "On Approved Leave (Excluded from Calls):", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF0284C7))
                            }
                            items(approvedLeaveContacts) { contact ->
                                val leave = leaveRecords.find { it.contactId == contact.contactId && it.status == LeaveStatus.APPROVED }
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF0F9FF)),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(1.dp, Color(0xFFBAE6FD), RoundedCornerShape(12.dp))
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .padding(12.dp)
                                            .fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Column {
                                            Text(text = contact.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = TextPrimary)
                                            Text(text = "Leave: ${leave?.startDate?.takeLast(5)}–${leave?.endDate?.takeLast(5)} • ${leave?.reason ?: "Sanctioned"}", fontSize = 12.sp, color = TextSecondary)
                                        }
                                        StatusBadge(text = "Approved Leave")
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                // Active Calling Session UI
                if (currentContact != null) {
                    val contact = currentContact!!

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = CardSurface),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, BorderLight, RoundedCornerShape(18.dp))
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                StatusBadge(text = "Queue #${(activeSession?.currentQueueIndex ?: 0) + 1}")
                                if (activeSession?.isPaused == true) {
                                    StatusBadge(text = "Session Paused")
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))
                            Text(text = contact.name, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Text(text = "ID #${contact.rollOrIdNumber} • ${contact.groupName}", fontSize = 13.sp, color = TextSecondary)

                            HorizontalDivider(modifier = Modifier.padding(vertical = 16.dp), color = BorderLight)

                            Text(text = "Select Number to Dial:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextSecondary)
                            Spacer(modifier = Modifier.height(8.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                                Button(
                                    onClick = { callingViewModel.dialCurrentContact(context, contact, NumberUsedType.PRIMARY) },
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (selectedNumberType == NumberUsedType.PRIMARY) RoyalBluePrimary else SoftBlueContainer,
                                        contentColor = if (selectedNumberType == NumberUsedType.PRIMARY) Color.White else RoyalBluePrimary
                                    ),
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                ) {
                                    Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "Primary\n${contact.primaryPhone}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }

                                Button(
                                    onClick = { callingViewModel.dialCurrentContact(context, contact, NumberUsedType.ALTERNATE) },
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (selectedNumberType == NumberUsedType.ALTERNATE) RoyalBluePrimary else SoftBlueContainer,
                                        contentColor = if (selectedNumberType == NumberUsedType.ALTERNATE) Color.White else RoyalBluePrimary
                                    ),
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                ) {
                                    Icon(Icons.Default.PhoneForwarded, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "Alternate\n${contact.alternatePhone.ifBlank { "N/A" }}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            Text(text = "Record Call Outcome:", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = TextSecondary)
                            Spacer(modifier = Modifier.height(8.dp))

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.fillMaxWidth()) {
                                listOf(
                                    CallOutcome.ANSWERED to SuccessGreen,
                                    CallOutcome.NO_ANSWER to WarningOrange,
                                    CallOutcome.BUSY to WarningOrange,
                                    CallOutcome.SWITCHED_OFF to DangerRed
                                ).forEach { (outcome, color) ->
                                    Button(
                                        onClick = { callingViewModel.onCallEnded(outcome) },
                                        shape = RoundedCornerShape(8.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = color.copy(alpha = 0.15f), contentColor = color),
                                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text(text = outcome.displayName, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Post-Call AI Report Review Dialog
        if (pendingReport != null) {
            AlertDialog(
                onDismissRequest = { },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = AiPurple)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "Post-Call Report Review", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(text = "Review and edit call details for ${currentContact?.name ?: "Contact"}:", fontSize = 12.sp, color = TextSecondary)

                        Text(text = "Status:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf(CallOutcome.ANSWERED, CallOutcome.NO_ANSWER, CallOutcome.BUSY, CallOutcome.SWITCHED_OFF).forEach { outcome ->
                                FilterChip(
                                    selected = editReportStatus == outcome,
                                    onClick = {
                                        editReportStatus = outcome
                                        callingViewModel.updatePendingReport(editReportStatus, editReportReason, editReportFollowUp)
                                    },
                                    label = { Text(text = outcome.displayName, fontSize = 11.sp) }
                                )
                            }
                        }

                        Text(text = "Reason / Notes:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        OutlinedTextField(
                            value = editReportReason,
                            onValueChange = {
                                editReportReason = it
                                callingViewModel.updatePendingReport(editReportStatus, editReportReason, editReportFollowUp)
                            },
                            modifier = Modifier.fillMaxWidth()
                        )

                        Text(text = "Follow-up Action:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        OutlinedTextField(
                            value = editReportFollowUp,
                            onValueChange = {
                                editReportFollowUp = it
                                callingViewModel.updatePendingReport(editReportStatus, editReportReason, editReportFollowUp)
                            },
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = { callingViewModel.confirmReportAndProceedNext() },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                    ) {
                        Text(text = "Confirm & Next Contact")
                    }
                }
            )
        }
    }
}
