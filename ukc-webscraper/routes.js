const puppeteer = require("puppeteer");

class Route {
  constructor() {
    this.id = null;
    this.name = null;
    this.grade = null;
    this.climbingType = null;
    this.stars = null;
    this.logs = null;
  }
}
class CragInfo {
  constructor() {
    this.crag_id = null;
    this.img = null;
    this.features = null;
    this.approach = null;
    this.accessType = null;
    this.accessNotes = null;
  }
}

const evaluateCrag = async (page, pageURL) => {
  await page.goto(pageURL, { waitUntil: "domcontentloaded" });
  const cragInfo = new CragInfo
  let imageFlag = true;

  try {
    await page.waitForSelector("#crag_thumb");
  } catch (err) {
    imageFlag = false;
  }

  if (imageFlag) {
    const cragThumb = await page.$("#crag_thumb");
    const imgEl = await cragThumb.$("img")
    if (!imgEl) {
      cragInfo.img = null;
    } else {
      cragInfo.img = await page.evaluate((el) => el.getAttribute("src"), imgEl);
    }
  }

  const featuresEl = await page.$("#features_info");
  if (!featuresEl) {
    cragInfo.features = null;
  } else {
    const features = await page.evaluate((el) => el.innerText, featuresEl);
    cragInfo.features = features.replace(/\n/g, " ").replace('Crag features', " ").trim();
  }

  const approachEl = await page.$("#approach_info");
  if (!approachEl) {
    cragInfo.approach = null;
  } else {
    const approach = await page.evaluate((el) => el.innerText, approachEl);
    cragInfo.approach = approach.replace(/\n/g, " ").replace('Approach notes', " ").trim();
  }

  const accessNotesEl = await page.$("#access_notes");
  const accessNotes = await page.evaluate((el) => el.innerText, accessNotesEl);
  cragInfo.accessNotes = accessNotes.replace(/\n/g, " ").replace('Get the BMC RAD app', "").trim();

  if (accessNotes.includes("Access Banned")) {
    cragInfo.accessType = 3
    cragInfo.accessNotes = accessNotes.replace(/\n/g, " ").replace(/\t/g, " ").split('Click here for RAD Access Notes')[0].split('.st1')[0].slice(1).trim();
  } else if (accessNotes.includes("Restricted Access")) {
    cragInfo.accessType = 2
    cragInfo.accessNotes = accessNotes.replace(/\n/g, " ").replace(/\t/g, " ").split('Click here for RAD Access Notes')[0].split('.st1')[0].slice(1).trim();
  } else if (accessNotes.includes("Access Advice")) {
    cragInfo.accessType = 1
    cragInfo.accessNotes = accessNotes.replace(/\n/g, " ").replace(/\t/g, " ").split('Click here for RAD Access Notes')[0].split('.st1')[0].trim().slice(1).trim();
  } else {
    cragInfo.accessType = 0
    cragInfo.accessNotes = 'No Access Issues'
  }
  return cragInfo
  // const routes = getRoutes(page);
}

const getRoutes = async (page) => {
  await page.waitForSelector("#table_container");
  const tableContainer = await page.$("#table_container");
  const table = await tableContainer.$("tbody");
  const routes = await table.$$("tr");

  const routesResults = []
  for (const row of routes) {
    const cols = await row.$$("td");

    const route = new Route()
    for (let i = 0; i < cols.length; i++) {
      if (i === 2) {
        route.name = await page.evaluate((el) => el.innerText, cols[i])
      } else if (i === 3) {
        route.grade = await page.evaluate((el) => el.innerText, cols[i])
      } else if (i === 4) {
        const iElement = await cols[i].$("i");
        route.stars = await page.evaluate((el) => {
          if (el) {
            const stars = el.getAttribute("title")
            return Number(stars.split(' ')[0])
          } else {
            return 0;
          }
        }, iElement);
      } else if (i === 5) {
        const iElement = await cols[i].$("i");
        route.climbingType = await page.evaluate((el) => {
          const title = el.getAttribute("title");
          if (!title) return 1;
          if (title === "Bouldering") return 2;
          if (title === "Trad") return 3;
          if (title === "Sport") return 4;
        }, iElement);
      } else if (i === 6) {
        route.logs = await page.evaluate((el) => el.innerText, cols[i])
      }
    }
    routesResults.push(route)
  }
  return routesResults
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage()
    const pageURL =
      "https://www.ukclimbing.com/logbook/crags/gun_cliff-793/";

    const res = await evaluateCrag(page, pageURL)
    console.log(res)

  } catch (err) {
    const error = new CragInfo()
    error.id = null;
    console.error("Error in main block:", err);
    return error
  } finally {
    await browser.close();
  }
})();
