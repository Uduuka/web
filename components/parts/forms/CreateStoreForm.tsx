import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import React, { useState } from "react";
import LeafletMap from "../maps/leaflet/LeafLetMap";
import Button from "@/components/ui/Button";
import { Store } from "@/lib/types";
import Mapview from "../maps/Mapview";

export default function CreateStoreForm() {
  const [store, setStore] = useState<Store>({} as Store);
  const handleCreateStore = () => {};
  return (
    <form
      action={handleCreateStore}
      className="w-full p-5 flex flex-col gap-5 h-max"
    >
      <FormGroup label="Title">
        <FormInput
          value={store.name}
          onChange={(e) => setStore({ ...store, name: e.target.value })}
        />
      </FormGroup>
      <FormGroup label="Description">
        <textarea
          value={store.description}
          onChange={(e) => setStore({ ...store, description: e.target.value })}
          className="resize-none border outline-0 focus:outline-0 px-3 py-1.5 focus:border-primary rounded-lg hover:border-primary"
        />
      </FormGroup>
      <FormGroup label="Address">
        <FormInput
          value={store.address}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
        />
      </FormGroup>
      <FormGroup label="Physical location">
        <div className="h-96 w-full border rounded-lg hover:border-primary">
          <Mapview provider="leaflet" className="h-full w-full" />
        </div>
      </FormGroup>

      <Button className="bg-primary">Create store</Button>
    </form>
  );
}
