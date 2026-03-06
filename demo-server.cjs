const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta dist/public
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Mock API para tRPC
app.use('/api/trpc/*', (req, res) => {
  res.json({
    result: {
      data: {
        json: []
      }
    }
  });
});

// Fallback a index.html para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Demo server running at http://localhost:${port}`);
});
