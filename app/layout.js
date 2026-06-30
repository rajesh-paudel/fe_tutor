import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "EduSphere Tutor Workspace",
  description:
    "A tutor marketplace and learning workspace for students and teachers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
        <Providers>
          <div className="flex flex-col min-h-screen justify-between">
            <div className="w-full flex-grow">
              <Navbar />
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
