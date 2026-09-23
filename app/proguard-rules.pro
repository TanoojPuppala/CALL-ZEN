# Keep Domain & Data Models
-keep class com.smartcallai.app.domain.model.** { *; }
-keep class com.smartcallai.app.data.local.** { *; }
-keep class com.smartcallai.app.data.remote.** { *; }

# Gson
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class com.google.gson.** { *; }

# OkHttp & Retrofit
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keep class retrofit2.** { *; }
-keep interface retrofit2.** { *; }

# Room
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**
