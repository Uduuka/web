"use client";

import Button from "@/components/ui/Button";
import { Listing, Pricing } from "@/lib/types";
import React, { useState, useTransition } from "react";

import AdForm from "./AdForm";
import { PricingForm } from "./PricingForm";
import LocationForm from "./LocationForm";
import AdImagesUploadForm from "./AdImagesUploadForm";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, ChevronLeft, LoaderCircle, X } from "lucide-react";
import { BiQuestionMark } from "react-icons/bi";
import { postAd, postPricing } from "@/lib/actions";

export default function CreateAdForm({ className }: { className?: string }) {
  const [ad, setAd] = useState<Listing>();
  const [pricings, setPricings] = useState<Pricing<any>[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, startSubmitting] = useTransition();

  const [location, setLocation] = useState<{
    locationString: string;
    address: string;
  }>();
  const [adImages, setAdImages] = useState<File[]>([]);

  const handleLocationChange = (l: string, a: string) => {
    setLocation({ locationString: l, address: a });
  };

  const setCurrent = (index: number) => {
    setCurrentStep(index);
  };

  const next = () => {
    currentStep < 4 ? setCurrent(currentStep + 1) : setCurrent(0);
  };

  const prev = () => {
    currentStep > 0 ? setCurrent(currentStep - 1) : setCurrent(0);
  };

  const handleUpload = (files: File[]) => {
    setAdImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = async () => {
    // Submit the ad to your backend or API

    startSubmitting(async () => {
      if (!ad || !location || pricings.length === 0 || adImages.length === 0) {
        setError("Please fill in all required fields before submitting.");
        return;
      }
      const adData = {
        ...ad,
        location: location.locationString,
        address: location.address,
      };

      // Create a new ad with the provided data
      const newAd = await postAd(adData);
      if (!newAd.data?.id) {
        setError("Failed to create ad. Please try again.");
        return;
      }

      // Add pricing information
      const { error: pricingError } = await postPricing(
        pricings.map((p) => ({ ...p, ad_id: newAd.data.id }))
      );

      if (pricingError) {
        setError("Failed to add pricing information.");
        return;
      }

      // Upload ad images
    });
  };

  return (
    <div
      className={cn(
        "flex h-full overflow-hidden flex-col gap-5 py-5 bg-accent",
        className
      )}
    >
      <h1 className="text-lg text-center px-5">Create an ad</h1>
      <div className="flex items-center w-full max-w-60 mx-auto gap-1">
        <Button
          type="button"
          onClick={() => setCurrentStep(0)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 0
              ? "bg-primary border-primary"
              : currentStep === 0
              ? "border-primary"
              : ""
          }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 0 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs
            ${
              currentStep > 1
                ? "bg-primary border-primary"
                : currentStep === 1
                ? "border-primary"
                : ""
            }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 1 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(2)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 2
              ? "bg-primary border-primary"
              : currentStep === 2
              ? "border-primary"
              : ""
          }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 2 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 3
              ? "border-primary bg-primary"
              : currentStep === 3
              ? "border-primary"
              : ""
          }`}
        ></Button>
        <div
          className={`w-full border-b ${
            currentStep > 3 ? "border-primary" : "border-secondary"
          }`}
        ></div>
        <Button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
            currentStep > 4
              ? "border-primary bg-primary"
              : currentStep === 4
              ? "border-primary"
              : ""
          }`}
        ></Button>
      </div>
      {error && (
        <div className="px-5">
          <div className="flex items-center justify-between bg-red-50 text-red-600 p-3 rounded-md">
            <p>{error}</p>
            <Button
              onClick={() => setError(null)}
              className="bg-transparent text-red-600 hover:bg-red-100"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full transition-transform duration-300">
          {
            /* Step one */
            currentStep === 0 && (
              <div className="w-full text-center h-full flex flex-col">
                <h1 className="text-center px-5 py-1 mb-4 bg-secondary w-fit rounded-full mx-auto">
                  Step one: Basic info
                </h1>
                <AdForm
                  setter={setAd}
                  initailData={ad}
                  handleNext={next}
                  actionText="Save and continue"
                />
              </div>
            )
          }

          {
            /* Step two */
            currentStep === 1 && (
              <div className="w-full text-center h-full">
                <h1 className="text-center">Step two: Pricing info</h1>
                {ad && (
                  <PricingForm
                    setter={setPricings}
                    ad={ad}
                    initialdData={pricings}
                    handleNext={next}
                    handlePrevious={prev}
                  />
                )}
              </div>
            )
          }

          {
            /* Step three */
            currentStep === 2 && (
              <div className="w-full h-full text-center flex flex-col gap-5">
                <LocationForm
                  handleLocationChange={handleLocationChange}
                  handleNext={next}
                  handlePrevious={prev}
                />
              </div>
            )
          }

          {
            /* Step four */
            currentStep === 3 && (
              <AdImagesUploadForm
                adImages={adImages.map((image) => ({
                  url: URL.createObjectURL(image),
                  ad_id: ad?.id || "",
                }))}
                handleUpload={handleUpload}
                handleBack={prev}
                handleNext={next}
              />
            )
          }

          {
            /* Step five */
            currentStep === 4 && (
              <div className="w-full h-full text-center flex flex-col gap-5">
                <h1 className="text-center px-5 py-1 mb-4 bg-secondary w-fit rounded-full mx-auto">
                  Review and submit
                </h1>
                <div className="flex flex-col gap-2 px-5">
                  <div className="flex w-full px-5 items-center gap-5">
                    <p className="w-full line-clamp-1 text-left"> Ad info:</p>
                    {ad ? (
                      <Check
                        size={20}
                        color="green"
                        className="bg-green-50 rounded-full p-0.5"
                      />
                    ) : (
                      <BiQuestionMark
                        size={20}
                        color="red"
                        className="bg-red-50 rounded-full p-0.5"
                      />
                    )}
                  </div>
                  <div className="flex w-full px-5 items-center gap-10">
                    <p className="w-full line-clamp-1 text-left">
                      {" "}
                      Address: {location?.address}
                    </p>
                    {ad ? (
                      <Check
                        size={20}
                        color="green"
                        className="bg-green-50 rounded-full p-0.5"
                      />
                    ) : (
                      <BiQuestionMark
                        size={20}
                        color="red"
                        className="bg-red-50 rounded-full p-0.5"
                      />
                    )}
                  </div>

                  <div className="flex w-full px-5 items-center gap-10">
                    <p className="w-full line-clamp-1 text-left">
                      {" "}
                      Ad pricing:
                    </p>
                    {ad ? (
                      <Check
                        size={20}
                        color="green"
                        className="bg-green-50 rounded-full p-0.5"
                      />
                    ) : (
                      <BiQuestionMark
                        size={20}
                        color="red"
                        className="bg-red-50 rounded-full p-0.5"
                      />
                    )}
                  </div>
                  <div className="flex w-full px-5 items-center gap-10">
                    <p className="w-full line-clamp-1 text-left"> Ad images:</p>
                    {adImages.length > 0 ? (
                      <Check
                        size={20}
                        color="green"
                        className="bg-green-50 rounded-full p-0.5"
                      />
                    ) : (
                      <BiQuestionMark
                        size={20}
                        color="red"
                        className="bg-red-50 rounded-full p-0.5"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between px-10 items-center gap-5 mt-5">
                  <Button
                    className="bg-primary gap-3 px-5 rounded-full text-background"
                    onClick={prev}
                  >
                    <ChevronLeft size={15} />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-primary gap-3 px-5 rounded-full text-background"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size={15} className="animate-spin" />{" "}
                        Submitting
                      </>
                    ) : (
                      <>
                        <CheckCheck size={15} /> Submit Ad
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
