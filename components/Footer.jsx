import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { GraduationCap } from "lucide-react";
const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "Find a tutor", href: "/tutors" },
      { label: "Become a tutor", href: "/become-a-tutor" },
      { label: "AI Study Assistant", href: "/ai-assistant" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Booking & payments", href: "/help/payments" },
      { label: "Tutor guidelines", href: "/help/tutor-guidelines" },
      { label: "Trust & safety", href: "/safety" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <span className="text-base font-bold tracking-tight text-slate-900">
                EduSphere
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              A tutoring platform that helps students in Nepal find tutors they
              can actually trust, backed by verified reviews and an AI study
              assistant for every learner.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="https://facebook.com"
                aria-label="EduSphere on Facebook"
                className="text-slate-400 transition hover:text-emerald-600"
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                aria-label="EduSphere on Instagram"
                className="text-slate-400 transition hover:text-emerald-600"
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                aria-label="EduSphere on LinkedIn"
                className="text-slate-400 transition hover:text-emerald-600"
              >
                <FaLinkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
            {footerLinks.map((col) => (
              <div key={col.heading}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {col.heading}
                </h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 transition hover:text-emerald-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-emerald-600">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-600">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
