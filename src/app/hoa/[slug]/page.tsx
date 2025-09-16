import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Users, Star, Calendar, Building } from 'lucide-react'
import { AverageRating } from '@/components/StarRating'
import { ReviewsList } from './ReviewsList'
import { JoinCommunityButton } from './JoinCommunityButton'
import { WriteReviewButton } from './WriteReviewButton'
import { formatDate } from '@/lib/utils'

async function getHOA(slug: string) {
  const hoa = await prisma.hOA.findUnique({
    where: { slug },
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
    }
  })

  if (!hoa) {
    return null
  }

  // Get recent approved reviews with admin responses
  const reviews = await prisma.review.findMany({
    where: {
      hoaId: hoa.id,
      status: 'APPROVED'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      adminResponses: {
        include: {
          responder: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  })

  return {
    ...hoa,
    reviews
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const hoa = await getHOA(params.slug)

  if (!hoa) {
    return {
      title: 'HOA Not Found - HOAdoor'
    }
  }

  return {
    title: `${hoa.name} - HOA Reviews & Community | HOAdoor`,
    description: hoa.descriptionPublic || `Find reviews and information about ${hoa.name} in ${hoa.location}.`,
  }
}

export default async function HOAProfilePage({ params }: PageProps) {
  const hoa = await getHOA(params.slug)

  if (!hoa) {
    notFound()
  }

  const ratingBreakdown = hoa.ratingAggregate?.breakdown as Record<string, number> || {}
  const totalReviews = hoa._count.reviews

  return (
    <div className="container py-6">
      {/* HOA Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold">{hoa.name}</h1>
            </div>
            
            <div className="flex items-center gap-4 mb-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{hoa.location}</span>
              </div>
              
              {hoa.unitCount && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{hoa.unitCount.toLocaleString()} units</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{hoa._count.memberships} members</span>
              </div>
            </div>

            {/* Rating Summary */}
            {hoa.ratingAggregate && (
              <div className="mb-4">
                <AverageRating 
                  rating={hoa.ratingAggregate.average}
                  count={totalReviews}
                  size="lg"
                />
              </div>
            )}

            {/* Amenities */}
            {hoa.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {hoa.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {hoa.descriptionPublic && (
              <p className="text-muted-foreground leading-relaxed">
                {hoa.descriptionPublic}
              </p>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Join This Community</CardTitle>
                <CardDescription>
                  Connect with neighbors and access private community features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <JoinCommunityButton hoaId={hoa.id} hoaName={hoa.name} />
                <WriteReviewButton hoaId={hoa.id} hoaName={hoa.name} />
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            {hoa.ratingAggregate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingBreakdown[rating.toString()] || 0
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                      
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <div className="flex items-center gap-1 w-12">
                            <span className="text-sm">{rating}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-yellow-400 rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({totalReviews})
          </TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-muted-foreground">{hoa.location}</p>
                  {hoa.zipCode && (
                    <p className="text-muted-foreground">ZIP: {hoa.zipCode}</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Community Size</h4>
                  {hoa.unitCount && (
                    <p className="text-muted-foreground">{hoa.unitCount.toLocaleString()} residential units</p>
                  )}
                  <p className="text-muted-foreground">{hoa._count.memberships} active community members</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Established</h4>
                  <p className="text-muted-foreground">
                    Community profile created {formatDate(hoa.createdAt)}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reviews</h4>
                  <p className="text-muted-foreground">
                    {totalReviews} resident review{totalReviews !== 1 ? 's' : ''}
                  </p>
                  {hoa.ratingAggregate && (
                    <p className="text-muted-foreground">
                      Average rating: {hoa.ratingAggregate.average.toFixed(1)}/5.0
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {hoa.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Community Amenities</CardTitle>
                <CardDescription>
                  Available facilities and features for residents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {hoa.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsList 
            hoaId={hoa.id} 
            initialReviews={hoa.reviews.map(review => ({
              id: review.id,
              stars: review.stars,
              text: review.text,
              createdAt: review.createdAt,
              isAnonymous: review.isAnonymous,
              user: review.user,
              adminResponses: review.adminResponses.map(response => ({
                id: response.id,
                text: response.text,
                createdAt: response.createdAt,
                responder: response.responder
              }))
            }))}
          />
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Community Portal</CardTitle>
              <CardDescription>
                Access private community features by joining as a member.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Members Only</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join this HOA community to access private forums, documents, events, 
                and connect with your neighbors.
              </p>
              <JoinCommunityButton hoaId={hoa.id} hoaName={hoa.name} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
