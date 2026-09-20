# SmartCall AI --- Design System

> **Version:** 1.0\
> **Product:** SmartCall AI\
> **Tagline:** Select. Speak. Call. Track. Complete.\
> **Purpose:** Canonical visual and interaction specification for AI
> development tools implementing the SmartCall AI mobile application.

------------------------------------------------------------------------

## 1. Design System Purpose

This document is the single source of truth for the visual language, UI
components, layout rules, interaction patterns, accessibility
expectations, screen structure, and state behavior of SmartCall AI.

Any AI coding/development tool must use this document together with the
PRD to reproduce the product consistently.

The reference design is a light, professional, enterprise mobile
application with a blue technology identity. It is intentionally simple
enough for teachers, administrators, employees, managers, and other
non-technical users.

### Product character

SmartCall AI should feel:

-   Professional
-   Trustworthy
-   Intelligent
-   Fast
-   Simple
-   Human-controlled
-   Enterprise-ready
-   Friendly without being playful
-   Modern without being futuristic

### Explicitly avoid

-   Iron Man/JARVIS styling
-   Sci-fi interfaces
-   Robot avatars
-   Gaming aesthetics
-   Excessive neon
-   Excessive glassmorphism
-   Dense enterprise clutter
-   Generic chatbot UI
-   Unnecessary animations
-   Unclear navigation
-   Dark overall application theme

------------------------------------------------------------------------

# 2. Core UX Principle

The most important interaction rule is:

> **Checkbox selection comes before calling.**

The calling queue must never be created merely because data is loaded.

The canonical sequence is:

**Login → Dashboard → Data Management → Select Year/Semester/Class →
Data Table → Select Required/Absent Contacts → Selected Count → Ready to
Call → Confirm Selected Contacts → Start Calling → Call Contact 1 →
Automatic Post-Call Report → Confirm → Next Selected Contact → Continue
→ Retry Queue → Final Report**

### Hard rule

If 70 students exist and the teacher selects 20 absent students:

-   Only those 20 selected students enter the calling queue.
-   The other 50 students must not enter the queue.
-   The user must explicitly press **Ready to Call**.
-   The user must explicitly confirm the selected list.
-   The user must explicitly press **Start Calling** before the first
    call.
-   The queue is generated dynamically from the selected contacts.

------------------------------------------------------------------------

# 3. Brand Identity

## 3.1 Brand name

**SmartCall AI**

## 3.2 Primary tagline

**Select. Speak. Call. Track. Complete.**

## 3.3 Secondary messaging

**Save Time. Build Better Connections.**

**Same App. Every Year. Full Control.**

**Upload. Manage. Call. Track. Grow.**

**Smarter People. Stronger Tomorrow.**

## 3.4 Logo direction

The logo should communicate:

-   People
-   Communication
-   Calling
-   AI assistance
-   Connection

Use a simple modern mark that remains legible at small mobile sizes.

Do not use a robot head or humanoid AI symbol.

------------------------------------------------------------------------

# 4. Color System

Use a light UI with blue as the primary brand color.

## 4.1 Core colors

  Token           Suggested Value   Usage
  --------------- ----------------- ----------------------------------
  `primary-900`   `#1E3A8A`         Strong headings, dark brand text
  `primary-800`   `#1D4ED8`         Strong interactive states
  `primary-700`   `#2563EB`         Primary buttons
  `primary-600`   `#3B82F6`         Active controls
  `primary-500`   `#60A5FA`         Highlights
  `primary-100`   `#DBEAFE`         Soft blue backgrounds
  `primary-50`    `#EFF6FF`         Very light blue cards
  `surface`       `#FFFFFF`         Cards and screens
  `background`    `#F8FAFC`         Application background
  `border`        `#E5E7EB`         Standard borders
  `text-900`      `#111827`         Primary text
  `text-700`      `#374151`         Secondary headings
  `text-600`      `#4B5563`         Secondary text
  `text-500`      `#6B7280`         Supporting text
  `success-700`   `#047857`         Success text
  `success-600`   `#16A34A`         Success action
  `success-100`   `#DCFCE7`         Success background
  `warning-700`   `#9A3412`         Warning text
  `warning-500`   `#F59E0B`         Warning action
  `warning-100`   `#FEF3C7`         Warning background
  `danger-700`    `#B91C1C`         Error/danger text
  `danger-600`    `#DC2626`         Destructive action
  `danger-100`    `#FEE2E2`         Error background
  `purple-700`    `#6D28D9`         AI-related secondary accent
  `purple-100`    `#EDE9FE`         AI cards

