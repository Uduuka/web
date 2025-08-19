import React, { useEffect, useState, useTransition } from "react";
import Model from "./Model";
import { TbExchange } from "react-icons/tb";
import ScrollArea from "../layout/ScrollArea";
import { Listing } from "@/lib/types";
import { fetchPersonalAds, updateMultipleAds } from "@/lib/actions";
import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";

export default function AdsModel() {
  const [ads, setAds] = useState<Listing[]>();
  const [fetching, startFetching] = useTransition();
  const [updating, startUpdating] = useTransition();
  const [error, setError] = useState<string>();
  const [selected, setSelected] = useState<Listing[]>();

  const storeID = useParams().storeID as string;

  useEffect(() => {
    startFetching(async () => {
      const { error, data } = await fetchPersonalAds({ store_id: null });

      if (error) {
        setError(error.message);
        return;
      }

      setAds(data);
    });
  }, []);

  const handleUpdateAds = async () => {
    startUpdating(async () => {
      if (!selected?.length || !storeID) {
        console.log({ selected, storeID });
        return;
      }
      const ids = selected?.map((ad) => ad.id) || [];
      const fields = { store_id: storeID };

      const { error, data: res } = await updateMultipleAds(ids, fields);
      console.log({ error, res });
      if (error) {
        setError(error.message);
        return;
      }
    });
  };

  return (
    <Model
      triggerStyle="w-fit"
      header="Add from library"
      trigger={
        <>
          <TbExchange size={15} />
          Add from collection
        </>
      }
    >
      {fetching && <div className=""></div>}
      {error && !ads ? (
        <>Error: {error}</>
      ) : (
        <div className="w-[90vw] max-w-md p-5 space-y-2 max-h-[70vh]">
          <ScrollArea maxHeight="100%">
            <div className="h-fit">
              {ads?.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => {
                    setSelected((prev) => {
                      if (prev?.some((item) => item.id === ad.id)) {
                        return prev.filter((item) => item.id !== ad.id);
                      }
                      return [...(prev || []), ad];
                    });
                  }}
                  className={`p-3 ${
                    selected?.some((item) => item.id === ad.id)
                      ? "bg-gray-200"
                      : "bg-gray-50 text-primary"
                  } flex rounded-md mb-2 hover:bg-gray-200 group transition-colors cursor-pointer`}
                >
                  <div className="w-full text-left">
                    <h2 className="font-semibold">{ad.title}</h2>
                    <p className="text-sm text-gray-600">{ad.description}</p>
                  </div>
                  <div className="flex w-fit justify-end items-end">
                    <span
                      className={`group-hover:opacity-100 ${
                        selected?.some((item) => item.id === ad.id)
                          ? "opacity-100"
                          : "opacity-0"
                      } transition-opacity duration-200 text-xs px-2 py-1 rounded bg-gray-300`}
                    >
                      {selected?.some((item) => item.id === ad.id)
                        ? "Selected"
                        : "Select"}
                    </span>
                  </div>
                </div>
              ))}
              {!ads?.length && (
                <p className="text-gray-500">No ads available in library.</p>
              )}
            </div>
          </ScrollArea>
          <div className="bg-white text-primary p-5 space-y-5 rounded-lg">
            <p className="text-center">
              {selected?.length ?? 0} selected out of {ads?.length} ads
            </p>
            <Button
              disabled={!selected?.length}
              onClick={handleUpdateAds}
              className="w-full bg-primary text-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Updating..." : "Add to store"}
            </Button>
          </div>
        </div>
      )}
    </Model>
  );
}
