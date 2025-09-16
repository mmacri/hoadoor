# HOAdoor UI/UX Design Document

## Design Philosophy

### Core Principles

**1. Transparency First**
- Clear, honest information presentation
- No hidden features or misleading interfaces
- Straightforward navigation and labeling
- Visual hierarchy that promotes important information

**2. Community-Centered**
- Warm, welcoming aesthetic that encourages participation
- Collaborative features that bring neighbors together
- Inclusive design that works for all demographics
- Trust-building visual elements

**3. Mobile-First Accessibility**
- Responsive design that works on all devices
- Touch-friendly interface elements
- Fast loading times and optimized performance
- Accessible to users with disabilities (WCAG 2.1 AA compliant)

**4. Professional Yet Approachable**
- Clean, modern interface that builds credibility
- Friendly tone and helpful guidance
- Professional data presentation for important decisions
- Approachable community features

## Visual Design System

### Color Palette

**Primary Colors**
- **Primary Blue**: `#3B82F6` (hsl(221, 83%, 53%))
  - Use: Primary buttons, links, active states, brand elements
  - Accessibility: AAA compliant contrast on white backgrounds

**Secondary Colors**
- **Success Green**: `#10B981` - Positive actions, approvals, high ratings
- **Warning Yellow**: `#F59E0B` - Alerts, pending states, moderate ratings  
- **Danger Red**: `#EF4444` - Errors, rejections, low ratings, delete actions
- **Info Blue**: `#06B6D4` - Information states, neutral highlights

**Neutral Palette**
- **Background**: `#FFFFFF` (white)
- **Card**: `#FFFFFF` (white with subtle shadows)
- **Muted Background**: `#F8FAFC` (light gray)
- **Border**: `#E2E8F0` (light gray)
- **Muted Foreground**: `#64748B` (medium gray)
- **Foreground**: `#0F172A` (dark slate)

### Typography

**Font Stack**: Inter (fallback: system fonts)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

**Type Scale**
- **Heading 1**: 48px/56px, font-weight: 800 (Homepage hero)
- **Heading 2**: 36px/44px, font-weight: 700 (Section headers)
- **Heading 3**: 24px/32px, font-weight: 600 (Card titles)
- **Heading 4**: 20px/28px, font-weight: 600 (Subsections)
- **Body Large**: 18px/28px, font-weight: 400 (Important descriptions)
- **Body**: 16px/24px, font-weight: 400 (Main text)
- **Body Small**: 14px/20px, font-weight: 400 (Secondary text)
- **Caption**: 12px/16px, font-weight: 400 (Labels, metadata)

### Iconography

**Icon System**: Lucide React
- Consistent 24px/16px sizing
- 1.5px stroke width for optimal clarity
- Semantic usage (Search, User, Star, etc.)
- Color matches text or uses theme colors

**Icon Usage Guidelines**
- Always pair with labels for accessibility
- Use consistent sizing within sections
- Maintain visual hierarchy through size and color
- Avoid decorative icons that don't add meaning

### Spacing System

**Base Unit**: 4px (0.25rem)
- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)  
- **MD**: 16px (1rem)
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)

### Component Library

**Buttons**
```tsx
// Primary action button
<Button variant="default" size="default">
  Submit Review
</Button>

// Secondary actions
<Button variant="outline" size="default">
  View Details
</Button>

// Destructive actions
<Button variant="destructive" size="default">
  Delete Post
</Button>
```

**Cards**
```tsx
// Standard content card
<Card>
  <CardHeader>
    <CardTitle>HOA Name</CardTitle>
    <CardDescription>Location info</CardDescription>
  </CardHeader>
  <CardContent>
    Card body content
  </CardContent>
</Card>
```

