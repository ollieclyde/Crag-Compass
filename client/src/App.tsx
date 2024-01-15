import { useEffect, useState } from 'react'

import { Checkbox, CheckboxGroup, Stack, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, FormControl, FormLabel, Input, Button} from '@chakra-ui/react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'

import { GoogleApiKey } from '../config/api-config'
import { useLoadScript } from '@react-google-maps/api';

import apiClientService from './Api-client-service'
import { Crag, Coords } from './types/types'
import moment from 'moment'

import './App.css'

import { SearchResults } from './components/search-results';

const googleMapLibrary: any = ['places']
const sportGrade: string[] = ['4a', '4b', '4c', '5a', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c +', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+']
const currentDateTime = moment().format('YYYY-MM-DDTHH:mm');

function App() {
  const [crags, setCrags] = useState<Crag[]>([]);
  const [filteredCrags, setFilteredCrags] = useState<Crag[]>([]);

  const [location, setLocation] = useState<string>('London');
  const [currentCoords, setCurrentCords] = useState<Coords>({ lat: '51.509865', lng: '-0.118092' })
  const [departureDate, setDepartureDate] = useState<any>(new Date(Date.now()))
  const [climbingType, setClimbingType] = useState<any[]>(['all']);
  const [rockType, setRockType] = useState<any>(['all']);
  const [numOfRoutes, setNumOfRoutes] = useState<number[]>([0, 500]);
  const [gradeRange, setGradeRange] = useState<string[]>(['5a', '8a']);
  const [driveLength, setDriveLength] = useState<number[]>([0, 60]);
  const [geoLocation, setGeoLocation] = useState<number[]>([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GoogleApiKey, // Replace with your API key
    libraries: googleMapLibrary
  });

  useEffect(() => {
    if (isLoaded && !loadError) {
      fetchCrags();
    }
  }, [isLoaded, loadError]);

  const fetchCrags = async () => {
    try {
      if (currentCoords) {
        const apiResults = await apiClientService.getAllCrags(currentCoords.lng, currentCoords.lat, driveLength[1]);
        setCrags(apiResults);
        setFilteredCrags(apiResults);
      }
    } catch (error) {
      console.error('Error fetching crags:', error);
    }
  };

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
      const timeInSecs = results?.rows[0]?.duration_in_traffic?.value
      if (timeInSecs) {
        return timeInSecs;
      } else {
        return 'unknown'
      }
    } catch (err) {
      console.error(`Google distance matrix error: ${err} `)
    }
  }

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
      setter(values.filter(value => value !== 'all'));
    } else if (!flag) {
      setter(values);
    } else {
      setter(['all'])
    }
  };

  const handleGradeChange = (values: number[]) => {
    const newGradeRange = [sportGrade[values[0]], sportGrade[values[1]]];
    setGradeRange(newGradeRange);
  }

  const handleDriveTime = (values: number[]) => {
    setDriveLength(values);
  }

  const numOfRoutesHandler = (values: number[]) => {
    setNumOfRoutes(values)
  }

  const searchHandler = () => {
    const filtered = crags.filter(crag => basicFilter(crag));
    // distanceMatrix(currentCoords, { lng: '-0.16544', lat: "51.49153" })
    setFilteredCrags(filtered);
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
    //ENSURE WORKS WITH UNKnown
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

  return (
    <>
      <div className='page-root'>
        <nav className='nav-bar'>
          <div className='logo-container'>
            <img src="../assets/logo.png"
              alt="A logo design for a climbing application named 'Crag Compass"
            />
          </div>
          <div className='search-container'>
            <Button onClick={onOpen} key={size}>
              Search
            </Button>
            <Modal onClose={onClose} size={size} isOpen={isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl >
                    <FormLabel>Location</FormLabel>
                    <Input type='text' value={location} onChange={(e) => setLocation(e.target.value)} min={currentDateTime} />
                    <FormLabel>Depature Time</FormLabel>
                    <Input type='datetime-local' value={departureDate} />
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
                      </Stack>
                    </CheckboxGroup>
                    <FormLabel>Routes</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
                      min={0}
                      max={500}
                      defaultValue={[0, 500]}
                      minStepsBetweenThumbs={1}
                      onChange={numOfRoutesHandler}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} >
                        <div className='grade-slider-value'>
                          <p>{numOfRoutes[0]}</p>
                        </div>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <div className='grade-slider-value'>
                          <p>{numOfRoutes[1] !== 500 ? numOfRoutes[1] : numOfRoutes[1] + '+'}</p>
                        </div>
                      </RangeSliderThumb>
                    </RangeSlider>
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
                    </RangeSlider>
                    <FormLabel>Drive</FormLabel>
                    <RangeSlider
                      aria-label={['min', 'max']}
                      defaultValue={[0, 60]}
                      min={0}
                      max={120}
                      step={5}
                      minStepsBetweenThumbs={1}
                      onChange={handleDriveTime}
                    >
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0}>
                        <div className='drive-slider-value'>
                          <p>{driveLength[0]} mins</p>
                        </div>
                      </RangeSliderThumb>
                      <RangeSliderThumb index={1}>
                        <div className='drive-slider-value'>
                          <p>{driveLength[1]} mins</p>
                        </div>
                      </RangeSliderThumb>
                    </RangeSlider>
                    <Button type="button" onClick={searchHandler}>
                    </Button>
                  </FormControl>


                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

          </div>
        </nav>
        <section className='main-content'>
          <SearchResults filteredCrags={filteredCrags} setFilteredCrags={setFilteredCrags} />
        </section >
      </div >
    </>
  )
}

/*
Left Over TODOs

TODO: grey out calendar if before current date
TODO: format time on drive slider to be more presentable
TODO: Ensure Date state variable changes on state change;
TODO: Sort the form to have required values and ensure to controlled/uncontrolled warnings
TODO: Sort date so that format can be used in google distance matrix as well as input form
*/
export default App
