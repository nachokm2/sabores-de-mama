import https from 'https';

https.get('https://saboresdemama.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // Extract logo
    const logoMatch = data.match(/<img[^>]+src="([^">]+logo[^">]+)"/i) || data.match(/<img[^>]+src="([^">]+)"[^>]*alt="[^"]*logo[^"]*"/i);
    console.log('Logo URL:', logoMatch ? logoMatch[1] : 'Not found');
    
    // Extract colors (hex codes)
    const colors = data.match(/#[0-9a-fA-F]{6}\b/g);
    if (colors) {
      const uniqueColors = [...new Set(colors)];
      console.log('Colors:', uniqueColors.slice(0, 10)); // Print top 10 unique colors
    } else {
      console.log('No colors found');
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
