import Button from "@/components/ui/Button";
import LocationMap from "../maps/mapbox/LocationMap";
import { Location } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LocationForm({
  handleLocationChange,
  initialLocation,
  handleNext,
  handlePrevious,
}: {
  handleLocationChange: (locationString: string, address: string) => void;
  initialLocation?: Location;
  handlePrevious?: () => void;
  handleNext?: () => void;
}) {
  return (
    <>
      <div className="h-full flex flex-col w-full px-5">
        <p className="text-xs font-thin py-2">Physical location of the ad.</p>
        <div className="h-full rounded-lg bg-secondary w-full relative">
          <LocationMap
            adLocation={initialLocation}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>

      <div className="flex justify-between px-5">
        <Button
          type="button"
          onClick={handlePrevious}
          className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
          aria-label="Next step"
        >
          <ChevronLeft size={15} />
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          className=" transform bg-primary/80 text-white p-2 px-5 w-40 gap-5 rounded-full hover:bg-primary transition"
          aria-label="Next step"
        >
          Next
          <ChevronRight size={15} />
        </Button>
      </div>
    </>
  );
}
