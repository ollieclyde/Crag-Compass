import {
  Card,
  CardBody,
  Text,
  Divider,
  Image,
  Box,
  Icon,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Crag } from "../types/types";
import WeatherComponent from "./weather-component";
import { GiMountainClimbing, GiStoneBlock } from "react-icons/gi";
import { RiPinDistanceFill } from "react-icons/ri";
import RatingComponent from './rating-component';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { MdOutlineImageNotSupported } from "react-icons/md";
import { PieChartKeyModal } from './pie-chart-key-modal';
import AccessWarningPopover from './access-warning-popover';
import { useDisclosure } from "@chakra-ui/react";
import { FullCragInfoModal } from "./full-crag-info-modal";
import PieChartComponent from './pie-chart';
import { useEffect, useState } from 'react';
import { IoMdWarning } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaInfoCircle } from "react-icons/fa";
import WarningIcon from "./warning-icon";



import './crag-card.css';
import { IconType } from "react-icons";

interface CragCardProps {
  crag: Crag;
  daysFromNow: number;
}
interface CragStats {
  beginner?: number;
  advanced?: number;
  experienced?: number;
  expert?: number;
  elite?: number;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const CragCard: React.FC<CragCardProps> = ({ crag, daysFromNow }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pieChartKeyModalFlag, setPieChartKeyModalFlag] = useState<boolean>(false);

  return (
    <>
      <Card
        className="crag-card"
        key={crag.cragID}
        direction={{ base: 'column', sm: 'column' }}
        overflow="hidden"
        variant="elevated"
        colorScheme="teal"
        height="540px"
        width={{ base: '90vw', sm: '10vw', md: '50vw', lg: '80vw', xl: '80vw' }}
        maxWidth={"sm"}
        transition="transform 0.3s ease, box-shadow 0.3s ease, border-width 0.3s ease"
        style={{ boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)' }}
      >
        <CardBody className="card-body">

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
          </Box>

          <Box onClick={onOpen} className="card-header-text">
            <Text noOfLines={[1]} className="crag-name" as="b" fontSize="larger">
              {crag.name}
            </Text>
            <Box className="avg-rating-component">
              <RatingComponent avgRating={crag.cragStats?.avgStars} />
            </Box>
            <Box className="warning-icon">
              <WarningIcon accessType={crag.cragInfo?.accessType} />
            </Box>
          </Box>
          <Box className="card-body-text">
            <GiStoneBlock />
            <Text fontSize='small' >
              {' ' + crag.rockType[0].toUpperCase() + crag.rockType.slice(1)}
            </Text>
            <GiMountainClimbing />
            <Text fontSize='small'>
              {
                ' ' + crag.climbingType
                  .filter(type => {
                    if (crag.climbingType.length > 1 && type.name === "Unknown") return false;
                    return true
                  })
                  .map(type => type.name)
                  .join(', ')
              }
            </Text>
            <RiPinDistanceFill />
            <Text fontSize='small'>{' ' + crag.distance}km</Text>
          </Box>
          <Box className="features-container">
            <Text fontSize='small' minH='60px' noOfLines={[1, 2, 3]}>
              {crag.cragInfo?.features}
            </Text>
          </Box>
          <Box className="info-graphics-container">
            <PieChartComponent crag={crag} setPieChartKeyModalFlag={setPieChartKeyModalFlag} />
            <Box className="weather-component">
              <WeatherComponent lat={crag.osy} lon={crag.osx} daysFromNow={daysFromNow} />
            </Box>
          </Box>
        </CardBody>
      </Card>
      <PieChartKeyModal pieChartKeyModalFlag={pieChartKeyModalFlag} setPieChartKeyModalFlag={setPieChartKeyModalFlag} />
      <FullCragInfoModal crag={crag} daysFromNow={daysFromNow} isOpen={isOpen} onClose={onClose} setPieChartKeyModalFlag={setPieChartKeyModalFlag} />
    </>
  );
};

export default CragCard;