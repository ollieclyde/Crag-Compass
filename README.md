
### Crag Compass

This is web application which allows users to search for rock climbing crags using the following techstack:




![Alt text](<readMeAssets/Screenshot 2024-01-16 at 18.55.12.png>)






### Key information

Types are certainly still very loose and will need refining. Some information on the data at hand. crag.osx = longitude and crag.oxy = latitude.



### Main Tasks Left





### Client
- Move into client folder: `cd client`
- To run the front-end: `npm run dev`

### Server
- Move into server folder: `cd server`
- Change any config information in the .config.js file, such as username and password for you PostgreSQL account
- To run the server: `npm run dev`

### Webscraper
To fill the database with data follow these instructions:
 1. Ensure the server is running properly
 2. Move into the webscraper foler: `cd webscraper`
 3. Determine what set of information you want to scrape. For Example, the current URL is 'https://www.ukclimbing.com/logbook/crags/?location=Leeds&distance=50'. This will get all the crags within 50 miles of Leeds.
 4. Run `node script.js` to run the script and push the scraped data to your database.

