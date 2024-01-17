
### Crag Compass

This is web application which allows users to search for rock climbing crags using the following techstack:




![Alt text](<readMeAssets/Screenshot 2024-01-16 at 18.55.12.png>)






### Key information

Types are certainly still very loose and will need refining. For example, I had hoped to calculated driving time but due to the cost of the number of API calls I changed to simply using distance in KM. Analysis of the datastructure at hand the appropriate types will be needed.


Additional Information:
crag.osx = longitude
crag.oxy = latitude.

Happy to jump on a call to explain any of this further.

### Next features to be implements
- Better Modularise the Nav bar and the Modal component
- Add all the route data for each individual crag. This would involve improving the webscraper to take the individual crag url from UKC and webscraping information such as each route, how many stars they have (or how popular the routes or the crag is), crag description, whether access is allowed, partially permitted or denied and even approach (walking) time.
- Feature for the user to favourite certain crags. Within the favourite list(this could be an additional navigation feature) more information can be displayed as well as driving time between crags to help them decide which one could be best for them.
- Autocomplete on the location input to ensure only appropriate address for the geocode converter to work.
- Guarantee that only dates in the future and within the 7 days weather forecast period are allowed.
- Display better weather data from the weather URL currently being used.

This app would be a good refactor if you are interested in working with SQL database as adding crags route information would be an interesting task in relational databases. It would also be good in learning about Typescript and a good task to ensure there are no `any` left!

### Client
- Move into client folder: `cd client`
-  Run `npm i`
- To run the front-end: `npm run dev`

### Server
- Move into server folder: `cd server`
- Run `npm i`
- Change any config information in the .config.js file, such as username and password for you PostgreSQL account - ensure you have PostGreSQL set up
- To run the server: `npm run dev`
- Please ignore the migrations folder - the setup I used happened to great migration options if you wanted to move in js from typescript

### Webscraper
To fill the database with data follow these instructions:
 1. Ensure the server is running properly
 2. Move into the webscraper foler: `cd webscraper`
 3. Run `npm i`
 4. Determine what set of information you want to scrape. For Example, the current URL is 'https://www.ukclimbing.com/logbook/crags/?location=Leeds&distance=50'. This will get all the crags within 50 miles of Leeds. (you beed to ensure the database is up an running and accepting requests)
 5. Run `node script.js` to run the script and scrape the data as well as the scraped data to your database.

