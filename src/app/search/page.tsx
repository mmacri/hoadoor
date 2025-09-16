'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, MapPin, Star, Users, Filter, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { debounce } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  location: string
  city: string
  state: string
  amenities: string[]
  unitCount: number | null
  descriptionPublic: string | null
  rating: {
    average: number
    count: number
  } | null
  reviewCount: number
  memberCount: number
}

interface SearchResponse {
  hoas: SearchResult[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

const AMENITY_OPTIONS = [
  'Pool', 'Gym', 'Tennis Court', 'Clubhouse', 'Playground', 'Walking Trails',
  'Golf Course', 'Basketball Court', 'Dog Park', 'Beach Access', 'Marina',
  'Spa', 'Business Center', 'Library', 'Game Room', 'Security Gate'
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialFiltersRef = useRef({
    query: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    rating: searchParams.get('ratingMin') ? Number(searchParams.get('ratingMin')) : 0
  })

  const [searchQuery, setSearchQuery] = useState(initialFiltersRef.current.query)
  const [location, setLocation] = useState(initialFiltersRef.current.location)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFiltersRef.current.amenities
  )
  const [minRating, setMinRating] = useState<number>(initialFiltersRef.current.rating)
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [pagination, setPagination] = useState<SearchResponse['pagination'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const performSearch = useMemo(() =>
    debounce(async (
      query: string,
      locationFilter: string,
      amenities: string[],
      rating: number,
      page: number = 1
    ) => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (locationFilter) params.set('location', locationFilter)
        if (amenities.length > 0) params.set('amenities', amenities.join(','))
        if (rating > 0) params.set('ratingMin', rating.toString())
        params.set('page', page.toString())
        params.set('limit', '12')

        const response = await fetch(`/api/search?${params.toString()}`)

        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data: SearchResponse = await response.json()

        if (page === 1) {
          setResults(data.hoas)
        } else {
          setResults(prev => [...prev, ...data.hoas])
        }

        setPagination(data.pagination)

        // Update URL
        const newParams = new URLSearchParams()
        if (query) newParams.set('q', query)
        if (locationFilter) newParams.set('location', locationFilter)
        if (amenities.length > 0) newParams.set('amenities', amenities.join(','))
        if (rating > 0) newParams.set('ratingMin', rating.toString())

        router.replace(`/search?${newParams.toString()}`, { scroll: false })

      } catch (err) {
        setError('Failed to search HOAs. Please try again.')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }, 300)
  , [router])

  const handleSearch = () => {
    performSearch(searchQuery, location, selectedAmenities, minRating, 1)
  }

  const handleLoadMore = () => {
    if (pagination && pagination.hasMore && !loading) {
      performSearch(searchQuery, location, selectedAmenities, minRating, pagination.page + 1)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLocation('')
    setSelectedAmenities([])
    setMinRating(0)
    setResults([])
    setPagination(null)
    router.replace('/search')
  }

  // Perform initial search on page load
  useEffect(() => {
    const { query, location: initialLocation, amenities, rating } = initialFiltersRef.current

    if (query || initialLocation || amenities.length > 0 || rating > 0) {
      performSearch(query, initialLocation, amenities, rating, 1)
    }
  }, [performSearch])

  return (
    <div className="container py-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">Search HOAs</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search HOAs by name, location, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <div className="w-64 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="City, State or ZIP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {rating}+
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => toggleAmenity(amenity)}
                      >
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                  <Button onClick={handleSearch} disabled={loading}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters */}
        {(searchQuery || location || selectedAmenities.length > 0 || minRating > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchQuery && (
              <Badge variant="secondary">
                Query: {searchQuery}
              </Badge>
            )}
            {location && (
              <Badge variant="secondary">
                <MapPin className="h-3 w-3 mr-1" />
                {location}
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                {minRating}+ stars
              </Badge>
            )}
            {selectedAmenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {pagination && (
        <div className="mb-4">
          <p className="text-muted-foreground">
            Found {pagination.total} HOA{pagination.total !== 1 ? 's' : ''}
            {pagination.total > pagination.limit && ` (showing ${results.length})`}
          </p>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {results.map((hoa) => (
          <Card key={hoa.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{hoa.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {hoa.location}
                  </CardDescription>
                </div>
                {hoa.rating && (
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {hoa.rating.average.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {hoa.reviewCount} reviews
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {hoa.descriptionPublic || 'No description available.'}
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

              <div className="flex justify-between items-center mb-4">
                {hoa.unitCount && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {hoa.unitCount} units
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {hoa.memberCount} members
                </p>
              </div>

              <Link href={`/hoa/${hoa.slug}`}>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {pagination && pagination.hasMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More HOAs'
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && pagination && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No HOAs Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse all HOAs.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Link href="/">
                  <Button>Browse All HOAs</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial Empty State */}
      {!loading && results.length === 0 && !pagination && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search for HOAs</h3>
              <p className="text-muted-foreground">
                Enter a search term above to find HOAs in your area.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
