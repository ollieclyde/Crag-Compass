import { Card, CardBody, Text, Box } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Crag } from "../types/types";
import WeatherComponent from "./subcomponents/weather-component";
import { GiMountainClimbing, GiStoneBlock } from "react-icons/gi";
import { RiPinDistanceFill } from "react-icons/ri";
import RatingComponent from "./subcomponents/rating-component";
import { PieChartKeyModal } from "./pie-chart-key-modal";
import { useDisclosure } from "@chakra-ui/react";
import { FullCragInfoModal } from "./full-crag-info-modal";
import PieChartComponent from "./subcomponents/pie-chart";
import { useState } from "react";
import WarningIcon from "./subcomponents/warning-icon";

interface CragCardProps {
  crag: Crag;
  daysFromNow: number;
}
const CragCard: React.FC<CragCardProps> = ({ crag, daysFromNow }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pieChartKeyModalFlag, setPieChartKeyModalFlag] =
    useState<boolean>(false);

  return (
    <>
      <Card
        as="article" // Assuming Card is essentially a Box, use 'as' prop if Card is a custom component
        key={crag.cragID}
        direction={{ base: "column", sm: "column" }}
        overflow="hidden"
        variant="elevated"
        colorScheme="teal"
        height="540px"
        width={{ base: "90vw", sm: "10vw", md: "50vw", lg: "80vw", xl: "80vw" }}
        maxWidth="sm"
        transition="transform 0.3s ease, box-shadow 0.3s ease, border-width 0.3s ease, z-index 0.3s ease"
        boxShadow="0px 10px 6px rgba(0, 0, 0, 0.5)"
        _hover={{
          transform: "scale(1.05)", // Slightly increase the scale
          zIndex: 10, // Elevate the z-index
          boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.7)", // Optionally increase the shadow for more depth
        }}
      >
        <CardBody
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          gap="3px"
          cursor="pointer"
        >
          <Box height="200px" width="100%">
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
          </Box>

          <Box onClick={onOpen} display="flex" paddingTop="7px">
            <Text
              noOfLines={[1]}
              marginBottom="5px"
              maxWidth="15vw"
              className="crag-name"
              as="b"
              fontSize="larger"
            >
              {crag.name}
            </Text>
            <Box paddingLeft="7px">
              <RatingComponent avgRating={crag.cragStats?.avgStars} />
            </Box>
            <Box paddingLeft="9px">
              <WarningIcon accessType={crag.cragInfo?.accessType} />
            </Box>
          </Box>
          <Box
            onClick={onOpen}
            display="flex"
            flexDirection="row"
            gap="3px"
            whiteSpace="nowrap"
          >
            <GiStoneBlock />
            <Text fontSize="small">
              {" " + crag.rockType[0].toUpperCase() + crag.rockType.slice(1)}
            </Text>
            <GiMountainClimbing />
            <Text fontSize="small">
              {" " +
                crag.climbingType
                  .filter((type) => {
                    if (crag.climbingType.length > 1 && type.name === "Unknown")
                      return false;
                    return true;
                  })
                  .map((type) => type.name)
                  .join(", ")}
            </Text>
            <RiPinDistanceFill />
            <Text fontSize="small">{" " + crag.distance}km</Text>
          </Box>
          <Box className="features-container" onClick={onOpen}>
            <Text fontSize="small" minH="60px" noOfLines={[1, 2, 3]}>
              {crag.cragInfo?.features}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            width="100%"
            height="100%"
          >
            <Box
              onClick={() => {
                setPieChartKeyModalFlag(true);
              }}
              flex="1"
              cursor="pointer"
            >
              <PieChartComponent crag={crag} />
            </Box>
            <Box onClick={onOpen} flex="1">
              <WeatherComponent
                lat={crag.osy}
                lon={crag.osx}
                fullWeatherComponentFlag={false}
                daysFromNow={daysFromNow}
              />
            </Box>
          </Box>
        </CardBody>
      </Card>
      <PieChartKeyModal
        pieChartKeyModalFlag={pieChartKeyModalFlag}
        setPieChartKeyModalFlag={setPieChartKeyModalFlag}
      />
      <FullCragInfoModal
        crag={crag}
        daysFromNow={daysFromNow}
        isOpen={isOpen}
        onClose={onClose}
        setPieChartKeyModalFlag={setPieChartKeyModalFlag}
      />
    </>
  );
};

export default CragCard;
