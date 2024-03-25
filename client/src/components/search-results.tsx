import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Text,
  Divider,
  CardHeader,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Crag } from "../types/types";
import { CragFilters } from "./crag-filters";
import WeatherComponent from "./weather-component";
import { IoFilter } from "react-icons/io5";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";

export function SearchResults({
  filteredCrags,
  cragCount,
  setFilteredCrags,
  date,
}: {
  filteredCrags: Crag[];
  cragCount: number;
  setFilteredCrags: Function;
  date: string;
}) {
  const [filterFlag, setFilterFlag] = useState<boolean>(false);
  const [routeFlag, setRouteFlag] = useState<boolean>(false);
  const [distanceFlag, setDistanceFlag] = useState<boolean>(false);
  const [currentPageCrags, setCurrentPageCrags] = useState<Crag[]>([]);

  const filterHandler = () => {
    setFilterFlag(!filterFlag);
  };

  // sort crags on routes - ascending or descending depending on the flag. Also set the current page back to the start.
  const handleRouteFilter = () => {
    const cragsToSort = [...filteredCrags];

    const sortedFilteredCrags = cragsToSort.sort((a, b) => {
      return routeFlag ? +a.routeCount - +b.routeCount : +b.routeCount - +a.routeCount;
    });

    setFilteredCrags(sortedFilteredCrags);
    setRouteFlag(!routeFlag);
    setCurrentPage(0);
  };

  // sort crags by distance - ascending or descending depending on the flag. Also set the current page back to the start.
  const handleDistanceFilter = () => {
    const cragsToSort = [...filteredCrags];

    const sortedFilteredCrags = cragsToSort.sort((a, b) => {
      return distanceFlag ? a.distance - b.distance : b.distance - a.distance;
    });

    setFilteredCrags(sortedFilteredCrags);
    setDistanceFlag(!distanceFlag);
    setCurrentPage(0);
  };

  useEffect(() => {
    const slicedCrags: Crag[] = filteredCrags.slice(0, 10);
    console.log(filteredCrags, "filteredCrags");

    setCurrentPageCrags(slicedCrags);
  }, [filteredCrags, distanceFlag, routeFlag]);

  // state to keep track of which page the user is on.
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // function to determine which page the user is on
  const pageCount = Math.ceil(filteredCrags.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < pageCount - 1) {
      const newPage = currentPage + 1;
      setCurrentPageCrags(
        filteredCrags.slice(
          newPage * itemsPerPage,
          (newPage + 1) * itemsPerPage,
        ),
      );
      setCurrentPage(newPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPageCrags(
        filteredCrags.slice(newPage * itemsPerPage, currentPage * itemsPerPage),
      );
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="search-results">
        <div className="filter-search-results-container">
          <div className="search-filter">
            <IconButton
              variant="none"
              onClick={filterHandler}
              aria-label="Filter"
              icon={<IoFilter />}
            />
            {filterFlag && (
              <CragFilters
                handleDistanceFilter={handleDistanceFilter}
                handleRouteFilter={handleRouteFilter}
                distanceFlag={distanceFlag}
                routeFlag={routeFlag}
              />
            )}
          </div>
          <div className="search-results-number">
            <p>Search results: {cragCount}</p>
          </div>
        </div>
        {Array.isArray(currentPageCrags)
          ? currentPageCrags.map((crag: Crag) => (
              <Card
                className="crag-card"
                key={crag.cragID}
                direction={{ base: "column", sm: "row" }}
                justify="start"
                overflow="hidden"
                variant="elevated"
                colorScheme="teal"
                size="sm"
                height="25vh"
                transition="transform 0.3s ease, box-shadow 0.3s ease, border-width 0.3s ease"
                box-shadow="0px 10px 20px rgba(0, 0, 0, 0.5)"
              >
                <CardHeader className="card-header" padding={0}>
                  <Box className="card-header-text">
                    <Text as="b" fontSize="larger">
                      {" "}
                      {crag.name}{" "}
                    </Text>
                    <Text> {crag.location} </Text>
                    <Text> {crag.country} </Text>
                  </Box>
                </CardHeader>

                <Divider orientation="vertical" variant="solid" />

                <CardBody className="card-body">
                  <Box className="card-body-text">
                    <Text>
                      {" "}
                      Rock Type:{" "}
                      {crag.rockType[0].toUpperCase() +
                        crag.rockType.slice(1)}{" "}
                    </Text>
                    <Box className="climbing-type">
                      <Text>
                        {"Climbing Type: "}
                        {crag.climbingType
                          .map((type) => type.name)
                          .join(", ")}
                      </Text>
                    </Box>

                    <Text> Distance: {crag.distance} Kilometres </Text>
                    <Text> Routes: {crag.routeCount} </Text>
                  </Box>
                  <WeatherComponent lat={crag.osy} lon={crag.osx} date={date} />
                </CardBody>
                <Box className="map-container">
                  <MapContainer
                    center={[+crag.osy, +crag.osx]}
                    zoom={13}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution=""
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[+crag.osy, +crag.osx]}>
                      <Popup>
                        <a
                          href={`https://www.google.com/maps?q=${crag.osy},${crag.osx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in Google Maps
                        </a>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <Divider />
                </Box>
              </Card>
            ))
          : null}
        <div className="pagination-controls">
          <Button onClick={handlePrevious}>
            <ArrowBackIcon />
          </Button>
          <Button onClick={handleNext}>
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
