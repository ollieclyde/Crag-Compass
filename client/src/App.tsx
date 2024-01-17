import { useEffect, useState } from 'react'
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
  FormErrorMessage,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box
} from '@chakra-ui/react';
import moment from 'moment'
import { Search2Icon } from '@chakra-ui/icons';

import { useLoadScript } from '@react-google-maps/api';
const GoogleApiKey: string = import.meta.env.VITE_GOOGLE_API
const googleMapLibrary: any = ['places']

import apiClientService from './Api-client-service'
import { Crag, Coords } from './types/types'
import { SearchResults } from './components/search-results';
import './App.css'

// Structure for grade array when that feature is implemented
// const sportGrade: string[] = ['4a', '4b', '4c', '5a', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c +', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+']
// const [gradeRange, setGradeRange] = useState<string[]>(['5a', '8a']);

function App() {
  //Main crag state from the only api call to data base to get all the crags
  const [crags, setCrags] = useState<Crag[]>([]);
  //Crags that have been filtered from the main state from the main set of filters - rocktype climbing type routes etc.
  const [filteredCrags, setFilteredCrags] = useState<Crag[]>([]);
  const [location, setLocation] = useState<string>('London');
  const [currentLocation, setCurrentLocation] = useState<string>('London')
  const [currentCoords, setCurrentCords] = useState<Coords>({ lat: '51.509865', lng: '-0.118092' })
  const currentDateTime = moment().format('YYYY-MM-DDTHH:mm');
  const [departureDate, setDepartureDate] = useState<any>(currentDateTime)
  const [climbingType, setClimbingType] = useState<any[]>(['all']);
  const [rockType, setRockType] = useState<any>(['all']);
  const [numOfRoutes, setNumOfRoutes] = useState<number[]>([0, 250]);
  const [distRange, setDistRange] = useState<number[]>([0, 50])
  const [searchedDistRange, setSearchedDistRange] = useState<number[]>([0, 50])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleApiKey,
    libraries: googleMapLibrary
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      fetchCrags(currentCoords.lng, currentCoords.lat);
    }
  }, [isLoaded, loadError]);

  const fetchCrags = async (lng: string, lat: string) => {
    try {
      if (currentCoords) {
        const apiResults = await apiClientService.getAllCrags(lng, lat, distRange);
        setCrags(apiResults);
        const filtered = apiResults.filter((crag: any) => basicFilter(crag));
        setFilteredCrags(filtered);
      }
    } catch (error) {
      console.error('Error fetching crags:', error);
    }
  };
