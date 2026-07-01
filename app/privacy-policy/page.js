import React from "react";

export const metadata = {
  title: "Privacy Policy | eduSphere",
  description: "Privacy Policy and data protection practices for eduSphere.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased selection:bg-emerald-100 ">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Sticky Navigation */}
        <aside className="md:col-span-1 hidden md:block">
          <div className="sticky top-8 space-y-3 text-sm border-l border-gray-200 pl-4">
            <p className="font-semibold text-gray-900 uppercase tracking-wider text-xs mb-4">
              On this page
            </p>
            <a
              href="#collection"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              1. Information We Collect
            </a>
            <a
              href="#usage"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              2. How We Use Your Data
            </a>
            <a
              href="#sharing"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              3. Sharing & Disclosure
            </a>
            <a
              href="#security"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              4. Data Security
            </a>
            <a
              href="#rights"
              className="block text-gray-600 hover:text-emerald-600 transition"
            >
              5. Your Rights
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 max-w-2xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
          <header className="mb-8 pb-6 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500">Last updated: July 1, 2026</p>
          </header>

          <p className="text-gray-600 leading-relaxed mb-6">
            Welcome to <strong>eduSphere</strong>. We value your privacy and are
            committed to protecting your personal data. This Privacy Policy
            outlines how we collect, process, and safeguard your information
            when you use our tutoring platform.
          </p>

          <div className="space-y-10">
            <section id="collection" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                To provide an optimal matching and learning experience, we
                collect information across two distinct account types:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  <strong>For Students:</strong> Name, contact details, academic
                  level, specific subjects requiring assistance, and payment
                  processing details.
                </li>
                <li>
                  <strong>For Tutors:</strong> Full name, professional
                  credentials, educational history, identification for
                  verification, and calendar schedules.
                </li>
              </ul>
            </section>

            <section id="usage" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                2. How We Use Your Data
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use the gathered information to authenticate your identity,
                facilitate matching between tutors and students, process
                transactions securely, manage schedule availability, and
                occasionally send updates regarding administrative modifications
                or platform enhancements.
              </p>
            </section>

            <section id="sharing" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                3. Data Sharing & Disclosure
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal data. Profile data necessary to
                enable pairing (e.g., tutor bios, subjects, or student requests)
                is visible to appropriate registered users. Trusted third-party
                processors handle critical operations such as payment processing
                and hosting under strict confidentiality standards.
              </p>
            </section>

            <section id="security" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                eduSphere implements industry-standard electronic safeguards,
                including end-to-end transport layer security (TLS) and data
                encryption at rest, to prevent unauthorized access, alteration,
                or disclosure of user accounts.
              </p>
            </section>

            <section id="rights" className="scroll-mt-6">
              <h2 className="text-xl font-semibold text-gray-950 mb-3">
                5. Your Rights
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Depending on your jurisdiction, you retain options to access,
                update, or completely purge your personal profile data within
                your account settings panel, or by coordinating directly with
                our administration support team.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
