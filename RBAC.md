# Role-Based Access Control (RBAC) Matrix

## Overview

HOAdoor implements a hierarchical role-based access control system with four main user types and granular permissions for different actions and resources.

## User Roles

### 1. Public User (Unauthenticated)
- Default state for all visitors
- Limited read-only access to public information
- Can sign up and authenticate to gain additional privileges

### 2. Authenticated User
- Logged in but not member of any specific HOA
- Can submit reviews and membership requests
- Has profile management capabilities

### 3. HOA Member
- Approved member of one or more HOA communities
- Access to private community features
- Can participate in community discussions

### 4. HOA Admin/President
- Administrative privileges within their HOA
- Can moderate content and manage members
- President has additional privileges over Admin

### 5. Platform Admin
- Global administrative access
- System-wide moderation and user management
- Access to audit logs and analytics

## Detailed Permission Matrix

| Feature/Action | Public | Authenticated | HOA Member | HOA Admin | HOA President | Platform Admin |
|----------------|--------|---------------|------------|-----------|---------------|----------------|

### **HOA Discovery & Profiles**
| Browse HOAs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View HOA public profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View HOA amenities | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View public reviews | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View rating aggregates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### **Reviews & Ratings**
| Submit review | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own review | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete own review | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View review status | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit anonymous review | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Moderate reviews | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Respond to reviews publicly | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve/reject reviews | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### **Community Membership**
| Request membership | ❌ | ✅ | N/A | ✅ | ✅ | ✅ |
| View membership status | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Leave community | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Approve membership requests | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Reject membership requests | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View member directory | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Promote/demote members | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Remove members | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### **Private Community Features**
| View private community portal | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create community posts | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Comment on posts | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit own posts/comments | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Delete own posts/comments | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| View private documents | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Upload documents | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View community events | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create events | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### **Content Moderation**
| Flag inappropriate content | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Moderate community posts | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete member posts/comments | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Pin/unpin posts | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Set post visibility | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### **HOA Management**
| Edit HOA profile | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Update amenities list | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage HOA settings | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Enable/disable review moderation | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| View analytics dashboard | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Export member data | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### **Platform Administration**
| Global content moderation | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage HOA verifications | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Suspend users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| System configuration | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Platform analytics | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Permission Implementation

### Code Examples

**Route Protection:**
```typescript
// Middleware for HOA admin routes
export async function requireHOAAdmin(userId: string, hoaId: string) {
  const membership = await getUserMembership(userId, hoaId)
  if (!membership || membership.status !== 'APPROVED') {
    throw new Error('HOA membership required')
  }
  if (!['ADMIN', 'PRESIDENT'].includes(membership.role)) {
    throw new Error('HOA admin privileges required')
  }
}
```

**UI Conditional Rendering:**
```tsx
// Show admin controls only to admins
{canModerateHOAContent && (
  <AdminControls hoaId={hoaId} />
)}
```

**API Endpoint Guards:**
```typescript
// POST /api/reviews/[id]/respond
export async function POST(request: NextRequest) {
  const user = await getSessionUser(session)
  await requireHOAAdmin(user.id, reviewHoaId)
  
  // Admin can now respond to review
}
```

## Role Elevation Rules

### Becoming an HOA Admin
1. Must be an approved member first
2. Current admin/president promotes member
3. Platform admin can directly assign role

### Becoming a Platform Admin
- Manual assignment by existing platform admin
- Database-level role assignment during setup

### Role Inheritance
- Platform Admin inherits all lower-level permissions
- HOA President inherits all HOA Admin permissions
- HOA Admin inherits all HOA Member permissions

## Security Considerations

### Permission Checking
- All API endpoints validate permissions server-side
- UI controls are hidden but permissions still enforced server-side
- No client-side only permission checks for security features

### Audit Logging
All privileged actions are logged with:
- Actor user ID and role
- Target resource and ID
- Action performed
- Timestamp
- Additional metadata (IP, user agent)

### Rate Limiting by Role
```typescript
// Different rate limits based on user role
const getRateLimitForUser = (userRoles: string[]) => {
  if (userRoles.includes('PLATFORM_ADMIN')) {
    return { limit: 1000, window: 3600 } // 1000/hour
  }
  if (userRoles.includes('ADMIN') || userRoles.includes('PRESIDENT')) {
    return { limit: 100, window: 3600 } // 100/hour  
  }
  return { limit: 10, window: 3600 } // 10/hour for regular users
}
```

## Edge Cases & Special Rules

### Multi-HOA Membership
- User can be member of multiple HOAs
- Admin privileges are HOA-specific
- Platform admin privileges are global

### Membership Status Changes
- PENDING → APPROVED: Gains member permissions
- APPROVED → REJECTED: Loses all HOA permissions
- Member role changes take effect immediately

### Content Ownership
- Users can always edit/delete their own content
- Admins can moderate any content in their HOA
- Platform admins can moderate any content globally

This RBAC system provides fine-grained control while maintaining simplicity and security throughout the application.
