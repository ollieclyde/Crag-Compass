const puppeteer = require("puppeteer");
const axios = require("axios").default;

class Route {
  constructor() {
    this.cragID = null;
    this.name = 'Unknown';
    this.grade = 'Unknown';
    this.climbingTypeID = 1;
    this.stars = 0;
    this.logs = 0;
  }
}

class CragInfo {
  constructor() {
    this.cragID = null;
    this.img = 'No image available';
    this.features = 'No features information available';
    this.approach = 'No approach information available';
    this.accessType = 0;
    this.accessNote = 'No Access Issues';
  }
}

const evaluateCrag = async (page, pageURL) => {
  await page.goto(pageURL, { waitUntil: "domcontentloaded" });
  const cragInfo = new CragInfo();

  try {
    const cragThumb = await page.$("#crag_thumb");
    const imgEl = cragThumb ? await cragThumb.$("img") : null;
    cragInfo.img = imgEl ? await page.evaluate(el => el.getAttribute("src"), imgEl) : 'no image available';
  } catch (err) {
    // img remains null if an error occurs
  }

  try {
    const featuresEl = await page.$("#features_info");
    cragInfo.features = featuresEl ? await page.evaluate(el => el.innerText.replace(/\n/g, " ").replace('Crag features', "").trim(), featuresEl) : 'No features information available';
  } catch (err) {
    // features remains null if an error occurs
  }

  try {
    const approachEl = await page.$("#approach_info");
    cragInfo.approach = approachEl ? await page.evaluate(el => el.innerText.replace(/\n/g, " ").replace('Approach notes', "").trim(), approachEl) : 'No approach information available';
  } catch (err) {
    // approach remains null if an error occurs
  }

  try {
    const accessNoteEl = await page.$("#access_notes");
    const accessNote = accessNoteEl ? await page.evaluate(el => el.innerText, accessNoteEl) : "No Access Issues";
    if (accessNote.includes("Access Banned")) {
      cragInfo.accessType = 3;
    } else if (accessNote.includes("Restricted Access")) {
      cragInfo.accessType = 2;
    } else if (accessNote.includes("Access Advice")) {
      cragInfo.accessType = 1;
    }
    if (cragInfo.accessType !== 0) {
      cragInfo.accessNote = cragInfo.accessType > 1 ? accessNote.replace(/\n/g, " ").replace(/\t/g, " ").split('Click here for RAD Access Notes')[0].split('.st1')[0].slice(1).trim() : accessNote.replace(/\n/g, " ").replace(/\t/g, " ").split('Click here for RAD Access Notes')[0].split('.st1')[0].trim().slice(1).trim();
    }
  } catch (err) {
  }
  return cragInfo
}

const getRoutes = async (page, pageURL) => {
  await page.goto(pageURL, { waitUntil: "domcontentloaded" });
  const routesResults = [];

  try {
    await page.waitForSelector("#table_container");
    const tableContainer = await page.$("#table_container");
    if (!tableContainer) return routesResults; // Exit if table container is not found

    const table = await tableContainer.$("tbody");
    if (!table) return routesResults; // Exit if table body is not found

    const routes = await table.$$("tr");

    for (const row of routes) {
      const cols = await row.$$("td");
      const route = new Route();

      for (let i = 0; i < cols.length; i++) {
        try {
          if (i === 2) {
            route.name = await page.evaluate(el => el.innerText, cols[i]);
          } else if (i === 3) {
            route.grade = await page.evaluate(el => el.innerText, cols[i]);
          } else if (i === 4) {
            const iElement = await cols[i].$("i");
            route.stars = iElement ? await page.evaluate(el => Number(el.getAttribute("title").split(' ')[0]), iElement) : 0;
          } else if (i === 5) {
            const iElement = await cols[i].$("i");
            route.climbingTypeID = iElement ? await page.evaluate(el => {
              const title = el.getAttribute("title");
              if (!title) return 1;
              if (title === "Bouldering" || title === "Boulder Circuit") return 2;
              if (title === "Trad") return 3;
              if (title === "Sport") return 4;
              if(title === "Top Rope") return 5;
            }, iElement) : 1;
          } else if (i === 6) {
            route.logs = Number(await page.evaluate(el => el.innerText, cols[i]));
          }
        } catch (err) {
          // Log error or handle as needed
        }
      }
      routesResults.push(route);
    }
  } catch (err) {
    // Handle error or log as needed
  }

  return routesResults;
};

const addCragInfo = async (crag, browser) => {
  const page = await browser.newPage()
  const cragInfo = await evaluateCrag(page, `https://www.ukclimbing.com/${crag.ukcURL}`)
  cragInfo.cragID = crag.cragID
  await axios.post("http://localhost:3000/addCragInfo", { crag: cragInfo });
}

(async () => {
  try {
    const crags = await axios.get("http://localhost:3000/getAll");
    for (const crag of crags.data) {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage()
      const pageURL = `https://www.ukclimbing.com/${crag.ukcURL}`;

      const cragInfo = await evaluateCrag(page, pageURL)
      cragInfo.cragID = crag.cragID
      await axios.post("http://localhost:3000/addCragInfo", { cragInfoData: cragInfo });

      // const routes = await getRoutes(page, pageURL)

      // for (const route of routes) {
      //   route.cragID = crag.cragID
      //   if (route.climbingType && route.grade !== 'Unknown' && route.name !== 'Unknown') {
      //     await axios.post("http://localhost:3000/addRoute", { routeData: route });
      //   }
      // }
      await browser.close();
    }

  } catch (err) {
    console.error("Error in main block:", err);
  }
})();
