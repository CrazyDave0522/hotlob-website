import { ContentPageLayout } from "../components/ContentPageLayout";
import { termsContent } from "@/content/pages/terms";

export const metadata = {
  title: "Terms & Conditions | Hotlob",
  description: "Review the terms and conditions for using Hotlob's services.",
};

export default function TermsPage() {
  return <ContentPageLayout title={termsContent.title} contentHtml={termsContent.body} />;
}
