import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Users, Shield, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AverageRating } from '@/components/StarRating'

async function getFeaturedHOAs() {
  return await prisma.hOA.findMany({
    take: 6,
    include: {
      ratingAggregate: true,
      _count: {
        select: {
          reviews: {
            where: { status: 'APPROVED' }
          },
          memberships: {
            where: { status: 'APPROVED' }
          }
        }
      }
    },
    orderBy: [
      { ratingAggregate: { average: 'desc' } },
      { createdAt: 'desc' }
    ]
  })
}

async function getStats() {
  const [hoaCount, reviewCount, memberCount] = await Promise.all([
    prisma.hOA.count(),
    prisma.review.count({ where: { status: 'APPROVED' } }),
    prisma.membership.count({ where: { status: 'APPROVED' } })
  ])

  return { hoaCount, reviewCount, memberCount }
}

export default async function HomePage() {
  const [featuredHOAs, stats] = await Promise.all([
    getFeaturedHOAs(),
    getStats()
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 lg:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              Find the Perfect
              <span className="text-primary"> HOA Community</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover transparent reviews, ratings, and connect with HOA communities. 
              Make informed decisions about your next home.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form action="/search" method="GET" className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search HOAs by name, location, or amenities..."
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8">
                  Search
                </Button>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{stats.hoaCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">HOAs Listed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.reviewCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{stats.memberCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose HOAdoor?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide transparency and community tools that make HOA living better for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Transparent Reviews</CardTitle>
                <CardDescription>
                  Read honest reviews from real residents about their HOA experiences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Private Communities</CardTitle>
                <CardDescription>
                  Connect with neighbors in secure, HOA-managed community portals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Verified Information</CardTitle>
                <CardDescription>
                  All HOA profiles are verified with accurate amenities and contact details.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>HOA Responses</CardTitle>
                <CardDescription>
                  HOA management can respond publicly to reviews and community concerns.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured HOAs Section */}
      {featuredHOAs.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Featured HOA Communities</h2>
              <p className="text-lg text-muted-foreground">
                Discover highly-rated communities in your area.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHOAs.map((hoa) => (
                <Card key={hoa.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{hoa.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{hoa.location}</p>
                      </div>
                      {hoa.ratingAggregate && (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">
                              {hoa.ratingAggregate.average.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {hoa._count.reviews} reviews
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {hoa.descriptionPublic || 'A wonderful community with great amenities.'}
                    </p>
                    
                    {hoa.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {hoa.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {hoa.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hoa.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <Link href={`/hoa/${hoa.slug}`}>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/search">
                <Button size="lg">View All HOAs</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Community?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of residents who use HOAdoor to make informed decisions 
            about their HOA communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" variant="secondary">
                Browse HOAs
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                Write a Review
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
