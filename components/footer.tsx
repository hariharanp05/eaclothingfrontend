import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/shop?sort=new" },
        { label: "Best Sellers", href: "/shop?sort=popular" },
        { label: "Sale", href: "/shop?filter=sale" },
        { label: "Collections", href: "/collections" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
      ],
    },
  ]

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-sm flex items-center justify-center text-primary text-sm font-bold">
                EA
              </div>
              <span className="font-bold text-lg">EA Clothing</span>
            </div>
            <p className="text-sm opacity-80">Premium fashion and athletic wear for modern lifestyles.</p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">&copy; {currentYear} EA Clothing. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm opacity-80 hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm opacity-80 hover:opacity-100">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