// Use of Google Maps Geocode
  const geocodeLocation = async (address: string): Promise<Coords | null> => {
    const geocoder = new google.maps.Geocoder();
    try {
      const results: any = await new Promise((resolve, reject) => {
        geocoder.geocode({ 'address': address }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      return { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
    } catch (error) {
      console.error(`Geocode was not successful for the following reason: ${error}`);
      return null;
    }
  };

  const handleCheckboxChange = (setter: any) => (values: any) => {
    const flag = values.includes('all')
    if (values[0] === 'all' && values.length > 1) {
      setter(values.filter((value: any) => value !== 'all'));
    } else if (!flag) {
      setter(values);
    } else {
      setter(['all'])
    }
  };

  const handleDist = (values: number[]) => {
    setDistRange(values);
  }
  const numOfRoutesHandler = (values: number[]) => {
    setNumOfRoutes(values)
  }

  const searchHandler = async () => {
    // Only call database if distance or location change otherwise just filter
    if (location !== currentLocation || distRange[0] !== searchedDistRange[0] || distRange[1] !== searchedDistRange[1]) {
      setCurrentLocation(location);
      setSearchedDistRange(distRange)
      const coords = await geocodeLocation(location);
      if (coords) {
        fetchCrags(coords.lng, coords.lat)
        setCurrentCords(coords)
      }
    } else {
      const filtered = crags.filter(crag => basicFilter(crag));
      setFilteredCrags(filtered);
    }
    onClose()
  };

  const basicFilter = (crag: Crag) => {
    // check that the crag has the correct number of routes
    const minRoutes = +numOfRoutes[0];
    const maxRoutes = +numOfRoutes[1] !== 500 ? +numOfRoutes[1] : 1000000;
    if (crag.routes === '?') {
      return false;
    }
    if (+crag.routes < minRoutes || +crag.routes > maxRoutes) {
      return false;
    }
    // check that the crag has the correct rocktype
    if (rockType[0] !== 'all') {
      if (!rockType.includes(crag.rockType)) {
        return false;
      }
    }
    //check that the crag has the correct climbingtype
    if (!climbingType.includes('all')) {
      let flag = false;
      for (let type of climbingType) {
        for (let i = 0; i < crag.climbingTypes.length; i++) {
          if (crag.climbingTypes[i].climbingType.toLowerCase() === type) {
            flag = true;
          }
        }
      }
      if (!flag) return flag;
    }
    return true;
  }
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState('xl')


  //Modularisation of code base needed! move Nav Bar into a separate component and then within that move the modal component
  return (
    <>
      <div className='page-root'>
        <nav className='nav-bar'>
          <div className='title-logo-container'>
            <div className='logo-container'>
              <img src="../assets/logo.png"
                alt="A logo design for a climbing application named 'Crag Compass"
              />
            </div>
            <div className='header-container'>
              <h1 className='title-text'> Crag Compass</h1>
            </div>
          </div>
          <div className='search-container'>
            <IconButton className='search-icon' aria-label='Search database' background='transparent' variant="none"
              fontSize='2rem'
              onClick={onOpen} icon={<Search2Icon />} />
            <Modal onClose={onClose} size={size} isOpen={isOpen} closeOnEsc colorScheme="teal" isCentered >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign="center" pt="3rem">Crag Search</ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDirection={'column'} gap="20px" className='modal-body'>
                  <FormControl className='form-content' isRequired >
                    <FormLabel>Location</FormLabel>
                    <Input isRequired={true} type='text' value={location} onChange={(e) => setLocation(e.target.value)} min={currentDateTime} />
                  </FormControl>

                  <FormControl className='form-content'>
                    <FormLabel>Depature Time</FormLabel>
                    <Input type='datetime-local' onChange={(e) => setDepartureDate(e.target.value)} value={departureDate} />
                  </FormControl>

                  <FormControl className='form-content'>
                    <FormLabel>Climbing Type</FormLabel>
                    <CheckboxGroup
                      value={climbingType}
                      onChange={handleCheckboxChange(setClimbingType)}
                    >
                      <Stack spacing={5} direction='row'>
                        <Checkbox value='all' >All</Checkbox>
                        <Checkbox value='bouldering'>Bouldering</Checkbox>
                        <Checkbox value='trad'>Trad</Checkbox>
                        <Checkbox value='sport'>Sport</Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>


                  <FormControl className='form-content'>
                    <FormLabel>Rock Type</FormLabel>
                    <CheckboxGroup
                      value={rockType}
                      onChange={handleCheckboxChange(setRockType)}
                    >
                      <Stack spacing={5} direction='row'>
                        <Checkbox value='all'>All</Checkbox>
                        <Checkbox value='granite'>Granite</Checkbox>
                        <Checkbox value='limestone'>Limestone</Checkbox>
                        <Checkbox value='grit'>Grit</Checkbox>
                        <Checkbox value='artificial'>Artificial</Checkbox>
                        <Checkbox value='sandstone'>Sandstone</Checkbox>
                      </Stack>
                    </CheckboxGroup>
                  </FormControl>

                  <FormControl className='form-content'>
                    <FormLabel pb="1rem">Routes</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
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
                      <RangeSliderThumb index={0} >
                        <Box className='grade-slider-value'>
                          <span>{numOfRoutes[0]}</span>
                        </Box>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <Box className='grade-slider-value'>
                          <span>{numOfRoutes[1] !== 500 ? numOfRoutes[1] : numOfRoutes[1] + '+'}</span>
                        </Box>
                      </RangeSliderThumb>
                    </RangeSlider>
                  </FormControl>

                  <FormControl className='form-content'>
                    <FormLabel pb="2rem">Distance</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
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
                        <Box className='distance-slider-value'>
                          {distRange[0] + 'km'}
                        </Box>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <Box className='distance-slider-value'>
                          {distRange[1] + 'km'}
                        </Box>
                      </RangeSliderThumb>
                    </RangeSlider>
                  </FormControl>
                  <Button w="25%" type="button" ml="12rem" mt="1rem" onClick={searchHandler} >
                    Search
                  </Button>

                </ModalBody>
                <ModalFooter>
                </ModalFooter>
              </ModalContent>
            </Modal>

          </div>
        </nav>
        <section className='main-content'>
          <SearchResults filteredCrags={filteredCrags} cragCount={filteredCrags.length}
            setFilteredCrags={setFilteredCrags} date={departureDate} />
        </section >
      </div >
    </>
  )
}

export default App

/*
Code to deal with driving distance and grades
const distanceMatrix = async (originCoords: Coords, destinationCoords: Coords) => {
  const origin = new google.maps.LatLng(+originCoords.lat, +originCoords.lng);
  const destination = new google.maps.LatLng(+destinationCoords.lat, +destinationCoords.lng);
  const service = new google.maps.DistanceMatrixService()
  const request: any = {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      departureTime: departureDate
    }
  }
  try {
    const results: any = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (results, status) => {
        if (status === 'OK') {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
    const timeInSecs = results?.rows[0]?.elements[0].duration_in_traffic?.value
    if (timeInSecs) {
      return timeInSecs;
    } else {
      return 'unknown'
    }
  } catch (err) {
    console.error(`Google distance matrix error: ${err} `)
  }
}
 <FormLabel>Grade Range</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
                      min={0}
                      max={sportGrade.length - 1}
                      defaultValue={[10, 20]}
                      minStepsBetweenThumbs={1}
                      onChange={handleGradeChange}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} >
                        <div className='grade-slider-value'>
                          <p>{gradeRange[0]}</p>
                        </div>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <div className='grade-slider-value'>
                          <p>{gradeRange[1]}</p>
                        </div>
                      </RangeSliderThumb>
                    </RangeSlider> */

// const handleGradeChange = (values: number[]) => {
//   const newGradeRange = [sportGrade[values[0]], sportGrade[values[1]]];
//   setGradeRange(newGradeRange);
// }
