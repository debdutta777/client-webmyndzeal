import Link from "next/link";

export const metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for MyndZeal",
};

export default function CookiePolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Cookie Policy</h1>
      <p className="text-gray-700 mb-6">Last updated: August 24, 2025</p>

      <section className="prose prose-lg mb-8">
        <p>
          We use cookies and similar technologies to provide and improve our services. This Cookie Policy explains how and why we use them.
        </p>
        <h2>Types of Cookies</h2>
        <p>Essential cookies for core functionality; analytics cookies for usage insights; optional preference cookies.</p>
        <h2>Managing Cookies</h2>
        <p>You may manage cookie preferences via your browser settings.</p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm text-[#8BA872]">← Back to home</Link>
      </div>
    </main>
  );
}
