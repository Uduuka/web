"use client";

import { useAppStore } from "@/lib/store";
import { pretifyMoney, toMoney } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useTransition } from "react";
import { redirect, useSearchParams } from "next/navigation";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Order, Profile, Store } from "@/lib/types";
import { placeOrder } from "@/lib/actions";
import { Check, LoaderCircle, X } from "lucide-react";
import Modal from "../models/Modal";
import LocationMap from "../maps/mapbox/LocationMap";
import ScrollArea from "../layout/ScrollArea";

export function PlaceOrder({
  setSuccess,
  profile
}: {
  setSuccess: (m: { message: string; store: Store }) => void;
  profile: Profile | null
}) {
  const {
    cart: { items, store, total, clearCart },
    currency,
  } = useAppStore();

  const [payementError, setPayementError] = useState("");
  const [number, setNumber] = useState<string>();
  const [submitting, startSubmitting] = useTransition();
  const [status, setStatus] = useState<"inquiry" | "pending">();
  const [pMessage, setPMessage] = useState("");
  const [deliverTo, setDeliverTo] = useState<{
    type: string;
    address: string;
    coordinates?: GeolocationCoordinates;
  }>();

  const dialodRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const method = useSearchParams().get("method") as "cash" | "mtn" | "airtel";

  const handleSubmit = () => {
    startSubmitting(async () => {
      if (!profile) {
        return redirect(`/signin?next=/order`);
      }

      if (!store) {
        setPayementError("The sore is undefined.");
        return;
      }

      if (!status) {
        setPayementError("Invalid order status.");
        return;
      }

      if (!deliverTo) {
        setPayementError(
          "Please specify where you want this order to be delivered."
        );
        return;
      }

      if (!method) {
        setPayementError("Choose a payement method.");
        return;
      }

      if (!number || number.length < 9 || number.length > 13) {
        setPayementError("Enter a valid phone number.");
        return;
      }

      const message =
        status === "inquiry"
          ? "Inquiry sent successfully! Remeber to check for the invoice to pay."
          : "Order placed successfully! Watch you phone to complete the payement process.";

      const order: Order = {
        p_desired_currency: currency,
        p_method: method,
        p_status: status,
        p_order_items: items.map((o) => ({
          pricing_id: o.pricing.id!,
          quantity: Number(o.qty),
          units: o.units,
        })),
        p_store_id: store.id,
        p_buyer_id: profile.user_id,
        p_phone: number,
        p_message: pMessage,
        p_deliver_to: deliverTo,
        p_amount: Number(pretifyMoney(total, currency)),
        p_type: "remote",
      };
      const { error } = await placeOrder(order);
      if (error) {
        setPayementError(error.message);
        return;
      }
      setSuccess({ message, store });
      clearCart?.();
      formRef.current?.submit();
    });
  };

  const orderOrInquire = (s: "pending" | "inquiry") => {
    if (!profile) {
      return redirect(`/signin?next=/order`);
    }
    setStatus(s);
    if (dialodRef.current) {
      dialodRef.current.showModal();
    }
  };

  return (
    <>
      <p className="text-gray-500">
        Thank you for shopping with {store?.name}. Please select a payement
        option and pay{" "}
        <span className="font-bold">
          {currency} {toMoney(total.toString(), currency)}
        </span>{" "}
        to place your order.
      </p>

      <div className="p-5 text-center space-y-5 border-2 transition-all duration-500 rounded-lg border-primary w-full mx-auto mt-5">
        <h1 className="text-xl font-bold">Select a payement method</h1>
        <div className="flex gap-5 justify-center items-center">
          <div className="flex flex-col gap-1">
            <Link
              href={`?method=mtn`}
              className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
            >
              <Image
                height={100}
                width={100}
                src="/logos/mtn.jpg"
                alt="MTN"
                className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
              />
            </Link>
            <div
              className={`h-1 bg-amber-400 rounded transition-all duration-500 w-0 ${
                method === "mtn" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          <h1 className="text-xl font-bold">Or</h1>
          <div className="flex flex-col gap-1">
            <Link
              href={`?method=airtel`}
              className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
            >
              <Image
                height={100}
                width={100}
                src="/logos/airtel.jpg"
                alt="Airtel"
                className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
              />
            </Link>
            <div
              className={`h-1 bg-red-600 rounded transition-all duration-500 w-0 ${
                method === "airtel" ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
        </div>
        <div>
          {payementError && (
            <div className="bg-red-50 px-4 py-2 rounded-lg text-error flex items-center">
              <p className="w-full text-left">{payementError}</p>
              <Button
                onClick={() => setPayementError("")}
                className="bg-error text-white p-1 rounded-full"
              >
                <X size={10} />
              </Button>
            </div>
          )}
          <div className="space-y-4 max-w-sm mx-auto">
            <FormGroup label="Ammount" className="text-left">
              <FormInput
                className=""
                disabled
                value={toMoney(total.toString(), currency)}
                icon={<span className="px-2">{currency}</span>}
                onChange={() => {}}
                wrapperStyle="border-2"
              />
            </FormGroup>
            <FormGroup label="Mobile number" className="text-left">
              <FormInput
                className=""
                value={number ?? ""}
                disabled={!Boolean(method)}
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                wrapperStyle="border-2"
                placeholder={
                  method
                    ? `Enter an ${method} number`
                    : "Select a payement method"
                }
              />
            </FormGroup>
          </div>
          <div className="flex gap-5 pt-5 justify-center">
            <Button
              type="button"
              onClick={() => {
                orderOrInquire("inquiry");
              }}
              className="bg-primary w-full max-w-sm mx-auto text-background shadow disabled:opacity-20"
            >
              Inquire
            </Button>
            <Button
              type="button"
              onClick={() => {
                orderOrInquire("pending");
              }}
              className="bg-primary w-full max-w-sm mx-auto text-background shadow disabled:opacity-20"
            >
              Pay now
            </Button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialodRef}
        className="outline-0 p-5 w-full mx-auto mt-20 bg-transparent backdrop:bg-black/30"
      >
        <div className="w-full max-w-sm bg-white shadow text-gray-500 rounded-lg mx-auto">
          <div className="flex justify-between items-center px-5 pt-2 pb-1 border-b-2 border-gray-300">
            <h1 className="text-base">
              Place an {status === "inquiry" ? status : "order"}
            </h1>
            <form method="dialog">
              <Button className="p-1">
                <X size={15} />
              </Button>
            </form>
          </div>
          <div className="px-5 py-2">
            <ScrollArea className="py-2 space-y-5">
              <p>Where or how should this order be deliver to you?</p>
              <div className="flex flex-wrap items-center gap-5">
                <Button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (l) => {
                          setDeliverTo({
                            coordinates: l.coords,
                            type: "current location",
                            address: "Current location",
                          });
                        },
                        (e) => {
                          console.log(e.message);
                          setDeliverTo({
                            type: "current location",
                            address: "Current location",
                          });
                        }
                      );
                    }
                    setDeliverTo({
                      type: "current location",
                      address: "Current location",
                    });
                  }}
                  className={`hover:bg-secondary justify-between ${
                    deliverTo?.type === "current location"
                      ? "bg-primary text-white hover:bg-orange-400 hover:text-white"
                      : ""
                  }`}
                >
                  <span className="text-left">
                    <p>My current location</p>
                  </span>
                </Button>
                <Modal
                  trigger={
                    <span className="text-left">
                      <p>Choose a location</p>
                    </span>
                  }
                  triggerStyle={`hover:bg-secondary ${
                    deliverTo?.type === "chosen"
                      ? "bg-primary text-white hover:bg-orange-400 hover:text-white"
                      : ""
                  }`}
                  header="Choose a location."
                >
                  <div className="h-80 p-2 flex flex-col w-full">
                    <LocationMap
                      onLocationChange={(l, a) => {
                        const lat = l.split(" ")[1]?.split(")")[0];
                        const lon = l.split(" ")[0]?.split("(")[1];
                        setDeliverTo({
                          type: "chosen",
                          coordinates: {
                            latitude: Number(lat ?? "0.3341463828774225"),
                            longitude: Number(lon ?? "32.652492627121795"),
                          } as GeolocationCoordinates,
                          address: a,
                        });
                      }}
                    />
                  </div>
                </Modal>
                {profile?.default_address && (
                  <Button
                    onClick={() => {
                      setDeliverTo({
                        type: "saved",
                        address: profile.default_address ?? "Saved location.",
                      });
                    }}
                    className={`hover:bg-secondary ${
                      deliverTo?.type === "saved"
                        ? "bg-primary text-white hover:bg-orange-400 hover:text-white"
                        : ""
                    }`}
                  >
                    <span className="text-left">
                      <p>Use saved location</p>
                    </span>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setDeliverTo({
                      type: "store",
                      coordinates: {} as GeolocationCoordinates,
                      address: "store's address",
                    });
                  }}
                  className={`hover:bg-secondary ${
                    deliverTo?.type === "store"
                      ? "bg-primary text-white hover:bg-orange-400 hover:text-white"
                      : ""
                  }`}
                >
                  <span className="text-left">
                    <p>Pick from the store</p>
                  </span>
                </Button>
              </div>
              {deliverTo && (
                <FormGroup
                  label="Deliver to"
                  className="bg-secondary px-5 py-3 rounded-lg"
                >
                  <p className="text-left font-bold line-clamp-1">
                    {deliverTo.address}
                  </p>
                </FormGroup>
              )}
              <FormGroup label="Message" htmlFor="message" className="">
                <textarea
                  id="message"
                  rows={2}
                  value={pMessage}
                  onChange={(e) => {
                    setPMessage(e.target.value);
                  }}
                  className="outline-0 border rounded-lg resize-none px-3 py-2 focus:border-primary"
                ></textarea>
              </FormGroup>
            </ScrollArea>
            {payementError && (
              <div className="bg-red-50 px-4 py-2 rounded-lg text-error flex items-center">
                <p className="w-full text-left font-thin text-xs">
                  {payementError}
                </p>
                <Button
                  onClick={() => setPayementError("")}
                  className="bg-error text-white p-1 rounded-full"
                >
                  <X size={10} />
                </Button>
              </div>
            )}
            <form
              ref={formRef}
              method="dialog"
              className="flex gap-5 items-center py-3"
            >
              <Button className="bg-transparent border-error text-error border-2 w-full hover:text-white hover:bg-error">
                <X size={15} className="mr-2" /> Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-transparent border-success text-success border-2 w-full hover:text-white hover:bg-success"
              >
                {submitting ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <>
                    <Check size={15} className="mr-2" /> Proceed
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
