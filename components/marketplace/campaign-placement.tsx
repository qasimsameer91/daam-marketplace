import { getPublicCampaign, type CampaignPlacement } from "@/lib/data/campaigns";
import { CampaignCreative } from "./campaign-creative";

export async function CampaignBanner({
  placement,
  locale,
  compact = false,
}: {
  placement: CampaignPlacement;
  locale: string;
  compact?: boolean;
}) {
  const campaign = await getPublicCampaign(placement);
  if (!campaign) return null;
  const urdu = locale === "ur";
  const href =
    campaign.cta_url.startsWith("/") && !/^\/(en|ur)(\/|\?|$)/.test(campaign.cta_url)
      ? `/${urdu ? "ur" : "en"}${campaign.cta_url}`
      : campaign.cta_url;
  return (
    <section data-slot="campaign" data-placement={placement} className="my-8">
      <CampaignCreative
        title={urdu ? campaign.title_ur : campaign.title_en}
        eyebrow={urdu ? campaign.subtitle_ur : campaign.subtitle_en}
        description={urdu ? campaign.description_ur : campaign.description_en}
        cta={urdu ? campaign.cta_ur : campaign.cta_en}
        href={href}
        desktop={campaign.desktop_image_url}
        mobile={campaign.mobile_image_url}
        theme={campaign.theme}
        compact={compact}
      />
    </section>
  );
}
