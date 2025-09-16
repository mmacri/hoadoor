import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "HOAdoor Community Features",
  description: "Explore the private portal and analytics tools available to HOA leaders on HOAdoor.",
}

const featureSections = [
  {
    title: "Communication Hub",
    badge: "Engagement",
    points: [
      "Announcement broadcasts with email notifications and in-app digest",
      "Discussion forums with moderation queues, pinning, and file attachments",
      "Direct messaging with resident opt-in controls and abuse reporting",
    ],
  },
  {
    title: "Operations &amp; Compliance",
    badge: "Governance",
    points: [
      "Document library with version history for bylaws, budgets, and meeting minutes",
      "Task management for maintenance items and board assignments",
      "Event scheduling with RSVP tracking and automated reminders",
    ],
  },
  {
    title: "Analytics &amp; Reputation",
    badge: "Insights",
    points: [
      "Review sentiment tracking and category breakdowns (management, amenities, value)",
      "Membership funnel metrics showing pending, approved, and churned residents",
      "Audit log of moderation actions for compliance and governance reviews",
    ],
  },
]

const premiumHighlights = [
  "Single sign-on integrations for large management companies",
  "Webhooks and CSV exports for financial and CRM tools",
  "Custom branding, vanity URLs, and white-labeled resident emails",
  "Priority support with quarterly strategy reviews",
]

export default function HoaFeaturesPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Tools built for modern HOA leadership</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Bring transparency and structure to your community. HOAdoor combines public reviews
            with private operational tools to deliver an end-to-end resident experience.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {featureSections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="space-y-2">
                <Badge variant="secondary" className="w-fit uppercase">
                  {section.badge}
                </Badge>
                <CardTitle className="text-lg" dangerouslySetInnerHTML={{ __html: section.title }} />
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Upgrade to HOAdoor Premium</h2>
          <Card>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {premiumHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground">
            Contact sales@hoadoor.com to schedule a live demo tailored to your HOA and learn about
            rollout timelines, training resources, and multi-property pricing.
          </p>
        </section>
      </div>
    </div>
  )
}
