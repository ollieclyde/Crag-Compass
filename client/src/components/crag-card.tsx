import {
  Card,
  CardBody,
  Text,
  Divider,
  Image,
  Box,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Crag } from "../types/types";
import WeatherComponent from "./weather-component";
import { GiMountainClimbing, GiStoneBlock } from "react-icons/gi";
import { RiPinDistanceFill } from "react-icons/ri";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { MdOutlineImageNotSupported } from "react-icons/md";
import './crag-card.css';

interface CragCardProps {
  crag: Crag;
  daysFromNow: number;
}

const CragCard: React.FC<CragCardProps> = ({ crag, daysFromNow }) => {

  const cragStats = crag.cragStats;
  const COLORS = ['#008000', '#FFFF00', '#FF0000', '#000000', '#FFFFFF'];

  const data = [
    { name: 'beginner', value: cragStats?.beginner },
    { name: 'advanced', value: cragStats?.advanced },
    { name: 'experienced', value: cragStats?.experienced },
    { name: 'expert', value: cragStats?.expert },
    { name: 'elite', value: cragStats?.elite },
  ]

  return (
    <>
      <Card
        className="crag-card"
        key={crag.cragID}
        direction={{ base: 'column', sm: 'row' }}
        justify="start"
        overflow="hidden"
        variant="elevated"
        colorScheme="teal"
        size="sm"
        height="40svh"
        transition="transform 0.3s ease, box-shadow 0.3s ease, border-width 0.3s ease"
        style={{ boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)' }}
      >
        <Box className='image-container' width="20vw" height="100%" overflow="hidden" pos="relative">
          {crag.cragInfo?.img !== 'no image available' ? (
            <Image
              className="card-image"
              src={crag.cragInfo?.img}
              alt={crag.name}
              objectFit="cover"
              boxSize="100%"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            />
          ) : (
            <MdOutlineImageNotSupported
              size="10rem"
              transform="translate(-50%, -50%)"
            />
          )}
        </Box>

        <CardBody className="card-body">
          <Box className="card-header-text">
            <Text as="b" fontSize="larger">
              {crag.name}
            </Text>
          </Box>
          <Box className="card-body-text">
            <GiStoneBlock />
            <Text fontSize='small' >
              {' ' + crag.rockType[0].toUpperCase() + crag.rockType.slice(1)}
            </Text>
            <GiMountainClimbing />
            <Text fontSize='small'>
              {' ' + crag.climbingType.map((type) => type.name).join(', ')}
            </Text>
            <RiPinDistanceFill />
            <Text fontSize='small'>{' ' + crag.distance}km</Text>
          </Box>
          <Box className="features-container">
            <Text fontSize='small' noOfLines={[1, 2, 3]}>
              {crag.cragInfo?.features}
            </Text>
          </Box>
          <Box className="info-graphics-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <WeatherComponent lat={crag.osy} lon={crag.osx} daysFromNow={daysFromNow} />
          </Box>
        </CardBody>


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
          <Divider />
        </Box>
      </Card>
    </>
  );
};

export default CragCard;