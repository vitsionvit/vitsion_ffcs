import type { Student } from "./types";
import * as XLSX from "xlsx";

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
