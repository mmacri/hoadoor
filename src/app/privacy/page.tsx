import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | HOAdoor",
  description:
    "Learn how HOAdoor collects, uses, and protects your information across public reviews and private community features.",
}

const updatedDate = "December 1, 2024"

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <p className="text-sm text-muted-foreground">Last updated: {updatedDate}</p>
          <h1 className="text-4xl font-bold tracking-tight">HOAdoor Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            HOAdoor ("we," "our," or "us") is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our website and services. By accessing HOAdoor you agree to
            the practices described below.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information you provide directly, data gathered automatically through your
            use of the platform, and limited information from third parties.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Information You Provide</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Email address for magic link authentication and account recovery</li>
                <li>Profile details and optional avatar</li>
                <li>Reviews, ratings, community posts, and membership requests</li>
                <li>Support tickets, survey responses, and other direct communications</li>
              </ul>
            </div>
            <div className="space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Information Collected Automatically</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Usage analytics such as pages viewed, search queries, and click interactions</li>
                <li>Device and technical data including IP address, browser, and operating system</li>
                <li>Cookies that remember preferences, maintain sessions, and measure performance</li>
                <li>Referring URLs and timestamps for security and diagnostics</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Information from Third Parties</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Publicly available HOA and property records used to verify community data</li>
              <li>Email delivery insights from our transactional email provider</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How We Use Information</h2>
          <p className="text-muted-foreground">
            HOAdoor uses your information to provide the service, support community engagement,
            and improve the platform. Key uses include:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Authenticating your account and delivering secure magic link sign-ins</li>
            <li>Displaying your reviews, responses, and contributions to the correct community</li>
            <li>Facilitating private community features like events, documents, and messaging</li>
            <li>Sending important service announcements, support responses, and feature updates</li>
            <li>Analyzing usage trends to improve search, recommendations, and reliability</li>
            <li>Protecting HOAdoor and its users against fraud, abuse, and legal violations</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">How We Share Information</h2>
          <p className="text-muted-foreground">
            We never sell personal information. We share data only when it is required to operate
            HOAdoor or when the law requires it.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Public &amp; Community Visibility</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Approved reviews and ratings are visible to all users unless posted anonymously</li>
                <li>Private community posts are visible only to members approved by HOA admins</li>
                <li>HOA administrators can review membership requests, flags, and moderation logs</li>
              </ul>
            </div>
            <div className="space-y-2 rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Service Providers &amp; Legal Requirements</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Email delivery, cloud hosting, analytics, and customer support providers</li>
                <li>Disclosure required to comply with laws, court orders, or prevent abuse</li>
                <li>Transfers in the event of a merger or acquisition under equivalent safeguards</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Data Security &amp; Retention</h2>
          <p className="text-muted-foreground">
            We apply technical, organizational, and physical safeguards to protect your data,
            including encryption in transit and at rest, access controls, audit trails, and
            disaster recovery procedures. Personal data is retained only as long as necessary to
            deliver the service and meet legal obligations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Your Choices</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Manage email preferences and account settings from your profile</li>
            <li>Request data export or deletion by contacting support@hoadoor.com</li>
            <li>Opt out of marketing messages at any time through email unsubscribe links</li>
            <li>Use privacy settings within community features to control visibility</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">International Users</h2>
          <p className="text-muted-foreground">
            HOAdoor is currently focused on the United States. If you access the Service from
            other jurisdictions, you consent to the transfer of your information to the U.S. and
            to the processing of your data according to this policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy or how HOAdoor safeguards your
            information, contact our privacy team at{' '}
            <Link href="mailto:privacy@hoadoor.com" className="text-primary underline">
              privacy@hoadoor.com
            </Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
