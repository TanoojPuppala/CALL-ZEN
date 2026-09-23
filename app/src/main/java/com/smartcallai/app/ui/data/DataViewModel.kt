package com.smartcallai.app.ui.data

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.smartcallai.app.data.repository.SmartCallRepository
import com.smartcallai.app.domain.model.*
import com.smartcallai.app.utils.CsvImportParser
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class DataViewModel(
    private val repository: SmartCallRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _statusFilter = MutableStateFlow("ALL")
    val statusFilter: StateFlow<String> = _statusFilter.asStateFlow()

    private val periodIdFlow = repository.getCurrentPeriod().map { it?.periodId ?: "" }

    val contacts: StateFlow<List<Contact>> = combine(
        periodIdFlow.flatMapLatest { pId ->
            if (pId.isNotBlank()) repository.getContacts(pId) else flowOf(emptyList())
        },
        _searchQuery,
        _statusFilter
    ) { contactList, query, filter ->
        contactList.filter { c ->
            val matchesQuery = query.isBlank() ||
                    c.name.contains(query, ignoreCase = true) ||
                    c.rollOrIdNumber.contains(query, ignoreCase = true) ||
                    c.primaryPhone.contains(query)
            val matchesFilter = when (filter) {
                "SELECTED" -> c.isSelected
                "ABSENT" -> c.currentStatus.contains("Absent", ignoreCase = true)
                "LEAVE" -> c.currentStatus.contains("Leave", ignoreCase = true)
                else -> true
            }
            matchesQuery && matchesFilter
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val leaveRecords: StateFlow<List<LeaveRecord>> = repository.getLeaveRecords()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val selectedContacts: StateFlow<List<Contact>> = contacts.map { list ->
        list.filter { it.isSelected }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Real File / CSV Import State
    private val _importPreviewItems = MutableStateFlow<List<ImportPreviewItem>>(emptyList())
    val importPreviewItems: StateFlow<List<ImportPreviewItem>> = _importPreviewItems.asStateFlow()

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setStatusFilter(filter: String) {
        _statusFilter.value = filter
    }

    fun toggleContactSelection(contactId: String, isSelected: Boolean) {
        viewModelScope.launch {
            repository.updateContactSelection(contactId, isSelected)
        }
    }

    fun selectAll(isSelected: Boolean) {
        viewModelScope.launch {
            val period = repository.getCurrentPeriod().first() ?: return@launch
            repository.selectAllContacts(period.periodId, isSelected)
        }
    }

    fun addManualContact(
        name: String,
        rollOrId: String,
        primaryPhone: String,
        alternatePhone: String,
        groupName: String,
        notes: String = ""
    ) {
        viewModelScope.launch {
            val period = repository.getCurrentPeriod().first() ?: return@launch
            val org = repository.getCurrentOrganization().first() ?: return@launch

            val contact = Contact(
                contactId = "c_${System.currentTimeMillis()}",
                organizationId = org.organizationId,
                periodId = period.periodId,
                rollOrIdNumber = rollOrId.ifBlank { "ID-${(100..999).random()}" },
                name = name,
                primaryPhone = primaryPhone,
                alternatePhone = alternatePhone,
                weeklyAttendance = 100.0f,
                monthlyAttendance = 100.0f,
                overallAttendance = 100.0f,
                currentStatus = "Active",
                isSelected = false,
                groupName = groupName.ifBlank { "General" },
                notes = notes
            )
            repository.addContact(contact)
        }
    }

    fun parseRawCsvInput(rawText: String, defaultGroup: String = "General") {
        viewModelScope.launch {
            val parsed = CsvImportParser.parseCsvText(rawText, defaultGroup)
            _importPreviewItems.value = parsed
        }
    }

    fun confirmImport() {
        viewModelScope.launch {
            val period = repository.getCurrentPeriod().first() ?: return@launch
            val org = repository.getCurrentOrganization().first() ?: return@launch

            val validContacts = _importPreviewItems.value.filter { it.isValid }.map { item ->
                Contact(
                    contactId = "c_${System.currentTimeMillis()}_${item.rowNumber}",
                    organizationId = org.organizationId,
                    periodId = period.periodId,
                    rollOrIdNumber = item.rollOrIdNumber,
                    name = item.name,
                    primaryPhone = item.primaryPhone,
                    alternatePhone = item.alternatePhone,
                    weeklyAttendance = 100.0f,
                    monthlyAttendance = 100.0f,
                    overallAttendance = 100.0f,
                    currentStatus = "Active",
                    isSelected = false,
                    groupName = item.groupName,
                    notes = "Imported record"
                )
            }
            if (validContacts.isNotEmpty()) {
                repository.importContacts(validContacts)
                _importPreviewItems.value = emptyList()
            }
        }
    }

    fun deleteContact(contactId: String) {
        viewModelScope.launch {
            repository.deleteContact(contactId)
        }
    }

    fun deleteSelectedContacts() {
        viewModelScope.launch {
            val selected = selectedContacts.value
            selected.forEach { contact ->
                repository.deleteContact(contact.contactId)
            }
        }
    }

    fun clearImport() {
        _importPreviewItems.value = emptyList()
    }
}