**Form Elements**
```tsx
// Input with label
<div className="space-y-2">
  <Label htmlFor="email">Email Address</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

## User Interface Layouts

### Homepage Layout

**Hero Section**
```
┌─────────────────────────────────────────────────────┐
│                  HERO BANNER                        │
│           Find the Perfect HOA Community            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           SEARCH BAR                         │   │
│  │  🔍 [Search HOAs...] [Location] [Search]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│        [1,234 HOAs]  [5,678 Reviews]  [890 Communities] │
└─────────────────────────────────────────────────────┘
```

**Features Section**
```
┌─────────────────────────────────────────────────────┐
│                Why Choose HOAdoor?                  │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │   ⭐    │  │   👥    │  │   🛡️    │  │   💬    ││
│  │Reviews  │  │Community│  │Verified │  │Response ││
│  │& Ratings│  │Features │  │Info     │  │System   ││
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘│
└─────────────────────────────────────────────────────┘
```

### Search Results Layout

**Filter Sidebar + Results Grid**
```
┌─────────────────────────────────────────────────────┐
│  SEARCH: "San Diego HOAs"              🔧 Filters   │
├──────────┬──────────────────────────────────────────┤
│ FILTERS  │                RESULTS                   │
│          │                                          │
│ Location │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│ Rating   │  │   HOA   │  │   HOA   │  │   HOA   │  │
│ Amenities│  │  Card   │  │  Card   │  │  Card   │  │
│ Price    │  │   #1    │  │   #2    │  │   #3    │  │
│          │  └─────────┘  └─────────┘  └─────────┘  │
│ [Clear]  │                                          │
│          │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│          │  │   HOA   │  │   HOA   │  │   HOA   │  │
│          │  │  Card   │  │  Card   │  │  Card   │  │
│          │  │   #4    │  │   #5    │  │   #6    │  │
│          │  └─────────┘  └─────────┘  └─────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### HOA Profile Layout

**Header Section**
```
┌─────────────────────────────────────────────────────┐
│  🏠 Sunset Ridge Community                          │
│  📍 San Diego, CA 92127  👥 450 units              │
│                                                     │
│  ⭐⭐⭐⭐⭐ 4.5 (123 reviews)                          │
│                                                     │
│  [Pool] [Gym] [Tennis] [Clubhouse] [+3 more]      │
│                                                     │
│  Beautiful gated community with modern amenities    │
│  and well-maintained grounds...                     │
└─────────────────────────────────────────────────────┘
```

**Tabbed Content**
```
┌─────────────────────────────────────────────────────┐
│  [Overview] [Reviews (123)] [Community]             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OVERVIEW TAB CONTENT                               │
│  • Community details                                │
│  • Amenities grid                                  │
│  • Location information                             │
│  • Contact details                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Mobile Layouts

**Mobile-First Approach**
- Bottom navigation for key sections
- Collapsible search filters
- Swipeable cards and tabs
- Touch-optimized buttons (44px minimum)
- Simplified layouts with single-column design

**Mobile Search Results**
```
┌─────────────────────┐
│ 🔍 [Search...] 🔧   │
├─────────────────────┤
│                     │
│  ┌───────────────┐  │
│  │   HOA Card    │  │
│  │   Full Width  │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │   HOA Card    │  │
│  │   Full Width  │  │
│  └───────────────┘  │
│                     │
│  [Load More...]     │
└─────────────────────┘
```

## User Experience Flows

### Review Submission Flow

**Step 1: Authentication Check**
```
User clicks "Write Review"
  ↓
Is user authenticated?
  ├─ No → Redirect to /auth/signin
  └─ Yes → Continue to review form
```

**Step 2: Review Form**
```
┌─────────────────────────────────────┐
│        Write a Review               │
│                                     │
│ Rating: ⭐⭐⭐⭐⭐ (interactive)     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Share your experience...        │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ☐ Post anonymously                  │
│                                     │
│ [Cancel] [Submit Review]            │
└─────────────────────────────────────┘
```

**Step 3: Confirmation**
```
┌─────────────────────────────────────┐
│        ✅ Review Submitted!         │
│                                     │
│ Your review is pending approval     │
│ and will appear shortly.            │
│                                     │
│        [View HOA Profile]           │
└─────────────────────────────────────┘
```

### Community Join Flow

**Step 1: Join Request**
```
User clicks "Join Community"
  ↓
Show membership request form
  ↓
User submits request with optional note
  ↓
Show pending approval message
```

**Step 2: Admin Approval**
```
HOA Admin receives notification
  ↓
