const puppeteer = require("puppeteer");

class Route {
  constructor() {
    this.name = null;
    this.grade = null;
    this.climbingType = null;
    this.stars = null;
    this.logs = null;
  }
}

const getRoutes = async (page, pageURL) => {
  await page.goto(pageURL, { waitUntil: "domcontentloaded" });
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
          console.log(title, 'title')
          if (title === "Bouldering") return 1;
          if (title === "Trad") return 2;
          if (title === "Sport") return 3;
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
      "https://www.ukclimbing.com/logbook/crags/curbar_edge-21/";

    const res = await getRoutes(page, pageURL)
    console.log(res)

  } catch (err) {
    console.error("Error in main block:", err);
  } finally {
    await browser.close();
  }
})();
