import express from 'express';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const articlesRouter = express.Router();
const articlesDataPath = path.join(__dirname, '..', '..', 'data', 'data.json');

articlesRouter.get('/', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename))
    };

    res.send(data);
  });
});

articlesRouter.get('/:id', (req, res, next) => {
  res.set('Content-Type', 'application/json');
  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename))
    };

    const parsedData = JSON.parse(data);
    const requestedArticle = parsedData.find((article) => article.id === +req.params.id);

    if (requestedArticle) {
      res.json(requestedArticle);
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  });
})

articlesRouter.post('/', (req, res, next) => {
  const newArticle = {
    id: uuid.v4(),
    author: req.body.author,
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    urlToImage: req.body.urlToImage,
    publishedAt: req.body.publishedAt,
  }

  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename))
    };

    const updatedArticles = [...JSON.parse(data), newArticle];

    fs.writeFile(articlesDataPath, JSON.stringify(updatedArticles), (err) => {
      if (err) {
        return next(new Error('UNABLE TO WRITE TO FILE', __filename))
      };

      res.status(200).json({ message: 'Article added!'})
    });
  });
})

articlesRouter.put('/:id', (req, res, next) => {
  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename))
    };


    const parsedData = JSON.parse(data);
    let requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

    if (requestedArticleIndex !== -1) {
      parsedData[requestedArticleIndex] = {...parsedData[requestedArticleIndex], ...req.body};

      fs.writeFile(articlesDataPath, JSON.stringify(parsedData), (err) => {
        if (err) {
          return next(new Error('UNABLE TO WRITE TO FILE', __filename))
        };

        res.status(200).json({ message: 'Article updated!'})
      });
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  });
})

articlesRouter.delete('/:id', (req, res, next) => {
  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename))
    };

    const parsedData = JSON.parse(data);
    const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

    if (requestedArticleIndex !== -1) {
      parsedData.splice(requestedArticleIndex, 1);

      fs.writeFile(articlesDataPath, JSON.stringify(parsedData), (err) => {
        if (err) {
          return next(new Error('UNABLE TO WRITE TO FILE', __filename))
        };

        res.status(200).json({ message: 'Article deleted!'})
      });
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  });
})

export { articlesRouter };