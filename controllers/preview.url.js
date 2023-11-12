////depuis vps
const puppeteer = require("puppeteer");
const sharp = require("sharp");
module.exports.previewUrl = async (req, res) => {
  const url = req.body.url;
  const regex = /https?:\/\/[^\s/$.?#].[^\s]*/;
  console.log(url);
  if (regex.test(url)) {
    try {
      //code quand api n'est pas sur VPS
      const browser = await puppeteer.launch({ headless: "new" });

      //Code quand api est sur VPS
      // const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
      const page = await browser.newPage();
      //viewport to pc
      // await page.setViewport({ width: 1280, height: 1024 });

      // to viewport mobil
      await page.setViewport({ width: 375, height: 667 });

      await page.goto(url);

      // Capture d'écran en tant que Buffer
      const screenshotBuffer = await page.screenshot({ fullPage: true });

      //resize img
      const resizeScreenShotBuffer = await sharp(screenshotBuffer)
        .resize(1080, 1080)
        .toBuffer();

      //convertir en base64
      const base64Image = resizeScreenShotBuffer.toString("base64");
      res.send(`data:image/png;base64,${base64Image}`);

      await browser.close(); // fermer le navigateur ouvert, important
    } catch (error) {
      console.log("Juste erreur");
      console.log(error);
    }
  } else {
    console.log("Erreur lien ici");
    return res.status(200).json({ message: "Erreur : lien incorrect" });
  }
};
