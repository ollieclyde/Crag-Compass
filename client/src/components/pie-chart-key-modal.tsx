
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Image } from '@chakra-ui/react';
export const PieChartKeyModal = ({ pieChartKeyModalFlag, setPieChartKeyModalFlag }: { pieChartKeyModalFlag: boolean, setPieChartKeyModalFlag: Function }) => {

  return (
    <Modal isOpen={pieChartKeyModalFlag} onClose={() => setPieChartKeyModalFlag(!pieChartKeyModalFlag)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Route Difficulty Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src="/assets/RockFax-Grades.png" alt="Pie Chart Key" />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};


