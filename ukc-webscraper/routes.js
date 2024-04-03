const puppeteer = require("puppeteer");
const axios = require("axios").default;

class Route {
  constructor() {
    this.cragID = null;
    this.name = "Unknown";
    this.grade = "Unknown";
    this.climbingTypeID = 1;
    this.stars = 0;
    this.logs = 0;
  }
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
            route.name = await page.evaluate((el) => el.innerText, cols[i]);
          } else if (i === 3) {
            route.grade = await page.evaluate((el) => el.innerText, cols[i]);
          } else if (i === 4) {
            const iElement = await cols[i].$("i");
            route.stars = iElement
              ? await page.evaluate(
                  (el) => Number(el.getAttribute("title").split(" ")[0]),
                  iElement,
                )
              : 0;
          } else if (i === 5) {
            const iElement = await cols[i].$("i");
            route.climbingTypeID = iElement
              ? await page.evaluate((el) => {
                  const title = el.getAttribute("title");
                  if (!title) return 1;
                  if (title === "Bouldering" || title === "Boulder Circuit")
                    return 2;
                  if (title === "Trad") return 3;
                  if (title === "Sport") return 4;
                  if (title === "Top Rope") return 5;
                }, iElement)
              : 1;
          } else if (i === 6) {
            route.logs = Number(
              await page.evaluate((el) => el.innerText, cols[i]),
            );
          }
        } catch (err) {
          console.error("Error processing routes:", err);
        }
      }
      routesResults.push(route);
    }
  } catch (err) {
    console.error("Error processing routes:", err);
  }
  return routesResults;
};

(async () => {
  try {
    const crags = await axios.get("http://localhost:3000/getAll");
    for (const crag of crags.data) {
      const cragRoutesExist = await axios.get(
        `http://localhost:3000/crags/cragRoutesExist/cragID/${crag.cragID}`,
      );

      if (cragRoutesExist.status === 200) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const pageURL = `https://www.ukclimbing.com/${crag.ukcURL}`;
        const routes = await getRoutes(page, pageURL);
        for (const route of routes) {
          route.cragID = crag.cragID;
          if (route.grade !== "Unknown" && route.name !== "Unknown") {
            console.log("test");
            console.log(
              route.name,
              route.grade,
              route.climbingTypeID,
              route.stars,
              route.logs,
            );
            await axios.post("http://localhost:3000/addRoute", {
              routeData: route,
            });
          }
        }
        await browser.close();
      }
    }
  } catch (err) {
    console.error("Error in main block:", err);
  }
})();
