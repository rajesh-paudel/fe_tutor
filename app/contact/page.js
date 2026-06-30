import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, PhoneCall, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/90 p-8 sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let’s make learning support feel effortless.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Whether you want to book a session, become a tutor, or ask a
            question, our team is here to help.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5">
              <Mail className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 font-semibold text-white">Email</p>
              <p className="mt-1 text-sm text-gray-400">
                support@edusphere.com
              </p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5">
              <PhoneCall className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 font-semibold text-white">Phone</p>
              <p className="mt-1 text-sm text-gray-400">+1 (555) 014-2288</p>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 font-semibold text-white">Location</p>
              <p className="mt-1 text-sm text-gray-400">
                Remote worldwide support
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
