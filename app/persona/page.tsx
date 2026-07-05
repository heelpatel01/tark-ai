import PersonaCards from "@/component/cardPersona";
import Navbar from "@/component/navbar";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(128,128,128,0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(128,128,128,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      <div className="pb-4">
        <Navbar />
      </div>
      <div className="pt-24 md:pt-28">
        <PersonaCards />
      </div>
    </div>
  );
}