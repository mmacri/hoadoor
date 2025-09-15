import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SAMPLE_AMENITIES = [
  'Pool', 'Gym', 'Tennis Court', 'Clubhouse', 'Playground', 'Walking Trails',
  'Golf Course', 'Basketball Court', 'Dog Park', 'Beach Access', 'Marina',
  'Spa', 'Business Center', 'Library', 'Game Room', 'Picnic Area',
  'BBQ Grills', 'Security Gate', '24/7 Security', 'Concierge'
]

const SAMPLE_HOAS = [
  {
    name: 'Sunset Ridge Community',
    location: 'San Diego, CA 92127',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92127',
    descriptionPublic: 'A beautiful gated community featuring modern amenities and well-maintained grounds. Perfect for families and professionals alike.',
    descriptionPrivate: 'Welcome to our community portal! Here you can connect with neighbors, access important documents, and stay updated on community events.',
    unitCount: 450,
    amenities: ['Pool', 'Gym', 'Tennis Court', 'Clubhouse', 'Security Gate']
  },
  {
    name: 'Ocean View Estates',
    location: 'Carlsbad, CA 92008',
    city: 'Carlsbad',
    state: 'CA',
    zipCode: '92008',
    descriptionPublic: 'Luxury oceanfront living with spectacular views and premium amenities. Resort-style living at its finest.',
    descriptionPrivate: 'Exclusive community resources and neighbor connections await you in our private portal.',
    unitCount: 180,
    amenities: ['Pool', 'Spa', 'Beach Access', 'Concierge', 'Golf Course']
  },
  {
    name: 'Mountain Vista HOA',
    location: 'Escondido, CA 92025',
    city: 'Escondido',
    state: 'CA',
    zipCode: '92025',
    descriptionPublic: 'Nestled in the hills with breathtaking mountain views and hiking trails. A peaceful retreat from city life.',
    descriptionPrivate: 'Connect with your mountain community neighbors and stay informed about trail maintenance and events.',
    unitCount: 320,
    amenities: ['Walking Trails', 'Clubhouse', 'Playground', 'BBQ Grills']
  },
  {
    name: 'Phoenix Gardens',
    location: 'Phoenix, AZ 85001',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    descriptionPublic: 'Desert oasis community with lush landscaping and desert-friendly amenities. Modern living in the heart of Phoenix.',
    descriptionPrivate: 'Your desert community hub for neighbors, events, and HOA information.',
    unitCount: 275,
    amenities: ['Pool', 'Gym', 'Desert Garden', 'Clubhouse']
  },
  {
    name: 'Lakeside Commons',
    location: 'Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    descriptionPublic: 'Waterfront community with private lake access and boat dock. Perfect for water enthusiasts and nature lovers.',
    descriptionPrivate: 'Lake community members can access boat schedules, water safety information, and community events.',
    unitCount: 150,
    amenities: ['Marina', 'Beach Access', 'Clubhouse', 'Walking Trails']
  },
  {
    name: 'Metro Heights',
    location: 'Denver, CO 80202',
    city: 'Denver',
    state: 'CO',
    zipCode: '80202',
    descriptionPublic: 'Urban high-rise living with panoramic city views and premium amenities. Walking distance to downtown attractions.',
    descriptionPrivate: 'Urban community portal with building updates, events, and neighbor connections.',
    unitCount: 400,
    amenities: ['Gym', 'Business Center', 'Concierge', '24/7 Security']
  },
  {
    name: 'Green Valley Preserve',
    location: 'Portland, OR 97201',
    city: 'Portland',
    state: 'OR',
    zipCode: '97201',
    descriptionPublic: 'Eco-friendly community focused on sustainability and green living. LEED-certified homes with nature preserves.',
    descriptionPrivate: 'Sustainable living community with resources for eco-friendly practices and conservation efforts.',
    unitCount: 200,
    amenities: ['Walking Trails', 'Community Garden', 'Recycling Center', 'Playground']
  },
  {
    name: 'Coastal Breeze Village',
    location: 'Miami, FL 33101',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    descriptionPublic: 'Tropical paradise with ocean breeze and resort-style amenities. Just minutes from South Beach.',
    descriptionPrivate: 'Tropical community hub with hurricane preparedness info, beach access schedules, and social events.',
    unitCount: 350,
    amenities: ['Pool', 'Beach Access', 'Tennis Court', 'Spa', 'Security Gate']
  },
  {
    name: 'Heritage Hills',
    location: 'Nashville, TN 37201',
    city: 'Nashville',
    state: 'TN',
    zipCode: '37201',
    descriptionPublic: 'Historic charm meets modern convenience in this established neighborhood with mature trees and walking paths.',
    descriptionPrivate: 'Historic community with architectural guidelines, neighborhood watch, and local history resources.',
    unitCount: 180,
    amenities: ['Walking Trails', 'Clubhouse', 'Library', 'Picnic Area']
  },
  {
    name: 'Silicon Valley Commons',
    location: 'San Jose, CA 95101',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95101',
    descriptionPublic: 'Modern tech-forward community with smart home features and high-speed fiber internet throughout.',
    descriptionPrivate: 'Tech community portal with smart home support, high-speed internet info, and professional networking.',
    unitCount: 500,
    amenities: ['Business Center', 'Gym', 'Game Room', 'EV Charging', 'Fiber Internet']
  }
]

