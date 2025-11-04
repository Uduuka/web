import { Check, LoaderCircle, Mail, Trash, X } from "lucide-react";
import Modal from "../../models/Modal";
import { Account, AccountProvider, Profile, StoreOrder } from "@/lib/types";
import { PiInvoice } from "react-icons/pi";
import { GiPositionMarker } from "react-icons/gi";
import { BiMoney } from "react-icons/bi";
import Button from "@/components/ui/Button";
import FormGroup from "@/components/ui/FormGroup";
import ScrollArea from "../../layout/ScrollArea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../tables/Table";
import PriceTag from "../../cards/PriceTag";
import { calcCartItemSubTotal, toMoney } from "@/lib/utils";
import FormInput from "@/components/ui/Input";
import {
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  createRemittanceAccount,
  deliverOrder,
  fetchAccount,
  payForOrder,
  sendInvoice,
  sendMessage,
  settlePayement,
  updateOrder,
} from "@/lib/actions";
import { useAppStore } from "@/lib/store";
import Image from "next/image";
import dynamic from "next/dynamic";
import Select from "@/components/ui/Select";
import env from "@/lib/env";

export const DeleteOrderDialog = ({
  order,
  rows,
  setRows,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) => {
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const handleDelete = () => {
    startDeleting(async () => {
      try {
        const { error } = await updateOrder(order, "deleted");
        if (error) {
          setError(error.message);
          return;
        }
        setRows(rows.filter((o) => o.id !== order.id));
        formRef.current?.submit();
      } catch (error) {
        setError("Failed to delete the order.");
        return;
      }
    });
  };
  return (
    <Modal
      trigger={
        <>
          <Trash size={15} /> Delete
        </>
      }
      header="Delete order"
      triggerStyle="bg-red-50 items-center text-red-500 hover:text-white w-full gap-2 hover:bg-red-500"
    >
      <div className="p-5">
        {error && (
          <p className="text-red-500 text-center rounded-lg mb-5 p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
            {error}
          </p>
        )}
        <p className="bg-yellow-50 break-words text-wrap whitespace-normal m-0 w-full text-yellow-500 rounded-lg p-5 text-center">
          This order will be moved to trash for 30 day before being deleted
          permanently.
        </p>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full pt-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            onClick={handleDelete}
            type="button"
            className="w-full bg-red-50 border border-red text-red-500 hover:text-white hover:bg-red-500"
          >
            {deleting ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Delete"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const CancelOrderDialog = ({
  order,
  rows,
  setRows,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) => {
  const [canceling, startCanceling] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const handleCancel = () => {
    startCanceling(async () => {
      try {
        const { error } = await updateOrder(order, "canceled");
        if (error) {
          setError(error.message);
          return;
        }
        const newOrder = { ...order, status: "canceled" };
        setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
        formRef.current?.submit();
      } catch (error) {
        setError("Failed to cancel the order.");
        return;
      }
    });
  };
  return (
    <Modal
      trigger={
        <>
          <X size={15} /> Cancel order
        </>
      }
      header="Delete order"
      triggerStyle="bg-red-50 items-center text-red-500 hover:text-white w-full gap-2 hover:bg-red-500"
    >
      <div className="p-5">
        {error && (
          <p className="text-red-500 text-center rounded-lg mb-5 p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
            {error}
          </p>
        )}
        <p className="bg-yellow-50 break-words text-wrap whitespace-normal m-0 w-full text-yellow-500 rounded-lg p-5 text-center">
          This order will be moved to trash for 30 day before being deleted
          permanently.
        </p>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full pt-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            onClick={handleCancel}
            type="button"
            className="w-full bg-red-50 border border-red text-red-500 hover:text-white hover:bg-red-500"
          >
            {canceling ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Cancel order"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const DeclineOrderDialog = ({
  order,
  rows,
  setRows,
  profilePromise,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) => {
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;

  const [declining, startdeclining] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDecline = () => {
    startdeclining(async () => {
      try {
        const { error } = await updateOrder(order, "declined");
        if (error) {
          setError(error.message);
          return;
        }
        const newOrder = { ...order, status: "declined" };
        setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
        formRef.current?.submit();
      } catch (error) {
        setError("Failed to decline the order.");
      }
    });
  };

  if (isBuyer) {
    return null;
  }
  return (
    <Modal
      trigger={
        <>
          <X size={15} /> Decline
        </>
      }
      header="Decline order"
      triggerStyle="bg-red-50 items-center text-red-500 hover:text-white w-full gap-2 hover:bg-red-500"
    >
      <div className="p-5">
        {error && (
          <p className="text-red-500 text-center rounded-lg mb-5 p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
            {error}
          </p>
        )}
        <p className="bg-yellow-50 break-words text-wrap whitespace-normal m-0 w-full text-yellow-500 rounded-lg p-5 text-center">
          Are you sure you want to decline this order? Your choice will not be
          altered.
        </p>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full pt-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            onClick={handleDecline}
            type="button"
            className="w-full bg-red-50 border border-red text-red-500 hover:text-white hover:bg-red-500"
          >
            {declining ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Decline"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const MessageDialog = ({
  order,
  profilePromise,
}: {
  order: StoreOrder;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, startSending] = useTransition();
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;

  const formRef = useRef<HTMLFormElement>(null);

  const handleSendMessage = () => {
    startSending(async () => {
      if (message.trim().length < 1 || !profile?.user_id) {
        setError("Message cannot be empty.");
        return;
      }
      const { error } = await sendMessage({
        text: message.trim(),
        sender_id: profile.user_id,
        receiver_id: isBuyer ? order.store.keeper_id : order.buyer_id,
      });

      if (error) {
        // Handle error (e.g., show a notification)
        setError(error.message);
        return;
      }

      // Optionally, clear the message input or provide feedback to the user
      setMessage("");
      formRef.current?.submit();
    });
  };
  if (!order.buyer) {
    return null;
  }
  return (
    <Modal
      trigger={
        <>
          <Mail size={15} /> Message
        </>
      }
      header={`Message ${isBuyer ? "seller" : "customer"}`}
      triggerStyle="bg-blue-50 items-center text-blue-500 hover:text-white w-full gap-2 hover:bg-blue-500"
    >
      <div className="p-5">
        {error && (
          <p className="text-red-500 text-center rounded-lg mb-5 p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
            {error}
          </p>
        )}
        <FormGroup
          label="Message"
          required
          htmlFor="message"
          className="w-full text-gray-500"
        >
          <textarea
            name="meessage"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            required
            rows={4}
            className="outline-0 p-2 focus:border-primary rounded-lg resize-none border-gray-500 hover:border-primary border"
          ></textarea>
        </FormGroup>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full pt-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            type="button"
            onClick={handleSendMessage}
            className="w-full bg-blue-50 border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500"
          >
            {sending ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const InvoiceDialog = ({
  order,
  rows,
  setRows,
  profilePromise,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) => {
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;

  const [sending, startSending] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSendInvoice = () => {
    // Implement send invoice functionality here
    startSending(async () => {
      if (!order.id) {
        setError("Invalid order ID.");
        return;
      }
      const { error } = await sendInvoice({ order_id: order.id });

      if (error) {
        // Handle error (e.g., show a notification)
        if (error.message.includes("duplicate key value")) {
          setError("Invoice has already been sent for this order.");
          return;
        }
        setError("Failed to send invoice. Please try again.");
        return;
      }

      const { error: updateError } = await updateOrder(order, "received");

      if (updateError) {
        setError(`Failed to update order status, ${updateError.message}`);
        return;
      }

      // Optionally, provide feedback to the user
      const newOrder = { ...order, status: "received" };
      setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
      formRef.current?.submit();
    });
  };

  if (!order.buyer || isBuyer) {
    return null;
  }

  return (
    <Modal
      trigger={
        <>
          <PiInvoice size={15} /> Send invoice
        </>
      }
      header="Send invoice to customer"
      triggerStyle="bg-green-50 items-center text-green-500 hover:text-white w-full gap-2 hover:bg-green-500"
    >
      <div className="">
        {error && (
          <div className="px-5">
            <p className="text-red-500 text-center rounded-lg p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
              {error}
            </p>
          </div>
        )}
        <ScrollArea maxHeight="60vh" className="text-gray-500 px-5">
          <div className="space-y-5">
            <div className="flex gap-5 justify-between ">
              <div className="w-full">
                <h1 className="text-xl text-blue-400">{order.store.name}</h1>
                <p className="font-thin text-xs">
                  {order.store.address ?? "Store address"}
                </p>
                <p className="font-thin text-xs">Phone: 070-000-0000</p>
                <p className="font-thin text-xs">Fax: 070-000-0000</p>
                <p className="font-thin text-xs">Website: conslwa.com</p>
              </div>
              <div className="w-full text-right">
                <h1 className="text-xl font-bold text-blue-400">INVOICE</h1>
                <div className="flex gap-2 justify-end w-full items-center">
                  <p className="text-xs uppercase">Date</p>
                  <div className="border border-b-0 w-16 text-center justify-center py-0 text-xs uppercase">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2 justify-end w-full items-center">
                  <p className="text-xs uppercase">Invoice #</p>
                  <div className="border border-b-0 w-16 text-center justify-center py-0 text-xs uppercase">
                    12345
                  </div>
                </div>
                <div className="flex gap-2 justify-end w-full items-center">
                  <p className="text-xs uppercase">Customer</p>
                  <div className="border border-b-0 w-16 text-center justify-center py-0 text-xs uppercase">
                    SC12
                  </div>
                </div>
                <div className="flex gap-2 justify-end w-full items-center">
                  <p className="text-xs uppercase">Due date</p>
                  <div className="border w-16 text-center justify-center py-0 text-xs uppercase">
                    12345
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <h1 className="bg-blue-400 uppercase text-white px-2">Bill To</h1>
              <p className="font-thin capitalize">{order.buyer.full_name}</p>
              <p className="font-thin capitalize">Phone: {order.buyer.phone}</p>
            </div>
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-6 text-white text-xs bg-blue-400 max-w-40 sticky left-0">
                      Descrition
                    </TableHead>
                    <TableHead className="h-6 text-white text-xs bg-blue-400">
                      Qty
                    </TableHead>
                    <TableHead className="h-6 text-white text-xs bg-blue-400">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {order.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="sticky max-w-40 left-0 overflow-hidden">
                        <p className="break-words text-wrap whitespace-normal m-0 w-full line-clamp-2">
                          {item.pricing?.details?.title ?? item.ad.title}
                        </p>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="flex justify-end">
                        <PriceTag
                          pricing={calcCartItemSubTotal(
                            item.pricing,
                            item.quantity
                          )}
                          className="text-gray-500 w-fit"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <div className="w-full justify-end text-base flex gap-5 items-center font-bold">
                        <span>Total</span>
                        <PriceTag
                          className="w-fit text-gray-500 font-bold"
                          pricing={{
                            scheme: "fixed",
                            currency: order.currency,
                            amount: order.amount,
                            details: {},
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="w-full px-5">
              <p className="text-center w-full text-xs break-words text-wrap whitespace-normal m-0">
                <span className="font-bold text-base">
                  Thank you for your business!
                </span>{" "}
                <br /> For questions, please contact{" "}
                <span className="font-bold">070-000-0000</span> or send an email
                to <span className="font-bold">info@uduuka.com</span>
              </p>
            </div>
          </div>
        </ScrollArea>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full p-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            onClick={handleSendInvoice}
            type="button"
            className="w-full bg-green-50 border border-green text-green-500 hover:text-white hover:bg-green-500"
          >
            {sending ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Send invoice"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const TrackOrderDialog = ({ order }: { order: StoreOrder }) => {
  const { location } = useAppStore();

  const [orderLocation, setOrderLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    longitude: location!.longitude + 2,
    latitude: location!.latitude + 2,
  });

  const map = import("@/components/parts/maps/mapbox/OrderTracker");

  const Map = useMemo(
    () =>
      dynamic(() => map, {
        loading: () => (
          <div className="w-full rounded-sm border-2 h-full flex justify-center items-center">
            Loading ...
          </div>
        ),
        ssr: false,
      }),
    []
  );

  return (
    <Modal
      trigger={
        <>
          <GiPositionMarker size={15} /> Track order
        </>
      }
      header="Trcking order"
      triggerStyle="bg-pink-50 items-center text-pink-500 hover:text-white w-full gap-2 hover:bg-pink-500"
    >
      <div className="max-h-[60vh] aspect-square w-full text-gray-500 p-5">
        {location && (
          <Map
            orderLocation={{
              latitude: location!.latitude,
              longitude: location!.longitude,
            }}
            destinationLocation={orderLocation}
          />
        )}
      </div>
    </Modal>
  );
};

export const RequestSettlementDialog = ({
  order,
  rows,
  setRows,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) => {
  const [loading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedProvider, setSelectedProvider] = useState<AccountProvider>();
  const [account, setAccount] = useState<Account | null>(null);
  const [fetchingAccounts, startFetchingAccounts] = useTransition();

  useEffect(() => {
    startFetchingAccounts(async () => {
      const { error, data } = await fetchAccount();
      if (error) {
        setError(error.message);
        return;
      }
      setAccount(data[0] ?? null);
    });
  }, []);

  const handleSettlementRequest = () => {
    // Implement settlement request functionality here
    startLoading(async () => {
      if (!order.id || !selectedProvider) {
        return;
      }
      const { error, data } = await settlePayement(
        order.id,
        selectedProvider.provider_name
      );
      if (error) {
        setError(error.message);
        return;
      }

      console.log(data);

      // Update order state here if needed
      const newOrder = { ...order, status: "completed" };
      setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
      formRef.current?.submit();
    });
  };

  if (!order.store.keeper_id) {
    return null;
  }

  return (
    <Modal
      trigger={
        <>
          <BiMoney size={15} /> Settlement
        </>
      }
      header="Request for settlement"
      triggerStyle="bg-pink-50 items-center text-pink-500 hover:text-white w-full gap-2 hover:bg-pink-500"
    >
      <div className="w-full text-gray-500 p-5">
        {error && (
          <p className="text-red-500 mb-3 font-thin rounded-lg p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
            {error}
          </p>
        )}
        <div className="p-5 flex flex-col gap-2 bg-secondary rounded-lg ">
          <h1 className="mb-2">Select how you want to be paid.</h1>
          {account ? (
            <div className="flex gap-5">
              {account.providers.map((account, i) => (
                <div className="w-full space-y-1" key={i}>
                  <Button
                    type="button"
                    className={`w-full min-w-20 uppercase text-white transition-all ${
                      account.provider_name === "mtn"
                        ? "bg-amber-400"
                        : "bg-red-500"
                    } ${account === selectedProvider ? "justify-between" : ""}`}
                    onClick={() => {
                      setSelectedProvider(account);
                    }}
                  >
                    <span className="flex gap-2 items-center">
                      <Image
                        height={100}
                        width={100}
                        src={
                          account.provider_name === "mtn"
                            ? "/logos/mtn.jpg"
                            : "/logos/airtel.jpg"
                        }
                        alt="logo"
                        className="h-6 w-6 rounded-lg"
                      />
                      <span>{account.provider_name}</span>
                    </span>

                    {account === selectedProvider && <Check size={15} />}
                  </Button>
                  <div
                    className={`h-1 transition-all rounded-full ${
                      account === selectedProvider ? "w-full" : "w-0"
                    } ${
                      account.provider_name === "mtn"
                        ? "bg-amber-400"
                        : "bg-red-500"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          ) : fetchingAccounts ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <div className="">
              <p className="bg-yellow-50 mb-3 text-yellow-500 p-5 rounded-lg w-full break-words text-wrap whitespace-normal">
                You have not added any payement account yet. Please add an
                account to be able to request for settlement.
              </p>

              <CreateRemittanceAccountDialog
                onCreate={(a) => {
                  setAccount(a);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {account?.providers.length! > 0 && (
        <form ref={formRef} method="dialog" className="flex gap-5 w-full p-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            type="button"
            onClick={handleSettlementRequest}
            className="w-full bg-blue-50 border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Request settlement"
            )}
          </Button>
        </form>
      )}
    </Modal>
  );
};

export const DeliverOrderDialog = ({
  order,
  rows,
  setRows,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
}) => {
  const [odt, setOdt] = useState("");
  const [loading, startLoading] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleDeliver = () => {
    // Implement deliver functionality here
    startLoading(async () => {
      // Add deliver logic here
      if (!order.id) {
        return;
      }
      const {
        error,
        data: { status },
      } = await deliverOrder(order.id);
      if (error) {
        setError(error.message);
        return;
      }

      // Update order state here if needed
      const newOrder = { ...order, status };
      setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
      formRef.current?.submit();
    });
  };

  if (!order.id) {
    return null;
  }
  return (
    <Modal
      trigger={
        <>
          <BiMoney size={15} /> Deliver
        </>
      }
      header="Deliver order"
      triggerStyle="bg-emerald-50 items-center text-emerald-500 hover:text-white w-full gap-2 hover:bg-emerald-500"
    >
      <div className="w-full text-gray-500">
        <div className="px-5 space-y-5">
          {error && (
            <p className="text-red-500 mb-3 font-thin text-center rounded-lg p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
              {error}
            </p>
          )}
          <p className="w-full break-words text-wrap whitespace-normal">
            You can deliver this order to either a transporter or the customer.
          </p>
          <p className="bg-yellow-50 text-yellow-500 p-5 rounded-lg w-full break-words text-wrap whitespace-normal">
            Note: The person {"you'r"} delivering to must have the order
            delivered token (ODT) to be able to confirm the delivery.
          </p>

          <FormGroup
            label="Order Deliverd Token (ODT)"
            required
            htmlFor="message"
            className="w-full text-gray-500 text-center"
          >
            <FormInput
              name="odt"
              id="odt"
              type="number"
              wrapperStyle="w-full max-w-40 mx-auto rounded"
              value={odt}
              onChange={(e) => {
                setOdt(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <form ref={formRef} method="dialog" className="flex gap-5 w-full p-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            type="button"
            onClick={handleDeliver}
            className="w-full bg-emerald-50 border border-emerald text-emerald-500 hover:text-white hover:bg-emerald-500"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Deliver"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const ReceiveOrderDialog = ({
  order,
  rows,
  setRows,
  profilePromise,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) => {
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;
  const [receiving, startReceiving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleReceive = () => {
    startReceiving(async () => {
      try {
        const { error } = await updateOrder(order, "delivered");
        if (error) {
          setError(error.message);
          return;
        }
        const newOrder = { ...order, status: "delivered" };
        setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
        formRef.current?.submit();
      } catch (error) {
        console.log(error);
        setError("Failed to receive the order.");
      }
    });
  };

  if (!isBuyer) {
    return null;
  }

  return (
    <Modal
      trigger={
        <>
          <Check size={15} /> Receive
        </>
      }
      header="Deliver order"
      triggerStyle="bg-emerald-50 items-center text-emerald-500 hover:text-white w-full gap-2 hover:bg-emerald-500"
    >
      <div className="w-full text-gray-500">
        <div className="px-5 space-y-5">
          {error && (
            <p className="text-red-500 text-center rounded-lg mb-5 p-5 bg-red-50 w-full break-words text-wrap whitespace-normal m-0">
              {error}
            </p>
          )}
          <p className="bg-yellow-50 text-yellow-500 p-5 rounded-lg w-full break-words text-wrap whitespace-normal">
            Please confirm that you have received your order. <br /> You can
            also provide the order customer secret to the transporter or the
            seller delivering the order to you
          </p>
          <p className=""></p>
        </div>
        <form method="dialog" className="flex gap-5 w-full p-5">
          <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
            Cancle
          </Button>
          <Button
            type="button"
            onClick={handleReceive}
            className="w-full bg-green-50 border border-green text-green-500 hover:text-white hover:bg-green-500"
          >
            {receiving ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              "Receive"
            )}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export const PayOrderDialog = ({
  order,
  rows,
  setRows,
  profilePromise,
}: {
  order: StoreOrder;
  rows: StoreOrder[];
  setRows: (rows: StoreOrder[]) => void;
  profilePromise: Promise<{
    data: Profile | null;
    error: { message: string } | null;
  }>;
}) => {
  const { data: profile } = use(profilePromise);
  const isBuyer = profile?.user_id === order.buyer_id;

  const [paying, startPaying] = useTransition();
  const [method, setMethod] = useState<"mtn" | "airtel" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePay = () => {
    startPaying(async () => {
      if (!order.id || !method || !phone) {
        setError("Please select a payment method and enter your phone number.");
        return;
      }
      const { error } = await payForOrder({
        order_id: order.id,
        phone,
        method,
      });
      if (error) {
        setError(error.message);
        return;
      }
      const newOrder = { ...order, status: "paid" };
      setRows(rows.map((o) => (o.id === order.id ? newOrder : o)));
      formRef.current?.submit();
    });
  };

  if (!isBuyer) {
    return null;
  }

  return (
    <Modal
      trigger={
        <>
          <BiMoney size={15} /> Pay
        </>
      }
      header="Pay for your order"
      triggerStyle="bg-emerald-50 items-center text-emerald-500 hover:text-white w-full gap-2 hover:bg-emerald-500"
    >
      <div className="w-full text-gray-500">
        <div className="px-5 space-y-5">
          <h1 className="text-xl font-bold">Select a payement method</h1>
          <div className="flex gap-5 justify-center items-center">
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                onClick={() => {
                  setMethod("mtn");
                }}
                className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
              >
                <Image
                  height={100}
                  width={100}
                  src="/logos/mtn.jpg"
                  alt="MTN"
                  className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
                />
              </Button>
              <div
                className={`h-1 bg-amber-400 rounded transition-all duration-500 w-0 ${
                  method === "mtn" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
            <h1 className="text-xl font-bold">Or</h1>
            <div className="flex flex-col gap-1">
              <Button
                type="button"
                onClick={() => {
                  setMethod("airtel");
                }}
                className="p-0 shadow hover:shadow-2xl transition-all duration-500 rounded-lg overflow-hidden"
              >
                <Image
                  height={100}
                  width={100}
                  src="/logos/airtel.jpg"
                  alt="Airtel"
                  className="w-full max-w-20 h-auto hover:scale-110 transition-all duration-500"
                />
              </Button>
              <div
                className={`h-1 bg-red-600 rounded transition-all duration-500 w-0 ${
                  method === "airtel" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          </div>
          <div>
            {error && (
              <div className="bg-red-50 px-4 py-2 rounded-lg text-error flex items-center">
                <p className="w-full text-left break-words text-wrap whitespace-normal m-0">
                  {error}
                </p>
                <Button
                  onClick={() => setError("")}
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
                  value={toMoney(order.amount.toString(), order.currency)}
                  icon={<span className="px-2">{order.currency}</span>}
                  onChange={() => {}}
                  wrapperStyle="border-2"
                />
              </FormGroup>
              <FormGroup label="Mobile number" className="text-left">
                <FormInput
                  className=""
                  value={phone ?? ""}
                  type="number"
                  onChange={(e) => setPhone(e.target.value)}
                  wrapperStyle="border-2"
                  placeholder={
                    method
                      ? `Enter an ${method} number`
                      : "Select a payement method"
                  }
                />
              </FormGroup>
            </div>
          </div>
        </div>
      </div>
      <form ref={formRef} method="dialog" className="flex gap-5 w-full p-5">
        <Button className="w-full bg-gray-50 text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-500">
          Cancle
        </Button>
        <Button
          type="button"
          onClick={handlePay}
          className="w-full bg-emerald-50 border border-emerald text-emerald-500 hover:text-white hover:bg-emerald-500"
        >
          {paying ? (
            <LoaderCircle className="animate-spin" size={15} />
          ) : (
            "Pay now"
          )}
        </Button>
      </form>
    </Modal>
  );
};

export const CreateRemittanceAccountDialog = ({
  onCreate,
  onEdit,
}: {
  onCreate?: (a: Account) => void;
  onEdit?: (a: Account) => void;
}) => {
  const [providerName, setProviderName] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [accountNames, setAccountNames] = useState<string | null>(null);
  const [accountCurrency, setAccountCurrency] = useState<string | null>(null);

  const [creating, startCreating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreate = () => {
    startCreating(async () => {
      if (!providerName) {
        setError("The provider name is required");
        return;
      }

      if (!accountCurrency) {
        setError("The account currency is required");
        return;
      }

      if (!accountNames) {
        setError("The account names is required");
        return;
      }

      if (!accountNumber) {
        setError("The account number is required");
        return;
      }
      const providers = [
        {
          provider_name: providerName,
          account_names: accountNames,
          account_number: accountNumber,
          account_currency: accountCurrency,
        },
      ];

      const { data: res, error } = await createRemittanceAccount({ providers });
      if (error) {
        setError(error.message);
        return;
      }
      onCreate?.(res);
      formRef.current?.submit();
    });
  };

  return (
    <Modal
      trigger={<span className="">Creat remittance account</span>}
      header="Create remittance account"
      triggerStyle="w-full bg-blue-50 border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500"
    >
      <ScrollArea maxHeight="50vh" className="space-y-5 px-5 text-gray-500">
        <h1 className="mb-5 w-full break-words text-wrap whitespace-normal m-0">
          Add at least one provider to create a remitance account.
        </h1>
        {error && (
          <div className="p-5 bg-red-50 text-error rounded-lg">
            <p className="w-full break-words text-wrap whitespace-normal m-0">
              {error}
            </p>
          </div>
        )}
        <FormGroup label="Account currency">
          <Select
            options={env.currencyOptions.map(
              (c) => c as { label: string; value: string }
            )}
            className="w-full"
            triggerStyle="w-full py-2 text-gray-500"
            onChange={(e) => {
              setAccountCurrency(e);
            }}
            value={accountCurrency}
          />
        </FormGroup>
        <FormGroup label="Provider">
          <Select
            options={[
              { label: "MTN", value: "mtn" },
              { label: "AIRTEL", value: "airtel" },
            ]}
            className="w-full"
            triggerStyle="w-full py-2 text-gray-500"
            onChange={(e) => {
              setProviderName(e);
            }}
            value={providerName}
          />
        </FormGroup>
        <FormGroup label="Account number">
          <FormInput
            value={accountNumber ?? ""}
            onChange={(e) => setAccountNumber(e.target.value)}
            type="number"
            className=""
          />
        </FormGroup>

        <FormGroup label="Account names">
          <FormInput
            value={accountNames ?? ""}
            onChange={(e) => setAccountNames(e.target.value)}
            className=""
          />
        </FormGroup>
      </ScrollArea>

      <form ref={formRef} method="dialog" className="w-full flex gap-5 p-5">
        <Button className="border-error w-full bg-red-50 text-error hover:bg-error hover:text-white">
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          type="button"
          className="border-success w-full bg-green-50 text-success hover:bg-success hover:text-white"
        >
          {creating ? (
            <LoaderCircle className="animate-spin" size={15} />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Modal>
  );
};
