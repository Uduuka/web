import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchPersonalAds } from "../actions";

export const usePersonalAds = () => {
  const [ads, setAds] = useState<Listing[]>([]);
  const [error, setError] = useState<string>();
  const [fetching, startFetching] = useTransition();

  useEffect(() => {
    startFetching(async () => {
      const { error, data } = await fetchPersonalAds();

      setAds((data ?? []) as Listing[]);
      setError(error?.message);
    });
  }, []);

  return { ads, fetching, error };
};
