import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "About HOAdoor",
  description: "Learn how HOAdoor brings transparency and connection to HOA communities.",
}

const pillars = [
  {
    title: "Transparency",
    description:
      "Residents deserve clear, accurate information before joining a community. We aggregate verified reviews, amenity details, and HOA responses to create a complete picture of life inside every HOA.",
  },
  {
    title: "Community",
    description:
      "Beyond public reviews, HOAdoor provides private portals where neighbors collaborate, share documents, organize events, and keep everyone informed.",
  },
  {
    title: "Accountability",
    description:
      "HOA leaders can address concerns publicly, measure satisfaction, and make data-informed improvements. Our moderation policies ensure every participant is heard respectfully.",
  },
]

const milestones = [
  {
    year: "2024",
    badge: "Foundation",
    details: [
      "Platform launches in Phoenix, Denver, and Austin",
      "Publishes first 1,000 verified HOA profiles and 5,000 resident reviews",
    ],
  },
  {
    year: "2025",
    badge: "Expansion",
    details: [
      "Rolls out premium tools for HOA administrators",
      "Introduces mobile apps and advanced search with map discovery",
    ],
  },
  {
    year: "2026",
    badge: "Scale",
    details: [
      "National coverage across 10,000+ HOAs",
      "Launches analytics suite and AI-powered insights for community health",
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">The story behind HOAdoor</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            HOAdoor was founded to bring Glassdoor-style transparency to homeowners associations
            while providing the operational tools communities need to thrive.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardHeader>
                <CardTitle className="text-lg">{pillar.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {pillar.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Roadmap milestones</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {milestones.map((milestone) => (
              <Card key={milestone.year}>
                <CardHeader className="space-y-2">
                  <Badge variant="secondary" className="w-fit uppercase">
                    {milestone.badge}
                  </Badge>
                  <CardTitle className="text-lg">{milestone.year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {milestone.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
