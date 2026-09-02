import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import RoadmapOverview from "@/components/home/RoadmapOverview";
import CommunityStats from "@/components/home/CommunityStats";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedCourses />
      <RoadmapOverview />
      <CommunityStats />
    </div>
  );
}
