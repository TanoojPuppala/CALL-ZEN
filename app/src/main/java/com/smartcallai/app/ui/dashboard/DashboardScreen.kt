package com.smartcallai.app.ui.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.MainViewModel
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.navigation.Screen
import com.smartcallai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    val org by viewModel.currentOrg.collectAsState()
    val user by viewModel.currentUser.collectAsState()
    val period by viewModel.currentPeriod.collectAsState()
    val summary by viewModel.analyticsSummary.collectAsState()

    var showSetupDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = org?.name ?: "SmartCall AI",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = if (org != null) "${org?.industryType?.displayName} • ${period?.name ?: "No active period"}" else "Clean First-Run Database",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                    }
                },
                actions = {
                    if (org != null) {
                        Box(
                            modifier = Modifier
                                .padding(end = 12.dp)
                                .clip(RoundedCornerShape(20.dp))
                                .background(SoftBlueContainer)
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(8.dp)
                                        .clip(CircleShape)
                                        .background(SuccessGreen)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = user?.role?.displayName ?: "Admin",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = RoyalBluePrimary
                                )
                            }
                        }
                    }
                },
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
            // First-Run Experience / Welcome Header Card
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = RoyalBluePrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        if (org == null) {
                            Text(
                                text = "Welcome to SmartCall AI",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "No organization configured yet. Register your organization to start managing contacts, attendance, calling sessions, and sanctions.",
                                fontSize = 13.sp,
                                color = Color.White.copy(alpha = 0.85f),
                                lineHeight = 18.sp
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Button(
                                onClick = { showSetupDialog = true },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color.White,
                                    contentColor = RoyalBluePrimary
                                ),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.AddBusiness, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Create Organization", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                        } else {
                            Text(
                                text = "Welcome back, ${user?.name ?: "Admin"}",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${org?.name} • ${org?.industryType?.displayName} Calling Workflow",
                                fontSize = 13.sp,
                                color = Color.White.copy(alpha = 0.85f)
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            Row(
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Button(
                                    onClick = { navController.navigate(Screen.DataManagement.route) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = Color.White,
                                        contentColor = RoyalBluePrimary
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Ready to Call", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                }

                                Button(
                                    onClick = { navController.navigate(Screen.LeaveManagement.route) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = SoftBlueContainer,
                                        contentColor = RoyalBluePrimary
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.EventNote, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Leave Sanction", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Key Database Overview Metrics
            item {
                Text(
                    text = "Live Database Summary",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }

            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MetricCard(
                        title = "Total Contacts",
                        value = "${summary?.totalAssigned ?: 0}",
                        subtitle = if ((summary?.totalAssigned ?: 0) == 0) "No contacts in DB" else "Active in period",
                        icon = Icons.Default.People,
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Selected",
                        value = "${summary?.totalSelected ?: 0}",
                        subtitle = "Marked for attention",
                        icon = Icons.Default.CheckBox,
                        iconBgColor = WarningOrangeContainer,
                        iconTint = WarningOrange,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MetricCard(
                        title = "On Approved Leave",
                        value = "${summary?.totalApprovedLeave ?: 0}",
                        subtitle = "Excluded from queue",
                        icon = Icons.Default.EventAvailable,
                        iconBgColor = Color(0xFFE0F2FE),
                        iconTint = Color(0xFF0284C7),
                        modifier = Modifier.weight(1f)
                    )
                    MetricCard(
                        title = "Active Queue",
                        value = "${(summary?.totalSelected ?: 0) - (summary?.totalApprovedLeave ?: 0)}",
                        subtitle = "Eligible for calling",
                        icon = Icons.Default.Call,
                        iconBgColor = SuccessGreenContainer,
                        iconTint = SuccessGreen,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Quick Actions
            item {
                Text(
                    text = "Quick Actions",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }

            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedButton(
                        onClick = { navController.navigate(Screen.DataManagement.route) },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                    ) {
                        Icon(Icons.Default.Storage, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Manage Contacts", fontSize = 13.sp)
                    }

                    OutlinedButton(
                        onClick = { navController.navigate(Screen.Reports.route) },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp)
                    ) {
                        Icon(Icons.Default.BarChart, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("View Analytics", fontSize = 13.sp)
                    }
                }
            }
        }

        // First-Run Organization Registration Dialog
        if (showSetupDialog) {
            var orgName by remember { mutableStateOf("") }
            var selectedIndustry by remember { mutableStateOf(IndustryType.EDUCATION) }
            var orgCode by remember { mutableStateOf("") }
            var adminName by remember { mutableStateOf("") }
            var email by remember { mutableStateOf("") }
            var password by remember { mutableStateOf("") }

            AlertDialog(
                onDismissRequest = { showSetupDialog = false },
                title = { Text(text = "Register Organization & Admin", fontWeight = FontWeight.Bold) },
                text = {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(text = "Organization Details:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBluePrimary)

                        OutlinedTextField(
                            value = orgName,
                            onValueChange = { orgName = it },
                            placeholder = { Text("Organization Name (e.g. St. Mark High School)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = orgCode,
                            onValueChange = { orgCode = it },
                            placeholder = { Text("Org Code (e.g. STM-2026)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Text(text = "Select Industry:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBluePrimary)
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            listOf(IndustryType.EDUCATION, IndustryType.BANKING, IndustryType.CORPORATE, IndustryType.HEALTHCARE).forEach { ind ->
                                FilterChip(
                                    selected = selectedIndustry == ind,
                                    onClick = { selectedIndustry = ind },
                                    label = { Text(ind.displayName, fontSize = 10.sp) }
                                )
                            }
                        }

                        Text(text = "Administrator Account:", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBluePrimary)

                        OutlinedTextField(
                            value = adminName,
                            onValueChange = { adminName = it },
                            placeholder = { Text("Admin Full Name") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            placeholder = { Text("Admin Email Address") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            placeholder = { Text("Admin Secure Password") },
                            visualTransformation = PasswordVisualTransformation(),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (orgName.isNotBlank() && adminName.isNotBlank() && email.isNotBlank()) {
                                viewModel.createOrganizationAndAdmin(
                                    orgName = orgName,
                                    industryType = selectedIndustry,
                                    orgCode = orgCode.ifBlank { "ORG-2026" },
                                    adminName = adminName,
                                    email = email,
                                    password = password
                                )
                                showSetupDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary)
                    ) {
                        Text("Save & Complete Setup")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showSetupDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}
