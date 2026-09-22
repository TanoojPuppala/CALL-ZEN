package com.smartcallai.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = RoyalBluePrimary,
    onPrimary = CardSurface,
    primaryContainer = SoftBlueContainer,
    onPrimaryContainer = RoyalBlueDark,
    secondary = AiPurple,
    onSecondary = CardSurface,
    secondaryContainer = AiPurpleContainer,
    background = LightBackground,
    onBackground = TextPrimary,
    surface = CardSurface,
    onSurface = TextPrimary,
    outline = BorderLight
)

@Composable
fun SmartCallAiTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        typography = Typography,
        content = content
    )
}
