import { GeocodeResult } from "use-places-autocomplete";
import { Coords } from "../types/types";
import { Libraries } from "@react-google-maps/api";

export const googleMapLibrary: Libraries = ["places"];

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

export const distanceMatrix = async (
  originCoords: Coords,
  destinationCoords: Coords,
  departureDate: string,
) => {
  const origin = new google.maps.LatLng(+originCoords.lat, +originCoords.lng);
  const destination = new google.maps.LatLng(
    +destinationCoords.lat,
    +destinationCoords.lng,
  );
  const service = new google.maps.DistanceMatrixService();

  const request = {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: new Date(departureDate),
    },
  };
  try {
    const response = await new Promise<google.maps.DistanceMatrixResponse>(
      (resolve, reject) => {
        service.getDistanceMatrix(request, (result, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK) {
            if (result) resolve(result);
          } else {
            reject(new Error(status));
          }
        });
      },
    );

    const timeInSecs =
      response?.rows[0]?.elements[0].duration_in_traffic?.value;
    if (timeInSecs) {
      return timeInSecs;
    } else {
      return "unknown";
    }
  } catch (err) {
    console.error(`Google distance matrix error: ${err} `);
  }
};
