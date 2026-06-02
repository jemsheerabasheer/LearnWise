const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Searches the web using DuckDuckGo's HTML version to get real search results.
 * @param {string} query The search query
 * @returns {Promise<Array<{title: string, link: string, snippet: string}>>} Array of search results
 */
async function searchWeb(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((i, element) => {
      if (results.length >= 5) return false;

      const title = $(element).find('.result__title .result__a').text().trim();
      let link = $(element).find('.result__title .result__a').attr('href');
      const snippet = $(element).find('.result__snippet').text().trim();

      if (title && link) {
        // DDG sometimes uses a redirect URL format, try to extract the actual destination
        if (link.startsWith('//duckduckgo.com/l/?uddg=')) {
          const urlParams = new URLSearchParams(link.split('?')[1]);
          link = decodeURIComponent(urlParams.get('uddg'));
        } else if (link.startsWith('/l/?uddg=')) {
            const urlParams = new URLSearchParams(link.split('?')[1]);
            link = decodeURIComponent(urlParams.get('uddg'));
        }

        results.push({ title, link, snippet });
      }
    });

    return results;
  } catch (error) {
    console.error('Web search failed:', error.message);
    return []; // Return empty array on failure so generation can still proceed
  }
}

module.exports = { searchWeb };
