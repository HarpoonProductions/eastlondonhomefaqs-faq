#!/bin/bash

# Upsum FAQ Template Setup Script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Upsum FAQ Template Setup${NC}"
echo "=================================="

# Collect basic info
read -p "Site name: " SITE_NAME
read -p "Domain: " SITE_DOMAIN
read -p "Description: " SITE_DESCRIPTION

echo
echo "Choose theme:"
echo "1) Orange (food/health)"
echo "2) Purple (education)" 
echo "3) Blue (tech/business)"
read -p "Choice (1-3): " THEME_CHOICE

case $THEME_CHOICE in
    2) SITE_THEME="purple" ;;
    3) SITE_THEME="blue" ;;
    *) SITE_THEME="orange" ;;
esac

# Create basic config
cat > config/site.config.js << EOL
export const siteConfig = {
  name: "$SITE_NAME",
  domain: "$SITE_DOMAIN", 
  description: "$SITE_DESCRIPTION",
  theme: "$SITE_THEME",
  
  logo: {
    filename: "logo.png",
    width: 400,
    height: 120,
    alt: "$SITE_NAME"
  },
  
  branding: {
    questionLabel: "Question",
    searchPlaceholder: "Search questions...",
    modalTitle: "Suggest a Question"
  },
  
  features: {
    search: true,
    suggestions: true,
    pwa: true,
    pushNotifications: false
  }
}

export default siteConfig
EOL

# Create basic layout
cat > app/layout.tsx << 'EOL'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
EOL

# Create basic homepage
cat > app/page.tsx << 'EOL'
'use client'

import { siteConfig } from '@/config/site.config'

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">{siteConfig.name}</h1>
      <p className="text-xl text-gray-600 mb-8">{siteConfig.description}</p>
      <div className={`inline-block px-6 py-3 rounded-lg text-white ${
        siteConfig.theme === 'orange' ? 'bg-orange-600' :
        siteConfig.theme === 'purple' ? 'bg-purple-600' : 
        'bg-blue-600'
      }`}>
        Theme: {siteConfig.theme}
      </div>
    </div>
  )
}
EOL

# Create globals.css
cat > app/globals.css << 'EOL'
@import "tailwindcss";

body {
  background: white;
  color: #171717;
  font-family: system-ui, -apple-system, sans-serif;
}
EOL

# Create tailwind config
cat > tailwind.config.js << 'EOL'
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './config/**/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

echo -e "${GREEN}✅ Setup complete!${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. npm install"
echo "2. npm run dev"
echo "3. Open http://localhost:3000"
echo
echo -e "${BLUE}Note: If localhost doesn't work, try:${NC}"
echo "• npm run dev -- --hostname 0.0.0.0"
echo "• Or check your hosts file"

