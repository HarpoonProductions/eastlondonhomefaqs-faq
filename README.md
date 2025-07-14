# 🚀 Upsum FAQ Template

> **Master template for the Upsum Network FAQ system**

Professional, replicable FAQ sites with Sanity CMS integration, designed for the Upsum Network.

## 🏢 Upsum Network

This is the **master template** for generating FAQ sites across the Upsum Network. Each client site is generated from this template and maintained as a separate repository under the `upsum-network` organization.

### 📊 Network Stats
- **Template Version:** 1.0.0
- **Active Sites:** [View Network](https://github.com/upsum-network)
- **Total Deployments:** Generated sites across network

## 🎯 Quick Site Generation

```bash
# 1. Clone template
git clone https://github.com/upsum-network/upsum-faq-template.git project-name-faq
cd project-name-faq

# 2. Generate site
node setup-new-site.js

# 3. Create repository
# Follow the prompts to set up as new Upsum Network site
```

## ✨ Features

- 🎨 **Three Professional Themes** - Purple, Blue, Orange
- 🔍 **Advanced Search** - Real-time FAQ filtering
- 🗄️ **Sanity CMS Integration** - Professional content management  
- ⚡ **Next.js 14** - Optimal performance
- 📱 **Fully Responsive** - Works on all devices
- 🚀 **Deploy Ready** - Vercel/Netlify configurations
- 🎯 **SEO Optimized** - Built for search engines
- 🏢 **Network Consistent** - Upsum branding standards

## 🗂️ Network Structure

```
upsum-network/
├── upsum-faq-template/     # 🎯 This repository
├── acme-corp-faq/         # Generated site
├── techstart-faq/         # Generated site
├── retail-chain-faq/      # Generated site
└── client-name-faq/       # Generated site
```

## 🎨 Theme Examples

### Purple Theme (Default)
- Primary: `#7c3aed`
- Use for: General clients, Upsum branding

### Blue Theme  
- Primary: `#2563eb`
- Use for: Corporate, tech clients

### Orange Theme
- Primary: `#ea580c` 
- Use for: Creative, retail clients

## 🛠️ Template Development

### Making Changes
```bash
git clone https://github.com/upsum-network/upsum-faq-template.git
cd upsum-faq-template
# Make improvements
git commit -m "feat: new template feature"
git push origin main
```

### Testing
```bash
# Test the generator
node setup-new-site.js
npm run dev
```

## 📋 Site Generation Process

1. **Clone template** → Fresh copy for new site
2. **Run generator** → `node setup-new-site.js`
3. **Customize** → Branding, theme, content
4. **Create repo** → Under `upsum-network` org
5. **Deploy** → Vercel/Netlify with custom domain
6. **Content** → Sanity CMS setup
7. **Monitor** → Analytics and performance

## 📁 Generated Site Structure

```
project-name-faq/
├── app/
│   ├── page.tsx           # Homepage with search
│   ├── faqs/[slug]/       # FAQ detail pages
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Themed styles
├── sanity/
│   └── schemas/           # CMS content schemas
├── site.config.json       # Site configuration
├── vercel.json           # Deployment config
└── README.md             # Site-specific docs
```

## 🚀 Deployment Standards

### Domain Strategy
- **Primary:** `faq.clientdomain.com`
- **Fallback:** `project-name-faq.vercel.app`

### Environment Variables
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=project-specific-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Performance Targets
- **Lighthouse Score:** 90+
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s

## 📞 Support & Maintenance

### Template Support
- **Issues:** Use GitHub issues in this repository
- **Features:** Submit PRs with new template features
- **Documentation:** Update this README

### Site-Specific Support  
- **Content:** Each site's Sanity CMS
- **Deployment:** Site-specific repository issues
- **Custom Features:** Site repository PRs

## 📈 Network Analytics

Each generated site includes:
- Google Analytics integration
- Performance monitoring setup
- Error tracking configuration
- Upsum Network attribution

## 🔄 Update Strategy

### Template Updates
- Backward compatible improvements
- Version tagging for major changes
- Migration guides for breaking changes

### Site Updates
- Manual application of template improvements
- Automated update scripts (future feature)
- Site-specific customizations preserved

## 📄 License

This template is part of the Upsum Network toolkit. Generated sites inherit this license with client-specific terms.

## 🏢 Upsum Network

**Building consistent, professional web solutions at scale**

- 🌐 [Network Overview](./UPSUM-NETWORK.md)
- 📊 [All Sites](https://github.com/upsum-network)
- 📞 Support: Upsum Network team

---

*Template Version 1.0.0 | Last Updated: January 2025*
