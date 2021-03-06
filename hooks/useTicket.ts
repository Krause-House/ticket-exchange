import { useState } from "react";
import { Contract } from "ethers";
import { useToast } from "@chakra-ui/react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { CHAIN, CHAIN_ID, V2_CONTRACT } from "../constants";
import { useTicketContext } from "../contexts/TicketContext";
declare var window: any;

export default function useTicket() {
  const [success, setSuccess] = useState<any | undefined>();
  const [loading, setLoading] = useState(false);
  const [waitingOnUser, setWaitingOnUser] = useState(false);
  const [waitingOnTxn, setWaitingOnTxn] = useState(false);
  const [txnHash, setTxnHash] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [{ data: network }] = useNetwork();
  const [{ data: signer }] = useSigner();
  const [{ data: account }] = useAccount();
  const toast = useToast();

  const { state: ticket } = useTicketContext();

  const triggerError = (message: string) => {
    toast({
      id: "error",
      position: "top",
      title: message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const ownsToken = async (tokenId: number) => {
    try {
      if (signer && network.chain?.id === CHAIN_ID) {
        const contract = new Contract(
          ticket.ticketAddress ?? "",
          ["function ownerOf(uint256) public view returns (address)"],
          signer
        );
        const owner = await contract.ownerOf(tokenId);
        return owner === account?.address;
      } else if (network.chain?.id != CHAIN_ID) {
        triggerError(`You gotta be on ${CHAIN}!`);
        return false;
      } else if (!signer) {
        triggerError("Connect your wallet Jerry!");
        return false;
      }
    } catch (error: any) {
      return false;
    }
    return false;
  };

  const hasToken = async () => {
    try {
      if (signer && network.chain?.id === CHAIN_ID) {
        const contract = new Contract(
          ticket.ticketAddress ?? "",
          ["function balanceOf(address) public view returns (uint256)"],
          signer
        );
        const balance = await contract.balanceOf(account?.address);
        return balance > 0;
      }
    } catch (error: any) {
      return false;
    }
    return false;
  };

  const exchangeToken = async (tokenId: number) => {
    try {
      setLoading(true);
      if (signer && ownsToken(tokenId)) {
        const contract = new Contract(
          ticket.ticketAddress ?? "",
          ["function safeTransferFrom(address, address, uint256) external"],
          signer
        );

        setWaitingOnUser(true);
        let tx = await contract.safeTransferFrom(
          account?.address,
          V2_CONTRACT,
          tokenId
        );
        setWaitingOnUser(false);
        setWaitingOnTxn(true);
        setTxnHash(tx.hash);
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          setSuccess(true);
        } else {
          setError("Transaction failed! Please try again");
          triggerError("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      setError("Transaction failed! Please try again");
      triggerError("Transaction failed! Please try again");
    } finally {
      setWaitingOnTxn(false);
      setWaitingOnUser(false);
      setLoading(false);
    }
  };

  return {
    success,
    loading,
    error,
    waitingOnUser,
    waitingOnTxn,
    txnHash,
    ownsToken,
    hasToken,
    exchangeToken,
  };
}
