import * as React from "react";
import { LEGACY_CONTRACT } from "../constants";

type Dispatch = (ticket: string) => void;
type TicketProviderProps = { children: React.ReactNode };
type State = {
  ticketAddress?: string;
};

const TicketContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function TicketReducer(state: State, newTicketAddress: string) {
  return { ticketAddress: newTicketAddress } as State;
}

function TicketProvider({ children }: TicketProviderProps) {
  const [state, dispatch] = React.useReducer(TicketReducer, {} as State);

  const value = { state, dispatch };
  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
}

function useTicketContext() {
  const context = React.useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTicket must be used within a TicketProvider");
  }
  return context;
}

export { TicketProvider, useTicketContext };
