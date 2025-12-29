import type { HourRequest, Student } from "./types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./formatDate";

export const generateCompleteReport = (students: Partial<Student>[]) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(
    students.map((s) => {
      return {
        Name: s.name,
        RegistrationNumber: s.registrationNumber,
        Hours: s.hours,
        Email: s.email,
        Mobile: s.mobile,
      };
    })
  );
  XLSX.utils.book_append_sheet(workbook, worksheet, "FFCS_Report");
  XLSX.writeFile(workbook, "FFCS_Report.xlsx");
};

export const generateIndividualReport = (
  student: Student,
  hourRequests: HourRequest[]
) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("VITSION FFCS Report", 14, 20);
  doc.setFont("helvetica", "normal");

  doc.setFontSize(12);
  doc.text(`Name: ${student.name}`, 14, 40);
  doc.text(`Registration Number: ${student.registrationNumber}`, 14, 50);
  doc.text(`Email: ${student.email}`, 14, 60);
  doc.text(`Phone: ${student.mobile}`, 14, 70);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`Approved Hours: ${student.hours}`, 14, 90);
  doc.setFont("helvetica", "normal");

  doc.addPage("a4", "landscape");

  autoTable(doc, {
    startY: 20,
    head: [
      [
        "Date",
        "Work Details",
        "Slab",
        "Type",
        "Hours",
        "Status",
        "Submitted",
        "Approved/Rejected",
      ],
    ],
    body: hourRequests.map((req) => [
      req.date,
      req.workName,
      req.workSlab,
      req.workType,
      req.hours,
      req.status.toUpperCase(),
      formatDate(req.submitted),
      req.approved
        ? formatDate(req.approved)
        : req.rejected
        ? formatDate(req.rejected)
        : "-",
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [79, 70, 229], // indigo
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 255],
    },
    margin: { left: 10, right: 10 },
    theme: "striped",
  });
  doc.save(`FFCS_${student.registrationNumber}_Report.pdf`);
};
