
### Crag Compass

Crag Compass is an innovative web application designed to assist climbers in discovering new climbing locations and crags around the world. It offers an intuitive interface that enables users to easily search for climbing spots based on their preferences, including location, difficulty level, weather and type of climbing (such as bouldering, sport climbing, or traditional climbing). Whether you're a seasoned climber looking for a new challenge or a beginner eager to explore the climbing world, Crag Compass is your go-to resource for finding the perfect crag.

- Initialised frontend and backend in React with Vite, Typescript, Express, Sequelize and PostgreSQL.
- Utilised Puppeteer to web-scrape and fill the database with relevant information for the application.
- Implemented multiples APIs for the location, weather and directions.





![Alt text](<readMeAssets/Crag-Compass-Screenshot>)





### Next features to be implements
- Better Modularisation of the Nav bar and the Modal component
- Add all the route data for each individual crag. This would involve improving the webscraper to take the individual crag url from UKC and webscraping information such as each route, how many stars they have (or how popular the routes or the crag is), crag description, whether access is allowed, partially permitted or denied and even approach (walking) time.
- Feature for the user to favourite certain crags. Within the favourite list(this could be an additional navigation feature) more information can be displayed as well as driving time between crags to help them decide which one could be best for them.
- Autocomplete on the location input to ensure only appropriate address for the geocode converter to work.
- Display better weather data from the weather URL currently being used - enrich what is already there

### Client
- Move into client folder: `cd client`
-  Run `npm i`
- To run the front-end: `npm run dev`

### Server
- Move into server folder: `cd server`
- Run `npm i`
- Change any config information in the .config.js file, such as username and password for you PostgreSQL account - ensure you have PostGreSQL set up
- To run the server: `npm run dev`

### Webscraper
To fill the database with data follow these instructions:
 1. Ensure the server is running properly
 2. Move into the webscraper foler: `cd webscraper`
 3. Run `npm i`
 4. Determine what set of information you want to scrape. For Example, the current URL is 'https://www.ukclimbing.com/logbook/crags/?location=Leeds&distance=50'. This will get all the crags within 50 miles of Leeds. (you beed to ensure the database is up an running and accepting requests)
 5. Run `node script.js` to run the script and scrape the data as well as the scraped data to your database.

