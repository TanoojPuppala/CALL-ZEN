package com.smartcallai.app.ui.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartcallai.app.domain.model.IndustryType
import com.smartcallai.app.ui.components.CallZenLogo
import com.smartcallai.app.ui.theme.*

@Composable
fun AuthScreen(
    viewModel: AuthViewModel,
    onAuthSuccess: () -> Unit
) {
    val authState by viewModel.authState.collectAsState()

    var isSignUpTab by remember { mutableStateOf(false) }

    // Form fields
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var orgName by remember { mutableStateOf("") }
    var adminName by remember { mutableStateOf("") }
    var selectedIndustry by remember { mutableStateOf(IndustryType.EDUCATION) }

    LaunchedEffect(authState) {
        if (authState is AuthState.Success) {
            onAuthSuccess()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(LightBackground)
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = CardSurface),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header Logo & Branding
                CallZenLogo(size = 54)
                Text(text = "CallZen", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = RoyalBluePrimary)
                Text(text = "Connect Smarter. Communicate Better.", fontSize = 12.sp, color = TextSecondary, fontWeight = FontWeight.Medium)

                Spacer(modifier = Modifier.height(6.dp))

                // Auth Mode Switcher (Sign In vs Sign Up)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(SoftBlueContainer)
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = { isSignUpTab = false },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (!isSignUpTab) RoyalBluePrimary else Color.Transparent,
                            contentColor = if (!isSignUpTab) Color.White else TextPrimary
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(text = "Sign In", fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = { isSignUpTab = true },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSignUpTab) RoyalBluePrimary else Color.Transparent,
                            contentColor = if (isSignUpTab) Color.White else TextPrimary
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(text = "Sign Up", fontWeight = FontWeight.Bold)
                    }
                }

                if (isSignUpTab) {
                    // Sign Up Form
                    OutlinedTextField(
                        value = orgName,
                        onValueChange = { orgName = it },
                        placeholder = { Text("Organization Name") },
                        leadingIcon = { Icon(Icons.Default.Business, contentDescription = null) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    Text(text = "Select Industry:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextSecondary, modifier = Modifier.align(Alignment.Start))
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp), modifier = Modifier.fillMaxWidth()) {
                        listOf(IndustryType.EDUCATION, IndustryType.BANKING, IndustryType.CORPORATE, IndustryType.HEALTHCARE).forEach { ind ->
                            FilterChip(
                                selected = selectedIndustry == ind,
                                onClick = { selectedIndustry = ind },
                                label = { Text(ind.displayName, fontSize = 10.sp) }
                            )
                        }
                    }

                    OutlinedTextField(
                        value = adminName,
                        onValueChange = { adminName = it },
                        placeholder = { Text("Full Name") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                // Shared Form Fields
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    placeholder = { Text("Email Address") },
                    leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    placeholder = { Text("Password") },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                // Error Message
                if (authState is AuthState.Error) {
                    Text(
                        text = (authState as AuthState.Error).message,
                        color = DangerRed,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Submit Button
                Button(
                    onClick = {
                        if (isSignUpTab) {
                            viewModel.signUp(orgName, selectedIndustry, adminName, email, password)
                        } else {
                            viewModel.signIn(email, password)
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    if (authState is AuthState.Loading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                    } else {
                        Text(text = if (isSignUpTab) "Create Account & Org" else "Sign In", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    }
                }
            }
        }
    }
}
