import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"

import { authOptions } from "@/server/auth/config"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Your HOAdoor Profile",
  description: "Review your account details, HOA memberships, and recent activity on HOAdoor.",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/profile")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      roles: true,
      memberships: {
        include: {
          hoa: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              state: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        include: {
          hoa: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) {
    redirect("/auth/signin?callbackUrl=/profile")
  }

  const approvedMemberships = user.memberships.filter((membership) => membership.status === "APPROVED")
  const pendingMemberships = user.memberships.filter((membership) => membership.status === "PENDING")
  const rejectedMemberships = user.memberships.filter((membership) => membership.status === "REJECTED")

  return (
    <div className="container py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ""}</h1>
          <p className="text-muted-foreground">
            Manage your HOAdoor activity, review membership status, and revisit your recent
            contributions.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Member since {formatDate(user.createdAt)}</span>
            <span aria-hidden="true">•</span>
            <span>{user.email}</span>
            {user.roles.length > 0 && (
              <>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-2">
                  Roles:
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="uppercase">
                      {role.replace(/_/g, " ")}
                    </Badge>
                  ))}
                </span>
              </>
            )}
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Community Memberships</h2>
            <Badge variant="secondary">{user.memberships.length} total</Badge>
          </div>

          {user.memberships.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                You have not joined any HOA communities yet. Browse the {""}
                <Link href="/search" className="text-primary underline">
                  directory
                </Link>{" "}
                to find communities that match your interests.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedMemberships.map((membership) => (
                <Card key={membership.id} className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link href={`/hoa/${membership.hoa.slug}`} className="hover:underline">
                        {membership.hoa.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {membership.hoa.city}, {membership.hoa.state}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Member since {formatDate(membership.createdAt)}</p>
                    <Badge variant="secondary" className="uppercase">
                      {membership.role}
                    </Badge>
                  </CardContent>
                </Card>
              ))}

              {pendingMemberships.map((membership) => (
                <Card key={membership.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link href={`/hoa/${membership.hoa.slug}`} className="hover:underline">
                        {membership.hoa.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {membership.hoa.city}, {membership.hoa.state}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">Pending Approval</Badge>
                    {membership.note && (
                      <p className="text-xs">Verification note: {membership.note}</p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {rejectedMemberships.map((membership) => (
                <Card key={membership.id} className="border-destructive/40">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link href={`/hoa/${membership.hoa.slug}`} className="hover:underline">
                        {membership.hoa.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {membership.hoa.city}, {membership.hoa.state}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <Badge variant="destructive">Rejected</Badge>
                    <p>Submitted on {formatDate(membership.createdAt)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Reviews</h2>
            <Badge variant="secondary">{user.reviews.length}</Badge>
          </div>

          {user.reviews.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                You have not written any reviews yet. Share your experience to help other
                homeowners make informed decisions.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {user.reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        <Link href={`/hoa/${review.hoa.slug}`} className="hover:underline">
                          {review.hoa.name}
                        </Link>
                      </CardTitle>
                      <Badge variant="secondary">{formatDate(review.createdAt)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.stars} star{review.stars === 1 ? "" : "s"}
                    </p>
                  </CardHeader>
                  {review.text && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
