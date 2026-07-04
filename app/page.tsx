import HeroSection from "@/component/hero";
import Navbar from "@/component/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <Navbar />
      <div className="pt-20">
        <HeroSection />
      </div>
    </div>
  );
}
