import React, { useEffect, useRef, useState, useTransition } from "react";
import Modal from "../models/Modal";
import { LoaderCircle, Pencil, X } from "lucide-react";
import { AdImage, Category, Listing, SubCategory } from "@/lib/types";
import FormGroup from "@/components/ui/FormGroup";
import Select from "@/components/ui/Select";
import FormInput from "@/components/ui/Input";
import ScrollArea from "../layout/ScrollArea";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  createAdImages,
  deletAdImage,
  fetchAdImages,
  postAd,
  updateAd,
  uploadFiles,
} from "@/lib/actions";
import Dropzone from "@/components/ui/Dopzone";
import NumberInput from "@/components/ui/NumberInput";

const prepareSepcs = (
  c?: Category,
  s?: SubCategory
): { key: string; value?: string }[] | undefined => {
  return (c?.default_specs ?? "")
    ?.concat(s?.default_specs ?? "")
    .split(",")
    .map((s) => ({ key: s.trim(), value: undefined }));
};

export default function EditAdDialog({
  ad,
  categories,
  ads,
  setAds,
}: {
  ad?: Listing;
  categories: Category[];
  ads: Listing[];
  setAds: (ads: Listing[]) => void;
}) {
  const [edit, setEdit] = useState(ad ?? ({} as Listing));
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<AdImage[]>();
  const [newImages, setNewImages] = useState<{ file: File; dataURL: string }[]>(
    []
  );

  const formRef = useRef<HTMLFormElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  const [fetchingImages, startFetchingImages] = useTransition();
  const [deletingImage, startDeletingImage] = useTransition();
  const [savingChnages, startSavingChanges] = useTransition();
  const [editSpecs, setEditSpecs] = useState<{ key: string; value?: string }[]>(
    []
  );

  useEffect(() => {
    const cat = categories.find((c) => c.slug === edit.category_id);
    const subCat = cat?.sub_categories?.find(
      (sc) => sc.slug === edit.sub_category_id
    );
    setEditSpecs(
      prepareSepcs(cat, subCat)?.map((sp) => ({
        ...sp,
        value: edit.specs
          ? (edit.specs as Record<string, string>)[sp.key]
          : undefined,
      })) ?? []
    );
  }, [edit, categories]);

  const fetchImages = () => {
    startFetchingImages(async () => {
      const { data, error } = await fetchAdImages(edit.id);
      if (data) {
        setImages(data);
        scrollToBottom();
      }
    });
  };

  const scrollToBottom = () => {
    if (imagesContainerRef.current) {
      imagesContainerRef.current.scrollTop =
        imagesContainerRef.current.scrollHeight;
    }
  };

  const handleNewImages = (
    images: { file: File; dataURL: string; success?: boolean }[]
  ) => {
    setNewImages([...newImages, ...images]);
    scrollToBottom();
  };

  const deleteOldImage = async (id?: number) => {
    startDeletingImage(async () => {
      if (!id) {
        console.log("Invalid ad image id.");
        return;
      }
      const { error } = await deletAdImage(id);
      if (error) {
        console.log("Failed to delete image");
        return;
      }
      setImages(images?.filter((i) => i.id !== id));
    });
  };

  const handleSaveChanges = () => {
    startSavingChanges(async () => {
      const { id, title, description, category_id, sub_category_id, units } =
        edit;
      let ad_id = id;
      const specs = editSpecs.reduce(
        (a, b) =>
          b.value && b.value.trim().length > 0 ? { ...a, [b.key]: b.value } : a,
        {}
      );
      if (ad_id) {
        const { error } = await updateAd(id, {
          title,
          description,
          category_id,
          sub_category_id,
          units,
          specs,
        });

        if (error) {
          console.log("failed to update the ad details.");
        }
      } else {
        const { data, error } = await postAd({
          title,
          description,
          category_id,
          sub_category_id,
          units,
          specs,
        });

        if (error) {
          console.log("Failed to post a new ad");
          return;
        }

        ad_id = data.id;
      }

      const uploadResponses = await uploadFiles(
        newImages.map((i) => i.file),
        "ads",
        ad_id
      );

      const errors = uploadResponses
        .map((u) => u.error)
        .filter((e) => e !== undefined);

      if (errors.length > 0) {
        console.log(errors);
      }
      const urls = uploadResponses
        .map((u) => u.url)
        .filter((url) => url !== undefined);

      if (urls.length > 0) {
        const { data } = await createAdImages(
          urls.map((u) => ({ url: u, ad_id: id, is_default: false }))
        );

        if (!data) {
          console.log("Failed to create new ad images");
        } else {
          setImages([...(images ?? []), ...data]);
        }
      } else {
        console.log("No new images uploaded");
      }

      setAds(ads.map((a) => (a.id === ad_id ? { ...edit, specs } : a)));
      formRef.current?.submit();
    });
  };

  return (
    <Modal
      trigger={<Pencil size={15} />}
      className="min-w-md"
      header={
        <span className="text-base font-bold max-w-90% line-clamp-1">
          Edit ad details and images.
        </span>
      }
      triggerStyle="absolute top-0 rounded right-0 p-1 bg-blue-500 hover:bg-blue-600 text-white hidden group-hover:block"
    >
      <div className="w-full flex -mt-2">
        <Button
          onClick={() => {
            setActiveTab(0);
          }}
          className="w-full text-base rounded-none border-r hover:bg-secondary border-gray-200 text-gray-500"
        >
          Details
        </Button>
        <Button
          onClick={() => {
            setActiveTab(1);
            if (!images) {
              fetchImages();
            }
          }}
          className="w-full text-base rounded-none hover:bg-secondary text-gray-500"
        >
          Images
        </Button>
      </div>
      <div
        className={cn("relative overflow-hidden rounded-lg")}
        role="region"
        aria-label="Image carousel"
      >
        <div
          className="flex w-full h-full transition-transform duration-300"
          style={{ transform: `translateX(-${activeTab * 100}%)` }}
        >
          <div className="w-full flex-shrink-0">
            <ScrollArea className="h-full px-5 pt-5 pb-0 flex flex-col gap-5">
              <div className="sm:flex gap-3 text-gray-500">
                <FormGroup
                  label="Category"
                  required
                  className="text-left w-full"
                >
                  <Select
                    placeholder="Select a category"
                    options={categories.map((cat) => ({
                      value: cat.slug,
                      label: cat.name,
                    }))}
                    optionsStyle={`hover:bg-gray-200 text-gray-500 text-sm`}
                    contentStyle="h-40"
                    className="w-full"
                    triggerStyle="w-full text-sm bg-background text-gray-500 py-2"
                    value={edit?.category_id}
                    onChange={(v) => {
                      setEdit({ ...edit, category_id: v });
                    }}
                  />
                </FormGroup>
                <FormGroup
                  label="Subcategory"
                  required
                  className="text-left w-full"
                >
                  <Select
                    disabled={!Boolean(edit?.category_id)}
                    placeholder="Select a sub-category"
                    optionsStyle={`hover:bg-gray-200 text-sm`}
                    contentStyle="h-40"
                    options={
                      categories
                        .find((cate) => cate.slug === edit?.category_id)
                        ?.sub_categories?.map((subCate) => ({
                          value: subCate.slug,
                          label: subCate.name,
                        })) ?? []
                    }
                    className="w-full "
                    triggerStyle="w-full bg-background py-2 text-sm"
                    value={edit?.sub_category_id}
                    onChange={(v) => {
                      setEdit({ ...edit, sub_category_id: v });
                    }}
                  />
                </FormGroup>
              </div>
              <FormGroup
                label="Title"
                required
                className="text-left w-full text-gray-500"
              >
                <FormInput
                  className="px-3 py-1.5 w-full "
                  wrapperStyle="border-gray-300"
                  value={edit?.title ?? ""}
                  onChange={(e) => setEdit({ ...edit, title: e.target.value })}
                  placeholder="Title or name of the advert"
                />
              </FormGroup>
              <FormGroup
                label="Description"
                required
                className="text-left w-full text-gray-500"
              >
                <textarea
                  cols={2}
                  value={edit.description ?? ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      description: e.target.value,
                    })
                  }
                  className="px-3 py-1.5 w-full rounded-lg border border-gray-300 hover:border-primary active:border-primary focus:border-primary transition-colors outline-0 focus:outline-0 ring-0 resize-none"
                  placeholder="Describe your product or service"
                />
              </FormGroup>
              <div className="flex gap-5">
                <FormGroup label="Quantity" className="w-1/2 text-gray-500">
                  <NumberInput
                    className="px-3 py-1 w-full border border-gray-300 focus:border-primary hover:border-primary"
                    placeholder="Quantity"
                    value={edit?.quantity ?? 0}
                    onChange={(e) => {
                      setEdit({
                        ...(edit ?? {}),
                        quantity: e,
                      });
                    }}
                  />
                </FormGroup>
                <FormGroup
                  label="Units"
                  className="w-1/2 text-gray-500 relative"
                >
                  <FormInput
                    value={edit.units ?? ""}
                    onChange={(e) => {
                      setEdit({ ...edit, units: e.target.value });
                    }}
                    placeholder="units"
                  />
                </FormGroup>
              </div>
              {editSpecs.length > 0 && (
                <FormGroup
                  label="Specifications"
                  className="text-gray-500 p-2 relative rounded-lg border border-gray-300"
                  labelStyle="absolute -top-2.5 px-2 left-5 bg-white"
                >
                  <div className="flex gap-5 p-3 flex-wrap w-full">
                    {editSpecs.map((s, i) => (
                      <div
                        key={i}
                        className="w-fit flex flex-col items-center text-gray-400"
                      >
                        <input
                          className="focus:outline-0 border-0 border-b border-gray-300 focus:border-primary text-center w-fit text-gray-500"
                          type="text"
                          value={s.value ?? ""}
                          onChange={(e) => {
                            setEditSpecs(
                              editSpecs.map((sp) =>
                                sp.key === s.key
                                  ? { key: s.key, value: e.target.value }
                                  : sp
                              )
                            );
                          }}
                        />
                        <label htmlFor={s.key}>{s.key}</label>
                      </div>
                    ))}
                  </div>
                </FormGroup>
              )}
            </ScrollArea>
          </div>
          <div className="w-full flex-shrink-0">
            <ScrollArea
              ref={imagesContainerRef}
              className="h-full px-5 pt-5 flex flex-col gap-5"
            >
              {fetchingImages ? (
                <div className="grid grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-full h-40 rounded-lg bg-secondary animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-5">
                  {images?.map((img, ind) => (
                    <div key={ind} className="w-full relative">
                      <Image
                        src={img.url}
                        alt={`image-${ind}`}
                        height={500}
                        width={500}
                        className="rounded-lg w-full h-auto"
                      />
                      <Button
                        onClick={() => {
                          deleteOldImage(img.id);
                        }}
                        className="p-1 rounded bg-red-50 text-error hover:bg-error absolute top-0 right-0 hover:text-background"
                      >
                        {deletingImage ? (
                          <LoaderCircle size={20} className="animate-spin" />
                        ) : (
                          <X size={20} />
                        )}
                      </Button>
                    </div>
                  ))}

                  {newImages?.map((img, ind) => (
                    <div key={ind} className="w-full relative">
                      <Image
                        src={img.dataURL}
                        alt={`image-${ind}`}
                        height={500}
                        width={500}
                        className="rounded-lg w-full h-auto"
                      />
                      <Button
                        onClick={() => {
                          setNewImages(newImages.filter((i) => i !== img));
                        }}
                        className="p-1 rounded bg-red-50 text-error hover:bg-error absolute top-0 right-0 hover:text-background"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  ))}

                  <Dropzone
                    onFilesChange={handleNewImages}
                    className="w-full rounded-lg text-gray-300 bg-gray-100 flex justify-center items-center"
                  />
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      <form ref={formRef} method="dialog" className="flex gap-5 w-full p-5">
        <Button className="w-full text-base text-orange-400 bg-transparent border border-orange-400 hover:text-white hover:bg-orange-400">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSaveChanges}
          className="w-full text-base text-green-500 bg-transparent border border-green-400 hover:text-white hover:bg-green-400"
        >
          {savingChnages ? (
            <LoaderCircle className="animate-spin" size={20} />
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Modal>
  );
}