Do not specify arbitrary colors outside this system unless a design
requirement needs one.

------------------------------------------------------------------------

# 5. Typography

Use a modern system sans-serif.

Recommended:

1.  Inter
2.  SF Pro / system UI on iOS
3.  Roboto / system UI on Android

Fallback:

`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

## Type hierarchy

  Role                    Size     Weight
  ----------------- ---------- ----------
  Screen title        20--24px        700
  Large metric        24--32px        700
  Section heading     16--18px        700
  Card title          14--16px   600--700
  Body                    14px   400--500
  Secondary text      12--13px        400
  Caption             10--11px   400--500
  Button                  14px   600--700

Keep text highly readable on mobile.

Avoid all-caps for long labels.

------------------------------------------------------------------------

# 6. Spacing System

Use a 4px base spacing system.

Common values:

-   4px
-   8px
-   12px
-   16px
-   20px
-   24px
-   32px
-   40px

Recommended mobile horizontal page padding:

**16--20px**

Recommended card internal padding:

**16px**

Recommended vertical gap between cards:

**12--16px**

------------------------------------------------------------------------

# 7. Corner Radius

Use rounded but professional geometry.

  Element                   Radius
  --------------------- ----------
  Small controls            6--8px
  Inputs                   8--10px
  Buttons                  8--12px
  Cards                   12--16px
  Large feature cards     16--20px
  Avatar                       50%

Avoid excessive pill shapes except for status badges, tabs, and compact
filters.

------------------------------------------------------------------------

# 8. Elevation and Borders

Use subtle shadows.

Preferred:

-   Small card: `0 1px 3px rgba(15, 23, 42, 0.06)`
-   Elevated card: `0 4px 12px rgba(15, 23, 42, 0.08)`
-   Modal/sheet: `0 10px 30px rgba(15, 23, 42, 0.12)`

Standard border:

`1px solid #E5E7EB`

Do not use heavy borders everywhere.

------------------------------------------------------------------------

# 9. Iconography

Use a consistent outline icon family such as Lucide.

Recommended icons:

-   Home
-   Database
-   Upload
-   FileSpreadsheet
-   FileText
-   Image
-   Archive
-   Trash2
-   Edit3
-   Search
-   Phone
-   PhoneCall
-   PhoneOff
-   Mic
-   Pause
-   Play
-   Check
-   CheckCircle
-   AlertCircle
-   Clock
-   Calendar
-   BarChart3
-   Users
-   User
-   ShieldCheck
-   Fingerprint
-   ScanFace
-   ChevronRight
-   MoreVertical

Icons should normally be 18--24px.

Never mix unrelated icon styles.

------------------------------------------------------------------------

# 10. Buttons

## Primary button

Blue background, white text.

Example:

**Start Calling**

## Secondary button

White/very light background, blue/dark text, subtle border.

Example:

**Cancel**

## Destructive button

Red only for irreversible/destructive actions.

Example:

**Delete Data**

## Success button

Green may be used for confirmation where appropriate.

Example:

**Confirm Report**

## Button behavior

Every button must have:

-   Default
-   Pressed
-   Disabled
-   Loading

states.

Buttons must have minimum touch target approximately 44×44px.

------------------------------------------------------------------------

# 11. Inputs

Inputs should have:

-   Clear label
-   Rounded border
-   White background
-   44--52px comfortable height
-   Visible focus state
-   Error state
-   Optional helper text

Password input must support show/hide.

Search input should have a search icon.

------------------------------------------------------------------------

# 12. Cards

Cards are the primary information container.

Card style:

-   White background
-   12--16px radius
-   1px subtle border or soft shadow
-   12--16px padding

Use cards for:

-   Dashboard metrics
-   Data management actions
-   Upload status
-   AI report
-   Contact summary
-   Campaign summary
-   Report summaries
-   Retry queue
-   Industry categories

------------------------------------------------------------------------

# 13. Status Badges

Use compact status badges.

### Answered

Green:

`Answered`

### No Answer

Red/light red:

`No Answer`

### Busy

Orange:

`Busy`

### Switched Off

Red/orange:

`Switched Off`

### Callback Required

Blue:

`Callback Required`

### Completed

Green:

`Completed`

### Pending

Orange:

`Pending`

