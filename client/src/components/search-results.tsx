import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
} from "@chakra-ui/react";
import { Crag } from "../types/types";
import { CragFilters } from "./crag-filters";
import { IoFilter } from "react-icons/io5";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import CragCard from "./crag-card";

import "./search-results.css";

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
            <CragCard crag={crag} date={date} />
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
