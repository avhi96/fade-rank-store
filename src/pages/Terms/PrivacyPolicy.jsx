import React from 'react';

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
    <div className="text-muted-foreground space-y-2">{children}</div>
  </div>
);

export default function PrivacyPolicy() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="bg-card text-card-foreground shadow-lg bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-10 space-y-6 border">
        <div>
          <h1 className="text-3xl font-bold text-center mb-3">Privacy Policy</h1><hr />
          <p className="text-sm text-muted-foreground text-end mt-3">Last Updated: July 21, 2025</p>
          <p className="mt-4">
            Fade (“we,” “our,” “us”) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store, and safeguard your personal information when you access our website, purchase our products, or use our services.
          </p>
          <p className="mt-2">
            By using our website or services, you agree to the terms outlined in this Privacy Policy.
          </p>
        </div>

        <Section title="1. Policy Changes">
          <p>We may revise or update this Privacy Policy at any time by updating this page.</p>
          <p>We encourage you to review this policy periodically to ensure that you are aware of any changes.</p>
        </Section>

        <Section title="2. Information We Collect">
          <ul className="list-disc ml-6">
            <li>Personal Identifiable Information (PII): Name, email, phone, billing/shipping address.</li>
            <li>Demographic Data: Postcode, preferences, and interests.</li>
            <li>Transaction Data: Purchases and secure payment details.</li>
            <li>Other Info: Surveys, promotions, and service updates.</li>
          </ul>
        </Section>

        <Section title="3. Purpose of Data Collection">
          <ul className="list-disc ml-6">
            <li>Maintain records & improve services.</li>
            <li>Send order confirmations & updates.</li>
            <li>Send marketing (opt-in only).</li>
            <li>Contact you for feedback or research.</li>
            <li>Personalize your experience.</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          <p>We use industry-standard protocols and encryption to prevent unauthorized access or misuse of your data.</p>
        </Section>

        <Section title="5. Use of Cookies">
          <ul className="list-disc ml-6">
            <li>Analyze traffic & improve site experience.</li>
            <li>Customize content to user preferences.</li>
            <li>Cookies do not give access to personal files.</li>
            <li>You can disable cookies in browser settings.</li>
          </ul>
        </Section>

        <Section title="6. Your Rights & Control of Information">
          <ul className="list-disc ml-6">
            <li>Opt-out from marketing anytime.</li>
            <li>Request corrections to your data.</li>
            <li>Restrict use for specific services.</li>
          </ul>
        </Section>

        <Section title="7. Sharing of Information">
          <ul className="list-disc ml-6">
            <li>We do not sell or distribute data without consent.</li>
            <li>We may share limited info with providers for order processing.</li>
          </ul>
        </Section>

        <Section title="8. Accuracy of Data">
          <p>If your info is incorrect or outdated, contact us to update it.</p>
        </Section>

        <Section title="9. Contact Us">
          <p>Address: 028 Raj Colony, near ITI, Sunam, Sangrur, Punjab, 148028, India</p>
          <p>Phone: +91 8789785951</p>
          <p>Email: fade@mail.io</p>
        </Section>
      </div>
    </div>
  );
}
