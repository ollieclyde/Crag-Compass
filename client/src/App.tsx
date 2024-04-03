import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Crag, SearchState } from "./types/types";
import APIService from "./Api-client-service";
import { SearchResults } from "./components/search-results";
import SearchModal from "./components/search-modal";
import moment from "moment";
import { googleMapLibrary } from "./helpers/googleAPI";
import { useLoadScript } from "@react-google-maps/api";

const GoogleApiKey: string = import.meta.env.VITE_GOOGLE_API;

function App() {
  const [crags, setCrags] = useState<Crag[]>([]);
  const [filteredCrags, setFilteredCrags] = useState<Crag[]>([])
  const currentDateTime = moment().format("YYYY-MM-DDTHH:mm");


  const [searchState, setSearchState] = useState<SearchState>({
    location: "London",
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
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleApiKey,
    libraries: googleMapLibrary,
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      fetchCrags(
        searchState.coords.lng,
        searchState.coords.lat,
        searchState.distRange,
      );
    }
  }, [isLoaded, loadError]);

  const fetchCrags = async (
    lng: string,
    lat: string,
    distRange: number[],
  ): Promise<void> => {
    try {
      const apiResults: Crag[] | undefined = await APIService.getAllCrags(
        lng,
        lat,
        distRange,
      );
      if (apiResults) {
        console.log(apiResults);
        setCrags(apiResults);
        const filtered = apiResults.filter((crag: Crag) => basicFilter(crag));
        setFilteredCrags(filtered);
      }
    } catch (error) {
      console.error("Error fetching crags:", error);
    }
  };

  useEffect(() => {
    const filtered = crags.filter((crag) => basicFilter(crag));
    setFilteredCrags(filtered);
  }, [searchState, crags]);

  const basicFilter = (crag: Crag) => {
    const { numOfRoutes, climbingType, rockType } = searchState;

    const minRoutes = Number(numOfRoutes[0]);
    const maxRoutes = numOfRoutes[1] !== 500 ? Number(numOfRoutes[1]) : Infinity;
    const routeCount = Number(crag.routeCount);

    if (!routeCount || routeCount < minRoutes || routeCount > maxRoutes) {
      return false;
    }

    if (rockType[0] !== "all" && !rockType.includes(crag.rockType)) {
      return false;
    }

    if (!crag.cragStats || Object.values(crag.cragStats).every(val => val === 0)) {
      return false;
    }

    if (climbingType[0] !== "all") {
      const climbingTypeMatch = crag.climbingType.some(cragType =>
        climbingType.includes(cragType.name.toLowerCase())
      );
      if (!climbingTypeMatch) return false;
    }

    return true;
  };


  return (
    <Box height="100vh" width="100vw">
      <Flex
        as="nav"
        height="14%"
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
          <Text fontSize="30px" fontWeight="bold">
            Crag Compass
          </Text>
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
      <VStack as="section" flex="1" paddingY="20px">
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