import { Text, Box, IconButton } from "@chakra-ui/react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export function CragFilters({
  handleDistanceFilter,
  handleRouteFilter,
  routeFlag,
  distanceFlag,
}: {
  handleDistanceFilter: Function;
  handleRouteFilter: Function;
  routeFlag: boolean;
  distanceFlag: boolean;
}) {
  return (
    <>
      {routeFlag ? (
        <Box className="routes-filter-container">
          <Text> Routes </Text>
          <IconButton
            variant="none"
            className="filter-arrow-button"
            aria-label="Routes"
            onClick={() => handleRouteFilter()}
            icon={<TriangleUpIcon />}
          />
        </Box>
      ) : (
        <Box className="routes-filter-container">
          <Text> Routes </Text>
          <IconButton
            variant="none"
            className="filter-arrow-button"
            aria-label="Routes"
            onClick={() => handleRouteFilter()}
            icon={<TriangleDownIcon />}
          />
        </Box>
      )}
      {distanceFlag ? (
        <Box className="routes-filter-container">
          <Text> Distance </Text>
          <IconButton
            variant="none"
            className="filter-arrow-button"
            aria-label="Routes"
            onClick={() => handleDistanceFilter()}
            icon={<TriangleUpIcon />}
          />
        </Box>
      ) : (
        <Box className="routes-filter-container">
          <Text> Distance </Text>
          <IconButton
            variant="none"
            className="filter-arrow-button"
            aria-label="Routes"
            onClick={() => handleDistanceFilter()}
            icon={<TriangleDownIcon />}
          />
        </Box>
      )}
    </>
  );
}
