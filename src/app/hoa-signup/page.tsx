import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Claim Your HOAdoor Profile",
  description: "Register your HOA to respond to reviews, manage a private community portal, and showcase verified information.",
}

const steps = [
  {
    title: "Verify your identity",
    description:
      "Tell us about your role (board member, property manager, or president) and provide official documentation so we can verify that you are authorized to represent the HOA.",
  },
  {
    title: "Complete your public profile",
    description:
      "Upload community photos, confirm amenities, set management contact details, and outline HOA highlights so prospective residents have accurate information.",
  },
  {
    title: "Launch the private portal",
    description:
      "Invite residents, publish documents, schedule events, and enable secure messaging. You control memberships and moderation tools from a central dashboard.",
  },
]

const benefits = [
  "Respond publicly to reviews to provide context and highlight improvements",
  "Centralize communications with announcements, events, and document libraries",
  "Measure community sentiment with analytics on reviews, flags, and participation",
  "Offer premium self-service experiences that reduce inbound support requests",
]

export default function HoaSignupPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4">
          <Badge variant="secondary" className="uppercase">For HOA Boards &amp; Managers</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Claim your HOAdoor presence</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Build trust with prospective residents, strengthen communication with current members,
            and manage your reputation from one secure workspace.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-lg">Step {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why HOAdoor?</h2>
          <Card>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <Card>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Email <Link href="mailto:onboarding@hoadoor.com" className="text-primary underline">onboarding@hoadoor.com</Link>{' '}
                with your HOA name, jurisdiction, and board position. Our onboarding team will set
                up a verification call and walk you through the activation checklist.
              </p>
              <p>
                Have multiple communities? Ask about multi-property management tools and API
                integrations available with HOAdoor Premium.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
