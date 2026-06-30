import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  Sparkles,
  Search,
  CalendarCheck2,
  BrainCircuit,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChooseUs";
import AISection from "@/components/AISection";
import SmartRanking from "@/components/SmartRanking";
import Subjects from "@/components/Subjects";
import HowItWorks from "@/components/HowItWork";
import TrustSection from "@/components/TrustSection";

const highlights = [
  {
    title: "Find the perfect tutor",
    description:
      "Browse curated educators by subject, experience, and budget in seconds.",
    icon: Search,
  },
  {
    title: "Book with confidence",
    description:
      "Request sessions, track approvals, and join live meetings through a clear workflow.",
    icon: CalendarCheck2,
  },
  {
    title: "Learn with AI support",
    description:
      "Get conceptual hints and homework guidance without losing the thinking process.",
    icon: BrainCircuit,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between">
      <Navbar />
      <Hero />
      <WhyChoose />
      <AISection />
      <SmartRanking />
      <Subjects />
      <HowItWorks />
      <TrustSection />
      <Footer />
    </div>
  );
}
