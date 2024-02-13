import { useEffect, useState } from "react";
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
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import moment from "moment";
import { Search2Icon } from "@chakra-ui/icons";
import { Libraries, useLoadScript } from "@react-google-maps/api";
import APIService from "./Api-client-service";
import { Crag, Coords } from "../types/types";
import { SearchResults } from "./search-results";
import "./App.css";
import { GeocodeResult } from "use-places-autocomplete";

const SearchModal = ({ location, setLocation, departureDate, setDepartureDate, climbingType, setClimbingType, rockType, setRockType, numOfRoutes,numOfRoutesHandler}) => {


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
              <FormLabel>Location</FormLabel>
              <Input
                isRequired={true}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                min={currentDateTime}
              />
            </FormControl>

            <FormControl className="form-content">
              <FormLabel>Depature Time</FormLabel>
              <Input
                type="datetime-local"
                onChange={(event) => setDepartureDate(event.target.value)}
                value={departureDate}
              />
            </FormControl>

            <FormControl className="form-content">
              <FormLabel>Climbing Type</FormLabel>
              <CheckboxGroup
                value={climbingType}
                onChange={(event) => handleCheckboxChange(setClimbingType, event)}
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
              <FormLabel>Rock Type</FormLabel>
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
              <FormLabel pb="1rem">Routes</FormLabel>
              <RangeSlider
                aria-label={["min", "max"]}
                min={0}
                max={500}
                defaultValue={numOfRoutes}
                step={5}
                minStepsBetweenThumbs={1}
                onChange={numOfRoutesHandler}
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
              <FormLabel pb="2rem">Distance</FormLabel>
              <RangeSlider
                aria-label={["min", "max"]}
                defaultValue={distRange}
                min={0}
                max={100}
                step={5}
                minStepsBetweenThumbs={1}
                onChange={handleDist}
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
