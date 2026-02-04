import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

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

/**
 * Fetches detailed information about a specific pest/disease
 * 
 * Scrapes the individual pest page to extract:
 * - Images
 * - Description
 * - Symptoms
 * - Management practices
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Fetch the pest detail page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $('h1.entry-title, h1.product_title').first().text().trim() || 
                  $('.product_title').first().text().trim() ||
                  $('h1').first().text().trim();

    // Extract all images from the page
    const images: string[] = [];
    const seenImages = new Set<string>();
    
    // Product gallery images
    $('.woocommerce-product-gallery__image img, .product-images img, .wp-post-image').each((_, el) => {
      let imgSrc = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-large-image');
      if (imgSrc && !seenImages.has(imgSrc)) {
        if (!imgSrc.startsWith('http')) {
          imgSrc = `https://pestoscope.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
        seenImages.add(imgSrc);
        images.push(imgSrc);
      }
    });
    
    // Content images
    $('.entry-content img, .product-description img, article img').each((_, el) => {
      let imgSrc = $(el).attr('src') || $(el).attr('data-src');
      if (imgSrc && !seenImages.has(imgSrc) && !imgSrc.includes('icon') && !imgSrc.includes('logo')) {
        if (!imgSrc.startsWith('http')) {
          imgSrc = `https://pestoscope.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        }
        seenImages.add(imgSrc);
        images.push(imgSrc);
      }
    });

    // Extract main content area - try multiple selectors
    const $content = $('.entry-content, .product-description, .woocommerce-tabs, .woocommerce-Tabs-panel, #tab-description, .woocommerce-product-details__short-description, article .product');
    
    // Initialize fields
    let causedBy = '';
    let problemCategory = '';
    let symptoms = '';
    let comments = '';
    let management = '';
    let control = '';
    let sku = '';
    
    // Try to extract from WooCommerce product meta
    $('.product_meta .sku_wrapper .sku, .sku').each((_, el) => {
      const skuText = $(el).text().trim();
      if (skuText && !skuText.toLowerCase().includes('sku')) {
        sku = skuText;
      }
    });
    
    // Get all text content from various content areas
    let contentText = '';
    
    // Try to get content from description tab
    const descriptionTab = $('#tab-description, .woocommerce-Tabs-panel--description, [id*="description"]');
    if (descriptionTab.length > 0) {
      contentText = descriptionTab.text();
    }
    
    // Fallback to entry content
    if (!contentText || contentText.length < 50) {
      contentText = $('.entry-content, .product-description, .woocommerce-product-details__short-description').text();
    }
    
    // Also try to get full page content if above methods fail
    if (!contentText || contentText.length < 50) {
      contentText = $('body').text();
    }

    console.log('Content text length:', contentText.length);
    console.log('Content preview:', contentText.substring(0, 500));
    
    // More flexible regex patterns to extract structured data
    // Extract "Caused by" - try multiple patterns
    let causedByMatch = contentText.match(/Caused\s+by[:\s]+([^\n]+)/i);
    if (!causedByMatch) causedByMatch = contentText.match(/Causal\s+organism[:\s]+([^\n]+)/i);
    if (causedByMatch) causedBy = causedByMatch[1].trim();
    
    // Extract "Problem Category"
    const categoryMatch = contentText.match(/Problem\s+Category[:\s]+([^\n]+)/i);
    if (categoryMatch) problemCategory = categoryMatch[1].trim();
    
    // Extract "Symptoms" - capture multi-line content
    let symptomsMatch = contentText.match(/Symptoms[:\s]+([^]*?)(?=Comments:|Management:|Control:|SKU:|Category:|$)/i);
    if (symptomsMatch) {
      symptoms = symptomsMatch[1].trim().substring(0, 1000); // Limit length
    }
    
    // Extract "Comments"
    let commentsMatch = contentText.match(/Comments[:\s]+([^]*?)(?=Management:|Control:|SKU:|Category:|$)/i);
    if (commentsMatch) {
      comments = commentsMatch[1].trim().substring(0, 1000);
    }
    
    // Extract "Management"
    let managementMatch = contentText.match(/Management[:\s]+([^]*?)(?=Control:|SKU:|Category:|Additional\s+information|Reviews|$)/i);
    if (managementMatch) {
      management = managementMatch[1].trim().substring(0, 1000);
    }
    
    // Extract "Control"
    let controlMatch = contentText.match(/Control[:\s]+([^]*?)(?=SKU:|Category:|Additional\s+information|Reviews|$)/i);
    if (controlMatch) {
      control = controlMatch[1].trim().substring(0, 1000);
    }
    
    // Extract SKU if not found earlier
    if (!sku) {
      const skuMatch = contentText.match(/SKU[:\s]+([^\n]+)/i);
      if (skuMatch) sku = skuMatch[1].trim();
    }

    // Extract category
    const category = $('.posted_in a, .product-categories a, .product_meta a[rel="tag"]').first().text().trim() || null;

    const pestDetail: PestDetail = {
      id: slug,
      title,
      images: images.slice(0, 10), // Limit to 10 images
      causedBy,
      problemCategory,
      symptoms,
      comments,
      management,
      control,
      sku,
      category,
      url,
    };

    return NextResponse.json({
      success: true,
      data: pestDetail,
    });

  } catch (error) {
    console.error('Error fetching pest details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pest details',
      },
      { status: 500 }
    );
  }
}