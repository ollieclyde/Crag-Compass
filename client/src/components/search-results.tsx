import { useState, useEffect } from 'react'
import { Button, Card, CardBody, Text, Divider, CardHeader, Box, IconButton } from '@chakra-ui/react';


import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup, } from 'react-leaflet'

import { Crag } from '../types/types';
import { CragFilters } from './crag-filters';

import WeatherComponent from './weather-component';

import { IoFilter } from "react-icons/io5";

import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons'


export function SearchResults({ filteredCrags, cragCount, setFilteredCrags, date }: any) {


  const [filterFlag, setFilterFlag] = useState(false);

  const filterHandler = () => {
    if (filterFlag) {
      setFilterFlag(false);
    } else {
      setFilterFlag(true);
    }
  }

  const [routeFlag, setRouteFlag] = useState<boolean>(false);
  const [distanceFlag, setDistanceFlag] = useState<boolean>(false);

  const handleRouteFilter = () => {
    const cragsToSort = [...filteredCrags];

    const sortedFilteredCrags = cragsToSort.sort((a, b) => {
      return routeFlag ? a.routes - b.routes : b.routes - a.routes;
    });

    setFilteredCrags(sortedFilteredCrags);
    setRouteFlag(!routeFlag);
    setCurrentPage(0);
  };


  const handleDistanceFilter = () => {
    const cragsToSort = [...filteredCrags];

    const sortedFilteredCrags = cragsToSort.sort((a, b) => {
      return distanceFlag ? a.distance - b.distance : b.distance - a.distance;
    });


    setFilteredCrags(sortedFilteredCrags);
    setDistanceFlag(!distanceFlag);
    setCurrentPage(0)
  };

  const [currentPageCrags, setCurrentPageCrags] = useState([])


  useEffect(() => {
    const slicedCrags: any = filteredCrags.slice(0, 10);

    setCurrentPageCrags(slicedCrags)
  }, [filteredCrags, distanceFlag, routeFlag])

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const pageCount = Math.ceil(filteredCrags.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < pageCount - 1) {
      const newPage = currentPage + 1;
      setCurrentPageCrags(filteredCrags.slice(newPage * itemsPerPage, (newPage + 1) * itemsPerPage));
      setCurrentPage(newPage);
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPageCrags(filteredCrags.slice(newPage * itemsPerPage, currentPage * itemsPerPage));
      setCurrentPage(newPage);
    }
  }

  return (
    <>
      <div className='search-results'>
        <div className='filter-search-results-container'>
          <div className='search-filter'>
            <IconButton variant='none' onClick={filterHandler} aria-label='Filter' icon={<IoFilter />} />
            {filterFlag && (
              <CragFilters handleDistanceFilter={handleDistanceFilter} handleRouteFilter={handleRouteFilter}
                distanceFlag={distanceFlag}
                routeFlag={routeFlag}
              />
            )}
          </div>
          <div className='search-results-number'>
            <p>
              Search results: {cragCount}
            </p>
          </div>
        </div>
        {
          Array.isArray(currentPageCrags) ? currentPageCrags.map((crag: any) => (
            <Card className='crag-card'
              key={crag.id}
              direction={{ base: 'column', sm: 'row' }}
              justify="start"
              overflow='hidden'
              variant='elevated'
              colorScheme='teal'
              size='sm'
              height="25vh"
              transition='transform 0.3s ease, box-shadow 0.3s ease, border-width 0.3s ease'
              box-shadow='0px 10px 20px rgba(0, 0, 0, 0.5)'
            >
              <CardHeader className='card-header' padding={0}>
                <Box className='card-header-text'>
                  <Text as='b' fontSize='larger'> {crag.cragName} </Text>
                  <Text> {crag.location} </Text>
                  <Text> {crag.country} </Text>
                </Box>
              </CardHeader>

              <Divider orientation='vertical' variant="solid" />

              <CardBody className='card-body'>
                <Box className='card-body-text'>
                  <Text> Rock Type: {crag.rockType[0].toUpperCase() + crag.rockType.slice(1)} </Text>
                  <Box className='climbing-type'>
                    <Text>
                      {'Climbing Type: '}
                      {crag.climbingTypes.map(type => type.climbingType).join(', ')}
                    </Text>
                  </Box>

                  <Text> Distance: {crag.distance} Kilometres </Text>
                  <Text> Routes: {crag.routes} </Text>
                </Box>
                <WeatherComponent lat={crag.osy} lon={crag.osx} date={date} />
              </CardBody>
              <Box className="map-container">
                <MapContainer center={[crag.osy, crag.osx]} zoom={13} scrollWheelZoom={false}>
                  <TileLayer
                    attribution=''
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[crag.osy, crag.osx]}>
                    <Popup >
                      <a href={`https://www.google.com/maps?q=${crag.osy},${crag.osx}`} target="_blank" rel="noopener noreferrer">
                        Open in Google Maps
                      </a>
                    </Popup>
                  </Marker>
                </MapContainer>
                <Divider />
              </Box>
            </Card>
          )) : null
        }
        <div className='pagination-controls'>
          <Button onClick={handlePrevious}>
            <ArrowBackIcon />
          </Button>
          <Button onClick={handleNext}>
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
    </>
  )
}
