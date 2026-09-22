package com.smartcallai.app.ui.data

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.navigation.Screen
import com.smartcallai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DataManagementScreen(
    navController: NavController,
    viewModel: DataViewModel
) {
    val contacts by viewModel.contacts.collectAsState()
    val selectedContacts by viewModel.selectedContacts.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val statusFilter by viewModel.statusFilter.collectAsState()
    val importPreviewItems by viewModel.importPreviewItems.collectAsState()
    val leaveRecords by viewModel.leaveRecords.collectAsState()

    var showImportDialog by remember { mutableStateOf(false) }
    var showAddContactDialog by remember { mutableStateOf(false) }

    val allSelected = contacts.isNotEmpty() && contacts.all { it.isSelected }

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
                            val leaveCount = selectedContacts.count { contact ->
                                leaveRecords.any { leave ->
                                    leave.contactId == contact.contactId && leave.status == LeaveStatus.APPROVED
                                }
                            }
                            val queueCount = selectedContacts.size - leaveCount
                            Text(
                                text = "$queueCount Call Queue • $leaveCount On Approved Leave",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }

                        PrimaryButton(
                            text = "Ready to Call",
                            onClick = { navController.navigate(Screen.Calling.route) },
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
                onValueChange = { viewModel.setSearchQuery(it) },
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
                        onClick = { viewModel.setStatusFilter(key) },
                        label = { Text(text = label, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = RoyalBluePrimary,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            if (contacts.isEmpty()) {
                // Real Clean Empty State Card
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
                // Select All Header Bar
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
                            onCheckedChange = { viewModel.selectAll(it) },
                            colors = CheckboxDefaults.colors(checkedColor = RoyalBluePrimary)
                        )
                        Text(text = "Select All (${contacts.size})", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                }

                // Contact Table (Horizontally Scrollable)
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
                        // Table Header
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

                        // Table Rows
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
                                        onCheckedChange = { viewModel.toggleContactSelection(contact.contactId, it) },
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
                                    IconButton(onClick = { viewModel.deleteContact(contact.contactId) }) {
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
                            placeholder = { Text("Full Name (e.g. Aarav Kumar)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = rollOrId,
                            onValueChange = { rollOrId = it },
                            placeholder = { Text("Roll Number / ID (e.g. 101)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = primaryPhone,
                            onValueChange = { primaryPhone = it },
                            placeholder = { Text("Primary Phone (e.g. +91 9810111111)") },
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
                            placeholder = { Text("Group / Class (e.g. Class 10A)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (name.isNotBlank() && primaryPhone.isNotBlank()) {
                                viewModel.addManualContact(
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

        // CSV Import Dialog
        if (showImportDialog) {
            var rawCsvText by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { showImportDialog = false },
                title = { Text(text = "Import Contacts (CSV / Text)", fontWeight = FontWeight.Bold) },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = "Paste CSV or comma-separated lines (Roll/ID, Name, Primary Phone, Alternate Phone, Group):", fontSize = 12.sp)

                        OutlinedTextField(
                            value = rawCsvText,
                            onValueChange = {
                                rawCsvText = it
                                viewModel.parseRawCsvInput(rawCsvText)
                            },
                            placeholder = { Text("101, Aarav Kumar, +91 9810111111, +91 8710111111, Class 10A\n102, Ananya Sharma, +91 9810222222, , Class 10A") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                        )

                        if (importPreviewItems.isNotEmpty()) {
                            Text(text = "Extracted Preview (${importPreviewItems.size} rows):", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBluePrimary)
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(130.dp)
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
                                viewModel.confirmImport()
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
                        viewModel.clearImport()
                        showImportDialog = false
                    }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
