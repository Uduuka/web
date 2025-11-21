"use client";

import { useState } from "react";
import { Upload, MapPin, Clock, Briefcase } from "lucide-react";
import FormInput from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormGroup from "@/components/ui/FormGroup";
import Dropzone from "@/components/ui/Dopzone";
import { FcBusiness } from "react-icons/fc";
import { IoBusiness } from "react-icons/io5";
import { MdBusiness } from "react-icons/md";

interface GeneralSettingsProps {
  onChange?: () => void;
}

export default function GeneralSettings({ onChange }: GeneralSettingsProps) {
  const [formData, setFormData] = useState({
    businessName: "My POS Business",
    businessDescription: "Premium cloud-based point of sale system",
    country: "UG",
    address: "123 Business Street, Kampala",
    website: "https://mypos.ug",
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handleWorkingHourChange = (
    day: string,
    field: string,
    value: string | boolean
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [field]: value },
    }));
    onChange?.();
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-5 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">General Settings</h1>
        <p className="text-muted-foreground">
          Manage your business information and basic details
        </p>
      </div>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5 w-full ">
        {/* Business Information */}
        <div className="w-full sm:w-1/2 md:w-full lg:w-1/2 bg-gray-50 p-5 rounded-lg">
          <div className="pb-5">
            <h1 className="text-base font-bold flex gap-2 items-center">
              <Briefcase /> Business Information
            </h1>
            <p>Update your business name and details</p>
          </div>
          <div className="space-y-5">
            <FormGroup label="Business name" htmlFor="businessName">
              <FormInput
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                placeholder="Enter business name"
                className="py-1.5 px-4"
                wrapperStyle="border-gray-300"
              />
            </FormGroup>

            <FormGroup label="Business Logo" htmlFor="businessLogo">
              <Dropzone
                onFilesChange={(f) => {}}
                text="Drag and drop your logo here"
                types={["PNG", "JPG"]}
                maxSize={5}
                className="mt-1.5 border border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              />
            </FormGroup>

            <FormGroup label="Business Description" htmlFor="description">
              <textarea
                id="description"
                value={formData.businessDescription}
                onChange={(e) =>
                  handleInputChange("businessDescription", e.target.value)
                }
                placeholder="Describe your business"
                className="mt-1.5 resize-none border border-border border-gray-300 hover:border-primary rounded-md px-4 py-2 w-full focus:outline-none focus:border-primary"
                rows={2}
              />
            </FormGroup>

            <FormGroup label="Country" htmlFor="country" className="w-full">
              <Select
                options={[
                  { label: "Uganda", value: "UG" },
                  { label: "Kenya", value: "KE" },
                  { label: "Tanzania", value: "TZ" },
                  { label: "Rwanda", value: "RW" },
                ]}
                value={formData.country}
                triggerStyle="w-full text-sm py-1.5"
                onChange={(v) => {
                  handleInputChange("country", v);
                }}
              />
            </FormGroup>

            <FormGroup label="Address" htmlFor="address">
              <FormInput
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter business address"
                className="py-1.5"
              />
            </FormGroup>

            <FormGroup label="Website URL" htmlFor="website">
              <FormInput
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                className="py-1.5"
              />
            </FormGroup>
          </div>
        </div>

        {/* Working Hours */}
        <div className="w-full sm:w-1/2 md:w-full lg:w-1/2 bg-gray-50 rounded-lg">
          <div className="p-5">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Clock className="w-5 h-5" />
              Working Hours
            </h1>
            <p>Set your business operating hours for each day</p>
          </div>
          <div>
            <div className="">
              {days.map((day) => (
                <div
                  key={day}
                  className="space-y-1 odd:bg-gray-100 p-5 hover:bg-gray-200 transition-all"
                >
                  <div className="flex w-full justify-between">
                    <span className="w-fit font-medium text-foreground capitalize">
                      {day}
                    </span>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          workingHours[day as keyof typeof workingHours].closed
                        }
                        onChange={(e) => {
                          handleWorkingHourChange(
                            day,
                            "closed",
                            e.target.checked
                          );
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">
                        Closed
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-5 w-full items-center justify-between">
                    {!workingHours[day as keyof typeof workingHours].closed && (
                      <>
                        <FormInput
                          type="time"
                          value={
                            workingHours[day as keyof typeof workingHours].open
                          }
                          onChange={(e) =>
                            handleWorkingHourChange(day, "open", e.target.value)
                          }
                          className=""
                          wrapperStyle="border-gray-300"
                        />
                        <span className="text-muted-foreground">to</span>
                        <FormInput
                          type="time"
                          value={
                            workingHours[day as keyof typeof workingHours].close
                          }
                          onChange={(e) =>
                            handleWorkingHourChange(
                              day,
                              "close",
                              e.target.value
                            )
                          }
                          className=""
                          wrapperStyle="border-gray-300"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
