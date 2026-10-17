import { CrisisStats } from "@/components/home/CrisisStats";
import { DonationBanner } from "@/components/home/DonationBanner";
import { Hero } from "@/components/home/Hero";
import { LatestArticles } from "@/components/home/LatestArticles";
import { ProgrammesPreview } from "@/components/home/ProgrammesPreview";
import { TestimoniesPreview } from "@/components/home/TestimoniesPreview";

/** Public landing page: mission, crisis figures, programmes, news and giving. */
export default function HomePage() {
  return (
    <div data-ocid="home.page">
      <Hero />
      <CrisisStats />
      <ProgrammesPreview />
      <LatestArticles />
      <TestimoniesPreview />
      <DonationBanner />
    </div>
  );
}
