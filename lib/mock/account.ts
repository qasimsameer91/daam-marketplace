import { listings } from "./marketplace";
export const previewThreads = [
  { id: "hafeez", name: "Hafeez Mobile Hub", listingId: listings[0]!.id, offer: 175000 },
  { id: "usman", name: "Usman Tech", listingId: listings[1]!.id, offer: 195000 },
] as const;
