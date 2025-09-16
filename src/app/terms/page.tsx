import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | HOAdoor",
  description:
    "Understand the rules and responsibilities for using HOAdoor's public review platform and private community tools.",
}

const updatedDate = "December 1, 2024"

export default function TermsOfServicePage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-4">
          <p className="text-sm text-muted-foreground">Last updated: {updatedDate}</p>
          <h1 className="text-4xl font-bold tracking-tight">HOAdoor Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            These Terms of Service ("Terms") govern your access to and use of HOAdoor. By creating
            an account, publishing reviews, or participating in private community features you
            agree to be bound by these Terms and our{' '}
            <Link href="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">1. Eligibility &amp; Accounts</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>You must be at least 18 years old to create an HOAdoor account.</li>
            <li>
              You are responsible for maintaining the accuracy of your contact information and the
              security of your magic link sign-in method.
            </li>
            <li>
              You may not create accounts using false identities or impersonate other individuals,
              HOA board members, or property managers.
            </li>
            <li>
              We reserve the right to suspend or terminate accounts that violate these Terms,
              applicable law, or community guidelines.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">2. Reviews &amp; Public Content</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Reviews must be based on genuine experiences with the HOA community you are writing
              about.
            </li>
            <li>
              Do not post confidential information, discriminatory language, harassment, or content
              that violates intellectual property rights.
            </li>
            <li>
              HOAdoor may moderate, edit, or remove reviews that violate policy or legal
              obligations.
            </li>
            <li>
              HOA administrators may respond publicly to reviews. Their responses are part of the
              public record and subject to these Terms.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">3. Private Community Features</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Membership in a private community requires approval from HOA administrators.</li>
            <li>
              Private forums, events, documents, and directories are for the exclusive use of
              approved members and must not be shared outside the platform.
            </li>
            <li>
              HOAdoor provides moderation tools, but individual HOAs are responsible for enforcing
              local policies, covenants, and community standards.
            </li>
            <li>
              Misuse of private community access, including harassment or disclosure of sensitive
              information, may result in suspension or legal action.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Use HOAdoor only for lawful purposes related to HOA research and community life.</li>
            <li>
              Do not attempt to gain unauthorized access to accounts, systems, or data belonging to
              other users or HOAs.
            </li>
            <li>
              Automated scraping, bulk data export, or interference with service availability is
              prohibited without written consent.
            </li>
            <li>
              Report suspected abuse, security issues, or policy violations to
              support@hoadoor.com.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              HOAdoor retains all rights to the platform, including design assets, code, and
              trademarks.
            </li>
            <li>
              You retain ownership of original content you submit, but grant HOAdoor a worldwide,
              royalty-free license to display, distribute, and create derivative works from that
              content for the purpose of operating the Service.
            </li>
            <li>
              You may not reuse, republish, or commercialize other users' content without their
              permission.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">6. Disclaimers &amp; Limitation of Liability</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              HOAdoor provides information "as is" without warranties of accuracy, completeness, or
              fitness for a particular purpose.
            </li>
            <li>
              We are not responsible for disputes between residents, HOAs, or third parties arising
              from information shared on the platform.
            </li>
            <li>
              To the fullest extent permitted by law, HOAdoor's liability for any claim is limited
              to the amount paid (if any) for use of premium services in the 12 months preceding the
              claim.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">7. Changes &amp; Contact</h2>
          <p className="text-muted-foreground">
            We may update these Terms to reflect product changes or legal requirements. When
            updates occur we will revise the "Last updated" date and, when required, notify you via
            email or in-product messaging. Continued use of HOAdoor after changes become effective
            constitutes acceptance of the revised Terms.
          </p>
          <p className="text-muted-foreground">
            Questions about these Terms can be directed to{' '}
            <Link href="mailto:legal@hoadoor.com" className="text-primary underline">
              legal@hoadoor.com
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
