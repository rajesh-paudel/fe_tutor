import React from "react";

export const metadata = {
  title: "Terms of Service | eduSphere",
  description: "Terms of Service and legal agreements for using eduSphere.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased selection:bg-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Sticky Navigation */}
        <aside className="md:col-span-1 hidden md:block">
          <div className="sticky top-8 space-y-3 text-sm border-l border-gray-200 pl-4">
            <p className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-4">
              On this page
            </p>
            <a
              href="#accounts"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              1. Account Terms
            </a>
            <a
              href="#conduct"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              2. User Conduct
            </a>
            <a
              href="#payments"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              3. Fees & Bookings
            </a>
            <a
              href="#liability"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              4. Limitation of Liability
            </a>
            <a
              href="#termination"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              5. Termination
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 max-w-2xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
          <header className="mb-8 pb-6 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-gray-500">Last updated: July 1, 2026</p>
          </header>

          <p className="text-gray-600 leading-relaxed mb-6">
            By creating an account or interacting with the{" "}
            <strong>eduSphere</strong> platform, you agree to comply with and be
            bound by the following Terms of Service. Please review these rules
            thoroughly.
          </p>

          <div className="space-y-10">
            <section id="accounts" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                1. Account Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You must provide authentic, precise, and current records when
                creating an account. You are solely responsible for maintaining
                the strict confidentiality of your credential entries, tokens,
                and all session activity tied to your user profile.
              </p>
            </section>

            <section id="conduct" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                2. User Conduct & Engagements
              </h2>
              <p className="text-gray-600 leading-relaxed">
                eduSphere functions as an open matchmaking forum for interactive
                tutoring services. Users agree to respect standard decorum and
                boundaries. Harassment, academic dishonesty (such as asking
                tutors to complete test items or cheat), and illicit
                solicitation outside the platform ecosystem remain strictly
                prohibited.
              </p>
            </section>

            <section id="payments" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                3. Booking Fees & Payment Settlement
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Students agree to pay specified platform rates and tutor fees
                mapped to reserved calendar sessions. Tutors acknowledge that
                platform payouts are subject to administrative processing cycles
                and standard transactional handling deductions outlined during
                profile setup.
              </p>
            </section>

            <section id="liability" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                4. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                eduSphere provides matchmaking systems &quot;as is&quot; without
                explicit warranties regarding performance or individual
                outcomes. We assume no direct liability for personal disputes,
                instructional quality deviations, or any situational conflicts
                arising out of physical or online appointments arranged via the
                platform.
              </p>
            </section>

            <section id="termination" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                5. Termination
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the exclusive authority to restrict, lock, or
                permanently delete user accounts at our discretion, without
                prior notice, if structural or conduct breaches under these
                Terms are detected.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
