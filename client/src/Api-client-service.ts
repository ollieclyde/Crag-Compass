import axios from 'axios'

const apiClientService: any = {}

apiClientService.getAllCrags = async (lng: string, lat: string, maxDist: number[]) => {
  try {
    const allCrags = await axios.get(`http://localhost:3000/crags/${lng}/${lat}/${maxDist}`)
    return allCrags.data
  } catch (err) {
    console.error('Error posting data to the server:', err);
  }
}


export default apiClientService