// Simplified PersonaInfo interface for frontend display
export interface PersonaInfo {
  key: string;
  name: string;
  role: string;
  personality: string;
  image?: string;
}

// Category type
export type PersonaCategory = "tech-educators";

// Category display names
export const CATEGORY_NAMES: Record<PersonaCategory, string> = {
  "tech-educators": "Engineering Mentors",
};

// Personas organized by category
export const PERSONAS_BY_CATEGORY: Record<PersonaCategory, PersonaInfo[]> = {
  "tech-educators": [
    {
      key: "hiteshchoudhary",
      name: "Hitesh Choudhary",
      role: "Founder, Chai Code · Full-Stack & Career Mentor",
      personality: "Project-first educator. Explains real-world engineering with simple analogies, Hinglish, and honest career advice.",
      image: "/hiteshchoudhary.png"
    },
    {
      key: "piyushgarg",
      name: "Piyush Garg",
      role: "Founder, Teachyst · AI & Backend Engineering Mentor",
      personality: "Systems thinker. Builds intuition before syntax — covering AI agents, MCP, backend, and modern dev workflows.",
      image: "/piyushgarg.png"
    },
  ],
};

// Get all personas as a flat array
export const getAllPersonas = (): PersonaInfo[] => {
  return Object.values(PERSONAS_BY_CATEGORY).flat();
};

// Get persona by key
export const getPersonaByKey = (key: string): PersonaInfo | undefined => {
  return getAllPersonas().find(p => p.key === key);
};

// Get all category keys
export const getCategoryKeys = (): PersonaCategory[] => {
  return Object.keys(PERSONAS_BY_CATEGORY) as PersonaCategory[];
};

// Get personas for a specific category
export const getPersonasByCategory = (category: PersonaCategory): PersonaInfo[] => {
  return PERSONAS_BY_CATEGORY[category] || [];
};
