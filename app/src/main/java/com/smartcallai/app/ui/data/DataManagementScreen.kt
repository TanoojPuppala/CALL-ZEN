package com.smartcallai.app.ui.data

import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.calling.CallingViewModel
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DataManagementScreen(
    navController: NavController,
    dataViewModel: DataViewModel,
    callingViewModel: CallingViewModel
) {
    val context = LocalContext.current
    val contacts by dataViewModel.contacts.collectAsState()
    val selectedContacts by dataViewModel.selectedContacts.collectAsState()
    val searchQuery by dataViewModel.searchQuery.collectAsState()
    val statusFilter by dataViewModel.statusFilter.collectAsState()
    val importPreviewItems by dataViewModel.importPreviewItems.collectAsState()
    val leaveRecords by dataViewModel.leaveRecords.collectAsState()

    val activeSession by callingViewModel.activeSession.collectAsState()
    val pendingReport by callingViewModel.pendingReport.collectAsState()
    val currentContact by callingViewModel.currentContact.collectAsState()

    var showImportDialog by remember { mutableStateOf(false) }
    var showAddContactDialog by remember { mutableStateOf(false) }
    var showReadyToCallModal by remember { mutableStateOf(false) }

    val allSelected = contacts.isNotEmpty() && contacts.all { it.isSelected }

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
                        Text(text = "Data Management", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text(text = "${contacts.size} Total Contacts in DB", fontSize = 12.sp, color = TextSecondary)
                    }
                },
                actions = {
                    Row(modifier = Modifier.padding(end = 8.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Button(
                            onClick = { showAddContactDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = SoftBlueContainer, contentColor = RoyalBluePrimary),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Add", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }

                        Button(
                            onClick = { showImportDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.UploadFile, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "Import CSV", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = CardSurface)
            )
        },
        bottomBar = {
            if (selectedContacts.isNotEmpty()) {
                Surface(
                    color = CardSurface,
                    shadowElevation = 8.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .padding(16.dp)
                            .fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "${selectedContacts.size} Selected",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                color = TextPrimary
                            )
                            Text(
                                text = "${eligibleContacts.size} Call Queue • ${approvedLeaveContacts.size} On Approved Leave",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }

                        PrimaryButton(
                            text = "Ready to Call",
                            onClick = { showReadyToCallModal = true },
                            icon = Icons.Default.Call
                        )
                    }
                }
            }
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
            // Search & Filters Row
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { dataViewModel.setSearchQuery(it) },
                placeholder = { Text(text = "Search by Name, Roll #, or Phone...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = RoyalBluePrimary,
                    unfocusedBorderColor = BorderLight,
                    focusedContainerColor = CardSurface,
                    unfocusedContainerColor = CardSurface
                ),
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // Filter Chips
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(
                    "ALL" to "All (${contacts.size})",
                    "SELECTED" to "Selected (${selectedContacts.size})",
                    "ABSENT" to "Absent Today",
                    "LEAVE" to "On Leave"
                ).forEach { (key, label) ->
                    FilterChip(
                        selected = statusFilter == key,
                        onClick = { dataViewModel.setStatusFilter(key) },
                        label = { Text(text = label, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = RoyalBluePrimary,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            if (contacts.isEmpty()) {
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
                        Icon(Icons.Default.Storage, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(text = "No Contacts in Database", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Add contacts manually or import a CSV file to populate your database.",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )
                        Spacer(modifier = Modifier.height(20.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Button(
                                onClick = { showAddContactDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                            ) {
                                Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = "Add Contact")
                            }

                            Button(
                                onClick = { showImportDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = SoftBlueContainer, contentColor = RoyalBluePrimary)
                            ) {
                                Icon(Icons.Default.UploadFile, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = "Import CSV")
                            }
                        }
                    }
                }
            } else {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderLight, RoundedCornerShape(12.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = allSelected,
                            onCheckedChange = { dataViewModel.selectAll(it) },
                            colors = CheckboxDefaults.colors(checkedColor = RoyalBluePrimary)
                        )
                        Text(text = "Select All (${contacts.size})", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }

                val horizontalScrollState = rememberScrollState()
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .border(1.dp, BorderLight, RoundedCornerShape(12.dp))
                        .clip(RoundedCornerShape(12.dp))
                        .background(CardSurface)
                ) {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .horizontalScroll(horizontalScrollState)
                    ) {
                        item {
                            Row(
                                modifier = Modifier
                                    .background(SoftBlueContainer)
                                    .padding(vertical = 10.dp, horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "SELECT", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(60.dp))
                                Text(text = "ID / ROLL", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(80.dp))
                                Text(text = "NAME", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(160.dp))
                                Text(text = "PRIMARY PHONE", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(140.dp))
                                Text(text = "ALTERNATE PHONE", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(140.dp))
                                Text(text = "STATUS", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(140.dp))
                                Text(text = "ACTION", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.width(80.dp))
                            }
                            HorizontalDivider(color = BorderLight)
                        }

                        items(contacts) { contact ->
                            val activeLeave = leaveRecords.find {
                                it.contactId == contact.contactId && it.status == LeaveStatus.APPROVED
                            }

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(if (contact.isSelected) SoftBlueContainer.copy(alpha = 0.5f) else CardSurface)
                                    .padding(vertical = 8.dp, horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(modifier = Modifier.width(60.dp)) {
                                    Checkbox(
                                        checked = contact.isSelected,
                                        onCheckedChange = { dataViewModel.toggleContactSelection(contact.contactId, it) },
                                        colors = CheckboxDefaults.colors(checkedColor = RoyalBluePrimary)
                                    )
                                }
                                Text(text = contact.rollOrIdNumber, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.width(80.dp))
                                Column(modifier = Modifier.width(160.dp)) {
                                    Text(text = contact.name, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    Text(text = contact.groupName, fontSize = 11.sp, color = TextMuted)
                                }
                                Text(text = contact.primaryPhone, fontSize = 13.sp, color = TextPrimary, modifier = Modifier.width(140.dp))
                                Text(text = contact.alternatePhone.ifBlank { "N/A" }, fontSize = 13.sp, color = TextSecondary, modifier = Modifier.width(140.dp))

                                Box(modifier = Modifier.width(140.dp)) {
                                    if (activeLeave != null) {
                                        StatusBadge(text = "Approved Leave (${activeLeave.startDate.takeLast(5)})")
                                    } else {
                                        StatusBadge(text = contact.currentStatus)
                                    }
                                }

                                Box(modifier = Modifier.width(80.dp)) {
                                    IconButton(onClick = { dataViewModel.deleteContact(contact.contactId) }) {
                                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = DangerRed, modifier = Modifier.size(18.dp))
                                    }
                                }
                            }
                            HorizontalDivider(color = BorderLight.copy(alpha = 0.5f))
                        }
                    }
                }
            }
        }

        // Ready-to-Call & Direct Dialing Modal
        if (showReadyToCallModal) {
            AlertDialog(
                onDismissRequest = { showReadyToCallModal = false },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Call, contentDescription = null, tint = RoyalBluePrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "Ready to Call Review", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 420.dp)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.SpaceAround,
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(SoftBlueContainer)
                                .padding(10.dp)
                                .clip(RoundedCornerShape(10.dp))
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${selectedContacts.size}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = RoyalBluePrimary)
                                Text(text = "Selected", fontSize = 11.sp, color = TextSecondary)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${approvedLeaveContacts.size}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF0284C7))
                                Text(text = "Approved Leave", fontSize = 11.sp, color = TextSecondary)
                            }
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(text = "${eligibleContacts.size}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = SuccessGreen)
                                Text(text = "Call Queue", fontSize = 11.sp, color = TextSecondary)
                            }
                        }

                        Text(text = "Tap Primary or Alternate to Dial Directly:", fontWeight = FontWeight.Bold, fontSize = 13.sp)

                        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                            items(eligibleContacts) { contact ->
                                Card(
                                    shape = RoundedCornerShape(10.dp),
                                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(1.dp, BorderLight, RoundedCornerShape(10.dp))
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text(text = contact.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text(text = "ID #${contact.rollOrIdNumber} • ${contact.groupName}", fontSize = 11.sp, color = TextMuted)
                                        Spacer(modifier = Modifier.height(8.dp))

                                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.fillMaxWidth()) {
                                            Button(
                                                onClick = {
                                                    if (activeSession == null) {
                                                        callingViewModel.startCallingSession("current_period", selectedContacts)
                                                    }
                                                    callingViewModel.dialCurrentContact(context, contact, NumberUsedType.PRIMARY)
                                                    showReadyToCallModal = false
                                                },
                                                colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
                                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(14.dp))
                                                Spacer(modifier = Modifier.width(4.dp))
                                                Text(text = "Call Primary\n${contact.primaryPhone}", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                            }

                                            if (contact.alternatePhone.isNotBlank()) {
                                                Button(
                                                    onClick = {
                                                        if (activeSession == null) {
                                                            callingViewModel.startCallingSession("current_period", selectedContacts)
                                                        }
                                                        callingViewModel.dialCurrentContact(context, contact, NumberUsedType.ALTERNATE)
                                                        showReadyToCallModal = false
                                                    },
                                                    colors = ButtonDefaults.buttonColors(containerColor = SoftBlueContainer, contentColor = RoyalBluePrimary),
                                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                                                    modifier = Modifier.weight(1f)
                                                ) {
                                                    Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(14.dp))
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text(text = "Call Alt\n${contact.alternatePhone}", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (approvedLeaveContacts.isNotEmpty()) {
                                item {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(text = "On Approved Leave (Excluded from Dialing):", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color(0xFF0284C7))
                                }
                                items(approvedLeaveContacts) { contact ->
                                    val leave = leaveRecords.find { it.contactId == contact.contactId && it.status == LeaveStatus.APPROVED }
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(Color(0xFFF0F9FF))
                                            .padding(8.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = "${contact.name} (${leave?.startDate?.takeLast(5)})", fontSize = 12.sp, color = TextPrimary)
                                        StatusBadge(text = "Approved Leave")
                                    }
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showReadyToCallModal = false }) {
                        Text(text = "Close")
                    }
                }
            )
        }

        // Post-Call Report Review Dialog
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
                        onClick = {
                            callingViewModel.confirmReportAndProceedNext()
                            showReadyToCallModal = true
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                    ) {
                        Text(text = "Confirm & Next Contact")
                    }
                }
            )
        }

        // Manual Add Contact Dialog
        if (showAddContactDialog) {
            var name by remember { mutableStateOf("") }
            var rollOrId by remember { mutableStateOf("") }
            var primaryPhone by remember { mutableStateOf("") }
            var alternatePhone by remember { mutableStateOf("") }
            var groupName by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { showAddContactDialog = false },
                title = { Text(text = "Add Contact to Database", fontWeight = FontWeight.Bold) },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            placeholder = { Text("Full Name") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = rollOrId,
                            onValueChange = { rollOrId = it },
                            placeholder = { Text("Roll Number / ID") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = primaryPhone,
                            onValueChange = { primaryPhone = it },
                            placeholder = { Text("Primary Phone") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = alternatePhone,
                            onValueChange = { alternatePhone = it },
                            placeholder = { Text("Alternate Phone (Optional)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = groupName,
                            onValueChange = { groupName = it },
                            placeholder = { Text("Group / Class") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (name.isNotBlank() && primaryPhone.isNotBlank()) {
                                dataViewModel.addManualContact(
                                    name = name,
                                    rollOrId = rollOrId,
                                    primaryPhone = primaryPhone,
                                    alternatePhone = alternatePhone,
                                    groupName = groupName
                                )
                                showAddContactDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                    ) {
                        Text("Add to Database")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showAddContactDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }

        // CSV Import Dialog with Native File Picker Launcher
        if (showImportDialog) {
            var rawCsvText by remember { mutableStateOf("") }

            val filePickerLauncher = rememberLauncherForActivityResult(
                contract = ActivityResultContracts.GetContent()
            ) { uri: Uri? ->
                if (uri != null) {
                    try {
                        val inputStream = context.contentResolver.openInputStream(uri)
                        val text = inputStream?.bufferedReader()?.use { it.readText() } ?: ""
                        rawCsvText = text
                        dataViewModel.parseRawCsvInput(rawCsvText)
                        Toast.makeText(context, "CSV File Loaded!", Toast.LENGTH_SHORT).show()
                    } catch (e: Exception) {
                        Toast.makeText(context, "Failed to read CSV: ${e.message}", Toast.LENGTH_LONG).show()
                    }
                }
            }

            AlertDialog(
                onDismissRequest = { showImportDialog = false },
                title = { Text(text = "Import Contacts (CSV File / Text)", fontWeight = FontWeight.Bold) },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        // Native File Upload Button
                        Button(
                            onClick = { filePickerLauncher.launch("*/*") },
                            colors = ButtonDefaults.buttonColors(containerColor = SoftBlueContainer, contentColor = RoyalBluePrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.FolderOpen, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Choose CSV File from Storage", fontWeight = FontWeight.Bold)
                        }

                        Text(text = "Or paste CSV / comma-separated text manually:", fontSize = 12.sp, color = TextSecondary)

                        OutlinedTextField(
                            value = rawCsvText,
                            onValueChange = {
                                rawCsvText = it
                                dataViewModel.parseRawCsvInput(rawCsvText)
                            },
                            placeholder = { Text("101, Aarav Kumar, +91 9810111111, +91 8710111111, Class 10A") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(100.dp)
                        )

                        if (importPreviewItems.isNotEmpty()) {
                            Text(text = "Extracted Preview (${importPreviewItems.size} rows):", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBluePrimary)
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(110.dp)
                                    .border(1.dp, BorderLight)
                                    .padding(6.dp)
                            ) {
                                importPreviewItems.forEach { item ->
                                    Text(
                                        text = "#${item.rollOrIdNumber} | ${item.name} | ${item.primaryPhone} | [${item.validationMessage}]",
                                        fontSize = 11.sp,
                                        color = if (item.isValid) SuccessGreen else DangerRed
                                    )
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    if (importPreviewItems.any { it.isValid }) {
                        Button(
                            onClick = {
                                dataViewModel.confirmImport()
                                showImportDialog = false
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                        ) {
                            Text("Confirm & Save to DB")
                        }
                    }
                },
                dismissButton = {
                    TextButton(onClick = {
                        dataViewModel.clearImport()
                        showImportDialog = false
                    }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
