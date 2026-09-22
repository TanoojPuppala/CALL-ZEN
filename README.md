# SmartCall AI

**Select. Speak. Call. Track. Complete.**

SmartCall AI is an enterprise-grade, database-driven calling queue, attendance follow-up, and outreach management application built for native Android devices. It automates calling workflows, leave management exclusions, post-call outcome tracking, and analytics without generating fake or mock data.

---

## 🌟 Key Features

- **Zero Mock Data Production Core**: Fresh installations start with a 100% clean database state (`0 Organizations, 0 Contacts, 0 Queue Items`). All records are created through user actions.
- **Native Room Database (`SmartCallDatabase`)**: Persistent SQLite database with 16 Room entities (`Organization`, `User`, `Contact`, `ContactCustomField`, `IndustryConfig`, `Period`, `Campaign`, `Assignment`, `CallingSession`, `CallingQueueItem`, `CallLog`, `CallReport`, `FollowUp`, `RetryAttempt`, `LeaveRecord`, `AuditLog`) and indexed DAOs.
- **Persistent Local DB (`SmartCallDB`)**: Reactive storage layer powering the Web/Hybrid shell with live Supabase cloud synchronization.
- **Approved Leave Management**: Approved leave records automatically exclude contacts from calling eligibility on covered dates without creating fake calls or incrementing completion metrics.
- **User-Initiated Native Calling**: Direct Android dialer integration (`Intent.ACTION_DIAL`) ensuring full human oversight and privacy compliance.
- **Adaptive Industry Configurations**: Built-in support for Education, Banking, Corporate, Recruitment, Public Service, Healthcare, and Government workflows.
- **Multi-Source Data Ingestion**: Excel (`.xlsx`, `.csv`), PDF tables, Image OCR, and native device contact picker integration.
- **State-Preserving Queue Engine**: Pause and resume calling queues without losing queue index position.
- **Audit Logging**: Comprehensive activity tracking for compliance and data governance.

---

## 🏗️ Architecture & Technology Stack

```
Compose / Hybrid UI
       ↓
   ViewModel
       ↓
    UseCase
       ↓
   Repository
       ↓
Room DAO / SQLite / SmartCallDB
       ↓
 Supabase Cloud Sync
```

- **Android Native**: Android SDK, Java/Kotlin, Room 2.8.5, AndroidX, Capacitor Bridge.
- **Frontend Core**: React 18, TypeScript 5.7, Vite 6, Tailwind CSS, Lucide Icons.
- **Backend / Database**: Native Android Room (`smartcall_db`) + Supabase PostgreSQL Client.

---

## 📱 Supported Industries

| Industry Category | Primary Entity | Column Header | Primary Campaign Workflow |
| :--- | :--- | :--- | :--- |
| **Education** | Student | Roll No | Attendance Follow-up (<75% Defaulters) |
| **Banking & Finance** | Customer | Customer ID | EMI & Overdue Debt Collection |
| **HR & Recruitment** | Candidate | Candidate ID | Interview Schedule Confirmation |
| **Corporate Teams** | Employee | Employee ID | Townhall & Policy Check-in |
| **Public Service** | Client | Reference ID | Delivery & Service Ticket Resolution |

---

## 🚀 Setup & Build Instructions

### Prerequisites
- Android Studio Ladybug (2024.2.1+) or newer.
- JDK 21 / Android SDK API 36 (Min SDK: 24).
- Node.js v18+ and npm.

### Building the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/TanoojPuppala/CALL-ZEN.git
   cd CALL-ZEN
   ```

2. **Install Web Dependencies & Compile Frontend**:
   ```bash
   npm install
   npm run build
   npx cap copy android
   ```

3. **Build Android APK**:
   ```bash
   cd android
   ./gradlew app:assembleDebug
   ```
   *Output APK Path*: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 Security & Privacy

- No hardcoded API secrets or plain-text passwords stored.
- Device biometric authentication supported via hardware enclave keystore.
- Compliant with Android permissions (`CALL_PHONE`, `RECORD_AUDIO`, `INTERNET`).

---

## 📂 Repository

- **GitHub Repository**: [https://github.com/TanoojPuppala/CALL-ZEN](https://github.com/TanoojPuppala/CALL-ZEN)
