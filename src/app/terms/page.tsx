import Link from "next/link";

export const metadata = {
  title: "Terms & Services",
  description: "Terms & Services for MyndZeal",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-4">Terms & Services</h1>
      <p className="text-gray-700 mb-6">Last updated: August 24, 2025</p>

      <section className="prose prose-lg mb-8">
        <p>
          These Terms & Services govern your use of MyndZeal&apos;s website and services. By accessing or using the service, you agree to be bound by these terms.
        </p>
        <h2>Use of Service</h2>
        <p>Users must be at least 16 years old or have parental consent. You agree not to misuse the services.</p>
        <h2>Limitation of Liability</h2>
        <p>We are not liable for indirect or consequential damages. Please read full terms carefully.</p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-sm text-[#8BA872]">← Back to home</Link>
      </div>
    </main>
  );
}
