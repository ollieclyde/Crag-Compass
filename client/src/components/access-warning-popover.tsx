import React from 'react';
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';
import { IoWarning } from 'react-icons/io5';
import { Crag } from '../types/types';

interface AccessWarningPopoverProps {
  accessType: number;
  accessNote: string;
}

const AccessWarningPopover: React.FC<AccessWarningPopoverProps> = ({ accessType, accessNote }) => {
  const warningColor: { [key: number]: string } = {
    1: 'blue',
    2: 'yellow',
    3: 'red',
  };

  return (
    <Popover placement="bottom" closeOnBlur={false} trigger='hover'>
      <PopoverTrigger>
        <IconButton aria-label="Warning label" colorScheme={warningColor[accessType]} icon={<IoWarning />} />
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800" width={"30vw"} height={"auto"}>
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Access Note
        </PopoverHeader>
        <PopoverArrow bg="blue.800" />
        <PopoverBody>
          {accessNote}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AccessWarningPopover;
