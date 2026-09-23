# CallZen — Connect Smarter. Communicate Better.

[![Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin_2.0-blue.svg)](https://kotlinlang.org)
[![Compose](https://img.shields.io/badge/UI-Jetpack_Compose_Material_3-4285F4.svg)](https://developer.android.com/jetpack/compose)
[![Supabase](https://img.shields.io/badge/Backend-Supabase_PostgreSQL-green.svg)](https://supabase.com)
[![Room](https://img.shields.io/badge/Database-Room_SQLite-orange.svg)](https://developer.android.com/training/data-storage/room)

**CallZen** is an enterprise-grade Android application designed for Education, Banking, Post Office, Corporate, Recruitment, Healthcare, Government, and Customer Service organizations to manage contact data, multi-day leave sanctions, direct phone dialing, AI post-call reporting, and real-time cloud synchronization via Supabase.

---

## 🎨 Branding & Identity

- **Name**: CallZen
- **Tagline**: *Connect Smarter. Communicate Better.*
- **Identity**: Clean gradient branding (Cyan, Royal Blue, Deep Purple) featuring a 3D letter 'C' icon wrapping a telephone receiver and vibrant soundwaves.

---

## 🚀 Key Features

### 1. Clean First-Run Onboarding
- **Zero Mock Data**: Starts with a clean database (0 Organizations, 0 Contacts, 0 Calling Sessions, 0 Leave Records, 0 Reports).
- **Organization Registration**: First-time authorized users register their Organization Name, Industry, Code, and Admin Account with salted SHA-256 hashed password security.

### 2. Multi-Industry Terminology System
- Native support for **Education, Banking, Post Office, Corporate, Recruitment, Healthcare, Government, Customer Service, and Custom** industries.
- Configurable terminology mapping (e.g., *Student / Class* for Education vs. *Customer / Branch* for Banking vs. *Candidate / Campaign* for Recruitment).

### 3. Contact & CSV Data Import Management
- **Manual Contact Creation**: Full name, Roll/ID Number, Primary Phone, Alternate Phone, Group/Section, Notes.
- **CSV & Text File Import**: Real delimited text parser with interactive validation preview, format checking (Phone number length, ID presence), row error highlighting, and direct Room DB + Supabase persistence.
- **Search & Filters**: Reactive filtering by status, search query, or group.

### 4. Primary & Alternate Phone Support
- Store Primary and Alternate numbers for every contact.
- Calling UI presents explicit **Call Primary** and **Call Alternate** actions.
- Persists `numberUsedType` (`PRIMARY` | `ALTERNATE`) and actual phone number used in call logs.

### 5. Integrated Multi-Day Leave Sanction Module
- Authorized staff can sanction multi-day leave (1 day, 3 days, 1 week, custom date ranges).
- **Approved Leave Exclusion Rule**: Contacts with approved leave covering the current date are automatically excluded from active dialing queues and flagged as *On Approved Leave*.
- Approved leave does NOT count as a call or completed attempt, keeping analytics 100% accurate.

### 6. Direct Phone Dialing Workflow
- Workflow: **Selection → Ready to Call Review → Select Primary/Alternate → Launch ACTION_DIAL → Return → Post-Call Outcome Review → Confirm & Next**.
- Direct dialing via `Intent.ACTION_DIAL`.
- Reviewable post-call report dialog allowing staff to record and edit outcome status (*Answered, Busy, No Answer, Switched Off, Callback Required, Wrong Number, Completed, Failed*), notes, and follow-up actions.
- Unreachable contacts automatically enter a **Retry Queue**.

### 7. Supabase Cloud Backend Integration
- Integrated with Supabase PostgreSQL database (`https://eyoszuowvipdalrjxjvj.supabase.co`).
- Automatic background sync for Organizations, Contacts, Leave Records, Calling Sessions, and Call Logs.

### 8. Live Database Analytics & Audit System
- Calculates **Organization Completion Rate** vs. **Employee / Caller Completion Rate**.
- Audit log records all organizational actions (*Register Org, Import Contacts, Add Leave, Create Session, Record Call Log*) with user IDs and timestamps.

### 9. CallZen AI Voice Assistant
- Specialized floating voice assistant processing natural commands (*"Call Rahul"*, *"Find Priya"*, *"Pause calling"*, *"Resume calling"*, *"Show today's progress"*).
- Enforces strict selection bounds (prevents adding unselected persons via voice).

---

## 🛠️ Technology Stack

- **Language**: Kotlin 2.0
- **UI Framework**: Jetpack Compose & Material 3
- **Navigation**: Jetpack Navigation Compose
- **Backend Services**: Supabase PostgreSQL & REST API
- **Local Persistence**: Room Database (SQLite) with TypeConverters & DAOs
- **Asynchrony**: Kotlin Coroutines & StateFlow
- **Minimum SDK**: API 24 (Android 7.0 Nougat)
- **Target SDK**: API 35 (Android 15)

---

## 💻 Build & Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/TanoojPuppala/CALL-ZEN.git
   cd CALL-ZEN
   ```
2. Open the project in **Android Studio (Ladybug / Jellyfish or newer)**.
3. Sync Gradle and run the application on an emulator or physical device running Android 7.0+:
   ```bash
   ./gradlew app:installDebug
   ```

---

## 🔒 Security & Privacy

- No plain text passwords stored in database or logs.
- All phone calls are explicitly human-initiated via native Android intents.
- Secrets, credentials, and local build files are excluded via `.gitignore`.
