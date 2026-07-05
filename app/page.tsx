import LandingPage from "@/component/hero";
import Navbar from "@/component/navbar";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(128,128,128,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128,128,128,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      <Navbar />
      <div className="pt-20 md:pt-24">
        <LandingPage />
      </div>
    </div>
  );
}
