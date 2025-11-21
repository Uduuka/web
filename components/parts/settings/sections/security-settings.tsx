"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface SecuritySettingsProps {
  onChange?: () => void;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
}

export default function SecuritySettings({ onChange }: SecuritySettingsProps) {
  const [staff, setStaff] = useState<Staff[]>([
    { id: "1", name: "John Doe", role: "Manager", status: "active" },
    { id: "2", name: "Jane Smith", role: "Cashier", status: "active" },
  ]);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome on MacOS",
      location: "Kampala",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      device: "Safari on iPad",
      location: "Kampala",
      lastActive: "1 hour ago",
    },
  ]);

  const [pinEnabled, setPinEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(15);
  const [voidCodeRequired, setVoidCodeRequired] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const endSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    onChange?.();
  };

  const removeStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-gray-50 rounded-lg ">
        <h1 className="text-3xl font-bold mb-2">Security & Access</h1>
        <p className="text-muted-foreground">
          Manage staff access and security settings
        </p>
      </div>

      {/* Staff Management */}
      <div className="p-5 bg-gray-50 rounded-lg">
        <div className="pb-5">
          <h1 className="text-base font-bold">Staff Management</h1>
          <p>Manage attendants and their roles</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {staff.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-3 py-2 min-w-60 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member.role} • {member.status}
                </p>
              </div>

              <button
                onClick={() => removeStaff(member.id)}
                className="p-2 hover:bg-destructive/10 text-error hover:text-error/80 cursor-pointer rounded-lg transition-colors text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="w-full flex justify-end">
            <Button className="mt-2 bg-primary hover:bg-primary/80 text-white">
              Add Staff Member
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-5 flex-col sm:flex-row md:flex-col lg:flex-row">
        {/* Active Sessions */}
        <div className="p-5 w-full bg-gray-50 rounded-lg space-y-4">
          <div className="">
            <h1 className="text-base font-bold">Active Sessions</h1>
            <p>Manage active login sessions</p>
          </div>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-light">{session.device}</p>
                  <p className="text-xs font-thin text-gray-500">
                    {session.location} • Since {session.lastActive}
                  </p>
                </div>
                <button
                  onClick={() => endSession(session.id)}
                  className="px-3 py-1 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors"
                >
                  End
                </button>
              </div>
            ))}
          </div>
          <div>
            <div className="pb-2">
              <h1 className="text-base font-bold">Session Timeout</h1>
              <p>Auto-logout after inactivity</p>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(Number.parseInt(e.target.value));
                    onChange?.();
                  }}
                  className="flex-1"
                />
                <span className="w-16 text-right font-medium">
                  {sessionTimeout} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Login Methods */}
        <div className="p-5 w-full bg-gray-50 rounded-lg space-y-5">
          <div className="">
            <h1 className="text-base font-bold">Login Methods</h1>
          </div>
          <div className="space-y-3">
            {[
              { key: "pin", label: "PIN Login" },
              { key: "biometric", label: "Biometric (Fingerprint)" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg hover:bg-muted transition-colors"
              >
                <label htmlFor={label} className="cursor-pointer w-full">
                  {label}
                </label>
                <input
                  type="checkbox"
                  checked={key === "pin" ? pinEnabled : biometricEnabled}
                  id={label}
                  onChange={(e) => {
                    if (key === "pin") setPinEnabled(e.target.checked);
                    else setBiometricEnabled(e.target.checked);
                    onChange?.();
                  }}
                  className="w-5 h-5 rounded cursor-pointer accent-primary"
                />
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg hover:bg-muted transition-colors">
              <label htmlFor="2fa" className="cursor-pointer w-full">
                Enable two factor authentication
              </label>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                id="2fa"
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg hover:bg-muted transition-colors">
              <label htmlFor="vc" className="cursor-pointer w-full">
                Require manager code for voids
              </label>
              <input
                type="checkbox"
                id="vc"
                checked={voidCodeRequired}
                onChange={(e) => {
                  setVoidCodeRequired(e.target.checked);
                  onChange?.();
                }}
                className="w-5 h-5 rounded cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
