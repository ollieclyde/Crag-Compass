import { useState } from 'react'
import { Button, Card, CardBody, Text } from '@chakra-ui/react';

import { Crag } from '../types/types';

export function SearchResults({ filteredCrags, setFilteredCrags }: any) {

  const [filterFlag, setFilterFlag] = useState(false);
  const [routeFlag, setRouteFlag] = useState(false);

  const filterHandler = () => {
    if (filterFlag) {
      setFilterFlag(false);
    } else {
      setFilterFlag(true);
    }
  }

  const handleRouteFilter = () => {
    if (routeFlag) {
      setRouteFlag(false)
      const sortedFilteredCragsAsc = filteredCrags.sort((a: any, b: any) => {
        return a.routes - b.routes;
      })
      setFilteredCrags(sortedFilteredCragsAsc)
    } else {
      setRouteFlag(true);
      const sortedFilteredCragsDesc = filteredCrags.sort((a: any, b: any) => {
        return b.routes - a.routes;
      })
      setFilteredCrags(sortedFilteredCragsDesc)
    }
  }

  return (
    <>
      <div className='search-results'>
        <div className='search-filter'>
          <Button onClick={filterHandler}>
            Filter
          </Button>
          {filterFlag ?
            <Button onClick={handleRouteFilter}>
              Routes
            </Button>
            : null
          }
        </div>
        {
          Array.isArray(filteredCrags) ? filteredCrags.map((crag: any, index: number) => (
            <Card className='crag-card'
              key={index}
              direction={{ base: 'column', sm: 'row' }}
              overflow='hidden'
              variant='outline'
              background={'gray'}
              color={'white'}
            >
              <CardBody>
                <Text> {crag.cragName} </Text>
                <Text> {crag.location} </Text>
                <Text> {crag.country} </Text>
                <Text> Rock: {crag.rockType[0].toUpperCase() + crag.rockType.slice(1)} </Text>
                <Text> Climbing Type: {crag.climbingTypes.map((type:any)=>(
                  <p>
                   { type.climbingType}
                  </p>
                ))}
                </Text>
                <Text> Routes: {crag.routes} </Text>
              </CardBody>
            </Card>
          )) : null
        }
      </div >
    </>
  )
}
