// ========================================
// TWITTER/X SERMON LINK EXTRACTOR
// ========================================
// 
// HOW TO USE:
// 1. Go to https://x.com/HicfanMin in your browser
// 2. Scroll down to load all sermon posts
// 3. Right-click > Inspect > Console tab
// 4. Paste this entire script and press Enter
// 5. It will copy all links to your clipboard!
//
// ========================================

console.log('🔍 Searching for sermon video links...');

// Find all tweet links on the page
const tweetLinks = Array.from(document.querySelectorAll('article a[href*="/status/"]'))
  .map(link => link.href)
  .filter((link, index, self) => self.indexOf(link) === index) // Remove duplicates
  .filter(link => link.includes('/status/'));

console.log(`✅ Found ${tweetLinks.length} tweet links`);

// Format them nicely
const formattedLinks = tweetLinks.map((link, index) => {
  return `${index + 1}. ${link}`;
}).join('\n');

// Copy to clipboard
const textArea = document.createElement('textarea');
textArea.value = formattedLinks;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);

console.log('✅ Links copied to clipboard!');
console.log('\n📋 Here are your links:\n');
console.log(formattedLinks);

alert(`✅ Successfully extracted ${tweetLinks.length} sermon links!\n\nThey have been copied to your clipboard.\n\nPaste them wherever you need them!`);
