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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import moment from "moment";
import { Search2Icon } from "@chakra-ui/icons";
import { SearchModalProps, SearchState } from "../types/types";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "../App.css";
import { geocodeLocation } from "../helpers/googleAPI";

const SearchModal: React.FC<SearchModalProps> = ({
  searchState,
  setSearchState,
  fetchCrags,
  onOpen,
  isOpen,
  onClose,
}) => {
  const currentDateTime = moment().format("YYYY-MM-DDTHH:mm");

  const [location, setLocation] = useState<string>('London');
  const [departureDate, setDepartureDate] = useState<string>(currentDateTime);
  const [climbingType, setClimbingType] = useState<string[]>(['all']);
  const [rockType, setRockType] = useState<string[]>(['all']);
  const [numOfRoutes, setNumOfRoutes] = useState<number[]>([0, 250]);
  const [distRange, setDistRange] = useState<number[]>([0, 50]);
  const [daysFromNow, setDaysFromNow] = useState<number>(0);
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');

  const searchHandler = async () => {
    let coords = searchState.coords;
    if (location !== '') {
      if (
        location !== searchState.location ||
        distRange[0] !== searchState.distRange[0] ||
        distRange[1] !== searchState.distRange[1]
      ) {
        const newCoords = await geocodeLocation(location);
        if (newCoords) {
          fetchCrags(newCoords.lng, newCoords.lat, distRange);
          coords = newCoords;
        }
      }
      const newSearchState: SearchState = {
        location: location,
        coords: coords,
        departureDate: departureDate,
        daysFromNow: daysFromNow,
        climbingType: climbingType,
        rockType: rockType,
        numOfRoutes: numOfRoutes,
        distRange: distRange,
      }
      setSearchState(newSearchState)
      onClose();
    }
  }

  useEffect(() => {
    const currentDate = new Date();
    const sevenDaysFromNow = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    const formatDateToInput = (date: Date) => {
      let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear(),
        hours = '' + date.getHours(),
        minutes = '' + date.getMinutes();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      if (hours.length < 2)
        hours = '0' + hours;
      if (minutes.length < 2)
        minutes = '0' + minutes;

      return [year, month, day].join('-') + 'T' + [hours, minutes].join(':');
    };

    setMinDate(formatDateToInput(currentDate));
    setMaxDate(formatDateToInput(sevenDaysFromNow));
  }, []);

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
  }

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

  return (
    <div className="search-container">
      <IconButton
        className="search-icon"
        aria-label="Search database"
        background="transparent"
        variant="none"
        fontSize="2rem"
        onClick={onOpen}
        icon={<Search2Icon />}
      />
      <Modal
        onClose={onClose}
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
            className="modal-body"
          >
            <FormControl className="form-content" isRequired>
              <FormLabel fontWeight="bold">Location</FormLabel>
              {/* <GooglePlacesAutocomplete
                apiOptions={{ language: 'en', region: 'gb' }}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ['gb'],
                  }
                }}
                selectProps={{
                  onChange: (address) => {
                    if (address) {
                      setLocation(address.label)
                    }
                  }
                }}
              /> */}
              <Input
                isRequired={true}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                min={currentDateTime}
              />
            </FormControl>

            <FormControl className="form-content">
              <FormLabel fontWeight="bold">Depature Time</FormLabel>
              <Input
                type="datetime-local"
                onChange={(event) => handleDateChange(event.target.value)}
                value={departureDate}
                min={minDate}
                max={maxDate}
              />
            </FormControl>

            <FormControl className="form-content">
              <FormLabel fontWeight="bold">Climbing Type</FormLabel>
              <CheckboxGroup
                value={climbingType}
                onChange={(event) =>
                  handleCheckboxChange(setClimbingType, event)
                }
              >
                <Stack spacing={5} direction="row">
                  <Checkbox value="all">All</Checkbox>
                  <Checkbox value="bouldering">Bouldering</Checkbox>
                  <Checkbox value="trad">Trad</Checkbox>
                  <Checkbox value="sport">Sport</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl className="form-content">
              <FormLabel fontWeight="bold">Rock Type</FormLabel>
              <CheckboxGroup
                value={rockType}
                onChange={(event) => handleCheckboxChange(setRockType, event)}
              >
                <Stack spacing={5} direction="row">
                  <Checkbox value="all">All</Checkbox>
                  <Checkbox value="granite">Granite</Checkbox>
                  <Checkbox value="limestone">Limestone</Checkbox>
                  <Checkbox value="grit">Grit</Checkbox>
                  <Checkbox value="artificial">Artificial</Checkbox>
                  <Checkbox value="sandstone">Sandstone</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <FormControl className="form-content">
              <FormLabel fontWeight="bold" pb="1rem">Routes</FormLabel>
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
                  <Box className="grade-slider-value">
                    <span>{numOfRoutes[0]}</span>
                  </Box>
                </RangeSliderThumb>
                <RangeSliderThumb index={1}>
                  <Box className="grade-slider-value">
                    <span>
                      {numOfRoutes[1] !== 500
                        ? numOfRoutes[1]
                        : numOfRoutes[1] + "+"}
                    </span>
                  </Box>
                </RangeSliderThumb>
              </RangeSlider>
            </FormControl>

            <FormControl className="form-content">
              <FormLabel fontWeight="bold" pb="2rem">Distance</FormLabel>
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
                  <Box className="distance-slider-value">
                    {distRange[0] + "km"}
                  </Box>
                </RangeSliderThumb>
                <RangeSliderThumb index={1}>
                  <Box className="distance-slider-value">
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
    </div>
  );
};

export default SearchModal;
