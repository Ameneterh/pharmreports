import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import fs from "fs";

export const generateWord = async (data) => {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Reporter")],
        }),
        new TableCell({
          children: [new Paragraph("Total Reports")],
        }),
        new TableCell({
          children: [new Paragraph("Incidents")],
        }),
      ],
    }),
  ];

  data.forEach((item) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(item.name)],
          }),

          new TableCell({
            children: [new Paragraph(String(item.totalReports))],
          }),

          new TableCell({
            children: [new Paragraph(String(item.incidents))],
          }),
        ],
      }),
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph("Weekly Report Summary"),

          new Table({
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  fs.writeFileSync("./server/exports/weekly-summary.docx", buffer);

  return "server/exports/weekly-summary.docx";
};
