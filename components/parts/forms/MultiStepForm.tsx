import Button from "@/components/ui/Button";
import React, { useState } from "react";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    currentStep < 4 ? setCurrentStep(currentStep + 1) : setCurrentStep(0);
  };

  const prev = () => {
    currentStep > 0 ? setCurrentStep(currentStep - 1) : setCurrentStep(0);
  };

  return (
    <div className="flex-1">
      <div className="h-full w-full flex-1 flex flex-col gap-2 transition-transform duration-300">
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
            onClick={() => setCurrentStep(4)}
            className={`h-3 p-0 bg-transparent aspect-square border rounded-full flex justify-center items-center text-xs ${
              currentStep > 3
                ? "border-primary bg-primary"
                : currentStep === 4
                ? "border-primary"
                : ""
            }`}
          ></Button>
        </div>

        <div
          className="flex w-full flex-1 transition-transform duration-300"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          <div className="w-full h-full bg-green-300 flex-shrink-0">
            <div className="h-full"></div>
          </div>
          <div className="w-full h-full bg-blue-300 flex-shrink-0">
            <div className="h-screen"></div>
          </div>
          <div className="w-full h-full bg-yellow-300 flex-shrink-0"></div>
          <div className="w-full h-full bg-purple-300 flex-shrink-0"></div>
          <div className="w-full h-full bg-pink-300 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
