const puppeteer = require("puppeteer");

const axios = require("axios").default;

const baseURL = "https://www.ukclimbing.com/";

class SearchRes {
  constructor() {
    this.name = null;
    this.location = null;
    this.country = null;
    this.osx = null;
    this.osy = null;
    this.faces = null;
    this.ukcURL = null;
    this.rockType = null;
    this.climbingTypes = [];
    this.routeCount = null;
  }
}

const search = async (browser, pageUrl) => {
  try {
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("tbody");

    const table = await page.$("tbody");
    const searchResults = await table.$$("tr");

    const results = [];
    for (const item of searchResults) {
      const result = await parseTableRow(item, page);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error("An error occurred while scraping:", error);
    return null;
  }
};

const parseTableRow = async (item, page) => {
  const newSearchRes = new SearchRes();
  const title = await item.$("a");
  newSearchRes.name = await page.evaluate((el) => el.innerText, title);
  newSearchRes.ukcURL = await page.evaluate(
    (el) => el.getAttribute("href"),
    title,
  );

  const allClasses = await item.$$("td.all");
  for (let i = 0; i < allClasses.length; i++) {
    if (i === 1) {
      const routes = await page.evaluate((el) => el.innerText, allClasses[i]);
      newSearchRes.routeCount = +routes;
      const facesElement = await allClasses[i].$("span.d-md-none");
      const facesAndArtificial = await page.evaluate(
        (el) => el.innerText,
        facesElement,
      );
      const newRockType = facesAndArtificial
        .replaceAll("\n", "")
        .replaceAll("\t", "")
        .split("Rock:");
      newSearchRes.rockType =
        newRockType[1] !== "-" ? newRockType[1].toLowerCase() : "unknown";
      const newFaces = newRockType[0].split(" ")[1];
      newSearchRes.faces = newFaces !== "-" ? newFaces : "unknown";
    }
  }

  const locations = await item.$$("td.min-brkpntxl.dtr-hidden");
  for (let i = 0; i < locations.length; i++) {
    if (i === 0) {
      newSearchRes.location = await page.evaluate(
        (el) => el.innerText,
        locations[i],
      );
    } else if (i === 1) {
      newSearchRes.country = await page.evaluate(
        (el) => el.innerText,
        locations[i],
      );
    } else if (i === 2) {
      const climbingTypes = await locations[i].$$("i");
      const res = [];
      for (let j = 0; j < climbingTypes.length; j++) {
        const item = await page.evaluate((el) => {
          const title = el.getAttribute("title");
          if (!title) return 1;
          if (title === "Bouldering") return 2;
          if (title === "Trad") return 3;
          if (title === "Sport") return 4;
          if(title === "Top Rope") return 5;
        }, climbingTypes[j]);

        if (item) {
          res.push(item);
        }
      }
      if (res.length < 1) {
        newSearchRes.climbingTypes = [4];
      } else {
        newSearchRes.climbingTypes.push(...res);
      }
    }
  }

  const mapMarker = await item.$("td.min-brkpntlg i");
  newSearchRes.osx = await page.evaluate(
    (el) => el.getAttribute("data-osx"),
    mapMarker,
  );
  newSearchRes.osy = await page.evaluate(
    (el) => el.getAttribute("data-osy"),
    mapMarker,
  );

  return newSearchRes;
};

// main function which will scrape the data base through Search and the post that data to the database
(async () => {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const pageURL =
      "https://www.ukclimbing.com/logbook/crags/?location=London&distance=100";
    const searchResults = await search(browser, pageURL);

    if (searchResults && searchResults.length > 0) {
      for (const result of searchResults) {
        try {
          await axios.post("http://localhost:3000/addCrag", { crag: result });
        } catch (err) {
          console.error("Error posting data to the server:", err);
        }
      }
    } else {
      console.log("No elements found or an error occurred.");
    }
  } catch (err) {
    console.error("Error in main block:", err);
  } finally {
    await browser.close();
  }
})();