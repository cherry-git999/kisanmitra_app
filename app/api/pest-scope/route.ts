import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://pestoscope.com/category/pest-advisory/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const advisories: Array<{
      id: string;
      title: string;
      date: string;
      excerpt: string;
      link: string;
      category: string;
      author?: string;
    }> = [];

    // Parse each advisory article
    $('article').each((index, element) => {
      const $article = $(element);
      const $header = $article.find('header');
      const $link = $header.find('h2 a, h3 a, .entry-title a');
      const title = $link.text().trim();
      const link = $link.attr('href') || '';
      
      // Extract date
      const dateText = $article.find('.posted-on time, .entry-date, time').text().trim() || '';
      
      // Extract author
      const author = $article.find('.author a, .entry-author').text().trim();
      
      // Extract excerpt (first few lines of content)
      const content = $article.find('.entry-content, .entry-summary, p').first().text().trim();
      const excerpt = content.substring(0, 250) + (content.length > 250 ? '...' : '');
      
      // Extract category
      const category = $article.find('.cat-links a, .category').first().text().trim() || 'Pest Advisory';

      if (title && link) {
        advisories.push({
          id: `pest-advisory-${index}`,
          title,
          date: dateText,
          excerpt: excerpt || 'Pest management advisory information available. Click to read more.',
          link,
          category,
          author: author || undefined,
        });
      }
    });

    // If no articles found with the above selector, try alternative
    if (advisories.length === 0) {
      $('h2 a, h3 a').each((index, element) => {
        const $link = $(element);
        const title = $link.text().trim();
        const link = $link.attr('href') || '';
        
        if (title && link && link.includes('pestoscope.com')) {
          const $parent = $link.closest('article, div, section');
          const dateText = $parent.find('.posted-on time, .entry-date, time').text().trim() || '';
          const author = $parent.find('.author a').text().trim();
          const content = $parent.text().trim();
          const excerpt = content.substring(0, 250) + (content.length > 250 ? '...' : '');
          
          advisories.push({
            id: `pest-advisory-${index}`,
            title,
            date: dateText,
            excerpt: excerpt || 'Pest management information available.',
            link,
            category: 'Pest Advisory',
            author: author || undefined,
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      count: advisories.length,
      advisories: advisories.slice(0, 20), // Limit to 20 most recent
    });
  } catch (error) {
    console.error('Error fetching pest scope data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pest advisories',
        advisories: [],
      },
      { status: 500 }
    );
  }
}
