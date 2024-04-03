import {
  Modal,
  Box,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
} from "@chakra-ui/react";
import { Crag } from "../types/types";
import RatingComponent from "./subcomponents/rating-component";
import { GiMountainClimbing, GiStoneBlock } from "react-icons/gi";
import PieChartComponent from "./subcomponents/pie-chart";
import { RiPinDistanceFill } from "react-icons/ri";
import WeatherComponent from "./subcomponents/weather-component";
import WarningIcon from "./subcomponents/warning-icon";

export const FullCragInfoModal = ({
  crag,
  daysFromNow,
  isOpen,
  onClose,
  setPieChartKeyModalFlag,
}: {
  crag: Crag;
  daysFromNow: number;
  isOpen: boolean;
  onClose: Function;
  setPieChartKeyModalFlag: Function;
}) => {
  const accessTitles: { [key: number]: string } = {
    1: "Access Advice",
    2: "Restricted Access",
    3: "Access Banned",
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size={"6xl"}>
        <ModalOverlay />
        <ModalContent width="160vw">
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {crag?.cragInfo?.img !== "no image available" && (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="10px"
              >
                <Image src={crag.cragInfo?.img} alt="crag image" />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-evenly"
                  width="100%"
                  height="100%"
                >
                  <Box
                    height="20vh"
                    onClick={() => {
                      setPieChartKeyModalFlag(true);
                    }}
                    flex="1"
                  >
                    <PieChartComponent crag={crag} />
                  </Box>
                  <Box flex="1">
                    <WeatherComponent
                      lat={crag.osy}
                      lon={crag.osx}
                      fullWeatherComponentFlag={true}
                      daysFromNow={daysFromNow}
                    />
                  </Box>
                </Box>
              </Box>
            )}
            <Box marginTop="15px" display="flex">
              <Text as="b" fontSize="larger">
                {crag.name}
              </Text>
              <Box paddingLeft="7px">
                <RatingComponent avgRating={crag.cragStats?.avgStars} />
              </Box>
            </Box>
            <Box display="flex" gap="7px">
              <GiStoneBlock />
              <Text fontSize="small">
                {" " + crag.rockType[0].toUpperCase() + crag.rockType.slice(1)}
              </Text>
              <GiMountainClimbing />
              <Text fontSize="small">
                {" " +
                  crag.climbingType
                    .filter((type) => {
                      if (
                        crag.climbingType.length > 1 &&
                        type.name === "Unknown"
                      )
                        return false;
                      return true;
                    })
                    .map((type) => type.name)
                    .join(", ")}
              </Text>
              <RiPinDistanceFill />
              <Text fontSize="small">{" " + crag.distance}km</Text>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              pt="10px"
              gap="20px"
              pb="10px"
            >
              <Box>
                <Text>Features</Text>
                <Text fontSize="small">{crag.cragInfo?.features}</Text>
              </Box>
              <Box>
                <Text>Approach</Text>
                <Text fontSize="small">{crag.cragInfo?.approach}</Text>
              </Box>
              {crag?.cragInfo?.accessType !== undefined &&
                crag.cragInfo.accessType !== 0 && (
                  <Box>
                    <Box display="flex" gap="15px" pb="5px">
                      <Text
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {accessTitles[crag.cragInfo.accessType]}
                      </Text>
                      <WarningIcon accessType={crag.cragInfo?.accessType} />
                    </Box>
                    <Text fontSize="small">
                      {crag.cragInfo?.accessNote
                        .trim()
                        .replace(accessTitles[crag.cragInfo.accessType], "")}
                    </Text>
                  </Box>
                )}
            </Box>
            {crag?.cragInfo?.img === "no image available" && (
              <Box
                display="flex"
                justifyContent="start"
                alignItems="start"
                height="100%"
                width="100%"
              >
                <Box
                  height="20vh"
                  width="15vw"
                  onClick={() => {
                    setPieChartKeyModalFlag(true);
                  }}
                >
                  <PieChartComponent crag={crag} />
                </Box>
                <Box>
                  <WeatherComponent
                    lat={crag.osy}
                    lon={crag.osx}
                    fullWeatherComponentFlag={true}
                    daysFromNow={daysFromNow}
                  />
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
