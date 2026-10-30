import { createContext, useContext } from "react";

export const OwnerSessionContext = createContext(false);
export function useOwnerSession() {
  return useContext(OwnerSessionContext);
}