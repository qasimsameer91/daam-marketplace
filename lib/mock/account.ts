import { listings } from "./marketplace";
export const previewThreads = [
  // online: seller is active now; lastSeenMinutes: minutes since last active otherwise.
  {
    id: "hafeez",
    name: "Hafeez Mobile Hub",
    listingId: listings[0]!.id,
    offer: 175000,
    online: true,
    lastSeenMinutes: 0,
  },
  {
    id: "usman",
    name: "Usman Tech",
    listingId: listings[1]!.id,
    offer: 195000,
    online: false,
    lastSeenMinutes: 42,
  },
] as const;
