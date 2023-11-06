const puppeteer = require("puppeteer");
module.exports.previewUrl = async (req, res) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Remplacez 'https://example.com' par l'URL de la page que vous souhaitez capturer
  //   const url = "https://fleeting.netlify.app";
  const url = "https://www.lodrick-web.fr";
  //   const url = "https://developer.mozilla.org/fr/docs/Web/CSS/filter";
  await page.goto(url);

  // Capture d'écran en tant que Buffer
  const screenshotBuffer = await page.screenshot();

  // Convertir le Buffer en une chaîne de données base64
  //   const screenshotDataUrl = `data:image/png;base64,${screenshotBuffer.toString(
  //     "base64"
  //   )}`;

  //   res.json({ screenshot: screenshotDataUrl });
  res.type("image/png");
  res.send(screenshotBuffer);

  await browser.close();
};