### Failed

Red:

`Failed`

Never communicate status only through color. Include readable text/icon.

------------------------------------------------------------------------

# 14. Navigation

Use a bottom navigation bar for the primary mobile areas:

**Home \| Data \| Calling \| Reports \| Profile**

The active item should use the primary blue.

The navigation should remain simple.

Do not add excessive top-level navigation items.

------------------------------------------------------------------------

# 15. Screen Specifications

The reference image contains 14 screens.

## Screen 1 --- Splash Screen

### Purpose

Introduce SmartCall AI.

### Content

-   SmartCall AI logo
-   SmartCall AI
-   Select. Speak. Call. Track. Complete.
-   Smarter People
-   Stronger Tomorrow
-   Version 1.0.0

### Visual

-   Blue gradient
-   White logo/text
-   Minimal
-   Premium
-   Center aligned

------------------------------------------------------------------------

## Screen 2 --- Admin Login

### Purpose

Secure entry for authorized users.

### Content

-   Welcome Back
-   Admin Login
-   Email
-   Password
-   Password visibility icon
-   Face/biometric authentication
-   Login
-   Only authorized users can access

### Security UX

Use platform biometric authentication such as Face ID, fingerprint, or
equivalent secure device authentication where available.

Do not require the application to store raw biometric data.

------------------------------------------------------------------------

## Screen 3 --- Dashboard

### Header

Avatar/profile

**Hello, Mr. Srinivas**

**Admin**

### Greeting card

**Good Morning!**

**Small actions make a big difference.**

### Feature cards

-   Data Management
-   View Records
-   Calling Progress / Start workflow
-   Reports

### Metrics

-   Students/Contacts: 70
-   Pending Calls: 20
-   Completed: 50
-   Overall: 71%

### Important

Do not let the dashboard bypass the selection workflow.

A "Calling Progress" card may show progress, but a new calling queue
must only be generated from selected contacts.

------------------------------------------------------------------------

## Screen 4 --- Data Management

### Header

**Data Management**

### Options

1.  Upload New Data
2.  Current Data
3.  Archived Data
4.  Delete Data
5.  Edit / Update Data
6.  Search Data
7.  Replace Data

### Visual hierarchy

**Upload New Data** must be highly visible.

This screen establishes that the Admin has full control of
organizational data.

------------------------------------------------------------------------

## Screen 5 --- Upload Data

### Header

**Upload Data**

### Upload area

-   Cloud upload icon
-   Tap to Upload
-   PDF / Excel / Image
-   Choose File

### Supported formats

-   Excel `.xlsx`, `.xls`
-   PDF `.pdf`
-   Image `.jpg`, `.jpeg`, `.png`

### Required process

**Upload → Extract → Preview → Verify → Save**

------------------------------------------------------------------------

## Screen 6 --- Preview & Save

### Header

**Preview Extracted Data**

### Table

Columns:

-   Roll No
-   Name
-   Phone Number

Example records:

-   1 / Rahul / 9876543210
-   2 / Priya / 9876543211
-   3 / Ahmed / 9876543212
-   4 / Sneha / 9876543213
-   5 / Karthik / 9876543214
-   6 / Divya / 9876543215
-   7 / Mohan / 9876543216
-   8 / Anjali / 9876543217
-   9 / Rohan / 9876543218
-   10 / Neha / 9876543219

Actions:

-   Edit
-   Save Data

The preview must be editable before persistence.

------------------------------------------------------------------------

## Screen 7 --- Select Class / Period

### Header

**Select Class / Period**

### Fields

-   Academic Year
-   Semester / Period
-   Department / Class

Example:

**2026**

**Semester 1**

**CSE-A**

### Summary

**Total Students: 70**

### Primary action

**Load Data**

This screen supports yearly/semester/period reuse.

------------------------------------------------------------------------

## Screen 8 --- Student List / Excel View

This is the key pre-calling screen.

### Header

**CSE-A (Semester 1)**

### Table columns

-   Checkbox
-   Roll No
-   Name
-   Phone
-   Weekly Attendance
-   Monthly Attendance
-   Overall Attendance

### Example

The table should look and behave like a mobile-friendly spreadsheet.

### Selection

The teacher/admin checks only the required people, such as absent
students.

Example:

70 students total.

20 absent.

Teacher checks 20 rows.

### Bottom selection bar

Show:

**Selected: 20**

Then:

# Ready to Call

### Hard rule

