import * as cheerio from 'cheerio';

async function testSelectors() {
  try {
    const response = await fetch('https://www.kisanmitra.net/category/farm-advisories/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    console.log('='.repeat(60));
    console.log('Testing selectors for kisanmitra.net');
    console.log('='.repeat(60));
    
    console.log('\narticle tags:', $('article').length);
    console.log('.post elements:', $('.post').length);
    console.log('.entry elements:', $('.entry').length);
    console.log('.blog-post elements:', $('.blog-post').length);
    console.log('.td-module-container elements:', $('.td-module-container').length);
    console.log('.td_module_wrap elements:', $('.td_module_wrap').length);

    console.log('\n' + '='.repeat(60));
    console.log('First .post element HTML:');
    console.log('='.repeat(60));
    
    const firstElement = $('.post').first();
    if (firstElement.length) {
      console.log(firstElement.html().substring(0, 1000));
      console.log('\n--- All links in first post ---');
      firstElement.find('a').each((i, el) => {
        console.log(`Link ${i + 1}:`, $(el).text().trim(), '→', $(el).attr('href'));
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testSelectors();
