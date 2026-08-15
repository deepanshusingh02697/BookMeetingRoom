import { useQuery } from "@apollo/client/react";
import { currentUser_Query } from "../graphql/Query";
import type { CurrUser_Interface } from "../graphql/Client";

export const UseAuthContext = () => {
  const { data, loading, error } =
    useQuery<CurrUser_Interface>(currentUser_Query);

  const authUser = data?.CurrUser ?? null;
  return { authUser, loading, error };
};
