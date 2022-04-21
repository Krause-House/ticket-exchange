import {
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN, CHAIN_ID } from "../constants";
import useExchange from "../hooks/useTicket";
import Waiting from "./Waiting";

interface BoothProps {
  className?: string;
  type: Ticket;
}

export enum Ticket {
  UpperLevel = "Upper Level",
  ClubLevel = "Club Level",
  Courtside = "Courtside",
}

function Booth({ className, type }: BoothProps) {
  const [modal, setModal] = useBoolean();
  const [tokenId, setTokenId] = useState(0);
  const [validTokenId, setValidTokenId] = useState(true);
  const {
    loading,
    success,
    waitingOnTxn,
    waitingOnUser,
    txnHash,
    error,
    ownsToken,
    hasToken,
    exchangeToken,
  } = useExchange();
  const [{ data: account }] = useAccount();
  const [hasTicket, setHasTicket] = useState(false);
  const [isExchanging, setExchanging] = useBoolean(false);
  const [{ data: network }] = useNetwork();

  useEffect(() => {
    hasToken().then((has) => {
      setHasTicket(has);
    });
  }, [account]);

  useEffect(() => {
    if (error) {
      setExchanging.off();
    }
  }, [error]);

  const maybeSetTokenId = (tokenId: string) => {
    const idAsNumber = parseInt(tokenId, 10);
    if (idAsNumber || tokenId === "") {
      setTokenId(idAsNumber);
      ownsToken(idAsNumber).then((userOwnsToken) => {
        setValidTokenId(userOwnsToken);
      });
    } else {
      setValidTokenId(false);
    }
  };

  const getGif = useMemo(() => {
    switch (type) {
      case Ticket.UpperLevel:
        return "/upperlevel.gif";
      case Ticket.ClubLevel:
        return "/clublevel.gif";
      case Ticket.Courtside:
        return "/courtside.gif";
    }
  }, [type]);

  const toast = useToast();
  const triggerError = (message: string) => {
    toast({
      id: "warning",
      position: "top",
      title: message,
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <div className="pb-60">
        <motion.div
          className={`relative w-44 h-52 flex flex-col justify-start py-4 my-4 items-center font-bold booth ${
            !hasTicket && "opacity-50"
          } ${className}`}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() => {
            if (!account) {
              triggerError("Connect your wallet, Jerry!");
            } else if (network.chain?.id != CHAIN_ID) {
              triggerError(`Switch to ${CHAIN}!`);
            } else if (!hasTicket) {
              triggerError(`This wallet doesn't have a ${type} ticket!`);
            } else {
              setModal.on();
            }
          }}
        >
          <img src={getGif} className="w-36 bottom-0 top-0 my-auto absolute" />
          <div className="text-white text-xs py-4 px-2 text-center font-vibes">
            {type}
          </div>
        </motion.div>
      </div>
      <Modal
        motionPreset="scale"
        isOpen={modal}
        onClose={() => {
          setModal.off();
          setExchanging.off();
        }}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader className="font-vibes w-9/12">
            Exchange your {type} ticket
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center gap-2 justify-center mt-12">
            {isExchanging ? (
              <Waiting
                type={type}
                loading={loading}
                waitingOnTxn={waitingOnTxn}
                waitingOnUser={waitingOnUser}
                success={success}
                txnHash={txnHash ?? ""}
              />
            ) : (
              <>
                <div className="flex gap-4">
                  <InputGroup>
                    <InputLeftAddon>Token ID</InputLeftAddon>
                    <Input
                      type="number"
                      isInvalid={!validTokenId}
                      value={tokenId}
                      onChange={(event) => maybeSetTokenId(event.target.value)}
                    />
                  </InputGroup>
                  <div
                    onClick={() =>
                      ownsToken(tokenId).then((userOwnsToken) => {
                        if (userOwnsToken) {
                          exchangeToken(tokenId);
                          setExchanging.on();
                        } else triggerError("You don't own this token ID!");
                      })
                    }
                    className="border border-black flex items-center px-2 pb-1 rounded-md font-vibes cursor-pointer"
                  >
                    Exchange
                  </div>
                </div>
                {!validTokenId && (
                  <div className="text-gray-300">
                    You don&apos;t own that token!
                  </div>
                )}
                <a href="" target="_blank" className="mt-12 underline">
                  How do I find my token ID?
                </a>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Booth;
