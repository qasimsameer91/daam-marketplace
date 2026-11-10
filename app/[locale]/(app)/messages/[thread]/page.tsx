import { notFound } from "next/navigation";
import { MessagesPage } from "@/components/account/messages-page";
import { previewThreads } from "@/lib/mock/account";
import { Suspense } from "react";
import Loading from "../../loading";
async function ThreadContent({ params }: PageProps<"/[locale]/messages/[thread]">) {
  const { thread } = await params;
  if (!previewThreads.some((t) => t.id === thread)) notFound();
  return <MessagesPage threadId={thread} />;
}
export default function Page(props: PageProps<"/[locale]/messages/[thread]">) {
  return (
    <Suspense fallback={<Loading />}>
      <ThreadContent {...props} />
    </Suspense>
  );
}
