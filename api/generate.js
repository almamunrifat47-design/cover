import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const templatePath = path.join(process.cwd(), "public", "template.docx");
  const content = fs.readFileSync(templatePath, "binary");

  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip);

  doc.setData(req.body);

  try {
    doc.render();
  } catch (error) {
    return res.status(500).send(error);
  }

  const buffer = doc.getZip().generate({
    type: "nodebuffer",
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Assignment_Cover.docx"
  );

  res.send(buffer);
}