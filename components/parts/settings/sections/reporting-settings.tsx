"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FormInput from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import FormGroup from "@/components/ui/FormGroup";

interface ReportingSettingsProps {
  onChange?: () => void;
}

export default function ReportingSettings({
  onChange,
}: ReportingSettingsProps) {
  const [dailyCloseout, setDailyCloseout] = useState(true);
  const [closeoutTime, setCloseoutTime] = useState("18:00");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [weeklyDay, setWeeklyDay] = useState("friday");
  const [monthlyReport, setMonthlyReport] = useState(true);
  const [monthlyDay, setMonthlyDay] = useState("1");
  const [emailRecipients, setEmailRecipients] = useState<string[]>([
    "admin@business.ug",
    "manager@business.ug",
  ]);
  const [newEmail, setNewEmail] = useState("");

  const addEmail = () => {
    if (newEmail && !emailRecipients.includes(newEmail)) {
      setEmailRecipients([...emailRecipients, newEmail]);
      setNewEmail("");
      onChange?.();
    }
  };

  const removeEmail = (email: string) => {
    setEmailRecipients(emailRecipients.filter((e) => e !== email));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Reporting & Analytics</h1>
        <p className="text-muted-foreground">
          Configure automatic reporting and email schedules
        </p>
      </div>

      {/* Automatic Reports */}
      <div className="w-full bg-gray-50 rounded-lg p-5">
        <div className="pb-5">
          <h1 className="text-base font-bold">Automatic Report Schedules</h1>
          <p>Set up automatic reports to be sent to your team</p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-5">
          {/* Daily */}
          <div className="space-y-3 bg-gray-100 rounded-lg p-5 w-full">
            <div className="flex items-center justify-between">
              <label className="cursor-pointer">Daily close-out report</label>
              <input
                type="checkbox"
                checked={dailyCloseout}
                onChange={(e) => {
                  setDailyCloseout(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>

            <div>
              <label htmlFor="closeoutTime" className="text-sm">
                Time to send
              </label>
              <FormInput
                id="closeoutTime"
                type="time"
                disabled={!dailyCloseout}
                value={closeoutTime}
                onChange={(e) => {
                  setCloseoutTime(e.target.value);
                  onChange?.();
                }}
                className="py-1.5 w-full disabled:opacity-40"
              />
            </div>
          </div>

          {/* Weekly */}
          <div className="space-y-3 bg-gray-100 rounded-lg p-5 w-full">
            <div className="flex items-center justify-between">
              <label className="cursor-pointer">Weekly summary report</label>
              <input
                type="checkbox"
                checked={weeklyReport}
                onChange={(e) => {
                  setWeeklyReport(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>
            <FormGroup label="Send on">
              <Select
                value={weeklyDay}
                onChange={(e) => {
                  setWeeklyDay(e);
                  onChange?.();
                }}
                options={[
                  { label: "Monday", value: "monday" },
                  { label: "Tuesday", value: "tuesday" },
                  { label: "Wednesday", value: "wednesday" },
                  { label: "Thursday", value: "thursday" },
                  { label: "Friday", value: "friday" },
                  { label: "Saturday", value: "saturday" },
                  { label: "Sunday", value: "sunday" },
                ]}
                disabled={!weeklyReport}
                triggerStyle="py-1.5 w-full text-sm disabled:opacity-40"
              />
            </FormGroup>
          </div>

          {/* Monthly */}
          <div className="space-y-3 bg-gray-100 rounded-lg p-5 w-full">
            <div className="flex items-center justify-between">
              <label className="cursor-pointer">Monthly reports</label>
              <input
                type="checkbox"
                checked={monthlyReport}
                onChange={(e) => {
                  setMonthlyReport(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>
            <div>
              <label htmlFor="monthlyDay" className="text-sm">
                Send on day
              </label>
              <FormInput
                id="monthlyDay"
                type="number"
                min="1"
                max="28"
                value={monthlyDay}
                disabled={!monthlyReport}
                onChange={(e) => {
                  setMonthlyDay(e.target.value);
                  onChange?.();
                }}
                className="py-1.5 w-full disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Recipients */}
      <div className="w-full bg-gray-50 rounded-lg p-5">
        <div className="pb-5">
          <h1 className="text-base font-bold">Email Recipients</h1>
          <p>Add team members who should receive reports</p>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {emailRecipients.map((email) => (
              <div
                key={email}
                className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm"
              >
                {email}
                <button
                  onClick={() => removeEmail(email)}
                  className="hover:bg-primary/20 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <FormInput
              placeholder="Enter email address"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && addEmail()}
              wrapperStyle="w-full max-w-60"
            />
            <Button
              onClick={addEmail}
              className="bg-primary hover:bg-orange-400 text-white w-full max-w-32"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