No calling queue exists before this selection.

------------------------------------------------------------------------

## Screen 9 --- Ready to Call

This screen appears only after the user taps **Ready to Call**.

### Content

**Ready to Call**

**You have selected 20 students**

**from CSE-A**

Show a preview of the selected contacts.

Show:

**Total Selected: 20**

### Actions

Primary:

**Start Calling**

Secondary:

**Back to Selection**

### Hard rule

The app must not automatically call or redirect after checkbox
selection.

The user must explicitly confirm by pressing **Start Calling**.

------------------------------------------------------------------------

## Screen 10 --- Calling Screen

This screen is entered only after **Start Calling**.

### Content

-   Contact avatar
-   Contact name
-   Phone number
-   Calling state
-   Speaker
-   Mute
-   Keypad
-   End Call

### Visual

Use a dark native-phone-inspired call screen.

### Important

Human speaks to the contact.

SmartCall AI manages workflow, not autonomous robot calling.

------------------------------------------------------------------------

## Screen 11 --- After Call --- Automatic Report

### Header

**Call Ended**

### Contact card

-   Name
-   Phone
-   Call duration

### AI Suggested Report

Fields:

-   Status
-   Reason
-   Follow-up

Example:

**Status: Answered**

**Reason: Fever**

**Follow-up: Not Required**

### Voice modification

Show:

**Speak to modify**

Example:

> "He has fever and will return tomorrow."

### Actions

-   Edit
-   Confirm

The report should be generated immediately after the call.

------------------------------------------------------------------------

## Screen 12 --- Next Call

After report confirmation:

Show:

**Next Contact**

Example:

**Sneha**

**+91 9876543213**

### Actions

-   Start Next Call
-   Skip
-   Pause / Resume

### Queue status

**Remaining in Queue: 14**

Show position, for example:

**2 of 20**

Only contacts selected on Screen 8 may appear here.

------------------------------------------------------------------------

## Screen 13 --- Reports

### Header

**Reports**

### Tabs

-   Daily
-   Weekly
-   Monthly
-   Overall

### Metrics

-   Total
-   Called
-   Answered
-   Not Answered
-   Busy
-   Switched Off
-   Callback Required
-   Completed
-   Pending

### Example

Total: 70

Called: 50

Answered: 35

Not Answered: 15

### Completion chart

Example:

**71% Overall Completion**

### Reasons

-   Fever
-   Family Function
-   Not Picked
-   Out of Station
-   Others

### Reports

Support:

-   Organization
-   Employee
-   Campaign
-   Department
-   Class
-   Period

------------------------------------------------------------------------

## Screen 14 --- Re-Attend / Retry

### Header

**Re-Attend Queue**

### Tabs

-   Not Answered
-   Retry History

### Table

Columns:

-   Roll No
-   Name
-   Status

Example:

-   Karthik --- No Answer
-   Rohan --- Busy
-   Suresh --- Switched Off
-   Latha --- No Answer
-   Vivek --- No Answer

### Actions

-   Retry Selected
-   Schedule for Later

The retry process must use the same human-controlled calling and
post-call report workflow.

------------------------------------------------------------------------

# 16. Data Lifecycle UI

The application must support long-term organizational use.

Admin actions:

-   Upload
-   Edit
-   Update
-   Replace
-   Archive
-   Delete
-   Search
-   Assign
-   Reassign

### Period model

Examples:

**2026 / Semester 1 / CSE-A**

**2026 / Semester 2 / CSE-A**

**2027 / Semester 1 / CSE-A**

The UI must make it obvious that the application remains the same while
the data and assignments change.

------------------------------------------------------------------------

# 17. Assignment UI

Keep data and caller assignment separate.

Example:

**CSE-A / Semester 1 → Teacher A**

Later:

**CSE-A / Semester 2 → Teacher B**

Later:

**CSE-A / 2027 → Teacher C**

Admin should be able to change the responsible caller without rebuilding
or reinstalling the application.

The same concept applies to companies where employees change.

------------------------------------------------------------------------

# 18. Voice Assistant UI

Voice is a specialized SmartCall assistant.

Do not create a humanoid AI.

Use:

-   Microphone button
-   Listening state
-   Transcription preview
-   Confirmation state
-   Action result

Example:

> "Call Rahul."

If Rahul is in the current selected list:

**Rahul found → confirm/continue → call**

If Rahul is not selected:

