// build out a modal that will display the full crag information

// import all dependencies
import { Modal, Box, Text, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Image } from '@chakra-ui/react';
import { Crag } from '../types/types';
import RatingComponent from './rating-component';
import { GiMountainClimbing, GiStoneBlock } from "react-icons/gi";
import PieChartComponent from './pie-chart';
import { RiPinDistanceFill } from "react-icons/ri";
import WeatherComponent from './weather-component';
import './full-crag-info-modal.css';
import WarningIcon from './warning-icon';


export const FullCragInfoModal = ({ crag, daysFromNow, isOpen, onClose, setPieChartKeyModalFlag }: { crag: Crag, daysFromNow: number, isOpen: boolean, onClose: Function, setPieChartKeyModalFlag: Function }) => {

  const accessTitles: { [key: number]: string } = {
    1: 'Access Advice',
    2: 'Restricted Access',
    3: 'Access Banned'
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => onClose()} isCentered size={"6xl"} >
        <ModalOverlay />
        <ModalContent width='160vw'>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {crag?.cragInfo?.img !== 'no image available' &&
              (<Image src={crag.cragInfo?.img} alt="crag image" />)
            }
            <Box className="card-header-text">
              <Text as="b" fontSize="larger" >
                {crag.name}
              </Text>
              <Box className="avg-rating-component">
                <RatingComponent avgRating={crag.cragStats?.avgStars} />
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
            <Box className='features-approach-container'>
              <Box className="features-container">
                <Text>
                  Features
                </Text>
                <Text fontSize='small' >
                  {crag.cragInfo?.features}
                </Text>
              </Box>
              <Box className="approach-container">
                <Text>
                  Approach
                </Text>
                <Text fontSize='small'>
                  {crag.cragInfo?.approach}
                </Text>
              </Box>
              {crag?.cragInfo?.accessType !== undefined && crag.cragInfo.accessType !== 0 && (
                <Box className="approach-container">
                  <Box className='access-title-container'>
                    <Text className='access-title'>
                      {accessTitles[crag.cragInfo.accessType]}
                    </Text>
                    <WarningIcon accessType={crag.cragInfo?.accessType} />
                  </Box>
                  <Text fontSize='small'>
                    {crag.cragInfo?.accessNote.trim().replace(accessTitles[crag.cragInfo.accessType], '')}
                  </Text>
                </Box>
              )}
            </Box>
            <Box className="info-graphics-container-modal">
              <PieChartComponent crag={crag} setPieChartKeyModalFlag={setPieChartKeyModalFlag} />
              <Box className="weather-component-modal">
                <WeatherComponent lat={crag.osy} lon={crag.osx} daysFromNow={daysFromNow} />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}