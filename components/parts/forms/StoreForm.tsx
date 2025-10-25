"use client";

import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import FormInput from "@/components/ui/Input";
import { createStore, uploadFiles } from "@/lib/actions";
import { Store } from "@/lib/types";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function StoreForm({ oldStore }: { oldStore?: Store }) {
  const router = useRouter();

  const [store, setStore] = useState<Store>(oldStore ?? ({} as Store));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataURL = e.target?.result as string;
        setStore({ ...store, logo: dataURL });
      };

      reader.onerror = (e: ProgressEvent<FileReader>) => {
        console.error("Error reading file:", e.target?.error);
      };

      reader.readAsDataURL(logoFile);
    }
  }, [logoFile]);

  const handleSubmit = async () => {
    if (!store) {
      setError("Fill out all requred fields before submiting.");
      return;
    }

    let logo: string | null;

    if (logoFile && store.name) {
      const res = await uploadFiles([logoFile], "stores", store.name);

      if (res[0].url) {
        logo = res[0].url;
      } else {
        logo = null;
      }
    } else {
      logo = null;
    }
    const { error } = await createStore({ ...store, logo });
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard/stores");
  };
  
  return (
    <form
      action={handleSubmit}
      className="w-full flex flex-col gap-5 items-center"
    >
      <div className="h-40 w-40 rounded-lg relative bg-white border-primary border flex justify-center items-center">
        <input
          type="file"
          accept="image/*"
          name="store-logo"
          className="hidden"
          onChange={(e) => {
            setLogoFile(e.target.files && e.target.files[0]);
          }}
          id="logo-change"
        />
        {store?.logo ? (
          <Image
            src={store.logo}
            alt="Store logo"
            height={1000}
            width={1000}
            className="w-full h-auto object-cover"
          />
        ) : (
          <p className="text-gray-500">Store logo or burner </p>
        )}
        <Button
          type="button"
          className="absolute bg-white bottom-1 right-1 text-primary border  rounded-full p-1"
        >
          <Camera
            fill="white"
            size={15}
            onClick={() => {
              document.getElementById("logo-change")?.click();
            }}
          />
        </Button>
      </div>
      {error && (
        <div className="bg-red-100 text-error p-5 rounded-lg text-center">
          {error}
        </div>
      )}
      <FormGroup
        label="Name"
        htmlFor="name"
        required
        className="w-full text-gray-500"
      >
        <FormInput
          value={store?.name ?? ""}
          id="name"
          autoComplete="false"
          required
          onChange={(e) =>
            setStore({ ...(store ?? ({} as Store)), name: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup label="Slug" htmlFor="slug" className="w-full text-gray-500">
        <FormInput
          value={store?.slug ?? ""}
          id="slug"
          autoComplete="false"
          onChange={(e) =>
            setStore({ ...(store ?? ({} as Store)), slug: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup
        label="Description"
        htmlFor="description"
        required
        className="w-full text-gray-500"
      >
        <textarea
          className="border border-secondary active:ring-0 focus:ring-0 focus:outline-0 outline-0 px-2 py-1 w-full hover:border-primary transition-all rounded-lg resize-none"
          rows={2}
          required
          id="description"
          autoComplete="false"
          value={store?.description ?? ""}
          onChange={(e) =>
            setStore({
              ...(store ?? ({} as Store)),
              description: e.target.value,
            })
          }
        />
      </FormGroup>
      <Button type="submit" className="bg-primary text-background w-full">
        Save
      </Button>
    </form>
  );
}
