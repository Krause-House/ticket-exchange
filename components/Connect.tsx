import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useBoolean,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useNetwork } from "wagmi";

function Connect() {
  const [
    { data: account, error: accountError, loading: accountLoading },
    disconnect,
  ] = useAccount();
  const [{ data, error, loading }, connect] = useConnect();
  const [{ data: network }, switchNetwork] = useNetwork();
  const [modal, setModal] = useBoolean();

  useEffect(() => {
    if (account) {
      setModal.off();
    }
  }, [account]);

  return (
    <>
      {network.chain?.id == 4 || !account ? (
        <motion.div
          className="font-vibes text-sm border-4 border-black rounded-md p-2 pb-3 flex items-center"
          onClick={account ? disconnect : setModal.on}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          {data.connected
            ? account?.ens?.name ||
              account?.address.slice(0, 6) + "..." + account?.address.slice(-4)
            : "Connect Wallet"}
        </motion.div>
      ) : (
        <motion.div
          className="font-vibes text-sm border-4 border-black rounded-md p-2 px-4 gap-2 flex items-center"
          onClick={() => switchNetwork && switchNetwork(4)}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <img src="/ethereum.png" className="w-8 h-8" />
          <div className="mb-1">Switch to Rinkeby</div>
        </motion.div>
      )}
      <Modal
        motionPreset="scale"
        isOpen={modal}
        onClose={setModal.off}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent pb={5}>
          <ModalHeader className="font-vibes">Select your wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex justify-center">
            {data.connectors.map((x) => (
              <div className="relative flex justify-center w-72" key={x.name}>
                <button
                  key={x.name}
                  onClick={() => connect(x)}
                  className="z-10 border-2 border-black rounded-md flex items-center justify-center hover:bg-black hover:text-white font-semibold transition px-4 py-2 my-2"
                >
                  {x.name === "MetaMask" && (
                    <img src="/metamask.png" className="mr-2 w-6 h-6" />
                  )}
                  {x.name}
                </button>
              </div>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Connect;