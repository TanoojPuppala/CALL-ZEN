# SmartCall AI — Organizational Calling & Leave Management System

[![Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin_2.0-blue.svg)](https://kotlinlang.org)
[![Compose](https://img.shields.io/badge/UI-Jetpack_Compose_Material_3-4285F4.svg)](https://developer.android.com/jetpack/compose)
[![Room](https://img.shields.io/badge/Database-Room_SQLite-orange.svg)](https://developer.android.com/training/data-storage/room)

**SmartCall AI** is a real, database-driven, enterprise-grade Android application designed for Education, Banking, Post Office, Corporate, Recruitment, Healthcare, Government, and Customer Service organizations. It manages contact records, multi-day leave sanctions, human-controlled native calling, AI-assisted post-call outcome reporting, retry queues, and organizational analytics.

---

## 🚀 Key Features

### 1. Clean First-Run Onboarding
- **Zero Mock Data**: Starts with a clean Room database (0 Organizations, 0 Contacts, 0 Calling Sessions, 0 Leave Records, 0 Reports).
- **Organization Registration**: First-time authorized users register their Organization Name, Industry, Code, and Admin Account with salted SHA-256 hashed password security.

### 2. Multi-Industry Terminology System
- Native support for **Education, Banking, Post Office, Corporate, Recruitment, Healthcare, Government, Customer Service, and Custom** industries.
- Configurable terminology mapping (e.g., *Student / Class* for Education vs. *Customer / Branch* for Banking vs. *Candidate / Campaign* for Recruitment).

### 3. Contact & CSV Data Import Management
- **Manual Contact Creation**: Full name, Roll/ID Number, Primary Phone, Alternate Phone, Group/Section, Notes.
- **CSV & Text File Import**: Real delimited text parser with interactive validation preview, format checking (Phone number length, ID presence), row error highlighting, and direct Room DB persistence.
- **Search & Filters**: Reactive Room DB filtering by status, search query, or group.

### 4. Primary & Alternate Phone Support
- Store Primary and Alternate numbers for every contact.
- Calling UI presents explicit **Call Primary** and **Call Alternate** actions.
- Persists `numberUsedType` (`PRIMARY` | `ALTERNATE`) and actual phone number used in call logs.

### 5. Integrated Multi-Day Leave Sanction Module
- Authorized staff can sanction multi-day leave (1 day, 3 days, 1 week, custom date ranges).
- **Approved Leave Exclusion Rule**: Contacts with approved leave covering the current date are automatically excluded from the active dialing queue and flagged as *On Approved Leave*.
- Approved leave does NOT count as a call or completed attempt, keeping analytics 100% accurate.

### 6. Human-Controlled Calling Workflow
- Workflow: **Selection → Ready to Call Review → Start Calling → Dial Contact → Call Ended → Post-Call AI Report Review → Confirm & Next**.
- Native dialing via `Intent.ACTION_DIAL`.
- Reviewable post-call report dialog allowing staff to record and edit outcome status (*Answered, Busy, No Answer, Switched Off, Callback Required*), reason, and follow-up actions.
- Unreachable contacts automatically enter a **Retry Queue**.

### 7. Pause & Resume Session State
- `CallingSession` and `CallingQueueItem` progress indices are persisted in Room DB.
- Pausing preserves exact queue position; resuming continues seamlessly from where staff left off.

### 8. Live Database Analytics & Audit System
- Calculates **Organization Completion Rate** vs. **Employee / Caller Completion Rate**.
- Audit log records all organizational actions (*Register Org, Import Contacts, Add Leave, Create Session, Record Call Log*) with user IDs and timestamps.

### 9. SmartCall Voice Assistant
- Specialized floating voice assistant processing natural commands (*"Call Rahul"*, *"Find Priya"*, *"Pause calling"*, *"Resume calling"*, *"Show today's progress"*).
- Enforces strict selection bounds (prevents adding unselected persons via voice).

---

## 🛠️ Technology Stack

- **Language**: Kotlin 2.0
- **UI Framework**: Jetpack Compose & Material 3
- **Navigation**: Jetpack Navigation Compose
- **Architecture Pattern**: MVVM + Repository Pattern
- **Local Persistence**: Room Database (SQLite) with TypeConverters & DAOs
- **Asynchrony**: Kotlin Coroutines & StateFlow
- **Security**: Salted SHA-256 password hashing
- **Minimum SDK**: API 24 (Android 7.0 Nougat)
- **Target SDK**: API 35 (Android 15)

---

## 📁 Package Architecture

```
com.smartcallai.app
├── data
│   ├── local (AppDatabase, DAOs, Room Entities, TypeConverters)
│   └── repository (SmartCallRepository interface & Room Implementation)
├── domain
│   └── model (Enums, User, Organization, Contact, LeaveRecord, CallingSession, CallLog, CallReport, RetryAttempt, AnalyticsSummary)
├── ui
│   ├── components (StatusBadge, MetricCard, PrimaryButton, SecondaryButton)
│   ├── navigation (NavRoutes, SmartCallBottomNavBar)
│   ├── theme (Color, Type, Theme)
│   ├── dashboard (DashboardScreen, OrganizationSetupDialog)
│   ├── data (DataManagementScreen, AddContactDialog, CsvImportDialog)
│   ├── calling (CallingScreen, ReadyToCallConfirmation, ActiveCallingCard, PostCallReportDialog)
│   ├── leave (LeaveManagementScreen, SanctionLeaveDialog)
│   ├── reports (ReportsScreen, AuditFeed)
│   ├── profile (ProfileScreen, SwitchRoleDialog, SwitchIndustryDialog)
│   └── voice (VoiceAssistantOverlay, VoiceAssistantViewModel)
└── utils (SecurityUtils, CsvImportParser)
```

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
- No covert recording or autonomous robocalling. All phone calls are explicitly human-initiated via native Android intents.
- Secrets, credentials, and local build files are excluded via `.gitignore`.

---

## 📄 License & Attribution

Developed as a functional Android application for organizational calling and leave management workflows.
