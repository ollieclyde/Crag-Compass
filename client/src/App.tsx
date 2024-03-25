import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import moment from "moment";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import APIService from "./Api-client-service";
import { Crag, Coords } from "./types/types";
import { SearchResults } from "./components/search-results";
import "./App.css";
import { GeocodeResult } from "use-places-autocomplete";
import SearchModal from "./components/search-modal";

const GoogleApiKey: string = import.meta.env.VITE_GOOGLE_API;
const googleMapLibrary: Libraries = ["places"];

function App() {

  const [crags, setCrags] = useState<Crag[]>([]);
  const [filteredCrags, setFilteredCrags] = useState<Crag[]>([]);
  
  const [location, setLocation] = useState<string>("London");
  const [currentLocation, setCurrentLocation] = useState<string>("London");
  const [currentCoords, setCurrentCords] = useState<Coords>({
    lat: "51.509865",
    lng: "-0.118092",
  });
  const currentDateTime = moment().format("YYYY-MM-DDTHH:mm");
  const [departureDate, setDepartureDate] = useState<string>(currentDateTime);
  const [climbingType, setClimbingType] = useState<string[]>(["all"]);
  const [rockType, setRockType] = useState<string[]>(["all"]);
  const [numOfRoutes, setNumOfRoutes] = useState<number[]>([0, 250]);
  const [distRange, setDistRange] = useState<number[]>([0, 50]);
  const [searchedDistRange, setSearchedDistRange] = useState<number[]>([0, 50]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleApiKey,
    libraries: googleMapLibrary,
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      fetchCrags(currentCoords.lng, currentCoords.lat);
    }
  }, [isLoaded, loadError]);

  const fetchCrags = async (lng: string, lat: string): Promise<void> => {
    try {
      if (currentCoords) {
        const apiResults: Crag[] | undefined = await APIService.getAllCrags(
          lng,
          lat,
          distRange,
        );
        if (apiResults) {
          setCrags(apiResults);
          const filtered = apiResults.filter((crag: Crag) => basicFilter(crag));
          setFilteredCrags(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching crags:", error);
    }
  };

  // Use of Google Maps Geocode
  const geocodeLocation = async (
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

  const handleCheckboxChange = (
    setter: Function,
    values: (string | number)[],
  ) => {
    const flag = values.includes("all");
    if (values[0] === "all" && values.length > 1) {
      setter(values.filter((value) => value !== "all"));
    } else if (!flag) {
      setter(values);
    } else {
      setter(["all"]);
    }
  };

  const searchHandler = async () => {
    // Only call database if distance or location change otherwise just filter
    if (
      location !== currentLocation ||
      distRange[0] !== searchedDistRange[0] ||
      distRange[1] !== searchedDistRange[1]
    ) {
      setCurrentLocation(location);
      setSearchedDistRange(distRange);
      const coords = await geocodeLocation(location);
      if (coords) {
        fetchCrags(coords.lng, coords.lat);
        setCurrentCords(coords);
      }
    } else {
      const filtered = crags.filter((crag) => basicFilter(crag));
      setFilteredCrags(filtered);
    }
    onClose();
  };

  const basicFilter = (crag: Crag) => {
    // check that the crag has the correct number of routes
    const minRoutes = +numOfRoutes[0];
    const maxRoutes = +numOfRoutes[1] !== 500 ? +numOfRoutes[1] : 1000000;
    if (crag.routeCount === "?") {
      return false;
    }
    if (+crag.routeCount < minRoutes || +crag.routeCount > maxRoutes) {
      return false;
    }
    // check that the crag has the correct rocktype
    if (rockType[0] !== "all") {
      if (!rockType.includes(crag.rockType)) {
        return false;
      }
    }
    //check that the crag has the correct climbingtype
    if (!climbingType.includes("all")) {
      let flag = false;
      for (let type of climbingType) {
        for (let i = 0; i < crag.climbingType.length; i++) {
          if (crag.climbingType[i].name.toLowerCase() === type) {
            flag = true;
          }
        }
      }
      if (!flag) return flag;
    }
    return true;
  };

  return (
    <>
      <div className="page-root">
        <nav className="nav-bar">
          <div className="title-logo-container">
            <div className="logo-container">
              <img
                src="../assets/logo.png"
                alt="A logo design for a climbing application named 'Crag Compass"
              />
            </div>
            <div className="header-container">
              <h1 className="title-text"> Crag Compass</h1>
            </div>
          </div>
          <SearchModal
            location={location}
            setLocation={setLocation}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            climbingType={climbingType}
            setClimbingType={setClimbingType}
            rockType={rockType}
            setRockType={setRockType}
            numOfRoutes={numOfRoutes}
            setNumOfRoutes={setNumOfRoutes}
            distRange={distRange}
            setDistRange={setDistRange}
            searchHandler={searchHandler}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            handleCheckboxChange={handleCheckboxChange}
            currentDateTime={currentDateTime}
          />
        </nav>
        <section className="main-content">
          <SearchResults
            filteredCrags={filteredCrags}
            cragCount={filteredCrags.length}
            setFilteredCrags={setFilteredCrags}
            date={departureDate}
          />
        </section>
      </div>
    </>
  );
}

export default App;

/*
Code to deal with driving distance and grades
const distanceMatrix = async (originCoords: Coords, destinationCoords: Coords) => {
  const origin = new google.maps.LatLng(+originCoords.lat, +originCoords.lng);
  const destination = new google.maps.LatLng(+destinationCoords.lat, +destinationCoords.lng);
  const service = new google.maps.DistanceMatrixService()
  const request: any = {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: departureDate
    }
  }
  try {
    const results: any = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (results, status) => {
        if (status === 'OK') {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
    const timeInSecs = results?.rows[0]?.elements[0].duration_in_traffic?.value
    if (timeInSecs) {
      return timeInSecs;
    } else {
      return 'unknown'
    }
  } catch (err) {
    console.error(`Google distance matrix error: ${err} `)
  }
}
 <FormLabel>Grade Range</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
                      min={0}
                      max={sportGrade.length - 1}
                      defaultValue={[10, 20]}
                      minStepsBetweenThumbs={1}
                      onChange={handleGradeChange}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} >
                        <div className='grade-slider-value'>
                          <p>{gradeRange[0]}</p>
                        </div>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <div className='grade-slider-value'>
                          <p>{gradeRange[1]}</p>
                        </div>
                      </RangeSliderThumb>
                    </RangeSlider> */

// const handleGradeChange = (values: number[]) => {
//   const newGradeRange = [sportGrade[values[0]], sportGrade[values[1]]];
//   setGradeRange(newGradeRange);
// }
