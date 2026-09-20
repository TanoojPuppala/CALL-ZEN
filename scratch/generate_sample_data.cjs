const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { jsPDF } = require('jspdf');

const outputDir = path.join(__dirname, '..', 'public', 'sample_data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sample Student / Contact Records
const sampleData = [
  { "Roll No": "01", "Full Name": "Rahul Kumar", "Phone": "+91 9876543210", "Attendance %": 62, "Department": "CSE-A", "Status": "Absent", "Notes": "Fever reported" },
  { "Roll No": "02", "Full Name": "Priya Sharma", "Phone": "+91 9876543211", "Attendance %": 58, "Department": "CSE-A", "Status": "Absent", "Notes": "Family emergency" },
  { "Roll No": "03", "Full Name": "Ahmed Khan", "Phone": "+91 9876543212", "Attendance %": 65, "Department": "CSE-A", "Status": "Absent", "Notes": "Out of station" },
  { "Roll No": "04", "Full Name": "Sneha Patel", "Phone": "+91 9876543213", "Attendance %": 71, "Department": "CSE-A", "Status": "Absent", "Notes": "Doctor appointment" },
  { "Roll No": "05", "Full Name": "Rahul Sharma", "Phone": "+91 9876543214", "Attendance %": 60, "Department": "CSE-A", "Status": "Absent", "Notes": "Bus breakdown" },
  { "Roll No": "06", "Full Name": "Kavita Reddy", "Phone": "+91 9876543215", "Attendance %": 69, "Department": "CSE-A", "Status": "Absent", "Notes": "Sick leave requested" },
  { "Roll No": "07", "Full Name": "Rohit Verma", "Phone": "+91 9876543216", "Attendance %": 54, "Department": "CSE-A", "Status": "Absent", "Notes": "Sports tournament" },
  { "Roll No": "08", "Full Name": "Ananya Joshi", "Phone": "+91 9876543217", "Attendance %": 72, "Department": "CSE-A", "Status": "Absent", "Notes": "Personal work" },
  { "Roll No": "09", "Full Name": "Vikas Singh", "Phone": "+91 9876543218", "Attendance %": 63, "Department": "CSE-A", "Status": "Absent", "Notes": "Fever" },
  { "Roll No": "10", "Full Name": "Rahul Reddy", "Phone": "+91 9876543219", "Attendance %": 59, "Department": "CSE-A", "Status": "Absent", "Notes": "No answer previously" },
  { "Roll No": "11", "Full Name": "Divya Nair", "Phone": "+91 9876543220", "Attendance %": 88, "Department": "CSE-A", "Status": "Present", "Notes": "Regular student" },
  { "Roll No": "12", "Full Name": "Manish Gupta", "Phone": "+91 9876543221", "Attendance %": 92, "Department": "CSE-A", "Status": "Present", "Notes": "Class representative" },
  { "Roll No": "13", "Full Name": "Pooja Malhotra", "Phone": "+91 9876543222", "Attendance %": 64, "Department": "CSE-A", "Status": "Absent", "Notes": "Hospital visit" },
  { "Roll No": "14", "Full Name": "Arjun Das", "Phone": "+91 9876543223", "Attendance %": 57, "Department": "CSE-A", "Status": "Absent", "Notes": "Travelling" },
  { "Roll No": "15", "Full Name": "Neha Choudhary", "Phone": "+91 9876543224", "Attendance %": 81, "Department": "CSE-A", "Status": "Present", "Notes": "Attending" }
];

// 1. Generate CSV
const csvHeaders = Object.keys(sampleData[0]).join(',');
const csvRows = sampleData.map(row => Object.values(row).map(val => `"${val}"`).join(','));
const csvContent = [csvHeaders, ...csvRows].join('\n');
fs.writeFileSync(path.join(outputDir, 'smartcall_sample_data.csv'), csvContent);
console.log('✓ Created smartcall_sample_data.csv');

// 2. Generate Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Students_CSE_A');
XLSX.writeFile(workbook, path.join(outputDir, 'smartcall_sample_data.xlsx'));
console.log('✓ Created smartcall_sample_data.xlsx');

// 3. Generate PDF Table (.pdf)
const doc = new jsPDF();
doc.setFontSize(18);
doc.setTextColor(37, 99, 235);
doc.text('SmartCall AI — Sample Student Records', 14, 20);

doc.setFontSize(10);
doc.setTextColor(100, 116, 139);
doc.text('Apex Institute of Engineering & Technology • Department: CSE-A • Year 2026-27', 14, 28);
doc.text('Dataset for Automated Attendance Calling & Follow-up Workflow', 14, 34);

doc.setDrawColor(226, 232, 240);
doc.line(14, 38, 196, 38);

// Table Header
doc.setFontSize(9);
doc.setFont('helvetica', 'bold');
doc.setTextColor(15, 23, 42);
doc.text('Roll', 14, 46);
doc.text('Full Name', 28, 46);
doc.text('Phone Number', 75, 46);
doc.text('Attn %', 115, 46);
doc.text('Status', 135, 46);
doc.text('Remark / Reason', 160, 46);

doc.setFont('helvetica', 'normal');
doc.setTextColor(51, 65, 85);

let y = 54;
sampleData.forEach((item, index) => {
  if (index % 2 === 0) {
    doc.setFillColor(248, 250, 252);
    doc.rect(12, y - 5, 186, 7, 'F');
  }
  doc.text(String(item['Roll No']), 14, y);
  doc.text(String(item['Full Name']), 28, y);
  doc.text(String(item['Phone']), 75, y);
  doc.text(`${item['Attendance %']}%`, 115, y);
  doc.text(String(item['Status']), 135, y);
  doc.text(String(item['Notes']), 160, y);
  y += 7.5;
});

doc.save(path.join(outputDir, 'smartcall_sample_data.pdf'));
console.log('✓ Created smartcall_sample_data.pdf');
