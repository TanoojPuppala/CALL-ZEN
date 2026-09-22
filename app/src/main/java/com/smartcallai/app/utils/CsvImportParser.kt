package com.smartcallai.app.utils

import com.smartcallai.app.domain.model.ImportPreviewItem

object CsvImportParser {

    fun parseCsvText(rawText: String, defaultGroup: String = "General"): List<ImportPreviewItem> {
        if (rawText.isBlank()) return emptyList()

        val lines = rawText.lines().map { it.trim() }.filter { it.isNotBlank() }
        if (lines.isEmpty()) return emptyList()

        val results = mutableListOf<ImportPreviewItem>()
        var rowNum = 1

        val startIndex = if (lines[0].contains("name", ignoreCase = true) || lines[0].contains("phone", ignoreCase = true) || lines[0].contains("roll", ignoreCase = true)) {
            1
        } else 0

        for (i in startIndex until lines.size) {
            val line = lines[i]
            val tokens = line.split(",", ";", "\t").map { it.trim().removeSurrounding("\"") }

            var rollOrId = ""
            var name = ""
            var primaryPhone = ""
            var alternatePhone = ""
            var groupName = defaultGroup

            if (tokens.size == 1) {
                // Name or Phone only
                name = tokens[0]
                rollOrId = "ID-$rowNum"
            } else if (tokens.size == 2) {
                // Name, Phone OR ID, Name
                if (tokens[1].contains(Regex("^\\+?[0-9\\-\\s]{7,15}$"))) {
                    name = tokens[0]
                    primaryPhone = tokens[1]
                    rollOrId = "ID-$rowNum"
                } else {
                    rollOrId = tokens[0]
                    name = tokens[1]
                }
            } else if (tokens.size >= 3) {
                rollOrId = tokens[0]
                name = tokens[1]
                primaryPhone = tokens[2]
                if (tokens.size >= 4) alternatePhone = tokens[3]
                if (tokens.size >= 5) groupName = tokens[4]
            }

            // Validation Rules
            val cleanedPrimary = primaryPhone.replace(Regex("[^0-9+]"), "")
            val cleanedAlt = alternatePhone.replace(Regex("[^0-9+]"), "")

            var isValid = true
            var validationMsg = "OK"

            if (name.isBlank()) {
                isValid = false
                validationMsg = "Missing name"
            } else if (cleanedPrimary.isNotBlank() && cleanedPrimary.length < 8) {
                isValid = false
                validationMsg = "Invalid primary phone format"
            }

            if (rollOrId.isBlank()) {
                rollOrId = "ID-$rowNum"
            }

            results.add(
                ImportPreviewItem(
                    rowNumber = rowNum,
                    rollOrIdNumber = rollOrId,
                    name = name,
                    primaryPhone = if (cleanedPrimary.isNotBlank()) cleanedPrimary else primaryPhone,
                    alternatePhone = if (cleanedAlt.isNotBlank()) cleanedAlt else alternatePhone,
                    groupName = groupName.ifBlank { defaultGroup },
                    isValid = isValid,
                    validationMessage = validationMsg
                )
            )
            rowNum++
        }

        return results
    }
}
