package com.smartcallai.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.smartcallai.app.data.local.AppDatabase
import com.smartcallai.app.data.repository.SmartCallRepositoryImpl
import com.smartcallai.app.ui.MainViewModel
import com.smartcallai.app.ui.auth.AuthScreen
import com.smartcallai.app.ui.auth.AuthState
import com.smartcallai.app.ui.auth.AuthViewModel
import com.smartcallai.app.ui.calling.CallingViewModel
import com.smartcallai.app.ui.dashboard.DashboardScreen
import com.smartcallai.app.ui.data.DataManagementScreen
import com.smartcallai.app.ui.data.DataViewModel
import com.smartcallai.app.ui.leave.LeaveManagementScreen
import com.smartcallai.app.ui.leave.LeaveViewModel
import com.smartcallai.app.ui.navigation.Screen
import com.smartcallai.app.ui.navigation.SmartCallBottomNavBar
import com.smartcallai.app.ui.profile.ProfileScreen
import com.smartcallai.app.ui.reports.ReportsScreen
import com.smartcallai.app.ui.reports.ReportsViewModel
import com.smartcallai.app.ui.theme.SmartCallAiTheme
import com.smartcallai.app.ui.voice.VoiceAssistantOverlay
import com.smartcallai.app.ui.voice.VoiceAssistantViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val database = AppDatabase.getDatabase(applicationContext)
        val repository = SmartCallRepositoryImpl(database)

        val mainViewModel = MainViewModel(repository)
        val dataViewModel = DataViewModel(repository)
        val callingViewModel = CallingViewModel(repository)
        val leaveViewModel = LeaveViewModel(repository)
        val reportsViewModel = ReportsViewModel(repository)
        val voiceViewModel = VoiceAssistantViewModel(repository)
        val authViewModel = AuthViewModel(repository, applicationContext)

        setContent {
            SmartCallAiTheme {
                val authState by authViewModel.authState.collectAsState()

                if (authState is AuthState.Success) {
                    SmartCallAppContent(
                        mainViewModel = mainViewModel,
                        dataViewModel = dataViewModel,
                        callingViewModel = callingViewModel,
                        leaveViewModel = leaveViewModel,
                        reportsViewModel = reportsViewModel,
                        voiceViewModel = voiceViewModel,
                        authViewModel = authViewModel
                    )
                } else {
                    AuthScreen(
                        viewModel = authViewModel,
                        onAuthSuccess = { }
                    )
                }
            }
        }
    }
}

@Composable
fun SmartCallAppContent(
    mainViewModel: MainViewModel,
    dataViewModel: DataViewModel,
    callingViewModel: CallingViewModel,
    leaveViewModel: LeaveViewModel,
    reportsViewModel: ReportsViewModel,
    voiceViewModel: VoiceAssistantViewModel,
    authViewModel: AuthViewModel
) {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            SmartCallBottomNavBar(navController = navController)
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            NavHost(
                navController = navController,
                startDestination = Screen.Dashboard.route
            ) {
                composable(Screen.Dashboard.route) {
                    DashboardScreen(navController = navController, viewModel = mainViewModel)
                }
                composable(Screen.DataManagement.route) {
                    DataManagementScreen(
                        navController = navController,
                        dataViewModel = dataViewModel,
                        callingViewModel = callingViewModel
                    )
                }
                composable(Screen.Reports.route) {
                    ReportsScreen(navController = navController, viewModel = reportsViewModel)
                }
                composable(Screen.Profile.route) {
                    ProfileScreen(
                        navController = navController,
                        viewModel = mainViewModel,
                        authViewModel = authViewModel
                    )
                }
                composable(Screen.LeaveManagement.route) {
                    LeaveManagementScreen(navController = navController, viewModel = leaveViewModel)
                }
            }

            VoiceAssistantOverlay(viewModel = voiceViewModel)
        }
    }
}
