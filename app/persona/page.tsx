import PersonaCards from "@/component/cardPersona";
import Navbar from "@/component/navbar";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="pb-25">
        <Navbar />
      </div>
      <PersonaCards />
    </div>
  );
}