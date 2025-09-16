import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Contact HOAdoor",
  description: "Get in touch with our sales, support, or trust & safety teams.",
}

const contactChannels = [
  {
    title: "Sales &amp; Partnerships",
    badge: "HOAdoor Premium",
    details: [
      "Custom onboarding for multi-community portfolios",
      "Pricing for enterprise features and API access",
      "Co-marketing opportunities and product demos",
    ],
    email: "sales@hoadoor.com",
  },
  {
    title: "Resident Support",
    badge: "Help Center",
    details: [
      "Assistance with sign-in and account recovery",
      "Review flagging and dispute resolution",
      "Membership approval questions",
    ],
    email: "support@hoadoor.com",
  },
  {
    title: "Trust &amp; Safety",
    badge: "Moderation",
    details: [
      "Legal requests and compliance inquiries",
      "Urgent abuse reports requiring moderator action",
      "Security disclosures and vulnerability reports",
    ],
    email: "legal@hoadoor.com",
  },
]

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">We are here to help</h1>
          <p className="text-lg text-muted-foreground">
            Choose the channel that best fits your needs. Our team typically responds within one
            business day.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {contactChannels.map((channel) => (
            <Card key={channel.title}>
              <CardHeader className="space-y-2">
                <Badge variant="secondary" className="w-fit uppercase">
                  {channel.badge}
                </Badge>
                <CardTitle className="text-lg" dangerouslySetInnerHTML={{ __html: channel.title }} />
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="list-disc space-y-1 pl-5">
                  {channel.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <p>
                  Email{' '}
                  <Link href={`mailto:${channel.email}`} className="text-primary underline">
                    {channel.email}
                  </Link>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
