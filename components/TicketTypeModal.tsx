import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

interface TicketTypeModalProps {
  isOpen: boolean;
  close: () => void;
}

function TicketTypeModal({ isOpen, close }: TicketTypeModalProps) {
  return (
    <Modal motionPreset="scale" isOpen={isOpen} onClose={close} size="lg">
      <ModalOverlay />
      <ModalContent pb={5}>
        <ModalHeader className="font-vibes w-9/12">Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col items-center gap-2 justify-center mt-12"></ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TicketTypeModal;
