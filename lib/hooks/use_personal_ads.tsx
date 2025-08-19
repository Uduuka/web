import { useEffect, useState, useTransition } from "react";
import { Listing } from "../types";
import { fetchPersonalAds } from "../actions";
import { useParams } from "next/navigation";

export const usePersonalAds = () => {
  const [ads, setAds] = useState<Listing[]>([]);
  const [error, setError] = useState<string>();
  const [fetching, startFetching] = useTransition();

  const storeID = useParams().storeID as string | undefined;

  useEffect(() => {
    startFetching(async () => {
      const { error, data } = await fetchPersonalAds({ store_id: storeID });

      setAds((data ?? []) as Listing[]);
      setError(error?.message);
    });
  }, []);

  return { ads, fetching, error };
};
