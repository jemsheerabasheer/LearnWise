const { searchWeb } = require('./utils/scraper');

async function test() {
  console.log("--- Testing Videos ---");
  const videos = await searchWeb("React Hooks beginner video tutorial site:youtube.com");
  console.log(JSON.stringify(videos, null, 2));

  console.log("\n--- Testing Articles ---");
  const articles = await searchWeb("React Hooks tutorial blog article documentation -youtube");
  console.log(JSON.stringify(articles, null, 2));
}

test();
