// app/forgot-password/page.tsx  (Next.js App Router)
// or pages/forgot-password.tsx  (Pages Router)

import React from "react";
import { Mail, Shield, Info } from "lucide-react";

const ForgotPasswordPage = () => {
  const adminEmail = "finitemarshallclub@outlook.com"; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 flex items-center justify-center px-4 py-10">
      <div className="relative w-full max-w-4xl bg-white/90 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

        <div className="relative z-10 grid md:grid-cols-2 gap-0">
          {/* Left: Forgot Password Info */}
          <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-emerald-100 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Forgot Password
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Secure, manual password reset as per Finite Marshall Club policy.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                For security and compliance reasons, Finite Marshall Club does not
                offer an automatic password reset system. All password changes are
                processed manually by the admin team.
              </p>
              <p>
                To reset your account password, please send an email request from
                your registered email address to our support team. Include the
                following details:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Full Name</li>
                <li>Registered Email Address</li>
                <li>Registered Mobile Number (if any)</li>
                <li>Short note: “I want to reset my Finite Marshall Club password.”</li>
              </ul>
            </div>

            {/* Contact box */}
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-700 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Contact Admin for Password Reset
                </p>
                <p className="text-sm text-gray-700">
                  Email us at{" "}
                  <a
                    href={`mailto:${adminEmail}`}
                    className="font-mono text-emerald-700 underline underline-offset-2"
                  >
                    {adminEmail}
                  </a>{" "}
                  from your registered email. Our team will verify your details and
                  share the reset steps.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Note: For your safety, we will never ask for your old password,
                  OTPs, or banking details.
                </p>
              </div>
            </div>
          </div>

          {/* Right: T&C Section */}
          <div className="p-8 md:p-10 bg-gradient-to-br from-sky-50 via-emerald-50 to-white space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                Finite Marshall Club – Terms & Conditions
              </h2>
            </div>

            <div className="text-xs md:text-sm text-gray-700 space-y-2 max-h-80 overflow-y-auto pr-1">
              <p>
                <strong>1. Nature of Membership</strong><br />
                Finite Marshall Club is a service-based membership platform. It is
                not an investment, deposit, loan, chit fund, collective scheme, or
                income-generating program. Finite Marshall Club does not promise or
                guarantee any financial return.
              </p>

              <p>
                <strong>2. No Income / No ROI Disclaimer</strong><br />
                Finite Marshall Club does not offer fixed or variable returns,
                guaranteed income, monthly earnings, profit sharing, or any form of
                assured financial benefit. Membership fees are charged solely for
                access to services.
              </p>

              <p>
                <strong>3. Services Offered</strong><br />
                Services may include yoga and wellness sessions, health and
                lifestyle programs, fitness or educational activities, and
                loyalty-based benefits. Service availability and structure may
                change without prior notice.
              </p>

              <p>
                <strong>4. Loyalty Points Policy</strong><br />
                Loyalty points are provided only for internal benefits or
                discounts. Points are non-transferable, non-cashable, and do not
                represent money, securities, or investment. No legal claim can be
                made on loyalty points.
              </p>

              <p>
                <strong>5. No Ownership or Earnings Rights</strong><br />
                Members do not acquire any ownership, profit, revenue, or asset
                rights in Finite Marshall Club. Finite Marshall Club remains a
                privately owned service platform.
              </p>

              <p>
                <strong>6. Refund Policy</strong><br />
                Membership fees are non-refundable. No refund shall be issued once
                services have commenced. Any exception shall be at the sole
                discretion of Finite Marshall Club management.
              </p>

              <p>
                <strong>7. Agent / Referral Disclaimer</strong><br />
                Any agent commission is applicable only on actual service sales.
                There is no recruitment-based income, downline system, or chain
                commission. Finite Marshall Club is not an MLM, Ponzi, or pyramid
                scheme.
              </p>

              <p>
                <strong>8. Marketing & Representation</strong><br />
                False income claims, misleading advertisements, fake testimonials,
                or edited earning proofs are strictly prohibited. Any
                misrepresentation by agents or third parties shall be their
                personal responsibility.
              </p>

              <p>
                <strong>9. Data Protection & Privacy</strong><br />
                User data is collected and stored securely. Data is not sold or
                misused. Only necessary permissions are requested as per service
                requirements. Detailed privacy terms are available separately.
              </p>

              <p>
                <strong>10. Membership Termination</strong><br />
                Finite Marshall Club reserves the right to suspend or terminate
                membership without refund in cases of fraud, misuse, false
                promotion, or legal violations.
              </p>

              <p>
                <strong>11. Limitation of Liability</strong><br />
                Finite Marshall Club shall not be liable for any financial
                expectations, indirect losses, or misunderstandings arising from
                membership usage.
              </p>

              <p>
                <strong>12. Jurisdiction</strong><br />
                All disputes shall be subject exclusively to the jurisdiction of
                Pune, Maharashtra, India.
              </p>

              <p>
                <strong>13. Acceptance</strong><br />
                By registering or paying the membership fee, the member confirms
                that they have read, understood, and accepted these Terms &
                Conditions.
              </p>

              <p>
                <strong>Strong Legal Disclaimer</strong><br />
                Finite Marshall Club does not guarantee or assure any income,
                profit, return, or financial benefit of any kind.
              </p>
            </div>

            <p className="text-[11px] md:text-xs text-gray-500 mt-2">
              By requesting a password reset, you acknowledge that you have read
              and understood the above Terms & Conditions of Finite Marshall Club.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
