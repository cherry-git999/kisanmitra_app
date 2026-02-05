#!/usr/bin/env node

/**
 * Script to scrape and generate static pest data JSON file
 * Run: npm run generate-pest-data
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://pestoscope.com';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCategories() {
  console.log('📦 Fetching categories...');
  
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const categories = [];
    const seenCategories = new Set();

    $('a[href*="/product-category/"]').each((_, el) => {
      const $link = $(el);
      const href = $link.attr('href');
      
      if (!href || href.includes('?') || href.includes('#')) return;
      
      const url = href.startsWith('http') ? href : `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
      const slug = href.split('/').filter(Boolean).pop() || '';
      
      if (!slug || seenCategories.has(slug)) return;
      seenCategories.add(slug);
      
      let name = $link.text().trim();
      name = name.replace(/\(\d+\)/g, '').trim();
      
      if (!name || name.length < 2) return;
      
      let image = null;
      const $img = $link.find('img').first();
      if ($img.length > 0) {
        const imgSrc = $img.attr('src') || $img.attr('data-src');
        if (imgSrc) {
          image = imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
      }
      
      categories.push({ name, slug, url, image, pests: [] });
    });

    console.log(`✅ Found ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

async function fetchCategoryPests(category) {
  console.log(`  📋 Fetching pests for: ${category.name}`);
  
  try {
    const response = await fetch(category.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const pests = [];
    const seenPests = new Set();

    $('.product, .woocommerce-LoopProduct-link, article.product').each((_, el) => {
      const $product = $(el);
      
      let $link = $product.find('a.woocommerce-LoopProduct-link, a.product-link, a[href*="/product/"]').first();
      if (!$link.length) $link = $product.find('a').first();
      
      const href = $link.attr('href');
      if (!href || seenPests.has(href)) return;
      seenPests.add(href);
      
      const url = href.startsWith('http') ? href : `${BASE_URL}${href.startsWith('/') ? '' : '/'}${href}`;
      const slug = href.split('/').filter(Boolean).pop() || '';
      
      const title = $product.find('.woocommerce-loop-product__title, h2, h3, .product-title').first().text().trim() ||
                    $link.attr('title')?.trim() || '';
      
      if (!title) return;
      
      let image = null;
      const $img = $product.find('img').first();
      if ($img.length > 0) {
        const imgSrc = $img.attr('src') || $img.attr('data-src');
        if (imgSrc) {
          image = imgSrc.startsWith('http') ? imgSrc : `${BASE_URL}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
      }
      
      const excerpt = $product.find('.product-excerpt, .woocommerce-product-details__short-description').first().text().trim();
      const price = $product.find('.price, .amount').first().text().trim() || null;
      
      pests.push({
        id: slug,
        title,
        slug,
        image,
        excerpt,
        price,
        url,
        detail: null
      });
    });

    console.log(`  ✅ Found ${pests.length} pests`);
    return pests;
  } catch (error) {
    console.error(`  ❌ Error fetching pests for ${category.name}:`, error);
    return [];
  }
}

async function fetchPestDetail(pest) {
  console.log(`    🔍 Fetching details for: ${pest.title}`);
  
  try {
    const response = await fetch(pest.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('h1.entry-title, h1.product_title').first().text().trim() || 
                  $('.product_title').first().text().trim() ||
                  $('h1').first().text().trim();

    const images = [];
    const seenImages = new Set();
    
    $('.woocommerce-product-gallery__image img, .product-images img, .wp-post-image').each((_, el) => {
      let imgSrc = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-large-image');
      if (imgSrc && !seenImages.has(imgSrc)) {
        if (!imgSrc.startsWith('http')) {
          imgSrc = `${BASE_URL}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
        seenImages.add(imgSrc);
        images.push(imgSrc);
      }
    });
    
    $('.entry-content img, .product-description img, article img').each((_, el) => {
      let imgSrc = $(el).attr('src') || $(el).attr('data-src');
      if (imgSrc && !seenImages.has(imgSrc) && !imgSrc.includes('icon') && !imgSrc.includes('logo')) {
        if (!imgSrc.startsWith('http')) {
          imgSrc = `${BASE_URL}${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
        seenImages.add(imgSrc);
        images.push(imgSrc);
      }
    });

    let contentText = '';
    const descriptionTab = $('#tab-description, .woocommerce-Tabs-panel--description, [id*="description"]');
    if (descriptionTab.length > 0) {
      contentText = descriptionTab.text();
    }
    
    if (!contentText || contentText.length < 50) {
      contentText = $('.entry-content, .product-description, .woocommerce-product-details__short-description').text();
    }
    
    if (!contentText || contentText.length < 50) {
      contentText = $('body').text();
    }

    let causedBy = '';
    let causedByMatch = contentText.match(/Caused\s+by[:\s]+([^\n]+)/i);
    if (!causedByMatch) causedByMatch = contentText.match(/Causal\s+organism[:\s]+([^\n]+)/i);
    if (causedByMatch) causedBy = causedByMatch[1].trim();
    
    let problemCategory = '';
    const categoryMatch = contentText.match(/Problem\s+Category[:\s]+([^\n]+)/i);
    if (categoryMatch) problemCategory = categoryMatch[1].trim();
    
    let symptoms = '';
    let symptomsMatch = contentText.match(/Symptoms[:\s]+([^]*?)(?=Comments:|Management:|Control:|SKU:|Category:|$)/i);
    if (symptomsMatch) {
      symptoms = symptomsMatch[1].trim().substring(0, 1000);
    }
    
    let comments = '';
    let commentsMatch = contentText.match(/Comments[:\s]+([^]*?)(?=Management:|Control:|SKU:|Category:|$)/i);
    if (commentsMatch) {
      comments = commentsMatch[1].trim().substring(0, 1000);
    }
    
    let management = '';
    let managementMatch = contentText.match(/Management[:\s]+([^]*?)(?=Control:|SKU:|Category:|Additional\s+information|Reviews|$)/i);
    if (managementMatch) {
      management = managementMatch[1].trim().substring(0, 1000);
    }
    
    let control = '';
    let controlMatch = contentText.match(/Control[:\s]+([^]*?)(?=SKU:|Category:|Additional\s+information|Reviews|$)/i);
    if (controlMatch) {
      control = controlMatch[1].trim().substring(0, 1000);
    }
    
    let sku = '';
    $('.product_meta .sku_wrapper .sku, .sku').each((_, el) => {
      const skuText = $(el).text().trim();
      if (skuText && !skuText.toLowerCase().includes('sku')) {
        sku = skuText;
      }
    });
    
    if (!sku) {
      const skuMatch = contentText.match(/SKU[:\s]+([^\n]+)/i);
      if (skuMatch) sku = skuMatch[1].trim();
    }

    const category = $('.posted_in a, .product-categories a, .product_meta a[rel="tag"]').first().text().trim() || null;

    console.log(`    ✅ Details fetched`);
    
    return {
      id: pest.slug,
      title,
      images: images.slice(0, 10),
      causedBy,
      problemCategory,
      symptoms,
      comments,
      management,
      control,
      sku,
      category,
      url: pest.url
    };
  } catch (error) {
    console.error(`    ❌ Error fetching details for ${pest.title}:`, error);
    return null;
  }
}

async function fetchAdvisoryDetail(advisory) {
  console.log(`    📄 Fetching full content for: ${advisory.title}`);
  
  try {
    const response = await fetch(advisory.link, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Get full content
    const $content = $('.entry-content, article .content, .post-content');
    let fullContent = '';
    
    // Extract text paragraphs
    $content.find('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        fullContent += text + '\n\n';
      }
    });

    // Get all images from the post
    const images = [];
    const seenImages = new Set();
    
    $content.find('img').each((_, el) => {
      let imgSrc = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (imgSrc && !imgSrc.includes('data:image') && !seenImages.has(imgSrc)) {
        if (!imgSrc.startsWith('http')) {
          imgSrc = `https://pestoscope.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
        seenImages.add(imgSrc);
        images.push(imgSrc);
      }
    });

    console.log(`    ✅ Full content fetched (${fullContent.length} chars, ${images.length} images)`);
    
    return {
      fullContent: fullContent.trim(),
      images: images
    };
  } catch (error) {
    console.error(`    ❌ Error fetching advisory details:`, error);
    return {
      fullContent: advisory.excerpt,
      images: []
    };
  }
}

async function fetchAdvisories() {
  console.log('\n📰 Fetching pest advisories...');
  
  try {
    const response = await fetch('https://pestoscope.com/category/pest-advisory/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const posts = [];

    $('article, .post, .entry').each((index, element) => {
      if (posts.length >= 10) return;

      const $article = $(element);

      const $titleLink = $article.find('h2 a, h1 a, .entry-title a, a[rel="bookmark"]').first();
      const title = $titleLink.text().trim();
      const link = $titleLink.attr('href');

      if (!title || !link) return;

      const absoluteLink = link.startsWith('http') ? link : `https://pestoscope.com${link}`;

      let image = null;
      const $img = $article.find('img').first();
      if ($img.length) {
        const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
        if (imgSrc && !imgSrc.includes('data:image')) {
          image = imgSrc.startsWith('http') ? imgSrc : `https://pestoscope.com${imgSrc}`;
        }
      }

      const $excerpt = $article.find('.entry-content, .entry-summary, p').first();
      const excerpt = $excerpt.text().trim().substring(0, 200) || '';

      const $author = $article.find('.author a, .entry-author a, [rel="author"]');
      const author = $author.text().trim() || null;

      const $date = $article.find('time, .entry-date, .posted-on');
      let date = null;
      if ($date.length) {
        date = $date.attr('datetime') || $date.text().trim() || null;
      }

      const $category = $article.find('.category a, .cat-links a').first();
      const category = $category.text().trim() || 'Pest Advisory';

      const id = absoluteLink.split('/').filter(Boolean).pop() || `post-${index}`;

      posts.push({
        id,
        title,
        image,
        excerpt,
        author,
        date,
        category,
        link: absoluteLink,
        fullContent: '',
        images: []
      });
    });

    console.log(`✅ Found ${posts.length} advisories`);
    
    // Fetch full content for each advisory
    for (const post of posts) {
      const detail = await fetchAdvisoryDetail(post);
      post.fullContent = detail.fullContent;
      post.images = detail.images.length > 0 ? detail.images : (post.image ? [post.image] : []);
      await delay(500); // Rate limiting
    }
    
    return posts;
  } catch (error) {
    console.error('❌ Error fetching advisories:', error);
    return [];
  }
}

async function generatePestData() {
  console.log('🚀 Starting pest data generation...\n');
  
  const categories = await fetchCategories();
  
  for (const category of categories) {
    console.log(`\n📂 Processing: ${category.name}`);
    
    const pests = await fetchCategoryPests(category);
    await delay(1000); // Rate limiting
    
    for (const pest of pests) {
      const detail = await fetchPestDetail(pest);
      pest.detail = detail;
      await delay(500); // Rate limiting
    }
    
    category.pests = pests;
  }
  
  const advisories = await fetchAdvisories();
  
  const pestData = {
    lastUpdated: new Date().toISOString(),
    categories,
    advisories
  };
  
  const outputDir = path.join(path.dirname(__dirname), 'public', 'data');
  const outputFile = path.join(outputDir, 'pest-data.json');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(pestData, null, 2), 'utf-8');
  
  console.log('\n✨ Generation complete!');
  console.log(`📄 File saved to: ${outputFile}`);
  console.log(`📊 Stats:`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Total Pests: ${categories.reduce((sum, cat) => sum + cat.pests.length, 0)}`);
  console.log(`   - Advisories: ${advisories.length}`);
  console.log(`   - File Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
}

generatePestData().catch(console.error);
