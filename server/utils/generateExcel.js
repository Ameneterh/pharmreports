import ExcelJS from "exceljs";

export const generateExcel = async (data, startDate, endDate) => {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Weekly Report Summary");

  // Title
  sheet.mergeCells("A1:C1");

  sheet.getCell("A1").value = "Summary Report";

  sheet.getCell("A1").font = {
    bold: true,
    size: 16,
  };

  sheet.getCell("A1").alignment = {
    horizontal: "center",
  };

  // Date range
  sheet.mergeCells("A2:C2");

  sheet.getCell("A2").value = `${startDate} to ${endDate}`;

  sheet.getCell("A2").alignment = {
    horizontal: "center",
  };

  // Empty row
  sheet.addRow([]);

  // Create header manually at row 4
  const header = sheet.addRow(["Reporter", "Total Reports", "Interventions"]);

  // Style header
  header.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: {
        argb: "FFFFFF",
      },
    };

    cell.fill = {
      type: "pattern",

      pattern: "solid",

      fgColor: {
        argb: "1F4E78",
      },
    };

    cell.alignment = {
      horizontal: "center",

      vertical: "middle",
    };
  });

  // Column widths
  sheet.getColumn(1).width = 30;

  sheet.getColumn(2).width = 15;

  sheet.getColumn(3).width = 20;

  // Add data from row 5
  data.forEach((item) => {
    sheet.addRow([item.name, item.totalReports, item.interventions]);
  });

  await workbook.xlsx.writeFile("./server/exports/weekly-summary.xlsx");

  return "server/exports/weekly-summary.xlsx";
};
