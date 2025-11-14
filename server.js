const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory (since we're in build folder)
app.use(express.static(__dirname));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});