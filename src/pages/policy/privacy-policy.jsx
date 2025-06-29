
import React, { useState } from 'react';
import { FileText, Shield, Cookie, Mail, Globe, Building } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', icon: Cookie }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Planet Empire FZCO</h1>
              <p className="text-sm text-gray-600 sm:text-base">Legal Documents & Policies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8 sm:py-12">
        <div className="p-6 bg-white shadow-lg rounded-xl sm:p-8 lg:p-12">
          {activeTab === 'privacy' && <PrivacyPolicyContent />}
          {activeTab === 'terms' && <TermsOfServiceContent />}
          {activeTab === 'cookies' && <CookiePolicyContent />}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-white bg-gray-900 sm:py-12">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Planet Empire FZCO</h3>
              <p className="text-sm text-gray-400">
                Committed to protecting your privacy and providing transparent services.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@ten.club</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>https://clubten.app</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>© 2024 Planet Empire FZCO. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PrivacyPolicyContent = () => (
  <div className="prose prose-slate max-w-none">
    <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">Privacy Policy</h1>
    <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
      Planet Empire FZCO ("we", "us", or "our") operates the website https://clubten.app (the "Site"). 
      We value your privacy and are committed to protecting your personal data. This Privacy Policy 
      explains how we collect, use, disclose, and safeguard your information when you visit our website.
    </p>

    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">1. Information We Collect</h2>
        <p className="mb-4 text-gray-600">We may collect and process the following types of personal information:</p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span><strong>Personal Identification Information:</strong> Name, email address, phone number, etc.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span><strong>Account Information:</strong> Login credentials and related information if you create an account.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span><strong>Payment Information:</strong> If you make purchases, we collect necessary payment details via secure third-party payment processors.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span><strong>Technical Data:</strong> IP address, browser type, operating system, referring URLs, pages viewed, and other usage data.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span><strong>Cookies and Tracking Technologies:</strong> For improving user experience, analytics, and marketing.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">2. How We Use Your Information</h2>
        <p className="mb-4 text-gray-600">We may use the information we collect from you to:</p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Provide, operate, and maintain our website and services</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Improve and personalize user experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Process transactions and manage orders</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Respond to support inquiries and provide customer service</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Send administrative or promotional communications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
            <span>Monitor and analyze usage and trends to improve our site</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">3. Sharing Your Information</h2>
        <p className="mb-4 text-gray-600">We do not sell your personal information. However, we may share your data with:</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-blue-50">
            <h4 className="mb-2 font-semibold text-gray-900">Service Providers</h4>
            <p className="text-sm text-gray-600">Third-party vendors who assist in website functionality, payments, or analytics</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50">
            <h4 className="mb-2 font-semibold text-gray-900">Legal Requirements</h4>
            <p className="text-sm text-gray-600">To comply with legal obligations, respond to lawful requests, or protect our rights</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50">
            <h4 className="mb-2 font-semibold text-gray-900">Business Transfers</h4>
            <p className="text-sm text-gray-600">In the event of a merger, sale, or asset transfer</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">4. Cookies and Tracking Technologies</h2>
        <p className="text-gray-600">
          We use cookies and similar technologies to enhance your experience on our site. You can control 
          cookie preferences through your browser settings. For more details, see our Cookie Policy.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">5. Data Security</h2>
        <p className="text-gray-600">
          We implement appropriate technical and organizational measures to secure your personal data. 
          However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">6. Your Rights</h2>
        <p className="mb-4 text-gray-600">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
        <div className="p-6 rounded-lg bg-gray-50">
          <ul className="space-y-2 text-gray-600">
            <li>• Access, correct, or delete your personal information</li>
            <li>• Object to or restrict processing</li>
            <li>• Withdraw consent at any time</li>
            <li>• Lodge a complaint with a data protection authority</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            To exercise these rights, contact us at <strong>support@ten.club</strong>.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">7. Third-Party Links</h2>
        <p className="text-gray-600">
          Our site may contain links to third-party websites. We are not responsible for the privacy 
          practices of such sites. Please review their policies before providing any personal information.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">8. Children's Privacy</h2>
        <p className="text-gray-600">
          Our services are not intended for individuals under the age of 13. We do not knowingly collect 
          personal data from children. If you believe we have unintentionally collected such data, please 
          contact us immediately.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">9. Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with 
          an updated effective date. Your continued use of the site indicates your acceptance of the revised policy.
        </p>
      </section>

      <section className="p-6 rounded-lg bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">10. Contact Us</h2>
        <p className="mb-4 text-gray-600">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
        <div className="space-y-2 text-gray-600">
          <p><strong>Planet Empire FZCO</strong></p>
          <p>Email: support@ten.club</p>
          <p>Website: https://clubten.app</p>
        </div>
      </section>
    </div>
  </div>
);

