import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "HOAdoor Help Center",
  description: "Find answers to frequently asked questions about reviews, community memberships, and account management.",
}

const faq = [
  {
    title: "How do I create an HOAdoor account?",
    body:
      "Click the sign-in button and enter your email address. We will send a secure magic link that signs you in without a password. If you do not receive the email within a few minutes, check your spam folder or contact support@hoadoor.com.",
  },
  {
    title: "Who can submit reviews?",
    body:
      "Any verified resident or homeowner can submit a review. Reviews should reflect first-hand experiences with the HOA community and follow our moderation guidelines.",
  },
  {
    title: "How do I join a private community portal?",
    body:
      "Navigate to the HOA profile and click \"Join Community.\" Provide any requested verification details so HOA administrators can confirm your residency. You will receive an email when your membership is approved or rejected.",
  },
  {
    title: "What if I forget which email I used?",
    body:
      "Our authentication is email-based. If you no longer have access to the email associated with your account, contact legal@hoadoor.com and we will guide you through identity verification to update your account.",
  },
]

const residentResources = [
  {
    title: "Publishing Helpful Reviews",
    items: [
      "Focus on facts: management responsiveness, amenity condition, communication style",
      "Avoid personal attacks or discriminatory language",
      "Attach photos when relevant to support your feedback",
      "Flag inaccurate or abusive content directly from the review detail page",
    ],
  },
  {
    title: "Managing Your Memberships",
    items: [
      "Track pending and approved memberships from your profile dashboard",
      "Update notification preferences to stay informed about new events and documents",
      "Leave a community by contacting the HOA administrators or emailing support",
    ],
  },
]

const hoaResources = [
  {
    title: "Responding to Reviews",
    items: [
      "Acknowledge concerns and outline the next steps you will take",
      "Stay professional; responses are public and build trust with prospective residents",
      "Use the moderation tools to escalate abusive or fraudulent submissions",
    ],
  },
  {
    title: "Onboarding Your Community Portal",
    items: [
      "Upload bylaws, financial reports, and key documents so residents can self-serve",
      "Create event categories (board meetings, maintenance, social gatherings) to keep calendars organized",
      "Assign admin roles to board members to distribute moderation duties",
    ],
  },
]

export default function HelpCenterPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">HOAdoor Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Resources to help residents, HOA managers, and platform administrators get the most
            out of HOAdoor. If you need direct assistance, email{' '}
            <Link href="mailto:support@hoadoor.com" className="text-primary underline">
              support@hoadoor.com
            </Link>
            .
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {faq.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Guides for Residents</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {residentResources.map((resource) => (
              <Card key={resource.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {resource.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Guides for HOA Leaders</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {hoaResources.map((resource) => (
              <Card key={resource.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    {resource.items.map((item) => (
                      <li key={item}>{item}</li>
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
