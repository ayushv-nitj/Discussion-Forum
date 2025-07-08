import "@/styles/globals.css"; // Adjust path if needed
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 text-gray-800 font-sans">
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}
