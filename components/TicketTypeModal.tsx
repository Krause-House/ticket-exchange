import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LEGACY_CONTRACT, WILL_CALL_CONTRACT } from "../constants";
import { useTicketContext } from "../contexts/TicketContext";

interface TicketTypeModalProps {
  isOpen: boolean;
  close: () => void;
}

function TicketTypeModal({ isOpen, close }: TicketTypeModalProps) {
  const { state: ticket, dispatch: setTicket } = useTicketContext();
  return (
    <Modal motionPreset="scale" isOpen={isOpen} onClose={close} size="lg">
      <ModalOverlay />
      <ModalContent pb={5}>
        <ModalHeader className="font-vibes w-9/12">
          How&apos;d you get your ticket?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col items-center gap-2 justify-center">
          <div className="flex flex-col gap-2 text-center">
            <motion.div
              className="font-vibes font-bold text-xs h-20 p-2 px-4 pb-5 flex items-center justify-center text-center button cursor-pointer"
              onClick={() => setTicket(WILL_CALL_CONTRACT)}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Will Call
            </motion.div>
            <motion.div
              className="font-vibes font-bold text-xs h-20 p-2 px-4 pb-5 flex items-center text-center justify-center button cursor-pointer"
              onClick={() => setTicket(LEGACY_CONTRACT)}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Mirror Sale
            </motion.div>
            <a
              href="https://krausehousework.notion.site/How-to-Migrate-Legacy-Tickets-to-the-V2-Ticket-Contract-58f047c48e6f4d0eb3a313d3438c04dd"
              target="_blank"
              rel="noreferrer"
              className="mt-12 underline"
            >
              How do I know?
            </a>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TicketTypeModal;
