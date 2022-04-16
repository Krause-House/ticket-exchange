import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import useTicket from "../hooks/useTicket";
import { Ticket } from "./Booth";
import Loader from "./Loader";

interface WaitingProps {
  type: Ticket;
  loading: boolean;
  waitingOnUser: boolean;
  waitingOnTxn: boolean;
  success: boolean;
  txnHash: string;
}

function Waiting({
  type,
  loading,
  waitingOnUser,
  waitingOnTxn,
  success,
  txnHash,
}: WaitingProps) {
  return (
    <>
      <div className="flex flex-col gap-4 items-center text-center">
        {loading && <Loader />}
        {waitingOnUser && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            Approve the transaction in MetaMask.
          </motion.div>
        )}
        {waitingOnTxn && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            Waiting for your transaction to process... View it on the block
            explorer{" "}
            <b>
              <a
                href={`https://rinkeby.etherscan.io/tx/${txnHash}`}
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </b>
            .
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            Success! Your new ticket should be in your wallet soon. View the
            transaction{" "}
            <b>
              <a
                href={`https://rinkeby.etherscan.io/tx/${txnHash}`}
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </b>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default Waiting;
