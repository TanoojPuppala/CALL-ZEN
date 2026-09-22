package com.smartcallai.app.domain.model

enum class IndustryType(val displayName: String) {
    EDUCATION("Education"),
    BANKING("Banking"),
    POST_OFFICE("Post Office"),
    CORPORATE("Corporate"),
    RECRUITMENT("Recruitment"),
    HEALTHCARE("Healthcare"),
    GOVERNMENT("Government"),
    CUSTOMER_SERVICE("Customer Service"),
    OTHER("Other / Custom")
}

enum class UserRole(val displayName: String) {
    SUPER_ADMIN("Super Admin"),
    ORG_ADMIN("Organization Admin"),
    TEACHER_IN_CHARGE("Teacher / In-Charge"),
    MANAGER("Manager"),
    HR("HR Manager"),
    CALLER_STAFF("Caller / Staff"),
    VIEWER("Viewer")
}

enum class LeaveStatus(val displayName: String) {
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    CANCELLED("Cancelled")
}

enum class CallOutcome(val displayName: String) {
    ANSWERED("Answered"),
    NO_ANSWER("No Answer"),
    BUSY("Busy"),
    SWITCHED_OFF("Switched Off"),
    CALLBACK_REQUIRED("Callback Required"),
    WRONG_NUMBER("Wrong Number"),
    NOT_REQUIRED("Not Required"),
    COMPLETED("Completed"),
    FAILED("Failed")
}

enum class NumberUsedType(val displayName: String) {
    PRIMARY("Primary Phone"),
    ALTERNATE("Alternate Phone")
}

enum class QueueItemStatus(val displayName: String) {
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    SKIPPED("Skipped"),
    RETRY_REQUIRED("Retry Required")
}

enum class ImportFileType(val displayName: String) {
    EXCEL("Excel Sheet (.xlsx, .csv)"),
    PDF("PDF Document (.pdf)"),
    IMAGE("Scanned Image / OCR (.jpg, .png)")
}
