import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://www.kisanmitra.net/category/farm-advisories/', {
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
    }> = [];

    // Parse each advisory article
    $('article').each((index, element) => {
      const $article = $(element);
      const $header = $article.find('header');
      const $link = $header.find('h3 a, h2 a');
      const title = $link.text().trim();
      const link = $link.attr('href') || '';
      
      // Extract date
      const dateText = $article.find('.entry-date, time, .date').text().trim() ||
                      $article.text().match(/Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1] || '';
      
      // Extract excerpt (first few lines of content)
      const content = $article.find('.entry-content, .post-content, p').first().text().trim();
      const excerpt = content.substring(0, 200) + (content.length > 200 ? '...' : '');
      
      // Extract category
      const category = $article.find('.category, .cat-links a').first().text().trim() || 'Farm Advisory';

      if (title && link) {
        advisories.push({
          id: `advisory-${index}`,
          title,
          date: dateText,
          excerpt: excerpt || 'Farm advisory information available. Click to read more.',
          link,
          category,
        });
      }
    });

    // If no articles found with the above selector, try alternative
    if (advisories.length === 0) {
      $('h3 a, h2 a').each((index, element) => {
        const $link = $(element);
        const title = $link.text().trim();
        const link = $link.attr('href') || '';
        
        if (title && link && link.includes('kisanmitra.net')) {
          const $parent = $link.closest('article, div, section');
          const dateText = $parent.find('.entry-date, time, .date').text().trim() || '';
          const content = $parent.text().trim();
          const excerpt = content.substring(0, 200) + (content.length > 200 ? '...' : '');
          
          advisories.push({
            id: `advisory-${index}`,
            title,
            date: dateText,
            excerpt: excerpt || 'Farm advisory information available.',
            link,
            category: 'Farm Advisory',
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
    console.error('Error fetching farmer scope data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch farm advisories',
        advisories: [],
      },
      { status: 500 }
    );
  }
}
