import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="bg-card text-card-foreground shadow-lg bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-10 space-y-6 border">
        <div>
          <h1 className="text-3xl font-bold text-center mb-3">Privacy Policy</h1>
          <hr />
          <p className="text-sm text-muted-foreground text-end mt-3">Last updated on Jul 21, 2025</p>
        </div>

        <div className="text-muted-foreground space-y-4">
          <p>
            This privacy policy sets out how SUMIT KUMAR uses and protects any information that you give SUMIT KUMAR when you visit their website and/or agree to purchase from them.
          </p>
          <p>
            SUMIT KUMAR is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.
          </p>
          <p>
            SUMIT KUMAR may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you adhere to these changes.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-6">Information We May Collect:</h2>
          <ul className="list-disc ml-6">
            <li>Name</li>
            <li>Contact information including email address</li>
            <li>Demographic information such as postcode, preferences and interests, if required</li>
            <li>Other information relevant to customer surveys and/or offers</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-6">What We Do With The Information</h2>
          <ul className="list-disc ml-6">
            <li>Internal record keeping</li>
            <li>Improving our products and services</li>
            <li>Sending promotional emails about new products, offers, or updates</li>
            <li>Contacting you for market research via email, phone, fax, or mail</li>
            <li>Customizing the website according to your interests</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-6">Security</h2>
          <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in suitable measures.</p>

          <h2 className="text-xl font-semibold text-primary mt-6">How We Use Cookies</h2>
          <p>
            A cookie is a small file that asks permission to be placed on your computer's hard drive. Once agreed, the file is added and it helps analyze web traffic or notifies you when you visit a particular site.
          </p>
          <ul className="list-disc ml-6">
            <li>Cookies allow web apps to tailor their operations to your preferences</li>
            <li>We use traffic log cookies to identify popular pages and improve our site</li>
            <li>We only use data for statistical analysis, then remove it from the system</li>
            <li>Cookies help us monitor useful vs. unused pages, but don’t access personal files</li>
          </ul>
          <p>
            You can choose to accept or decline cookies. Most browsers accept cookies automatically, but you can usually modify this in settings. Declining may limit website functionality.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-6">Controlling Your Personal Information</h2>
          <ul className="list-disc ml-6">
            <li>Look for an opt-out box when submitting forms</li>
            <li>Change your mind about marketing by emailing us at fade@mail.io</li>
            <li>We won’t sell, distribute, or lease your information without your permission or legal requirement</li>
            <li>We may send promotional info from third parties if you opt in</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-6">Corrections</h2>
          <p>
            If you believe any information we’re holding is incorrect or incomplete, please write to:
          </p>
          <p>
            <strong>Address:</strong> 028 Raj Colony, near ITI, Sunam, Punjab, India Sangrur PUNJAB 148028
          </p>
          <p>
            <strong>Phone:</strong> +91 8789785951 <br />
            <strong>Email:</strong> fade@mail.io
          </p>
        </div>
      </div>
    </div>
  );
}
