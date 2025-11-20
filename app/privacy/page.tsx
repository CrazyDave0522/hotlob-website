import { ContentPageLayout } from "../components/ContentPageLayout";
import { privacyContent } from "@/content/pages/privacy";

export const metadata = {
  title: "Privacy Policy | Hotlob",
  description: "Read Hotlob's privacy practices and how we handle your information.",
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout title={privacyContent.title} contentHtml={privacyContent.body} />
  );
}
