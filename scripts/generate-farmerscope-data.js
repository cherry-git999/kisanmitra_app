import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch farm advisories from kisanmitra.net
 */
async function fetchAdvisories() {
  try {
    console.log('Fetching farm advisories from kisanmitra.net...');
    
    const url = 'https://www.kisanmitra.net/category/farm-advisories/';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch advisories: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const advisories = [];

    $('article, .post, .entry').each((index, element) => {
      if (advisories.length >= 3) return; // Limit to 3 advisories

      const $article = $(element);

      // Updated selectors for kisanmitra.net structure
      const $titleLink = $article.find('h3.blog-title a, h2 a, h1 a, .entry-title a, a[rel="bookmark"]').first();
      const title = $titleLink.text().trim();
      const link = $titleLink.attr('href');

      if (!title || !link) return;

      const absoluteLink = link.startsWith('http') ? link : `https://www.kisanmitra.net${link}`;

      let image = null;
      const $img = $article.find('img').first();
      if ($img.length) {
        const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
        if (imgSrc && !imgSrc.includes('data:image')) {
          image = imgSrc.startsWith('http') ? imgSrc : `https://www.kisanmitra.net${imgSrc}`;
        }
      }

      const $excerpt = $article.find('.blog-content, .entry-content, .entry-summary, p').first();
      const excerpt = $excerpt.text().trim().substring(0, 200) || '';

      const $author = $article.find('.author a, .entry-author a, [rel="author"]');
      const author = $author.text().trim() || null;

      const $date = $article.find('time, .entry-date, .posted-on, .blog-date');
      const date = $date.length ? ($date.attr('datetime') || $date.text().trim() || null) : null;

      const $category = $article.find('.category a, .cat-links a').first();
      const category = $category.text().trim() || 'Farm Advisory';

      const id = absoluteLink.split('/').filter(Boolean).pop() || `post-${index}`;

      advisories.push({
        id,
        title,
        link: absoluteLink,
        image,
        excerpt,
        author,
        date,
        category,
        fullContent: '',
        images: []
      });
    });

    console.log(`Found ${advisories.length} advisories`);
    
    // Fetch full content for each advisory
    for (let i = 0; i < advisories.length; i++) {
      const advisory = advisories[i];
      console.log(`Fetching full content for advisory ${i + 1}/${advisories.length}: ${advisory.title}`);
      
      const details = await fetchAdvisoryDetail(advisory);
      if (details) {
        advisory.fullContent = details.fullContent;
        advisory.images = details.images;
        console.log(`  ✓ Extracted ${details.fullContent.length} characters and ${details.images.length} images`);
      }
      
      // Add delay to avoid overwhelming the server
      if (i < advisories.length - 1) {
        await delay(500);
      }
    }

    return advisories;

  } catch (error) {
    console.error('Error fetching advisories:', error);
    return [];
  }
}

/**
 * Fetch full content and images from individual advisory page
 */
async function fetchAdvisoryDetail(advisory) {
  try {
    const response = await fetch(advisory.link, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch advisory detail: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract full content from paragraphs
    const contentParagraphs = [];
    $('.blog-content p, .entry-content p, article p, .post-content p, .content p').each((_, element) => {
      const text = $(element).text().trim();
      if (text && text.length > 10) {
        contentParagraphs.push(text);
      }
    });

    const fullContent = contentParagraphs.join('\n\n');

    // Extract all images from the post content
    const images = [];
    $('.blog-content img, .entry-content img, article img, .post-content img, .content img').each((_, element) => {
      const imgSrc = $(element).attr('src') || $(element).attr('data-src');
      if (imgSrc && !imgSrc.includes('data:image') && !imgSrc.includes('avatar')) {
        const absoluteImg = imgSrc.startsWith('http') ? imgSrc : `https://www.kisanmitra.net${imgSrc}`;
        if (!images.includes(absoluteImg)) {
          images.push(absoluteImg);
        }
      }
    });

    return {
      fullContent,
      images
    };

  } catch (error) {
    console.error(`Error fetching advisory detail for "${advisory.title}":`, error.message);
    return {
      fullContent: advisory.excerpt || '',
      images: advisory.image ? [advisory.image] : []
    };
  }
}

/**
 * Main function to generate farm advisory data
 */
async function generateFarmerScopeData() {
  console.log('='.repeat(60));
  console.log('Starting FarmerScope Data Generation');
  console.log('='.repeat(60));

  const advisories = await fetchAdvisories();

  const data = {
    lastUpdated: new Date().toISOString(),
    count: advisories.length,
    advisories: advisories
  };

  // Save to JSON file
  const outputPath = join(__dirname, '../public/data/farmerscope-advisories.json');
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log('Data Generation Complete!');
  console.log('='.repeat(60));
  console.log(`Total advisories: ${advisories.length}`);
  console.log(`Output file: ${outputPath}`);
  console.log(`Last updated: ${data.lastUpdated}`);
  console.log('='.repeat(60));
}

// Run the script
generateFarmerScopeData().catch(console.error);
