#!/usr/bin/env ts-node

/**
 * Script to scrape and generate static pest data JSON file
 * Run: npm run generate-pest-data
 */

import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface PestDetail {
  id: string;
  title: string;
  images: string[];
  causedBy: string;
  problemCategory: string;
  symptoms: string;
  comments: string;
  management: string;
  control: string;
  sku: string;
  category: string | null;
  url: string;
}

interface PestItem {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string;
  price: string | null;
  url: string;
  detail: PestDetail | null;
}

interface CategoryData {
  name: string;
  slug: string;
  url: string;
  image: string | null;
  pests: PestItem[];
}

interface PestDataStructure {
  lastUpdated: string;
  categories: CategoryData[];
}

const BASE_URL = 'https://pestoscope.com';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCategories(): Promise<CategoryData[]> {
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
    
    const categories: CategoryData[] = [];
    const seenCategories = new Set<string>();

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
      
      let image: string | null = null;
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

async function fetchCategoryPests(category: CategoryData): Promise<PestItem[]> {
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
    
    const pests: PestItem[] = [];
    const seenPests = new Set<string>();

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
      
      let image: string | null = null;
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

async function fetchPestDetail(pest: PestItem): Promise<PestDetail | null> {
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

    const images: string[] = [];
    const seenImages = new Set<string>();
    
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
  
  const pestData: PestDataStructure = {
    lastUpdated: new Date().toISOString(),
    categories
  };
  
  const outputDir = path.join(process.cwd(), 'public', 'data');
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
  console.log(`   - File Size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
}

generatePestData().catch(console.error);
