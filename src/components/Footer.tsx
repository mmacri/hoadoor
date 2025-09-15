import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">HOAdoor</h3>
            <p className="text-sm text-muted-foreground">
              The transparent platform for Homeowners Association reviews and community management.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">For Residents</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Browse HOAs
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-primary transition-colors">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">For HOAs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/hoa-signup" className="hover:text-primary transition-colors">
                  Claim Your HOA
                </Link>
              </li>
              <li>
                <Link href="/hoa-features" className="hover:text-primary transition-colors">
                  Community Features
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/moderation" className="hover:text-primary transition-colors">
                  Content Policy
                </Link>
              </li>
              <li>
                <Link href="/report-abuse" className="hover:text-primary transition-colors">
                  Report Abuse
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 HOAdoor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
