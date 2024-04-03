import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Text,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Crag } from "../types/types";
import CragFilters from "./crag-filters";
import { IoFilter } from "react-icons/io5";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import CragCard from "./crag-card";

const SearchResults = ({
  filteredCrags,
  cragCount,
  setFilteredCrags,
  daysFromNow,
}: {
  filteredCrags: Crag[];
  cragCount: number;
  setFilteredCrags: Function;
  daysFromNow: number;
}) => {
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
      return routeFlag
        ? +a.routeCount - +b.routeCount
        : +b.routeCount - +a.routeCount;
    });

    setFilteredCrags(sortedFilteredCrags);
    setRouteFlag(!routeFlag);
    setCurrentPage(0);
  };

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
    const slicedCrags: Crag[] = filteredCrags.slice(0, 12);
    setCurrentPageCrags(slicedCrags);
  }, [filteredCrags, distanceFlag, routeFlag]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

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
      <Box width="100%">
        <Flex alignItems="center">
          <Flex
            padding="1rem"
            alignItems="center"
            gap="2rem"
            className="search-filter"
          >
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
          </Flex>
          <Box width="100%">
            <Text>Search results: {cragCount}</Text>
          </Box>
        </Flex>
        <Wrap justify="center" spacing="20px" padding="20px">
          {Array.isArray(currentPageCrags)
            ? currentPageCrags.map((crag: Crag) => (
              <WrapItem key={crag.cragID}>
                <CragCard crag={crag} daysFromNow={daysFromNow} />
              </WrapItem>
            ))
            : null}
        </Wrap>
        <Flex justifyContent="space-around">
          <Button onClick={handlePrevious}>
            <ArrowBackIcon />
          </Button>
          <Button onClick={handleNext}>
            <ArrowForwardIcon />
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export default SearchResults;