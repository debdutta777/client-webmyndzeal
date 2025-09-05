import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - MyndZeal",
  description: "Privacy Policy for MyndZeal",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-6">Last updated: August 24, 2025</p>

      <section className="prose prose-lg mb-8">
        <p>
          MyndZeal (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting and respecting your privacy. This Policy explains how we collect, use, disclose and safeguard your information when you use our website and services.
        </p>
        <h2>Information We Collect</h2>
        <p>We may collect personal information you provide directly and usage information automatically.</p>
        <h2>How We Use Information</h2>
        <p>We use information to provide, maintain and improve our services, communicate with you, and comply with legal obligations.</p>
      </section>

      <p className="text-sm text-gray-600">For full details, contact <a href="mailto:info@myndzeal.com" className="text-[#8BA872]">info@myndzeal.com</a>.</p>

      <div className="mt-8">
        <Link href="/" className="text-sm text-[#8BA872]">← Back to home</Link>
      </div>
    </main>
  );
}
