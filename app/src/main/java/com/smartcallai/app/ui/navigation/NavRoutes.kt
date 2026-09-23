package com.smartcallai.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Home", Icons.Default.Home)
    object DataManagement : Screen("data_management", "Data", Icons.Default.Storage)
    object Reports : Screen("reports", "Reports", Icons.Default.BarChart)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)

    // Secondary routes
    object LeaveManagement : Screen("leave_management", "Leave Sanction", Icons.Default.EventNote)
}

val bottomNavItems = listOf(
    Screen.Dashboard,
    Screen.DataManagement,
    Screen.Reports,
    Screen.Profile
)
