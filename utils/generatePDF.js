import puppeteer from "puppeteer";
import fs from "fs";
import hbs from "handlebars";

export async function generarInformePDF(Datainforme, esSoloFormato = false) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const NameHBS = esSoloFormato ? 'informe_skeleton' : 'informe'
  const html = fs.readFileSync(`./templates/${NameHBS}.hbs`, "utf-8");

  const imgBase64 = fs.readFileSync("./public/imgs/logoUNL.png").toString("base64");
  const fonts = await convertFontBase64();

  const data = {
    imgBase64,
    fonts,
    ...Datainforme,
  }

  const content = await hbs.compile(html)(data);
  await page.setContent(content, { waitUntil: "domcontentloaded" });

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
    printBackground: true,
    landscape: true,
    format: "A4",
  });

  // Close the browser instance
  await browser.close();
  return pdf;
}

async function convertFontBase64() {
  const fonts = {
    normal: null,
    italic: null,
    boldItalic: null,
    bold: null,
  };
  const normal = await fs.readFileSync("./public/fonts/GOTHIC.TTF");
  const bold = await fs.readFileSync("./public/fonts/GOTHICB.TTF");
  const italic = await fs.readFileSync("./public/fonts/GOTHICI.TTF");
  const boldItalic = await fs.readFileSync("./public/fonts/GOTHICBI.TTF");

  fonts.normal = normal.toString("base64");
  fonts.bold = bold.toString("base64");
  fonts.italic = italic.toString("base64");
  fonts.boldItalic = boldItalic.toString("base64");
  return fonts;
}
