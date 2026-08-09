const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Lambang_Kabupaten_Cirebon.png/500px-Lambang_Kabupaten_Cirebon.png';
const dest = 'd:\\web_desa_budur\\frontend\\public\\logo-cirebon.png';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    res.resume(); // consume response data to free up memory
    return;
  }

  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed successfully.');
  });
}).on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
