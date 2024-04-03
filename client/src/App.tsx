import { useEffect, useState } from "react";
import {
  Box, Flex, Image, Text, useDisclosure, VStack
} from '@chakra-ui/react';
import moment from "moment";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import APIService from "./Api-client-service";
import { Crag, SearchState } from "./types/types";
import { SearchResults } from "./components/search-results";
import "./App.css";
import { GeocodeResult } from "use-places-autocomplete";
import SearchModal from "./components/search-modal";

const GoogleApiKey: string = import.meta.env.VITE_GOOGLE_API;
const googleMapLibrary: Libraries = ["places"];

function App() {

  const [crags, setCrags] = useState<Crag[]>([]);
  const [filteredCrags, setFilteredCrags] = useState<Crag[]>([]);

  const currentDateTime = moment().format("YYYY-MM-DDTHH:mm");
  const [searchState, setSearchState] = useState<SearchState>(
    {
      location: 'London',
      coords: {
        lat: "51.509865",
        lng: "-0.118092",
      },
      departureDate: currentDateTime,
      daysFromNow: 0,
      climbingType: ["all"],
      rockType: ["all"],
      numOfRoutes: [0, 250],
      distRange: [0, 50],
    }
  )
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleApiKey,
    libraries: googleMapLibrary,
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      fetchCrags(searchState.coords.lng, searchState.coords.lat, searchState.distRange);
    }
  }, [isLoaded, loadError]);

  const fetchCrags = async (lng: string, lat: string, distRange: number[]): Promise<void> => {
    try {
      if (lng && lat) {
        const apiResults: Crag[] | undefined = await APIService.getAllCrags(
          lng,
          lat,
          distRange,
        );
        if (apiResults) {
          console.log(apiResults)
          setCrags(apiResults);
          const filtered = apiResults.filter((crag: Crag) => basicFilter(crag));
          setFilteredCrags(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching crags:", error);
    }
  };

  useEffect(() => {
    const filtered = crags.filter((crag) => basicFilter(crag));
    setFilteredCrags(filtered);
  }, [searchState])

  const basicFilter = (crag: Crag) => {
    const { numOfRoutes, climbingType, rockType } = searchState;

    const minRoutes = +numOfRoutes[0];
    const maxRoutes = +numOfRoutes[1] !== 500 ? +numOfRoutes[1] : 1000000;
    if (!crag.routeCount) {
      return false;
    }
    if (+crag.routeCount < minRoutes || +crag.routeCount > maxRoutes) {
      return false;
    }
    if (rockType[0] !== "all") {
      if (!rockType.includes(crag.rockType)) {
        return false;
      }
    }
    const stats = crag.cragStats;
    if (!stats || Object.values(stats).every(val => val === 0)) {
      return false;
    }

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
    <Box height="100vh" width="100vw">
      <Flex
        as="nav"
        height="18%"
        border="5px"
        backgroundColor="white"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="0 2px 6px lightgray"
        paddingX="50px"
      >
        <Flex alignItems="center" gap="2rem">
          <Image
            src="../assets/logo.png"
            alt="A logo design for a climbing application named 'Crag Compass"
            boxSize="100px"
            borderRadius="full"
            objectFit="cover"
          />
          <Text fontSize="30px" fontWeight="bold">Crag Compass</Text>
        </Flex>
        <SearchModal
          searchState={searchState}
          setSearchState={setSearchState}
          fetchCrags={fetchCrags}
          basicFilter={basicFilter}
          setFilteredCrags={setFilteredCrags}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </Flex>
      <VStack
        as="section"
        flex="1"
        paddingY="20px"
      >
        <SearchResults
          filteredCrags={filteredCrags}
          cragCount={filteredCrags.length}
          setFilteredCrags={setFilteredCrags}
          daysFromNow={searchState.daysFromNow}
        />
      </VStack>
    </Box>
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