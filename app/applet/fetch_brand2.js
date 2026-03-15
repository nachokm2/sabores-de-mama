import https from 'https';

https.get('https://saboresdemama.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const imgMatches = [...data.matchAll(/<img[^>]+src="([^">]+)"/gi)];
    const imgs = imgMatches.map(m => m[1]).filter(src => src.toLowerCase().includes('logo'));
    console.log('Logo URLs:', imgs);
    
    // Look for all hex colors
    const colors = data.match(/#[0-9a-fA-F]{6}\b/g);
    const uniqueColors = [...new Set(colors)];
    console.log('Hex Colors:', uniqueColors);
    
    // Look for CSS variables
    const cssVars = data.match(/--[\w-]+:\s*([^;]+);/g);
    if (cssVars) {
        console.log('CSS Vars:', cssVars.slice(0, 20));
    }
  });
});
