import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Report Abuse | HOAdoor",
  description: "Learn how to report abusive content, urgent safety issues, or policy violations on HOAdoor.",
}

const reportScenarios = [
  {
    title: "Harassment or Hate Speech",
    description:
      "If you encounter threats, discriminatory remarks, or personal attacks, flag the content immediately. Provide context about the incident and whether you feel unsafe.",
  },
  {
    title: "Fraudulent Reviews",
    description:
      "Report reviews you believe were posted by non-residents or by parties with conflicts of interest. Include evidence such as residency records or communication logs.",
  },
  {
    title: "Sensitive or Legal Matters",
    description:
      "Use this channel for situations involving doxxing, legal injunctions, or confidential documents. Our trust team will coordinate with you to remove sensitive content quickly.",
  },
]

export default function ReportAbusePage() {
  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Report abuse or policy violations</h1>
          <p className="text-lg text-muted-foreground">
            HOAdoor takes safety seriously. Use the guidance below to make sure your report reaches
            the right team with the context we need to investigate.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {reportScenarios.map((scenario) => (
            <Card key={scenario.title}>
              <CardHeader>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                {scenario.description}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How to submit a report</h2>
          <Card>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                1. Use the in-product <strong>Report</strong> action whenever possible. Reports filed
                from within HOAdoor include metadata that speeds up investigation.
              </p>
              <p>
                2. For cases where you cannot access the content directly, email{' '}
                <Link href="mailto:trust@hoadoor.com" className="text-primary underline">
                  trust@hoadoor.com
                </Link>{' '}
                with links, screenshots, and the reason the content violates our policy.
              </p>
              <p>
                3. For emergencies or time-sensitive legal issues, call our hotline at{' '}
                <Link href="tel:+18005550123" className="text-primary underline">
                  +1 (800) 555-0123
                </Link>{' '}and follow up with written documentation.
              </p>
            </CardContent>
          </Card>
          <Badge variant="secondary" className="w-fit uppercase">Response time</Badge>
          <p className="text-sm text-muted-foreground">
            Most reports are reviewed within 24 hours. Urgent safety issues are prioritized and may
            receive a response within two hours.
          </p>
        </section>
      </div>
    </div>
  )
}
