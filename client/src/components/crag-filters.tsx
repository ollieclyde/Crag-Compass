import { Text, Flex, IconButton } from "@chakra-ui/react";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

interface CragFiltersProps {
  handleDistanceFilter: Function;
  handleRouteFilter: Function;
  routeFlag: boolean;
  distanceFlag: boolean;
}

const CragFilters = ({
  handleDistanceFilter,
  handleRouteFilter,
  routeFlag,
  distanceFlag,
}: CragFiltersProps) => {
  return (
    <>
      <Flex justifyContent="center" alignItems="center">
        <Text> Routes </Text>
        <IconButton
          variant="none"
          className="filter-arrow-button"
          aria-label="Routes"
          onClick={() => handleRouteFilter()}
          icon={routeFlag ? <TriangleUpIcon /> : <TriangleDownIcon />}
        />
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Text> Distance </Text>
        <IconButton
          variant="none"
          className="filter-arrow-button"
          aria-label="Routes"
          onClick={() => handleDistanceFilter()}
          icon={distanceFlag ? <TriangleUpIcon /> : <TriangleDownIcon />}
        />
      </Flex>
    </>
  );
};

export default CragFilters;
