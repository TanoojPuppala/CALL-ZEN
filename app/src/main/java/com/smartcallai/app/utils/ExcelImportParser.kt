package com.smartcallai.app.utils

import android.content.Context
import android.net.Uri
import android.util.Xml
import com.smartcallai.app.domain.model.ImportPreviewItem
import org.xmlpull.v1.XmlPullParser
import java.io.InputStream
import java.io.PushbackInputStream
import java.util.zip.ZipInputStream

object ExcelImportParser {

    fun parseXlsxOrCsv(context: Context, uri: Uri, defaultGroup: String = "General"): List<ImportPreviewItem> {
        return try {
            val contentResolver = context.contentResolver
            val mimeType = contentResolver.getType(uri) ?: ""
            val filename = uri.lastPathSegment ?: ""

            val inputStream = contentResolver.openInputStream(uri) ?: return emptyList()

            // Check if file is ZIP/XLSX (starts with PK header or has .xlsx extension)
            val headerBytes = ByteArray(4)
            val pushbackStream = PushbackInputStream(inputStream, 4)
            val bytesRead = pushbackStream.read(headerBytes, 0, 4)
            if (bytesRead == 4) {
                pushbackStream.unread(headerBytes, 0, 4)
            }

            val isZipHeader = bytesRead == 4 &&
                    headerBytes[0] == 0x50.toByte() &&
                    headerBytes[1] == 0x4B.toByte()

            if (isZipHeader || filename.endsWith(".xlsx", ignoreCase = true) || mimeType.contains("spreadsheet", ignoreCase = true)) {
                parseXlsxStream(pushbackStream, defaultGroup)
            } else {
                val text = pushbackStream.bufferedReader().use { it.readText() }
                CsvImportParser.parseCsvText(text, defaultGroup)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    private fun parseXlsxStream(inputStream: InputStream, defaultGroup: String): List<ImportPreviewItem> {
        val sharedStrings = mutableListOf<String>()
        var sheetBytes: ByteArray? = null

        ZipInputStream(inputStream).use { zipStream ->
            var entry = zipStream.nextEntry
            while (entry != null) {
                val entryName = entry.name
                if (entryName.endsWith("sharedStrings.xml", ignoreCase = true)) {
                    sharedStrings.addAll(parseSharedStrings(zipStream))
                } else if (entryName.endsWith("sheet1.xml", ignoreCase = true) || (sheetBytes == null && entryName.contains("worksheets/sheet", ignoreCase = true))) {
                    sheetBytes = zipStream.readBytes()
                }
                zipStream.closeEntry()
                entry = zipStream.nextEntry
            }
        }

        if (sheetBytes == null) return emptyList()

        return sheetBytes!!.inputStream().use { sheetStream ->
            parseSheetXml(sheetStream, sharedStrings, defaultGroup)
        }
    }

    private fun parseSharedStrings(stream: InputStream): List<String> {
        val strings = mutableListOf<String>()
        val parser = Xml.newPullParser()
        parser.setInput(stream, "UTF-8")

        var eventType = parser.eventType
        var currentText = StringBuilder()
        var inTextTag = false

        while (eventType != XmlPullParser.END_DOCUMENT) {
            val tagName = parser.name
            when (eventType) {
                XmlPullParser.START_TAG -> {
                    if (tagName == "t") {
                        inTextTag = true
                        currentText.setLength(0)
                    }
                }
                XmlPullParser.TEXT -> {
                    if (inTextTag) {
                        currentText.append(parser.text)
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (tagName == "t") {
                        inTextTag = false
                    } else if (tagName == "si") {
                        strings.add(currentText.toString().trim())
                        currentText.setLength(0)
                    }
                }
            }
            eventType = parser.next()
        }
        return strings
    }

    private fun parseSheetXml(stream: InputStream, sharedStrings: List<String>, defaultGroup: String): List<ImportPreviewItem> {
        val results = mutableListOf<ImportPreviewItem>()
        val parser = Xml.newPullParser()
        parser.setInput(stream, "UTF-8")

        var eventType = parser.eventType
        var currentCellRef = ""
        var currentCellType = ""
        var currentCellValue = StringBuilder()
        var inVTag = false

        var rowNum = 1
        val currentRowMap = mutableMapOf<Int, String>()

        while (eventType != XmlPullParser.END_DOCUMENT) {
            val tagName = parser.name
            when (eventType) {
                XmlPullParser.START_TAG -> {
                    if (tagName == "c") {
                        currentCellRef = parser.getAttributeValue(null, "r") ?: ""
                        currentCellType = parser.getAttributeValue(null, "t") ?: ""
                        currentCellValue.setLength(0)
                    } else if (tagName == "v") {
                        inVTag = true
                    }
                }
                XmlPullParser.TEXT -> {
                    if (inVTag) {
                        currentCellValue.append(parser.text)
                    }
                }
                XmlPullParser.END_TAG -> {
                    if (tagName == "v") {
                        inVTag = false
                    } else if (tagName == "c") {
                        val colIndex = getColumnIndex(currentCellRef)
                        val valStr = currentCellValue.toString().trim()
                        val finalVal = if (currentCellType == "s") {
                            val index = valStr.toIntOrNull()
                            if (index != null && index in sharedStrings.indices) {
                                sharedStrings[index]
                            } else valStr
                        } else valStr

                        if (colIndex >= 0) {
                            currentRowMap[colIndex] = finalVal
                        }
                    } else if (tagName == "row") {
                        if (currentRowMap.isNotEmpty()) {
                            val item = buildImportItem(currentRowMap, rowNum, defaultGroup)
                            if (item != null) {
                                results.add(item)
                                rowNum++
                            }
                            currentRowMap.clear()
                        }
                    }
                }
            }
            eventType = parser.next()
        }

        return results
    }

    private fun getColumnIndex(cellRef: String): Int {
        val colLetters = cellRef.takeWhile { it.isLetter() }.uppercase()
        if (colLetters.isEmpty()) return -1
        var index = 0
        for (char in colLetters) {
            index = index * 26 + (char - 'A' + 1)
        }
        return index - 1
    }

    private fun buildImportItem(rowMap: Map<Int, String>, rowNum: Int, defaultGroup: String): ImportPreviewItem? {
        val firstVal = rowMap[0] ?: ""
        val secondVal = rowMap[1] ?: ""

        // Skip header row if present
        if (firstVal.contains("roll", ignoreCase = true) || firstVal.contains("id", ignoreCase = true) || secondVal.contains("name", ignoreCase = true)) {
            return null
        }

        var rollOrId = rowMap[0] ?: "ID-$rowNum"
        var name = rowMap[1] ?: ""
        var primaryPhone = rowMap[2] ?: ""
        var alternatePhone = rowMap[3] ?: ""
        var groupName = rowMap[4] ?: defaultGroup

        // If 0-indexed column 0 is name and column 1 is phone
        if (name.isBlank() && primaryPhone.isBlank() && rollOrId.isNotBlank()) {
            name = rollOrId
            rollOrId = "ID-$rowNum"
        }

        val cleanedPrimary = primaryPhone.replace(Regex("[^0-9+]"), "")
        val cleanedAlt = alternatePhone.replace(Regex("[^0-9+]"), "")

        var isValid = true
        var validationMsg = "OK"

        if (name.isBlank()) {
            isValid = false
            validationMsg = "Missing name"
        } else if (cleanedPrimary.isNotBlank() && cleanedPrimary.length < 8) {
            isValid = false
            validationMsg = "Invalid primary phone"
        }

        return ImportPreviewItem(
            rowNumber = rowNum,
            rollOrIdNumber = rollOrId.ifBlank { "ID-$rowNum" },
            name = name,
            primaryPhone = if (cleanedPrimary.isNotBlank()) cleanedPrimary else primaryPhone,
            alternatePhone = if (cleanedAlt.isNotBlank()) cleanedAlt else alternatePhone,
            groupName = groupName.ifBlank { defaultGroup },
            isValid = isValid,
            validationMessage = validationMsg
        )
    }
}
