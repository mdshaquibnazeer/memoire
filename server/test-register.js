const https = require('https');

const data = JSON.stringify({
  email: "testuser2@example.com",
  username: "testuser2",
  password: "Password123!",
  displayName: "Test User"
});

const options = {
  hostname: 'memoire-backend.onrender.com',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, res => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
