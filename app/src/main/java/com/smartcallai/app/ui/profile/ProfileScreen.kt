package com.smartcallai.app.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.ui.MainViewModel
import com.smartcallai.app.ui.components.*
import com.smartcallai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    navController: NavController,
    viewModel: MainViewModel
) {
    val org by viewModel.currentOrg.collectAsState()
    val user by viewModel.currentUser.collectAsState()
    val config by viewModel.industryConfig.collectAsState()

    var showIndustryDialog by remember { mutableStateOf(false) }
    var showRoleDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Profile & Organization", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
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
            // User Profile Card
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = CardSurface),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderLight, RoundedCornerShape(18.dp))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(CircleShape)
                                    .background(SoftBlueContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Person, contentDescription = null, tint = RoyalBluePrimary, modifier = Modifier.size(32.dp))
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column {
                                Text(text = user?.name ?: "Unregistered User", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = TextPrimary)
                                Text(text = user?.email ?: "No email configured", fontSize = 12.sp, color = TextSecondary)
                                StatusBadge(text = user?.role?.displayName ?: "Guest")
                            }
                        }

                        if (org != null) {
                            HorizontalDivider(modifier = Modifier.padding(vertical = 16.dp), color = BorderLight)

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                OutlinedButton(
                                    onClick = { showRoleDialog = true },
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.ManageAccounts, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "Switch Role", fontSize = 12.sp)
                                }

                                OutlinedButton(
                                    onClick = { showIndustryDialog = true },
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Business, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "Switch Industry", fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
            }

            // Industry Configuration Card
            item {
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = SoftBlueContainer),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, BorderLight, RoundedCornerShape(18.dp))
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(text = "Active Industry Configuration", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = RoyalBlueDark)
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(text = "Industry: ${org?.industryType?.displayName ?: "Not Configured"}", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Contact Terminology: ${config?.contactLabel ?: "Contact"}", fontSize = 13.sp)
                        Text(text = "Group Terminology: ${config?.groupLabel ?: "Group"}", fontSize = 13.sp)

                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = "Custom Fields: ${config?.customFields?.joinToString(", ") ?: "Standard ID, Phone, Notes"}", fontSize = 12.sp, color = TextSecondary)
                    }
                }
            }
        }

        // Switch Industry Dialog
        if (showIndustryDialog) {
            AlertDialog(
                onDismissRequest = { showIndustryDialog = false },
                title = { Text(text = "Select Industry Context", fontWeight = FontWeight.Bold) },
                text = {
                    Column {
                        IndustryType.entries.forEach { type ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                RadioButton(
                                    selected = org?.industryType == type,
                                    onClick = {
                                        viewModel.switchIndustry(type)
                                        showIndustryDialog = false
                                    }
                                )
                                Text(text = type.displayName, fontSize = 14.sp)
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showIndustryDialog = false }) { Text(text = "Close") }
                }
            )
        }

        // Switch Role Dialog
        if (showRoleDialog) {
            AlertDialog(
                onDismissRequest = { showRoleDialog = false },
                title = { Text(text = "Select User Role", fontWeight = FontWeight.Bold) },
                text = {
                    Column {
                        UserRole.entries.forEach { role ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                RadioButton(
                                    selected = user?.role == role,
                                    onClick = {
                                        viewModel.switchRole(role)
                                        showRoleDialog = false
                                    }
                                )
                                Text(text = role.displayName, fontSize = 14.sp)
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showRoleDialog = false }) { Text(text = "Close") }
                }
            )
        }
    }
}
