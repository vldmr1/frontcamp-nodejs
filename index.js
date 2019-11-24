import express from 'express';
import fs from 'fs';

const app = express();

app.get('/news', (req, res) => {
  res.set('Content-Type', 'application/json');
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

app.listen(3000,
  () => console.log('Application started on port 3000'));