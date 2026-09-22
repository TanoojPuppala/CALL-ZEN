package com.smartcallai.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Home", Icons.Default.Home)
    object DataManagement : Screen("data_management", "Data", Icons.Default.Storage)
    object Calling : Screen("calling", "Calling", Icons.Default.Call)
    object Reports : Screen("reports", "Reports", Icons.Default.BarChart)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)

    // Secondary routes
    object Login : Screen("login", "Login", Icons.Default.Lock)
    object LeaveManagement : Screen("leave_management", "Leave Sanction", Icons.Default.EventNote)
    object RetryQueue : Screen("retry_queue", "Retry Queue", Icons.Default.Replay)
}

val bottomNavItems = listOf(
    Screen.Dashboard,
    Screen.DataManagement,
    Screen.Calling,
    Screen.Reports,
    Screen.Profile
)
