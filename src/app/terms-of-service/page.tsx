import Link from "next/link";

export const metadata = {
  title: "Terms of Service - MyndZeal",
  description: "Terms of Service for MyndZeal",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 mb-6">Last updated: August 24, 2025</p>

      <section className="prose prose-lg mb-8">
        <p>
          These Terms of Service explain the rules for using MyndZeal&apos;s services and the obligations of both users and MyndZeal.
        </p>
        <h2>Account Responsibilities</h2>
        <p>Keep your account secure and notify us of unauthorized use.</p>
        <h2>Service Availability</h2>
        <p>We strive to maintain service but may experience interruptions.</p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm text-[#8BA872]">← Back to home</Link>
      </div>
    </main>
  );
}
