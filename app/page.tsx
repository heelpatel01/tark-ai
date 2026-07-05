import LandingPage from "@/component/hero";
import Navbar from "@/component/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <LandingPage />
    </div>
  );
}
