"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { listings } from "@/lib/mock/marketplace";
import { useHydrated } from "@/hooks/use-hydrated";

export type PreviewStatus = "active" | "pending" | "drafts" | "sold" | "expired";
export interface PreviewProfile {
  name: string;
  username: string;
  city: string;
  bio: string;
  whatsapp: boolean;
}
export interface PreviewMessage {
  id: string;
  thread: string;
  text: string;
  mine: boolean;
  offer?: number;
  decision?: "accepted" | "declined";
}
export interface PreviewListing {
  id: string;
  status: PreviewStatus;
}
type State = {
  ready: boolean;
  profile: PreviewProfile;
  setProfile: Dispatch<SetStateAction<PreviewProfile>>;
  owned: PreviewListing[];
  setOwned: Dispatch<SetStateAction<PreviewListing[]>>;
  favorites: string[];
  setFavorites: Dispatch<SetStateAction<string[]>>;
  messages: PreviewMessage[];
  setMessages: Dispatch<SetStateAction<PreviewMessage[]>>;
  blocked: string[];
  setBlocked: Dispatch<SetStateAction<string[]>>;
  readNotifications: boolean;
  setReadNotifications: Dispatch<SetStateAction<boolean>>;
  previewLogin: boolean;
  setPreviewLogin: Dispatch<SetStateAction<boolean>>;
};
const Context = createContext<State | null>(null);
/** In-memory sample state only. This does not authenticate users or persist marketplace data. */
export function PreviewProvider({ children }: { children: ReactNode }) {
  const ready = useHydrated();
  const [profile, setProfile] = useState<PreviewProfile>({
    name: "Ayesha",
    username: "ayesha.k",
    city: "karachi",
    bio: "",
    whatsapp: true,
  });
  const [owned, setOwned] = useState<PreviewListing[]>(
    listings.slice(0, 5).map((l, i) => ({
      id: l.id,
      status: (["active", "pending", "drafts", "sold", "expired"] as const)[i]!,
    })),
  );
  const [favorites, setFavorites] = useState(listings.slice(0, 2).map((l) => l.id));
  const [messages, setMessages] = useState<PreviewMessage[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [readNotifications, setReadNotifications] = useState(false);
  const [previewLogin, setPreviewLogin] = useState(false);
  return (
    <Context.Provider
      value={{
        ready,
        profile,
        setProfile,
        owned,
        setOwned,
        favorites,
        setFavorites,
        messages,
        setMessages,
        blocked,
        setBlocked,
        readNotifications,
        setReadNotifications,
        previewLogin,
        setPreviewLogin,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePreviewAccount() {
  const state = useContext(Context);
  if (!state) throw new Error("PreviewProvider is required");
  return state;
}
