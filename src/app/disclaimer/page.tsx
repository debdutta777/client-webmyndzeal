import Link from "next/link";

export const metadata = {
  title: "Disclaimer",
  description: "Disclaimer for MyndZeal",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
      <p className="text-gray-700 mb-6">Last updated: August 24, 2025</p>

      <section className="prose prose-lg mb-8">
        <p>
          The information provided on this website is for general informational purposes only and does not constitute medical advice. Please consult a qualified professional for medical concerns.
        </p>
        <h2>Limitation</h2>
        <p>We are not liable for actions taken based on content on this site.</p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm text-[#8BA872]">← Back to home</Link>
      </div>
    </main>
  );
}
