import ThreadsList from "./parts/ThreadsList";
import { fetchThreads, getProfile } from "@/lib/actions";
import ChatBoard from "./parts/ChatBoard";

export default function page() {
  const threadsPromise = fetchThreads();
  const myPromise = getProfile();
  return (
    <div className="space-y-5">
      <div className="flex gap-5 flex-col sm:flex-row">
        <div className="flex flex-col space-y-2 bg-white rounded-lg p-2 w-full sm:w-[25rem] sm:h-[77vh]">
          <ThreadsList threadsPromise={threadsPromise} myPromise={myPromise} />
        </div>
        <div className="bg-white w-full rounded-lg h-[77vh] pt-5 flex flex-col justify-center items-center">
          <ChatBoard />
        </div>
      </div>
    </div>
  );
}