> **Rahul is not currently selected. Would you like to return to the
> contact list and select Rahul?**

The voice assistant must not silently add unauthorized contacts to the
queue.

------------------------------------------------------------------------

# 19. Voice Commands

Supported examples:

-   Call Rahul
-   Call Rahul Kumar
-   Find Priya
-   Call the next person
-   Pause calling
-   Resume calling
-   Show today's pending calls
-   Show people who did not answer
-   Retry Rahul
-   Schedule Rahul for tomorrow

Voice commands must respect role permissions and current workflow state.

------------------------------------------------------------------------

# 20. Automatic Report UX

After each call:

1.  Detect call completion.
2.  Present the post-call report screen.
3.  Generate a suggested structured report from user-provided input and
    supported application data.
4.  Let the user edit.
5.  Let the user use voice to modify.
6.  Require confirmation before finalizing.
7.  Move to the next selected contact.

Never force the administrator to type a long report after every call.

------------------------------------------------------------------------

# 21. Pause / Resume UX

Pause must preserve:

-   Selected list
-   Current position
-   Completed count
-   Pending contacts
-   Retry contacts
-   Current campaign/period
-   Follow-up state

Example:

**8 / 20 completed**

Pause.

Resume.

Continue from:

**9 / 20**

Never restart from contact 1.

------------------------------------------------------------------------

# 22. Calling State Machine

The UI should reflect these states:

`IDLE`

→ `CONTACTS_SELECTED`

→ `READY_TO_CALL`

→ `CALLING`

→ `CALL_ENDED`

→ `REPORT_REVIEW`

→ `REPORT_CONFIRMED`

→ `NEXT_CONTACT`

or

`CALLING`

→ `NO_ANSWER / BUSY / SWITCHED_OFF`

→ `MAIN_QUEUE_CONTINUES`

→ `RETRY_QUEUE`

A retry should never falsely mark a contact as completed.

------------------------------------------------------------------------

# 23. Responsive and Platform Rules

The product is a mobile application designed for:

-   Android
-   iOS

The design system should be platform-neutral at the product level while
respecting native platform conventions.

### Android

Use Material-inspired interaction patterns where appropriate.

### iOS

Respect iOS navigation, safe areas, touch targets, and system
interaction conventions.

Do not make the two platforms look like completely different products.

------------------------------------------------------------------------

# 24. Accessibility

Minimum requirements:

-   Strong text/background contrast
-   44px+ touch targets
-   Do not use color alone for status
-   Support screen readers
-   Meaningful accessibility labels
-   Clear focus states
-   Readable font sizes
-   Avoid tiny table text where possible
-   Provide confirmation for destructive actions

------------------------------------------------------------------------

# 25. Loading, Empty, Error, and Success States

Every data-driven screen must have:

### Loading

Skeleton or progress indicator.

### Empty

Explain what the user should do.

Example:

**No contacts selected yet. Select contacts from the table to create a
calling list.**

### Error

Clear human-readable error.

### Success

Clear confirmation.

Example:

**20 contacts are ready to call.**

------------------------------------------------------------------------

# 26. Destructive Actions

Delete operations must require confirmation.

Example:

> **Delete this dataset?**

Show:

-   Dataset name
-   Number of records
-   Period
-   Consequences

Buttons:

**Cancel**

**Delete**

For permanent deletion, use an additional confirmation if required by
policy.

------------------------------------------------------------------------

# 27. Industry Adaptability

The UI should support:

-   Education
-   Banking
-   Post Office
-   Corporate
-   Recruitment
-   Healthcare
-   Government
-   Customer Service
-   Other organizations

Use configurable labels.

For example:

Student → Contact

Class → Team/Department

Attendance → Status/Eligibility

Teacher → Caller/Employee

The underlying design system should not be hard-coded exclusively for
education.

------------------------------------------------------------------------

# 28. Dashboard Metrics

The dashboard may show:

-   Total Contacts
-   Pending Calls
-   Completed
-   Selected Today
-   Overall Completion
-   Active Campaigns
-   Follow-ups Due
-   Retry Queue Count

Do not overwhelm the user with metrics.

Prioritize the current task.

------------------------------------------------------------------------

# 29. Analytics Visualization

Charts should be:

-   Simple
-   Readable
-   Mobile-friendly
-   Accessible
-   Clearly labeled

Recommended:

-   Donut/circular completion chart
-   Bar chart for employee completion
-   Line chart for daily/weekly trends
-   Outcome distribution
-   Campaign progress

