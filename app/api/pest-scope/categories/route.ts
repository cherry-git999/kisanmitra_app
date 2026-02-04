import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface PestCategory {
  name: string;
  slug: string;
  url: string;
  image: string | null;
}

/**
 * Discovers all pest categories from pestoscope.com
 * 
 * Selector used: a[href*="/product-category/"]
 * 
 * Reasoning: The homepage displays crop categories as WooCommerce product categories.
 * These are identified by URLs containing "/product-category/" followed by the crop slug.
 * This selector targets all anchor tags with this pattern, which represent the main
 * crop categories on the site (e.g., Cotton, Rice, Wheat, Tomato, etc.)
 */
export async function GET() {
  try {
    const targetUrl = 'https://pestoscope.com/';
    
    // Fetch HTML from Pestoscope homepage
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Map to track unique categories by URL
    const categoriesMap = new Map<string, PestCategory>();
    
    // Select all links containing "/product-category/"
    // These are WooCommerce product category links
    $('a[href*="/product-category/"]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const text = $link.text().trim();
      
      if (!href || !text) return;
      
      // Convert relative URLs to absolute
      const absoluteUrl = href.startsWith('http') 
        ? href 
        : `https://pestoscope.com${href.startsWith('/') ? '' : '/'}${href}`;
      
      // Extract slug from URL (e.g., "cotton" from "/product-category/cotton/")
      const slugMatch = href.match(/\/product-category\/([^\/]+)/);
      if (!slugMatch) return;
      
      const slug = slugMatch[1];
      
      // Extract image from img tag inside the link
      const $img = $link.find('img');
      let image = $img.attr('src') || $img.attr('data-src') || null;
      
      // Convert relative image URLs to absolute
      if (image && !image.startsWith('http')) {
        image = image.startsWith('/') 
          ? `https://pestoscope.com${image}` 
          : `https://pestoscope.com/${image}`;
      }
      
      // Clean up the name - remove count "(5)" and extra text
      let name = text
        .replace(/^Visit product category\s+/i, '')
        .replace(/\s*\(\d+\)\s*$/, '') // Remove "(5)" count at the end
        .trim();
      
      // Skip if name is empty after cleaning
      if (!name) return;
      
      // Use URL as key to avoid duplicates
      if (!categoriesMap.has(absoluteUrl)) {
        categoriesMap.set(absoluteUrl, {
          name,
          slug,
          url: absoluteUrl,
          image,
        });
      }
    });
    
    // Convert map to array and sort by name
    const categories = Array.from(categoriesMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return NextResponse.json(categories);
    
  } catch (error) {
    console.error('Error discovering categories:', error);
    return NextResponse.json(
      { error: 'Failed to discover categories' },
      { status: 500 }
    );
  }
}
