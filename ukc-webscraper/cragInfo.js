const puppeteer = require("puppeteer");
const axios = require("axios").default;

class CragInfo {
  constructor() {
    this.cragID = null;
    this.img = "No image available";
    this.features = "No features information available";
    this.approach = "No approach information available";
    this.accessType = 0;
    this.accessNote = "No Access Issues";
  }
}

const evaluateCrag = async (page, pageURL) => {
  await page.goto(pageURL, { waitUntil: "domcontentloaded" });
  const cragInfo = new CragInfo();

  try {
    const cragThumb = await page.$("#crag_thumb");
    const imgEl = cragThumb ? await cragThumb.$("img") : null;
    cragInfo.img = imgEl
      ? await page.evaluate((el) => el.getAttribute("src"), imgEl)
      : "no image available";
  } catch (err) {
    // img remains null if an error occurs
  }

  try {
    const featuresEl = await page.$("#features_info");
    cragInfo.features = featuresEl
      ? await page.evaluate(
          (el) =>
            el.innerText
              .replace(/\n/g, " ")
              .replace("Crag features", "")
              .trim(),
          featuresEl,
        )
      : "No features information available";
  } catch (err) {
    // features remains null if an error occurs
  }

  try {
    const approachEl = await page.$("#approach_info");
    cragInfo.approach = approachEl
      ? await page.evaluate(
          (el) =>
            el.innerText
              .replace(/\n/g, " ")
              .replace("Approach notes", "")
              .trim(),
          approachEl,
        )
      : "No approach information available";
  } catch (err) {
    // approach remains null if an error occurs
  }

  try {
    const accessNoteEl = await page.$("#access_notes");
    const accessNote = accessNoteEl
      ? await page.evaluate((el) => el.innerText, accessNoteEl)
      : "No Access Issues";
    if (accessNote.includes("Access Banned")) {
      cragInfo.accessType = 3;
    } else if (accessNote.includes("Restricted Access")) {
      cragInfo.accessType = 2;
    } else if (accessNote.includes("Access Advice")) {
      cragInfo.accessType = 1;
    }
    if (cragInfo.accessType !== 0) {
      cragInfo.accessNote =
        cragInfo.accessType > 1
          ? accessNote
              .replace(/\n/g, " ")
              .replace(/\t/g, " ")
              .split("Click here for RAD Access Notes")[0]
              .split(".st1")[0]
              .slice(1)
              .trim()
          : accessNote
              .replace(/\n/g, " ")
              .replace(/\t/g, " ")
              .split("Click here for RAD Access Notes")[0]
              .split(".st1")[0]
              .trim()
              .slice(1)
              .trim();
    }
  } catch (err) {}
  return cragInfo;
};

(async () => {
  try {
    const crags = await axios.get("http://localhost:3000/getAll");
    for (const crag of crags.data) {
      // check whether cragInfo exist by calling the get request to the server
      const cragInfoExist = await axios.get(
        `http://localhost:3000/crags/cragInfoExists/cragID/${crag.cragID}`,
      );
      if (cragInfoExist.status === 200) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const pageURL = `https://www.ukclimbing.com/${crag.ukcURL}`;
        const cragInfo = await evaluateCrag(page, pageURL);
        cragInfo.cragID = crag.cragID;
        await axios.post("http://localhost:3000/addCragInfo", {
          cragInfoData: cragInfo,
        });
        await browser.close();
      }
    }
  } catch (err) {
    console.error("Error in main block:", err);
  }
})();
