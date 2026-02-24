// ========================================
// SERMON LINK IMPORTER SCRIPT
// ========================================
// 
// After extracting links from Twitter, paste them below
// and this script will generate the sermon data for you!
//
// ========================================

const twitterLinks = [
  // PASTE YOUR TWITTER LINKS HERE, one per line
  // Example:
  // "https://x.com/HicfanMin/status/1234567890",
  // "https://x.com/HicfanMin/status/9876543210",
];

// Generate sermon data
function generateSermonData(links) {
  const sermons = links.map((link, index) => {
    const id = (index + 1).toString();
    
    // Extract date from link or use placeholder
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (index * 7)); // Each week back
    const dateStr = dateObj.toISOString().split('T')[0];
    
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Determine if it's a youth service (Friday)
    const isYouth = dateObj.getDay() === 5;
    
    return {
      id,
      title: isYouth 
        ? `Friday Youth Service - ${formattedDate}`
        : `Sunday Service - ${formattedDate}`,
      speaker: isYouth ? "Youth Leaders" : "Pastor Thabo Boshomane",
      date: dateStr,
      duration: isYouth ? "55:00" : "1:15:00",
      category: isYouth ? "Teaching" : "Word",
      thumbnail: "require('@/assets/images/sermon-word.png')",
      videoUrl: link,
      audioUrl: link,
      notes: "Watch the full service recording on our Twitter/X account",
      description: isYouth 
        ? "Friday evening youth service with dynamic worship and relevant teaching."
        : "Sunday morning service with powerful worship, prayer, and the Word of God."
    };
  });
  
  return sermons;
}

// Run the generator
if (twitterLinks.length > 0) {
  const sermonData = generateSermonData(twitterLinks);
  
  console.log('\n✅ Generated Sermon Data:');
  console.log('\nexport const SERMONS = [');
  
  sermonData.forEach((sermon, index) => {
    console.log('  {');
    console.log(`    id: "${sermon.id}",`);
    console.log(`    title: "${sermon.title}",`);
    console.log(`    speaker: "${sermon.speaker}",`);
    console.log(`    date: "${sermon.date}",`);
    console.log(`    duration: "${sermon.duration}",`);
    console.log(`    category: "${sermon.category}",`);
    console.log(`    thumbnail: ${sermon.thumbnail},`);
    console.log(`    videoUrl: "${sermon.videoUrl}",`);
    console.log(`    audioUrl: "${sermon.audioUrl}",`);
    console.log(`    notes: "${sermon.notes}",`);
    console.log(`    description: "${sermon.description}"`);
    console.log(`  }${index < sermonData.length - 1 ? ',' : ''}`);
  });
  
  console.log('];');
  console.log('\n✅ Copy the above code and paste it into lib/ministry-data.ts');
} else {
  console.log('⚠️  Please add Twitter links to the twitterLinks array first!');
}

// To use in Node.js: node sermon-link-importer.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateSermonData };
}