Never use charts merely for decoration.

------------------------------------------------------------------------

# 30. Design-to-Code Rules for AI Development Tools

When an AI coding tool implements this design:

1.  Reuse components.
2.  Do not create one-off styles for every screen.
3.  Use design tokens.
4.  Create a central theme file.
5.  Create reusable Button, Card, Input, Badge, Table, Modal, Sheet,
    Avatar, MetricCard, EmptyState, LoadingState, and Confirmation
    components.
6.  Keep spacing consistent.
7.  Keep typography consistent.
8.  Keep status colors consistent.
9.  Keep icon sizes consistent.
10. Keep navigation consistent.
11. Keep mobile touch targets large.
12. Keep the selection → Ready to Call → Start Calling flow intact.

------------------------------------------------------------------------

# 31. Component Inventory

Required reusable components:

-   `AppShell`
-   `SplashScreen`
-   `AdminLogin`
-   `BiometricAuth`
-   `Dashboard`
-   `BottomNavigation`
-   `MetricCard`
-   `FeatureCard`
-   `DataManagement`
-   `UploadCard`
-   `FilePicker`
-   `UploadProgress`
-   `DataPreviewTable`
-   `YearSelector`
-   `SemesterSelector`
-   `ClassSelector`
-   `ContactTable`
-   `SelectionCheckbox`
-   `SelectionSummaryBar`
-   `ReadyToCallCard`
-   `SelectedContactsPreview`
-   `CallingQueue`
-   `CallContactCard`
-   `NativeCallLauncher`
-   `CallStatus`
-   `PostCallReport`
-   `AIReportCard`
-   `VoiceInput`
-   `NextContactCard`
-   `PauseResumeControl`
-   `RetryQueue`
-   `RetryTable`
-   `ReportsDashboard`
-   `ReportTabs`
-   `CompletionChart`
-   `ReasonBreakdown`
-   `EmployeePerformance`
-   `CampaignPerformance`
-   `ConfirmationDialog`
-   `Toast`
-   `EmptyState`
-   `ErrorState`
-   `LoadingState`

------------------------------------------------------------------------

# 32. Core Interaction Invariants

These must never be violated:

### Invariant 1

No selected contacts = no calling queue.

### Invariant 2

Calling queue = selected contacts only.

### Invariant 3

Ready to Call does not automatically start the first call.

### Invariant 4

Start Calling explicitly begins the queue.

### Invariant 5

Every call produces a reviewable outcome.

### Invariant 6

No Answer / Busy / Switched Off does not equal Completed.

### Invariant 7

Unreachable contacts enter retry/follow-up flow.

### Invariant 8

Pause never loses queue state.

### Invariant 9

Voice commands cannot bypass authorization or selection rules.

### Invariant 10

Organization completion and employee completion are separate metrics.

------------------------------------------------------------------------

# 33. Reference Image Mapping

The supplied reference board represents:

1.  Splash Screen
2.  Admin Login
3.  Dashboard
4.  Data Management
5.  Upload Data
6.  Preview & Save
7.  Select Class / Period
8.  Student List / Excel View
9.  Ready to Call
10. Calling Screen
11. After Call --- Auto Report
12. Next Call
13. Reports
14. Re-Attend / Retry

The implementation should preserve this information architecture while
improving interaction correctness where the product requirements demand
it.

The most important correction is that Screen 8 creates the selection and
Screen 9 confirms it before Screen 10 starts calling.

------------------------------------------------------------------------

# 34. Final Design Goal

The final SmartCall AI UI must communicate this experience immediately:

**Upload → Select → Ready to Call → Confirm → Call → Auto Report → Next
→ Retry → Complete**

The user should always know:

-   Where they are
-   What they are doing
-   How many contacts are selected
-   Which contact is currently being called
-   What happened on the previous call
-   What remains
-   What action comes next

The design should make a repetitive one-hour calling task significantly
easier and faster without removing human control.

------------------------------------------------------------------------

# 35. Final Product Statement

> **SmartCall AI is a professional, human-controlled, AI-assisted
> organizational calling workflow system. It helps users select the
> right contacts, call them one by one, automatically prepare post-call
> reports, manage retries and follow-ups, and measure real progress
> across organizations, employees, campaigns, classes, teams, years, and
> periods.**

The signature experience is:

> **Select the people. SmartCall manages the workflow.**
