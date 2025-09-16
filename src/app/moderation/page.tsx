import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "HOAdoor Content &amp; Moderation Policy",
  description: "Understand how HOAdoor keeps reviews authentic, respectful, and compliant with the law.",
}

const policySections = [
  {
    title: "Community Standards",
    badge: "Respect",
    items: [
      "Share first-hand experiences relevant to HOA living",
      "Avoid hateful, discriminatory, or harassing language",
      "Do not post personal information or confidential documents",
      "Label speculative statements and focus on verifiable facts",
    ],
  },
  {
    title: "What We Moderate",
    badge: "Enforcement",
    items: [
      "Fraudulent or duplicate reviews",
      "Spam, solicitations, or commercial promotions",
      "Content that violates court orders or legal restrictions",
      "Security threats or content encouraging violence",
    ],
  },
  {
    title: "Resident Rights",
    badge: "Transparency",
    items: [
      "Every flagged review is evaluated by a human moderator",
      "Users receive email updates when content status changes",
      "HOA administrators can submit evidence when disputing reviews",
      "Appeals can be requested by emailing legal@hoadoor.com within 14 days",
    ],
  },
]

export default function ModerationPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Content &amp; Moderation Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            HOAdoor exists to promote transparent, constructive dialogue between residents and HOA
            leaders. These guidelines explain how we enforce that mission.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {policySections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="space-y-2">
                <Badge variant="secondary" className="w-fit uppercase">
                  {section.badge}
                </Badge>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to report content</h2>
          <Card>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Use the "Report" action on any review or post to flag violations. Provide as much
                context as possible, including dates, documentation, and links.
              </p>
              <p>
                For urgent matters involving safety or legal compliance, email{' '}
                <Link href="mailto:legal@hoadoor.com" className="text-primary underline">
                  legal@hoadoor.com
                </Link>{' '}
                with the subject line "Urgent Moderation".
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
