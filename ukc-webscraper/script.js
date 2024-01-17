const puppeteer = require('puppeteer');

const axios = require('axios').default;

const baseURL = 'https://www.ukclimbing.com/';

class SearchRes {
  constructor() {
    this.cragName = null;
    this.location = null;
    this.country = null;
    this.osx = null;
    this.osy = null;
    this.ukcURL = null;
    this.climbingTypes = [];
  }
}

class CragInfo {
  constructor(name, location, country, ukcURL, osx, osy) {
    this.name = name;
    this.climbs = null;
    this.location = location;
    this.country = country;
    this.ukcURL = ukcURL;
    this.rocktype = null;
    this.altitude = null;
    this.faces = null;
    this.googleURL = null;
    this.osx = osx;
    this.osy = osy;
    this.routes = []
  }
}

class Route {
  constructor(name) {
    this.cragName = name;
    this.routeName = null;
    this.grade = null;
    this.stars = null;
    this.type = null;
  }
}

const search = async function (browser, pageUrl) {
  try {
    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('tbody');

    const table = await page.$('tbody');
    const searchResults = await table.$$('tr');

    const results = [];
    for (const item of searchResults) {
      const result = await parseTableRow(item, page);
      results.push(result);
    }

    return results;
  } catch (error) {
    console.error('An error occurred while scraping:', error);
    return null;
  }
};

const parseTableRow = async (item, page) => {
  const newSearchRes = new SearchRes();
  const title = await item.$('a');
  newSearchRes.cragName = await page.evaluate(el => el.innerText, title);
  newSearchRes.ukcURL = await page.evaluate(el => el.getAttribute('href'), title);

  const allClasses = await item.$$('td.all')
  for (let i = 0; i < allClasses.length; i++) {
    if (i === 1) {
      const routes = await page.evaluate(el => el.innerText, allClasses[i])
      newSearchRes.routes = +routes;
      const facesElement = await allClasses[i].$('span.d-md-none')
      const facesAndArtificial = await page.evaluate(el => el.innerText, facesElement)
      const newRockType = facesAndArtificial.replaceAll('\n', '').replaceAll('\t', '').split('Rock:')
      newSearchRes.rocktype = newRockType[1] !== '-' ? newRockType[1].toLowerCase() : 'unknown';
      const newFaces = newRockType[0].split(' ')[1]
      newSearchRes.faces = newFaces !== '-' ? newFaces : 'unknown'
    }
  }


  const locations = await item.$$('td.min-brkpntxl.dtr-hidden');
  for (let i = 0; i < locations.length; i++) {
    if (i === 0) {
      newSearchRes.location = await page.evaluate(el => el.innerText, locations[i]);
    } else if (i === 1) {
      newSearchRes.country = await page.evaluate(el => el.innerText, locations[i]);
    } else if (i === 2) {
      const climbingTypes = await locations[i].$$('i')
      const res = [];
      for (let j = 0; j < climbingTypes.length; j++) {
        const item = await page.evaluate((el) => {
          const title = el.getAttribute('title')
          console.log(title, 'title')
          if (title === 'Bouldering') return 1
          if (title === 'Trad') return 2
          if (title === 'Sport') return 3
        }, climbingTypes[j])

        if (item) {
          res.push(item);
        }
      }
      if (res.length < 1) {
        newSearchRes.climbingTypes = [4]
      } else {
        newSearchRes.climbingTypes.push(...res)
      }
    }
  }

  const mapMarker = await item.$('td.min-brkpntlg i');
  newSearchRes.osx = await page.evaluate(el => el.getAttribute('data-osx'), mapMarker);
  newSearchRes.osy = await page.evaluate(el => el.getAttribute('data-osy'), mapMarker);

  return newSearchRes;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const pageURL = 'https://www.ukclimbing.com/logbook/crags/?location=Leeds&distance=50';
    const searchResults = await search(browser, pageURL);

    console.log(searchResults)

    if (searchResults && searchResults.length > 0) {

      for (const result of searchResults) {
        try {
          await axios.post('http://localhost:3000/crags', { crag: result });
        } catch (err) {
          console.error('Error posting data to the server:', err);
        }
      }

    } else {
      console.log('No elements found or an error occurred.');
    }
  } catch (err) {
    console.error('Error in main block:', err);
  } finally {
    await browser.close();
  }
})();



// Code to take the individual page of the crag and harvest individual routes information - now out of date will mostly need to be rewritten
const searchCragURL = async (browser, crags) => {
  try {
    const cragPromises = crags.map(async crag => {
      const page = await browser.newPage();
      try {
        await page.goto(baseURL + crag.ukcURL, { waitUntil: 'domcontentloaded' });
        const cragInfo = new CragInfo(crag.cragName, crag.location, crag.country, crag.ukcURL, crag.osx, crag.osy)
        const header = await page.$('p');
        const headerText = await page.evaluate(p => p?.innerText, header);
        const splitHeaderText = headerText.split('\n')

        if (splitHeaderText) {
          cragInfo.climbs = splitHeaderText[0] ? splitHeaderText[0].split(' ')[1] : null;
          cragInfo.rocktype = splitHeaderText[1] ? splitHeaderText[1].split(' ')[1] : null;
          cragInfo.altitude = splitHeaderText[2] ? splitHeaderText[2].split(' ')[1] + ' a.s.l' : null;
          cragInfo.faces = splitHeaderText[3] ? splitHeaderText[3].split(' ')[1] : null;
        }

        const tableWrapper = await page.$('div#table_container')
        const table = await tableWrapper.$('tbody');
        const routes = await table.$$('tr');

        const loopRoutes = async (routes) => {
          const climbs = []
          for (let item of routes) {
            const routeName = await item.$('td.datatable_column_name');
            if (routeName) {
              const route = new Route(crag.name);
              const routeName = await item.$('td.datatable_column_name');
              route.routeName = await page.evaluate(routeName => routeName.innerText, routeName);

              const grade = await item.$('td.datatable_column_grade.small.not-small-md');
              route.grade = await page.evaluate(grade => grade.innerText, grade);

              const stars = await item.$('td.datatable_column_star i');
              if (stars) {
                starsStr = await page.evaluate(stars => stars.getAttribute('title'), stars);
                route.stars = +starsStr.split(' ')[0]
              } else {
                route.stars = 0;
              }

              const type = await item.$('td.datatable_column_type i');
              route.type = await page.evaluate(type => type.getAttribute('title'), type);
              climbs.push(route)
            }
          }
          return climbs;
        }

        const climbs = await loopRoutes(routes);
        cragInfo.routes = climbs;

        return cragInfo;
      } catch (error) {
        console.error(`An error occurred while scraping ${crag}`, error);
      }
    })

    const results = await Promise.all(cragPromises);
    return results.filter(r => r !== undefined);

  } catch (error) {
    console.error(`An error occurred while scraping all crags:`, error);
    return null;
  }
}



const getGoogleMapURL = async (page) => {
  await page.click('a#show_map');
  const OSRefEl = await page.$('a.btn.btn-default.btn-sm');
  const OSRefURL = await page.evaluate(OSRefEl => OSRefEl.getAttribute('href'), OSRefEl);
  return OSRefEl;
}

