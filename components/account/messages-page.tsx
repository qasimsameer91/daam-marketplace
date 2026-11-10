import { getLocale } from "next-intl/server";
import { getSeedContentBlocks } from "@/lib/content/seed-content-blocks";
import { isAppLocale } from "@/lib/i18n/routing";
import { MessagesScreen } from "./messages-screen";
export async function MessagesPage({ threadId }: { threadId?: string }) {
  const locale = await getLocale();
  const content = await getSeedContentBlocks(isAppLocale(locale) ? locale : "en");
  return (
    <MessagesScreen
      key={threadId}
      threadId={threadId}
      safety={content.get("safety.chat_start") ?? ""}
    />
  );
}