const TermsOfServiceContent = () => (
  <div className="prose prose-slate max-w-none">
    <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">Terms of Service</h1>
    <div className="p-4 mb-8 rounded-lg bg-blue-50">
      <p className="text-sm text-gray-700 sm:text-base">
        <strong>Company:</strong> Planet Empire FZCO<br />
        <strong>Website:</strong> https://clubten.app<br />
        <strong>Support Email:</strong> support@ten.club
      </p>
    </div>

    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">1. Acceptance of Terms</h2>
        <p className="text-gray-600">
          By accessing or using https://clubten.app ("the Site"), you agree to be bound by these Terms 
          of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">2. Eligibility</h2>
        <p className="text-gray-600">
          You must be at least 13 years old to use our Site. By using the Site, you represent that you meet this requirement.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">3. Account Registration</h2>
        <p className="mb-4 text-gray-600">Some features require account creation. You agree to:</p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span>Provide accurate and complete information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span>Keep your login credentials secure</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></span>
            <span>Notify us immediately of unauthorized use</span>
          </li>
        </ul>
        <p className="mt-4 text-gray-600">We reserve the right to suspend or delete accounts at our discretion.</p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">4. User Conduct</h2>
        <p className="mb-4 text-gray-600">You agree not to:</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-red-50">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Violate any applicable laws or regulations</li>
              <li>• Use the site for any fraudulent or harmful purpose</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-50">
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Upload malicious code or spam</li>
              <li>• Infringe on intellectual property rights</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">5. Payments and Subscriptions</h2>
        <p className="text-gray-600">
          If you purchase a subscription or paid service, you agree to the terms and prices listed at checkout. 
          All payments are handled through secure third-party providers. We are not responsible for payment processing errors.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">6. Intellectual Property</h2>
        <p className="text-gray-600">
          All content on the Site (logos, graphics, text, software) is the property of Planet Empire FZCO 
          or its licensors and protected under copyright and trademark laws. You may not reuse or distribute 
          content without our permission.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">7. Disclaimers</h2>
        <p className="text-gray-600">
          The Site is provided "as is" and "as available" without warranties of any kind. We do not guarantee 
          that the site will be error-free or uninterrupted.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">8. Limitation of Liability</h2>
        <p className="text-gray-600">
          To the maximum extent permitted by law, Planet Empire FZCO will not be liable for any indirect, 
          incidental, or consequential damages arising out of or in connection with your use of the Site.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">9. Termination</h2>
        <p className="text-gray-600">
          We may suspend or terminate your access to the Site without notice for any reason, including if you violate these Terms.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">10. Governing Law</h2>
        <p className="text-gray-600">
          These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. 
          Any disputes shall be resolved in the appropriate courts located in Dubai.
        </p>
      </section>

      <section className="p-6 rounded-lg bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">11. Contact Us</h2>
        <p className="text-gray-600">Questions about these Terms? Contact us:</p>
        <p className="mt-2 text-gray-600">Email: support@ten.club</p>
      </section>
    </div>
  </div>
);

const CookiePolicyContent = () => (
  <div className="prose prose-slate max-w-none">
    <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">Cookie Policy</h1>
    <div className="p-4 mb-8 rounded-lg bg-blue-50">
      <p className="text-sm text-gray-700 sm:text-base">
        <strong>Website:</strong> https://clubten.app<br />
        <strong>Company:</strong> Planet Empire FZCO
      </p>
    </div>

    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">1. What Are Cookies?</h2>
        <p className="text-gray-600">
          Cookies are small data files stored on your device when you visit a website. They help improve 
          user experience by remembering preferences, enabling functionality, and tracking usage data.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">2. Types of Cookies We Use</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-6 rounded-lg bg-green-50">
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Essential Cookies
            </h4>
            <p className="text-sm text-gray-600">Required for basic site functionality.</p>
          </div>
          <div className="p-6 rounded-lg bg-blue-50">
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Performance Cookies
            </h4>
            <p className="text-sm text-gray-600">Collect data on how users interact with the Site (e.g., Google Analytics).</p>
          </div>
          <div className="p-6 rounded-lg bg-purple-50">
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Functional Cookies
            </h4>
            <p className="text-sm text-gray-600">Remember user choices and preferences.</p>
          </div>
          <div className="p-6 rounded-lg bg-orange-50">
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-gray-900">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              Targeting/Advertising Cookies
            </h4>
            <p className="text-sm text-gray-600">Track browsing habits to deliver relevant ads.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">3. Third-Party Cookies</h2>
        <p className="text-gray-600">
          We may use third-party services (e.g., Google, Facebook) that set their own cookies. These cookies 
          are governed by the privacy policies of those third parties.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">4. Managing Cookies</h2>
        <p className="mb-4 text-gray-600">
          You can manage or disable cookies through your browser settings. However, disabling cookies may 
          affect the functionality of the Site.
        </p>
        <div className="p-6 rounded-lg bg-gray-50">
          <h4 className="mb-4 font-semibold text-gray-900">Browser Help Links:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="font-medium text-gray-700 min-w-[80px]">Chrome:</span>
              <a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 break-all hover:underline">
                https://support.google.com/chrome/answer/95647
              </a>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="font-medium text-gray-700 min-w-[80px]">Firefox:</span>
              <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-blue-600 break-all hover:underline">
                https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences
              </a>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="font-medium text-gray-700 min-w-[80px]">Safari:</span>
              <a href="https://support.apple.com/en-us/HT201265" className="text-blue-600 break-all hover:underline">
                https://support.apple.com/en-us/HT201265
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">5. Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated effective date.
        </p>
      </section>

      <section className="p-6 rounded-lg bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl">6. Contact Us</h2>
        <p className="text-gray-600">If you have any questions about our use of cookies, contact us at:</p>
        <p className="mt-2 text-gray-600">Email: support@ten.club</p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;
