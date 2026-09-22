package com.smartcallai.app.ui.navigation

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.smartcallai.app.ui.theme.*

@Composable
fun SmartCallBottomNavBar(
    navController: NavController
) {
    val navBackStackEntry = navController.currentBackStackEntryAsState().value
    val currentRoute = navBackStackEntry?.destination?.route

    NavigationBar(
        containerColor = CardSurface,
        tonalElevation = 8.dp
    ) {
        bottomNavItems.forEach { screen ->
            val isSelected = currentRoute == screen.route
            NavigationBarItem(
                selected = isSelected,
                onClick = {
                    if (currentRoute != screen.route) {
                        navController.navigate(screen.route) {
                            popUpTo(Screen.Dashboard.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                icon = {
                    Icon(
                        imageVector = screen.icon,
                        contentDescription = screen.title
                    )
                },
                label = {
                    Text(
                        text = screen.title,
                        fontSize = 11.sp
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = RoyalBluePrimary,
                    selectedTextColor = RoyalBluePrimary,
                    indicatorColor = SoftBlueContainer,
                    unselectedIconColor = TextMuted,
                    unselectedTextColor = TextMuted
                )
            )
        }
    }
}
