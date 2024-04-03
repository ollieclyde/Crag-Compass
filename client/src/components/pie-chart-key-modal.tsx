import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
} from "@chakra-ui/react";

interface PieChartKeyModalProps {
  pieChartKeyModalFlag: boolean;
  setPieChartKeyModalFlag: Function;
}

const PieChartKeyModal = ({
  pieChartKeyModalFlag,
  setPieChartKeyModalFlag,
}: PieChartKeyModalProps) => {
  return (
    <Modal
      isOpen={pieChartKeyModalFlag}
      onClose={() => setPieChartKeyModalFlag(!pieChartKeyModalFlag)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Route Difficulty Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src="https://res.cloudinary.com/dsvnavnxo/image/upload/v1712157194/niegg5qoegqxkmtrt6er.png"
            alt="Pie Chart Key"
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PieChartKeyModal;
