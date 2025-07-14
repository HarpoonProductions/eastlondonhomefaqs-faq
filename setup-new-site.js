#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupNewSite() {
  console.log('🏢 Upsum Network FAQ Site Generator')
  console.log('Creating a new FAQ site for the Upsum network\n')

  try {
    const projectName = await question('Project name (e.g., "acme-corp"): ')
    const siteName = await question('Site title (e.g., "Acme Corp FAQ"): ') || `${projectName} FAQ`
    const siteDescription = await question('Site description: ') || `FAQ site for ${projectName}`
    const theme = await question('Theme (purple/blue/orange) [purple]: ') || 'purple'

    console.log('\n📁 Generating site...')

    const siteConfig = {
      project: projectName,
      name: siteName,
      description: siteDescription,
      theme: theme,
      setupDate: new Date().toISOString(),
      network: 'upsum'
    }

    fs.writeFileSync('site.config.json', JSON.stringify(siteConfig, null, 2))
    updateHomepage(siteConfig)
    updatePackageJson(siteConfig)

    console.log('✅ Site generated successfully!')
    console.log(`✅ Project: ${projectName}`)
    console.log(`✅ Theme: ${theme}`)
    console.log('\n🚀 Next steps:')
    console.log('1. npm run dev')
    console.log('2. Visit http://localhost:3000')
    console.log(`3. Create repo: upsum-network/${projectName}-faq`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

function updateHomepage(config) {
  const homepagePath = 'app/page.tsx'
  if (!fs.existsSync(homepagePath)) return
  
  let content = fs.readFileSync(homepagePath, 'utf8')
  const newConfig = `const siteConfig = {
    name: "${config.name}",
    description: "${config.description}",
    theme: "${config.theme}",
    project: "${config.project}",
    network: "upsum",
    logo: null
  }`
  
  content = content.replace(/const siteConfig = {[\s\S]*?}/, newConfig)
  fs.writeFileSync(homepagePath, content)
}

function updatePackageJson(config) {
  if (!fs.existsSync('package.json')) return
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  pkg.name = `${config.project}-faq`
  pkg.description = config.description
  
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
}

setupNewSite()
