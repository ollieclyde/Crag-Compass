import {
  Checkbox,
  IconButton,
  CheckboxGroup,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import moment from "moment";
import { Search2Icon } from "@chakra-ui/icons";
import { SearchState } from "../types/types";
import { geocodeLocation } from "../helpers/googleAPI";

export interface SearchModalProps {
  setSearchState: Function;
  searchState: SearchState;
  basicFilter: Function;
  setFilteredCrags: Function;
  fetchCrags: (lng: string, lat: string, distRange: number[]) => Promise<void>;
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
};

const climbingTypes = [
  { value: "all", label: "All" },
  { value: "bouldering", label: "Bouldering" },
  { value: "trad", label: "Trad" },
  { value: "sport", label: "Sport" },
];

const rockTypes = [
  { value: "all", label: "All" },
  { value: "granite", label: "Granite" },
  { value: "limestone", label: "Limestone" },
  { value: "grit", label: "Grit" },
  { value: "artificial", label: "Artificial" },
  { value: "sandstone", label: "Sandstone" },
  { value: "slate", label: "Slate" },
];

const SearchModal: React.FC<SearchModalProps> = ({
  searchState,
  setSearchState,
  fetchCrags,
  onOpen,
  isOpen,
  onClose,
}) => {
  const currentDateTime = moment().format("YYYY-MM-DDTHH:mm");

  const [initialState, setInitialState] = useState<SearchState | null>(null);

  const [location, setLocation] = useState<string>("London");
  const [departureDate, setDepartureDate] = useState<string>(currentDateTime);
  const [climbingType, setClimbingType] = useState<string[]>(["all"]);
  const [rockType, setRockType] = useState<string[]>(["all"]);
  const [numOfRoutes, setNumOfRoutes] = useState<number[]>([0, 250]);
  const [distRange, setDistRange] = useState<number[]>([0, 50]);
  const [daysFromNow, setDaysFromNow] = useState<number>(0);
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");

  const [locationErrorFlag, setLocationErrorFlag] = useState<boolean>(false);

  const searchHandler = async () => {
    const hasLocationChanged = location !== searchState.location;
    const hasDistRangeChanged = distRange[0] !== searchState.distRange[0] || distRange[1] !== searchState.distRange[1];

    // If there's no change, update the state and close the modal directly.
    if (!hasLocationChanged && !hasDistRangeChanged) {
      const newSearchState: SearchState = {
        location: location,
        coords: searchState.coords,
        departureDate: departureDate,
        daysFromNow: daysFromNow,
        climbingType: climbingType,
        rockType: rockType,
        numOfRoutes: numOfRoutes,
        distRange: distRange,
      };
      setSearchState(newSearchState);
      setLocationErrorFlag(false);
      setInitialState(null)
      onClose();
      return;
    }
    try {
      const newCoords = await geocodeLocation(location);
      if (newCoords) {
        fetchCrags(newCoords.lng, newCoords.lat, distRange);
        const newSearchState: SearchState = {
          location: location,
          coords: newCoords,
          departureDate: departureDate,
          daysFromNow: daysFromNow,
          climbingType: climbingType,
          rockType: rockType,
          numOfRoutes: numOfRoutes,
          distRange: distRange,
        };
        setLocationErrorFlag(false);
        setSearchState(newSearchState);
        setInitialState(null)
        onClose();
      } else {
        setLocationErrorFlag(true);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  const customOnClose = () => {
    setLocation(initialState?.location || "London");
    setDepartureDate(initialState?.departureDate || currentDateTime);
    setClimbingType(initialState?.climbingType || ["all"]);
    setRockType(initialState?.rockType || ["all"]);
    setNumOfRoutes(initialState?.numOfRoutes || [0, 250]);
    setDistRange(initialState?.distRange || [0, 50]);
    setDaysFromNow(initialState?.daysFromNow || 0);
    setLocationErrorFlag(false);
    setInitialState(null);
    onClose();
  };

  useEffect(() => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date(
      currentDate.getTime() + 6 * 24 * 60 * 60 * 1000,
    );

    const formatDateToInput = (date: Date) => {
      let month = "" + (date.getMonth() + 1),
        day = "" + date.getDate(),
        year = date.getFullYear(),
        hours = "" + date.getHours(),
        minutes = "" + date.getMinutes();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      if (hours.length < 2) hours = "0" + hours;
      if (minutes.length < 2) minutes = "0" + minutes;

      return [year, month, day].join("-") + "T" + [hours, minutes].join(":");
    };

    setMinDate(formatDateToInput(currentDate));
    setMaxDate(formatDateToInput(sevenDaysFromNow));
  }, []);

  useEffect(() => {
    if (isOpen && initialState === null) {
      setInitialState(searchState);
    }
  }, [isOpen, searchState, initialState]);


  const getDaysFromNow = (dateString: string): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const providedDate = new Date(dateString);
    providedDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round(Math.abs((+providedDate - +today) / oneDay));
    return diffDays;
  };

  const handleDateChange = (value: string) => {
    setDaysFromNow(getDaysFromNow(value));
    setDepartureDate(value);
  };

  const handleCheckboxChange = (
    setter: Function,
    values: (string | number)[],
  ) => {
    const flag = values.includes("all");
    if (values[0] === "all" && values.length > 1) {
      setter(values.filter((value) => value !== "all"));
    } else if (flag || !values.length) {
      setter(["all"]);
    } else {
      setter(values);
    }
  };

  return (
    <Box paddingRight="10rem">
      <IconButton
        aria-label="Search database"
        background="transparent"
        variant="none"
        fontSize="2rem"
        onClick={onOpen}
        icon={<Search2Icon />}
      />
      <Modal
        onClose={customOnClose}
        size={"xl"}
        isOpen={isOpen}
        closeOnEsc
        colorScheme="teal"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" pt="3rem">
            Crag Search
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection={"column"}
            gap="20px"
          >
            <FormControl isInvalid={locationErrorFlag} isRequired>
              <FormLabel fontWeight="bold">Departure Location</FormLabel>
              <Input
                isRequired={true}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                min={currentDateTime}
              />
              {locationErrorFlag && (
                <FormErrorMessage> Location cannot be found</FormErrorMessage>
              )}
            </FormControl>

            <FormControl >
              <FormLabel fontWeight="bold">Depature Time</FormLabel>
              <Input
                type="datetime-local"
                onChange={(event) => handleDateChange(event.target.value)}
                value={departureDate}
                min={minDate}
                max={maxDate}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Climbing Type</FormLabel>
              <CheckboxGroup
                value={climbingType}
                onChange={(event) =>
                  handleCheckboxChange(setClimbingType, event)
                }
              >
                <Stack spacing={8} direction="row">
                  {climbingTypes.map((type) => (
                    <Checkbox key={type.value} value={type.value}>{type.label}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Rock Type</FormLabel>
              <CheckboxGroup
                value={rockType}
                onChange={(event) => handleCheckboxChange(setRockType, event)}
              >
                <Stack wrap="wrap" spacing={8} direction="row">
                  {rockTypes.map((type) => (
                    <Checkbox key={type.value} value={type.value}>{type.label}</Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl >
              <FormLabel fontWeight="bold" pb="1rem">
                Routes
              </FormLabel>
              <RangeSlider
                aria-label={["min", "max"]}
                min={0}
                max={500}
                defaultValue={numOfRoutes}
                step={5}
                minStepsBetweenThumbs={1}
                onChange={(value) => setNumOfRoutes(value)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0}>
                  <Box paddingBottom="40px">
                    <span>{numOfRoutes[0]}</span>
                  </Box>
                </RangeSliderThumb>
                <RangeSliderThumb index={1}>
                  <Box paddingBottom="40px">
                    <span>
                      {numOfRoutes[1] !== 500
                        ? numOfRoutes[1]
                        : numOfRoutes[1] + "+"}
                    </span>
                  </Box>
                </RangeSliderThumb>
              </RangeSlider>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold" pb="2rem">
                Distance
              </FormLabel>
              <RangeSlider
                aria-label={["min", "max"]}
                defaultValue={distRange}
                min={0}
                max={100}
                step={5}
                minStepsBetweenThumbs={1}
                onChange={(value) => setDistRange(value)}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0}>
                  <Box paddingBottom="40px">
                    {distRange[0] + "km"}
                  </Box>
                </RangeSliderThumb>
                <RangeSliderThumb index={1}>
                  <Box paddingBottom="40px">
                    {distRange[1] + "km"}
                  </Box>
                </RangeSliderThumb>
              </RangeSlider>
            </FormControl>
            <Button
              w="25%"
              type="button"
              ml="12rem"
              mt="1rem"
              onClick={searchHandler}
            >
              Search
            </Button>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SearchModal;