const SAMPLE_USERS = [
  { name: 'John Smith', email: 'john.smith@example.com' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@example.com' },
  { name: 'Michael Brown', email: 'michael.brown@example.com' },
  { name: 'Emily Davis', email: 'emily.davis@example.com' },
  { name: 'David Wilson', email: 'david.wilson@example.com' },
  { name: 'Jessica Miller', email: 'jessica.miller@example.com' },
  { name: 'Robert Taylor', email: 'robert.taylor@example.com' },
  { name: 'Amanda Anderson', email: 'amanda.anderson@example.com' },
  { name: 'Christopher Thomas', email: 'christopher.thomas@example.com' },
  { name: 'Michelle Jackson', email: 'michelle.jackson@example.com' }
]

const REVIEW_TEMPLATES = [
  "Great community with excellent amenities and responsive management. The staff is always helpful and the grounds are well-maintained.",
  "Love living here! The amenities are fantastic and the neighbors are friendly. Management does a great job keeping everything running smoothly.",
  "This is a wonderful place to call home. The community events are well-organized and the facilities are always clean and in good condition.",
  "Outstanding HOA management and beautiful community. The landscaping is gorgeous and the amenities are top-notch.",
  "Decent community overall. Some issues with maintenance response time but generally acceptable living situation.",
  "Management is unresponsive and maintenance issues take forever to resolve. HOA fees are high for the level of service provided.",
  "Poor communication from the HOA board and selective enforcement of rules. Many amenities are often out of order.",
  "It's an okay place to live. The facilities are adequate and the neighbors are mostly quiet. Nothing spectacular but meets basic needs."
]

const POST_TITLES = [
  "Welcome New Neighbors!",
  "Pool Maintenance Schedule Update",
  "Community Garage Sale This Weekend",
  "Reminder: Pet Waste Cleanup",
  "Holiday Decorations Guidelines",
  "Parking Reminder for Guests",
  "Community Garden Update",
  "Security Gate Code Change"
]

const POST_BODIES = [
  "Please join me in welcoming our new neighbors to the community! Don't forget to introduce yourselves.",
  "The pool will be closed for maintenance from 8 AM to 2 PM this Thursday. Thank you for your patience.",
  "Community garage sale is scheduled for this Saturday from 8 AM to 3 PM. Tables available for $10.",
  "Friendly reminder to all pet owners to please clean up after your pets. Let's keep our community clean!",
  "The holiday decoration committee has posted new guidelines. Please review before decorating.",
  "Reminder that guest parking is limited to 24 hours. Please inform your visitors.",
  "The community garden is looking great! Thank you to all volunteers who helped with the recent planting.",
  "The security gate access code will be changing next Monday. New codes will be distributed via email."
]

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('🌱 Starting seed process...')

  // Clear existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.auditLog.deleteMany({})
  await prisma.flag.deleteMany({})
  await prisma.ratingAggregate.deleteMany({})
  await prisma.adminResponse.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.post.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.document.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.membership.deleteMany({})
  await prisma.hOA.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.user.deleteMany({})

  // Create users
  console.log('👥 Creating users...')
  const users = await Promise.all(
    SAMPLE_USERS.map(userData => 
      prisma.user.create({
        data: {
          ...userData,
          emailVerified: new Date(),
          roles: []
        }
      })
    )
  )

  // Create platform admin
  const adminUser = await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@hoadoor.com',
      emailVerified: new Date(),
      roles: ['PLATFORM_ADMIN']
    }
  })

  console.log('🏠 Creating HOAs...')
  const hoas = []
  
  for (const hoaData of SAMPLE_HOAS) {
    const slug = generateSlug(hoaData.name)
    const hoa = await prisma.hOA.create({
      data: {
        ...hoaData,
        slug
      }
    })
    hoas.push(hoa)
  }

  // Create memberships
  console.log('👥 Creating memberships...')
  const memberships = []
  
  for (const hoa of hoas) {
    // Assign 3-5 members per HOA
    const memberCount = Math.floor(Math.random() * 3) + 3
    const hoaUsers = getRandomElements(users, memberCount)
    
    for (let i = 0; i < hoaUsers.length; i++) {
      const user = hoaUsers[i]
      let role: 'MEMBER' | 'ADMIN' | 'PRESIDENT' = 'MEMBER'
      
      // First user is president, second is admin
      if (i === 0) role = 'PRESIDENT'
      else if (i === 1) role = 'ADMIN'
      
      const membership = await prisma.membership.create({
        data: {
          userId: user.id,
          hoaId: hoa.id,
          role,
          status: 'APPROVED'
        }
      })
      memberships.push(membership)
    }
  }

  // Create reviews
  console.log('⭐ Creating reviews...')
  const reviews = []
  
  for (const hoa of hoas) {
    // Create 5-12 reviews per HOA
    const reviewCount = Math.floor(Math.random() * 8) + 5
    const reviewUsers = getRandomElements(users, reviewCount)
    
    for (const user of reviewUsers) {
      // Generate realistic rating distribution (more 4-5 stars)
      let stars: number
      const rand = Math.random()
      if (rand < 0.4) stars = 5
      else if (rand < 0.7) stars = 4
      else if (rand < 0.85) stars = 3
      else if (rand < 0.95) stars = 2
      else stars = 1
      
      const reviewText = getRandomElement(REVIEW_TEMPLATES)
      const isAnonymous = Math.random() < 0.2 // 20% anonymous
      const status = Math.random() < 0.9 ? 'APPROVED' : 'PENDING' // 90% approved
      
      const review = await prisma.review.create({
        data: {
          userId: user.id,
          hoaId: hoa.id,
          stars,
          text: reviewText,
          isAnonymous,
          status,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
        }
      })
      reviews.push(review)
    }
  }

  // Create admin responses to some reviews
  console.log('💬 Creating admin responses...')
  const adminResponses = [
    "Thank you for your feedback! We're glad you're enjoying the community amenities.",
    "We appreciate your review and are working to address the concerns you've mentioned.",
    "Thanks for taking the time to share your experience. We value all resident feedback.",
    "We're pleased to hear you're happy with our services. Thank you for being a valued resident!"
  ]

  for (const hoa of hoas) {
    // Find HOA admin/president
    const hoaAdmin = memberships.find(m => 
      m.hoaId === hoa.id && (m.role === 'ADMIN' || m.role === 'PRESIDENT')
    )
    
    if (hoaAdmin) {
      // Respond to 30% of reviews for this HOA
      const hoaReviews = reviews.filter(r => r.hoaId === hoa.id && r.status === 'APPROVED')
      const responsesToCreate = Math.floor(hoaReviews.length * 0.3)
      const reviewsToRespondTo = getRandomElements(hoaReviews, responsesToCreate)
      
      for (const review of reviewsToRespondTo) {
        await prisma.adminResponse.create({
          data: {
            reviewId: review.id,
            responderUserId: hoaAdmin.userId,
            text: getRandomElement(adminResponses),
            createdAt: new Date(review.createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) // Response within 30 days
          }
        })
      }
    }
  }

  // Create rating aggregates
  console.log('📊 Creating rating aggregates...')
  for (const hoa of hoas) {
    const hoaReviews = reviews.filter(r => r.hoaId === hoa.id && r.status === 'APPROVED')
    
    if (hoaReviews.length > 0) {
      const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      let totalStars = 0
      
      for (const review of hoaReviews) {
        breakdown[review.stars as keyof typeof breakdown]++
        totalStars += review.stars
      }
      
      const average = totalStars / hoaReviews.length
      
      await prisma.ratingAggregate.create({
        data: {
          hoaId: hoa.id,
          average,
          count: hoaReviews.length,
          breakdown
        }
      })
    }
  }

  // Create some sample posts for private communities
  console.log('📝 Creating community posts...')
  for (const hoa of hoas) {
    // Create 2-4 posts per HOA
    const postCount = Math.floor(Math.random() * 3) + 2
    const hoaMembers = memberships.filter(m => m.hoaId === hoa.id)
    
    for (let i = 0; i < postCount; i++) {
      const author = getRandomElement(hoaMembers)
      const title = getRandomElement(POST_TITLES)
      const body = getRandomElement(POST_BODIES)
      
      const post = await prisma.post.create({
        data: {
          hoaId: hoa.id,
          authorId: author.userId,
          title,
          body,
          visibility: 'PRIVATE',
          status: 'APPROVED',
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date within last 90 days
        }
      })

      // Add some comments to posts
      if (Math.random() < 0.6) { // 60% chance of having comments
        const commentCount = Math.floor(Math.random() * 3) + 1
        for (let j = 0; j < commentCount; j++) {
          const commenter = getRandomElement(hoaMembers)
          await prisma.comment.create({
            data: {
              postId: post.id,
              authorId: commenter.userId,
              body: "Thanks for sharing this information! Very helpful.",
              createdAt: new Date(post.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Comment within 7 days of post
            }
          })
        }
      }
    }
  }

  // Create sample events
  console.log('🎉 Creating events...')
  const eventTitles = [
    "HOA Board Meeting",
    "Community BBQ",
    "Pool Party",
    "Holiday Celebration",
    "Maintenance Day",
    "Neighborhood Watch Meeting"
  ]

  for (const hoa of hoas) {
    const eventCount = Math.floor(Math.random() * 3) + 1
    const hoaAdmins = memberships.filter(m => m.hoaId === hoa.id && m.role !== 'MEMBER')
    
    if (hoaAdmins.length > 0) {
      for (let i = 0; i < eventCount; i++) {
        const futureDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000) // Future date within 90 days
        await prisma.event.create({
          data: {
            hoaId: hoa.id,
            title: getRandomElement(eventTitles),
            startsAt: futureDate,
            endsAt: new Date(futureDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
            location: "Community Clubhouse",
            description: "Join us for this community event. All residents are welcome!",
            visibility: 'PRIVATE'
          }
        })
      }
    }
  }

  // Create sample documents
  console.log('📄 Creating documents...')
  const documentTitles = [
    "HOA Bylaws",
    "CC&R Document",
    "Budget Summary",
    "Meeting Minutes",
    "Community Rules",
    "Architectural Guidelines"
  ]

  for (const hoa of hoas) {
    const docCount = Math.floor(Math.random() * 4) + 2
    
    for (let i = 0; i < docCount; i++) {
      await prisma.document.create({
        data: {
          hoaId: hoa.id,
          title: getRandomElement(documentTitles),
          url: `https://example.com/docs/${hoa.slug}-${i}.pdf`,
          visibility: 'PRIVATE'
        }
      })
    }
  }

  console.log('✅ Seed completed successfully!')
  console.log(`Created:
  - ${users.length + 1} users (including 1 admin)
  - ${hoas.length} HOAs
  - ${memberships.length} memberships
  - ${reviews.length} reviews
  - Rating aggregates for ${hoas.length} HOAs
  - Community posts, events, and documents`)

  // Log some sample login credentials
  console.log('\n🔑 Sample login credentials:')
  console.log('Platform Admin: admin@hoadoor.com')
  console.log('Regular Users:', users.slice(0, 3).map(u => u.email).join(', '))
  console.log('\n💡 Use these emails to sign in with magic links!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
