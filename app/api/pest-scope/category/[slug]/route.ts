import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface PestItem {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string;
  price: string | null;
  url: string;
}

/**
 * Fetches all pest/product items from a specific crop category
 * 
 * Selector used: .product, .woocommerce-LoopProduct-link
 * 
 * Reasoning: pestoscope.com uses WooCommerce for product listings.
 * Each pest/disease is listed as a product with image, title, and link.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const targetUrl = `https://pestoscope.com/product-category/${slug}/`;
    
    // Fetch HTML from category page
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
    
    const pests: PestItem[] = [];
    const seenUrls = new Set<string>();
    
    // Select WooCommerce product items
    $('.product, .woocommerce-LoopProduct-link').each((index, element) => {
      const $product = $(element);
      
      // Get the link - could be the element itself or a child
      let $link = $product.is('a') ? $product : $product.find('a').first();
      const url = $link.attr('href');
      
      if (!url || seenUrls.has(url)) return;
      seenUrls.add(url);
      
      // Extract title
      const $title = $product.find('.woocommerce-loop-product__title, h2, h3').first();
      const title = $title.text().trim();
      
      if (!title) return;
      
      // Extract image
      const $img = $product.find('img').first();
      let image = $img.attr('src') || $img.attr('data-src') || null;
      
      // Convert relative image URLs to absolute
      if (image && !image.startsWith('http')) {
        image = image.startsWith('/') 
          ? `https://pestoscope.com${image}` 
          : `https://pestoscope.com/${image}`;
      }
      
      // Extract excerpt/description if available
      const $excerpt = $product.find('.woocommerce-loop-product__excerpt, .product-excerpt').first();
      const excerpt = $excerpt.text().trim() || '';
      
      // Extract price if available
      const $price = $product.find('.price, .woocommerce-Price-amount').first();
      const price = $price.text().trim() || null;
      
      // Generate slug from title
      const slugFromTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Create unique ID from URL
      const id = url.split('/').filter(Boolean).pop() || `pest-${index}`;
      
      pests.push({
        id,
        title,
        slug: slugFromTitle,
        image,
        excerpt,
        price,
        url: url.startsWith('http') ? url : `https://pestoscope.com${url}`,
      });
    });
    
    // If no products found with primary selector, try article-based selector
    if (pests.length === 0) {
      $('article.product, li.product').each((index, element) => {
        const $article = $(element);
        const $link = $article.find('a').first();
        const url = $link.attr('href');
        
        if (!url || seenUrls.has(url)) return;
        seenUrls.add(url);
        
        const title = $link.find('h2, h3, .woocommerce-loop-product__title').text().trim() ||
                     $link.attr('aria-label')?.replace(/^Visit product\s+/i, '') || '';
        
        if (!title) return;
        
        const $img = $article.find('img').first();
        let image = $img.attr('src') || $img.attr('data-src') || null;
        
        if (image && !image.startsWith('http')) {
          image = `https://pestoscope.com${image.startsWith('/') ? '' : '/'}${image}`;
        }
        
        const slugFromTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const id = url.split('/').filter(Boolean).pop() || `pest-${index}`;
        
        pests.push({
          id,
          title,
          slug: slugFromTitle,
          image,
          excerpt: '',
          price: null,
          url: url.startsWith('http') ? url : `https://pestoscope.com${url}`,
        });
      });
    }
    
    return NextResponse.json({
      success: true,
      category: slug,
      count: pests.length,
      data: pests,
    });
    
  } catch (error) {
    console.error('Error fetching category pests:', error);
    const { slug } = await params;
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch category data',
        category: slug,
        count: 0,
        data: []
      },
      { status: 500 }
    );
  }
}
