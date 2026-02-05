import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface FarmerPost {
  id: string;
  title: string;
  image: string | null;
  excerpt: string;
  author: string | null;
  date: string | null;
  category: string | null;
  link: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: FarmerPost[];
}

export async function GET() {
  try {
    const targetUrl = 'https://www.kisanmitra.net/category/farm-advisories/';
    
    const response = await fetch(targetUrl, {
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
    const posts: FarmerPost[] = [];

    $('article, .post, .entry').each((index, element) => {
      if (posts.length >= 20) return;

      const $article = $(element);

      const $titleLink = $article.find('h2 a, h1 a, .entry-title a, a[rel="bookmark"]').first();
      const title = $titleLink.text().trim();
      const link = $titleLink.attr('href');

      if (!title || !link) return;

      const absoluteLink = link.startsWith('http') ? link : `https://www.kisanmitra.net${link}`;

      let image: string | null = null;
      const $img = $article.find('img').first();
      if ($img.length) {
        const imgSrc = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
        if (imgSrc && !imgSrc.includes('data:image')) {
          image = imgSrc.startsWith('http') ? imgSrc : `https://www.kisanmitra.net${imgSrc}`;
        }
      }

      const $excerpt = $article.find('.entry-content, .entry-summary, p').first();
      const excerpt = $excerpt.text().trim().substring(0, 200) || '';

      const $author = $article.find('.author a, .entry-author a, [rel="author"]');
      const author = $author.text().trim() || null;

      const $date = $article.find('time, .entry-date, .posted-on');
      const date = $date.length ? ($date.attr('datetime') || $date.text().trim() || null) : null;

      const $category = $article.find('.category a, .cat-links a').first();
      const category = $category.text().trim() || 'Farm Advisory';

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
      });
    });

    return NextResponse.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching farm advisories:', error);
    return NextResponse.json(
      {
        success: false,
        count: 0,
        data: [],
      },
      { status: 500 }
    );
  }
}

/**
 * Selector Strategy:
 * - Posts: 'article, .post, .entry' - WordPress standard containers
 * - Title/Link: 'h2 a, h1 a, .entry-title a' - common heading patterns
 * - Images: Prioritizes 'src', falls back to 'data-src' for lazy-loaded images
 * - Author: '.author a, [rel="author"]' - WordPress author meta
 * - Date: 'time[datetime]' - semantic HTML5 time element with ISO format
 * - All relative URLs converted to absolute with https://www.kisanmitra.net base
 */
