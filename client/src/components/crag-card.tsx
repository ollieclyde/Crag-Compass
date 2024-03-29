import {
  Card,
  CardBody,
  Text,
  Divider,
  CardHeader,
  Image,
  Box,
} from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Crag } from "../types/types";
import WeatherComponent from "./weather-component";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';


import { MdOutlineImageNotSupported } from "react-icons/md";


import './crag-card.css';
import { useEffect, useState } from "react";

interface CragCardProps {
  crag: Crag;
  date: string;
}

const CragCard: React.FC<CragCardProps> = ({ crag, date }) => {

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
        height="25vh"
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
            <Text fontSize='small' >
              Rock Type:
              {' ' + crag.rockType[0].toUpperCase() + crag.rockType.slice(1)}
            </Text>
            <Text fontSize='small'>
              Climbing Type:
              {' ' + crag.climbingType.map((type) => type.name).join(', ')}
            </Text>
            <Text fontSize='small'>Distance: {' ' + crag.distance}km</Text>
            <Text fontSize='small'>Routes: {crag.routeCount}</Text>
          </Box>
          <Box className="features-container">
            <Text fontSize='small' noOfLines={[1, 2, 3]}>
              {crag.cragInfo?.features}
            </Text>
          </Box>
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
        </CardBody>

        <WeatherComponent lat={crag.osy} lon={crag.osx} date={date} />

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