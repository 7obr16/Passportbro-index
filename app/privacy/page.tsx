import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Privacy Policy | Passport Bro Index",
  description: "Privacy Policy for the Passport Bro Index app and website.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <SiteNav />

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80 mb-0">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="lead text-zinc-400 mt-3 text-base sm:text-lg">
            This Privacy Policy explains how Passport Bro Index collects, uses, and shares
            information when you use our website, app, and related services.
          </p>
          <p className="text-xs text-zinc-500 mt-1">Last updated: March 9, 2026</p>

          <hr className="border-zinc-800 my-8" />

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Who We Are</h2>
          <p className="text-zinc-300 leading-7 mb-4">
            Passport Bro Index provides country intelligence, charts, rankings, and related
            premium subscription features through the Passport Bro Index website and app. This
            Privacy Policy applies to information processed in connection with those services.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Information We Collect</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            We may collect account information such as your email address and login details when
            you create or access an account.
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            We may collect subscription and purchase information, including subscription status,
            product identifiers, and transaction-related metadata needed to manage in-app
            purchases.
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            We may collect information you submit through the service, such as ratings, comments,
            feedback, support requests, and other content you choose to provide.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            We may collect basic technical and usage information, such as device type, browser
            type, pages viewed, interactions with the service, and diagnostic information needed
            to operate and improve the app and website.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">How We Use Information</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            We use information to operate, maintain, secure, and improve Passport Bro Index.
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            We use information to provide account access, deliver app features, personalize
            content, process purchases, respond to support requests, and communicate important
            service updates.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            We may also use aggregated or de-identified information for analytics, performance
            monitoring, product planning, and service improvements.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">
            In-App Purchases and RevenueCat
          </h2>
          <p className="text-zinc-300 leading-7 mb-3">
            Passport Bro Index uses <strong className="text-zinc-200">RevenueCat</strong> as a
            third-party service provider for the secure processing of in-app purchases and
            subscriptions. RevenueCat helps us manage subscription status and entitlements for
            Apple in-app purchases.
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            When you purchase or restore a subscription, RevenueCat and Apple may process
            information such as subscription identifiers, receipts, transaction metadata, and
            entitlement status so we can determine whether premium access is active. RevenueCat
            acts as a service provider and does not receive more data than necessary to provide
            that functionality.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            We do not sell your personal data or any unnecessary data to third parties. Data is
            only shared with service providers like RevenueCat to the extent required to operate
            the service (e.g. subscription management) and as described in this policy.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">How We Share Information</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            We may share information with service providers that help us operate the app and
            website, such as hosting, authentication, database, and subscription management
            providers (including RevenueCat for in-app purchases and subscriptions).
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            We may disclose information when required by law, to enforce our terms, to protect our
            users, or in connection with a business transfer such as a merger, acquisition, or
            asset sale.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            We do not sell your personal data or unnecessary data. We do not share personal
            information with third parties for their marketing purposes. We only share as
            described in this Privacy Policy or as otherwise required to provide the service.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Data Retention</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            We retain personal information for as long as reasonably necessary to provide the
            service, comply with legal obligations, resolve disputes, enforce agreements, and
            maintain legitimate business records.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            Retention periods may vary depending on the type of data, whether you maintain an
            account, and whether we are required to preserve certain records for legal, security,
            tax, or accounting reasons.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Your Choices and Rights</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            You may be able to access, update, or delete certain account information through the
            app or by contacting us through our website.
          </p>
          <p className="text-zinc-300 leading-7 mb-3">
            You may cancel an Apple subscription at any time in your Apple account settings.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            Depending on your location, you may have additional legal rights regarding access,
            correction, deletion, or restriction of your personal information.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Children&apos;s Privacy</h2>
          <p className="text-zinc-300 leading-7 mb-3">
            Passport Bro Index is not directed to children under 13, and we do not knowingly
            collect personal information from children under 13.
          </p>
          <p className="text-zinc-300 leading-7 mb-4">
            If you believe a child has provided personal information to us, please contact us
            through{" "}
            <a
              href="https://thepassportbro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-300"
            >
              https://thepassportbro.com
            </a>{" "}
            so we can review and remove the information where appropriate.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Changes to This Policy</h2>
          <p className="text-zinc-300 leading-7 mb-4">
            We may update this Privacy Policy from time to time. When we do, we will post the
            updated version on this page and update the &quot;Last updated&quot; date above.
          </p>

          <h2 className="text-xl font-bold text-zinc-100 mt-10 mb-3">Contact</h2>
          <p className="text-zinc-300 leading-7 mb-4">
            If you have privacy-related questions, you can contact us through our website at{" "}
            <a
              href="https://thepassportbro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4 hover:text-emerald-300"
            >
              https://thepassportbro.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
