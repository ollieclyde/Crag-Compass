import axios from 'axios'

import { GoogleApiKey } from '../config/api-config.ts'

const apiClientService: any = {}

const geocodeURL: string = 'https://maps.googleapis.com/maps/api/geocode/json?'


apiClientService.getAllCrags = async (lng: string, lat: string,driveLength:number) => {
  try {
    const paramsGetAll = new URLSearchParams({
      lng: lng,
      lat: lat
    })
    const allCrags = await axios.get(`http://localhost:3000/crags/${lng}/${lat}/${driveLength}`)
    return allCrags.data
  } catch (err) {
    console.error('Error posting data to the server:', err);
  }
}


const params = new URLSearchParams({
  key: GoogleApiKey,
  place_id: 'ChIJeRpOeF67j4AR9ydy_PIzPuM'
})

apiClientService.getLocationCoordinates = async () => {

  try {
    const res = await fetch(geocodeURL + params, {
      method: 'GET'
    })
    const resObj = await res.json();

    const coordinates = resObj.results[0].geometry.location

    console.log(coordinates)
    return [coordinates.lat, coordinates.lng];
  } catch (error) {

  }
}


export default apiClientService