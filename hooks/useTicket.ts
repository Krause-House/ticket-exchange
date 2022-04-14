import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
// import contractMetadata from "@contracts/Domains.json";
import { useToast } from "@chakra-ui/react";
import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useSigner,
} from "wagmi";
declare var window: any;

export default function useTicket(address: string) {
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
      if (signer && network.chain?.id === 4) {
        const contract = new Contract(
          address,
          ["function ownerOf(uint256) public view returns (address)"],
          signer
        );
        const owner = await contract.ownerOf(tokenId);
        return owner === account?.address;
      } else if (network.chain?.id != 4) {
        triggerError("You gotta be on Rinkeby!");
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
      if (signer && network.chain?.id === 4) {
        const contract = new Contract(
          address,
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
          address,
          ["function safeTransferFrom(address, address, uint256) external"],
          signer
        );

        setWaitingOnUser(true);
        let tx = await contract.safeTransferFrom(
          account?.address,
          "0xd592d7ec844E71b64240d183AA6877BF2A7f351C",
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
