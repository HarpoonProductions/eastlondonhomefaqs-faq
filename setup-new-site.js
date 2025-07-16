#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [search, replace] of Object.entries(replacements)) {
    const newContent = content.replace(new RegExp(search, 'g'), replace);
    if (newContent !== content) {
      content = newContent;
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`⚠️  No changes made to ${filePath}`);
  }
}

function generateTopicFAQs(topic, siteName) {
  const faqTemplates = {
    'east london home': [
      {
        category: 'Getting Started',
        question: 'What are the best areas in East London for first-time buyers?',
        answer: 'Popular areas for first-time buyers include Stratford, Canary Wharf, Bow, and Hackney Wick. These areas offer good transport links, regeneration projects, and relatively affordable prices compared to Central London.'
      },
      {
        category: 'Buying',
        question: 'What is the average house price in East London?',
        answer: 'As of 2024, average house prices in East London vary significantly by area. Expect to pay £400,000-£600,000 for a typical 2-bed flat, with prices higher in areas like Canary Wharf and lower in areas like Barking & Dagenham.'
      },
      {
        category: 'Renting',
        question: 'How much should I budget for rent in East London?',
        answer: 'Rental costs vary by area and property type. A 1-bed flat typically ranges from £1,200-£2,000 per month, while a 2-bed flat ranges from £1,500-£2,800 per month, depending on location and amenities.'
      }
    ],
    'default': [
      {
        category: 'Getting Started',
        question: `How do I get started with ${siteName}?`,
        answer: `Learn the basics of getting started with our ${siteName.toLowerCase()} system.`
      },
      {
        category: 'Features',
        question: `What features are included in ${siteName}?`,
        answer: `Discover all the powerful features including search, theming, and content management.`
      },
      {
        category: 'Customization',
        question: `How do I customize the design and themes?`,
        answer: `Learn how to customize themes, colors, layout, and branding for your site.`
      }
    ]
  };
  
  const topicKey = topic.toLowerCase();
  return faqTemplates[topicKey] || faqTemplates['default'];
}

async function main() {
  console.log('🏢 Upsum Network FAQ Site Generator');
  console.log('Creating a new FAQ site for the Upsum network\n');

  // Get site configuration
  const projectName = await question('Project name (e.g., "acme-corp"): ');
  const siteTitle = await question('Site title (e.g., "Acme Corp FAQ"): ');
  const siteDescription = await question('Site description: ');
  const theme = await question('Theme (purple/blue/orange) [purple]: ') || 'purple';
  const topic = await question('Topic area (e.g., "east london home"): ') || siteTitle.toLowerCase();

  rl.close();

  console.log('\n📁 Generating site...');

  // 1. Update site.config.json
  const siteConfig = {
    name: siteTitle,
    description: siteDescription,
    theme: theme.toLowerCase(),
    projectName: projectName,
    domain: `${projectName}.com`,
    topic: topic
  };

  fs.writeFileSync('site.config.json', JSON.stringify(siteConfig, null, 2));
  console.log('✅ Updated site.config.json');

  // 2. Update package.json
  replaceInFile('package.json', {
    '"upsum-faq-template"': `"${projectName}-faq"`,
    '"name": ".*"': `"name": "${projectName}-faq"`
  });

  // 3. Update app/layout.tsx - Site title and metadata
  replaceInFile('app/layout.tsx', {
    'Enhanced FAQ Site': siteTitle,
    'Professional FAQ system with search and content management': siteDescription
  });

  // 4. Update app/page.tsx - Main content  
  replaceInFile('app/page.tsx', {
    'Enhanced FAQ Site': siteTitle,
    'Professional FAQ system with search and content management': siteDescription
  });

  // 5. Generate topic-specific FAQ data
  const faqs = generateTopicFAQs(topic, siteTitle);
  
  // Create lib directory if it doesn't exist
  if (!fs.existsSync('lib')) {
    fs.mkdirSync('lib', { recursive: true });
  }
  
  // Create or update FAQ data file
  const faqDataPath = 'lib/mockData.ts';
  const faqDataContent = `// Mock FAQ data for ${siteTitle}
export const mockFAQs = ${JSON.stringify(faqs, null, 2)};

export default mockFAQs;
`;

  fs.writeFileSync(faqDataPath, faqDataContent);
  console.log('✅ Generated topic-specific FAQ data');

  // 6. Update README.md
  replaceInFile('README.md', {
    'Upsum FAQ Template': siteTitle,
    'Master template for the Upsum Network FAQ system': `${siteTitle} - ${siteDescription}`,
    'Professional, replicable FAQ sites with Sanity CMS integration, designed for the Upsum Network\\.': siteDescription
  });

  // 7. Set theme in globals.css (activate the selected theme)
  replaceInFile('app/globals.css', {
    ':root': `:root[data-theme="${theme.toLowerCase()}"]`
  });

  console.log(`\n✅ Site generated successfully!`);
  console.log(`✅ Project: ${projectName}`);
  console.log(`✅ Theme: ${theme}`);
  console.log(`✅ Topic: ${topic}`);

  console.log('\n🚀 Next steps:');
  console.log('1. npm run dev');
  console.log('2. Visit http://localhost:3000');
  console.log(`3. Create repo: upsum-network/${projectName}-faq`);
  console.log('4. Deploy to Vercel');
}

main().catch(console.error);