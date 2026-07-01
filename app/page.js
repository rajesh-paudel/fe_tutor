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

import HowItWorks from "@/components/HowItWork";

import BrowseByGoal from "@/components/BrowseByGoal";
import Testimonials from "@/components/Testimonials";
import FinalCta from "@/components/Finalcta";
import JoinSplit from "@/components/JoinSplit";

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
    <div className="min-h-screen flex flex-col justify-between">
      <Hero />
      <BrowseByGoal />
      <HowItWorks />

      <Testimonials />

      <JoinSplit />
    </div>
  );
}