Reviews membership request
  ↓
Approves or rejects with reason
  ↓
User receives email notification
```

**Step 3: Community Access**
```
Approved user gains access to:
├─ Private community portal
├─ Discussion forums  
├─ Document library
├─ Event calendar
└─ Member directory
```

## Accessibility Features

### WCAG 2.1 AA Compliance

**Visual Accessibility**
- Color contrast ratios meet AA standards (4.5:1 for normal text)
- Text can be resized up to 200% without loss of functionality
- Focus indicators are clearly visible for all interactive elements
- Color is never the only way to convey information

**Keyboard Navigation**
- All interactive elements are keyboard accessible
- Logical tab order throughout the interface
- Skip links for main content areas
- Proper focus management in modals and dialogs

**Screen Reader Support**
- Semantic HTML structure with proper headings
- Alt text for all meaningful images
- ARIA labels and descriptions where needed
- Form labels properly associated with inputs
- Status updates announced to screen readers

**Motor Accessibility**
- Click/touch targets minimum 44px x 44px
- Drag and drop alternatives provided
- Timeout warnings and extensions available
- Motion preferences respected (reduced motion)

### Inclusive Design Features

**Language and Content**
- Plain language used throughout the interface
- Important information presented in multiple formats
- Error messages are clear and actionable
- Help text provided for complex features

**Cognitive Accessibility**
- Consistent navigation and layout patterns
- Clear visual hierarchy and information organization
- Progress indicators for multi-step processes
- Confirmation dialogs for destructive actions

## Performance Considerations

### Loading States

**Skeleton Screens**
```tsx
// Card loading state
<Card>
  <CardHeader>
    <div className="h-6 bg-gray-200 rounded animate-pulse" />
    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
    </div>
  </CardContent>
</Card>
```

**Progressive Enhancement**
- Core functionality works without JavaScript
- Enhanced features layer on top progressively
- Graceful degradation for older browsers
- Offline functionality for key features

### Image Optimization

**Strategy**
- Next.js Image component for automatic optimization
- WebP format with PNG/JPEG fallbacks
- Responsive images with multiple sizes
- Lazy loading for below-the-fold images
- Placeholder blur effects during loading

### Animation Guidelines

**Performance-First Animations**
- CSS transforms and opacity only (avoid layout changes)
- Hardware acceleration with `transform3d()`
- Respect `prefers-reduced-motion` setting
- Duration limits: <200ms for micro-interactions, <500ms for transitions

**Motion Design**
- Subtle hover effects on interactive elements
- Smooth page transitions between routes
- Loading animations that indicate progress
- Attention-grabbing animations for important updates

## Design Tokens

### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: 221 83% 53%;
  --color-secondary: 210 40% 96%;
  --color-success: 142 76% 36%;
  --color-warning: 38 92% 50%;
  --color-danger: 0 84% 60%;
  
  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
  
  /* Spacing */
  --spacing-unit: 0.25rem;
  --spacing-xs: calc(var(--spacing-unit) * 1); /* 4px */
  --spacing-sm: calc(var(--spacing-unit) * 2); /* 8px */
  --spacing-md: calc(var(--spacing-unit) * 4); /* 16px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Border Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}
```

## Component Documentation

### Rating Display Component
```tsx
interface StarRatingProps {
  rating: number          // 0-5 rating value
  size?: 'sm' | 'md' | 'lg'  // Size variant
  interactive?: boolean   // Can user change rating?
  showCount?: boolean    // Show review count?
  className?: string     // Additional CSS classes
}
```

### Search Filter Component
```tsx
interface SearchFiltersProps {
  filters: SearchFilters    // Current filter state
  onFilterChange: (filters: SearchFilters) => void
  className?: string
  collapsed?: boolean      // Mobile collapsed state
}
```

### HOA Card Component
```tsx
interface HOACardProps {
  hoa: HOAProfile         // HOA data object
  showJoinButton?: boolean // Show join CTA
  compact?: boolean       // Compact layout variant
  className?: string
}
```

This comprehensive UI/UX design document ensures consistent, accessible, and user-friendly interface design throughout the HOAdoor application.
