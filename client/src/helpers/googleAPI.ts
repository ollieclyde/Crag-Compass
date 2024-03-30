import { GeocodeResult } from "use-places-autocomplete";
import { Coords } from "../types/types";

export const geocodeLocation = async (
  address: string,
): Promise<Coords | undefined> => {
  const geocoder = new google.maps.Geocoder();
  try {
    const results: GeocodeResult[] | null = await new Promise(
      (resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK") {
            resolve(results);
          } else {
            reject(status);
          }
        });
      },
    );
    if (results && results[0]) {
      return {
        lat: results[0].geometry.location.lat().toString(),
        lng: results[0].geometry.location.lng().toString(),
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(
      `Geocode was not successful for the following reason: ${error}`,
    );
  }
};