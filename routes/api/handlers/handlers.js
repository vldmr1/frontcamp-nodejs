import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Article } from '../../../components/index.js';
import fs, { read, write } from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const articlesDataPath = path.join(__dirname, '..', '..', '..', 'data', 'data.json');

const readArticlesFromFile = (req, res, next) => {
  fs.readFile(articlesDataPath, 'utf8', (err, data) => {
    if (err) {
      return next(new Error('UNABLE TO READ FILE', __filename));
    };

    req.data = data;
    next();
  });
};

const writeDataToFile = (req, res, next) => {
  fs.writeFile(articlesDataPath, JSON.stringify(req.updatedArticles, null, 2), (err) => {
    if (err) {
      return next(new Error('UNABLE TO WRITE TO FILE', __filename));
    };

    next();
  });
}

export const getArticlesListHandler = [
  readArticlesFromFile,
  (req, res) => {
    res.status(200).send(req.data);
  }
]

export const getArticleHandler = [
  readArticlesFromFile,
  (req, res, next) => {
    const parsedData = JSON.parse(req.data);
    const requestedArticle = parsedData.find((article) => article.id === +req.params.id);

    if (requestedArticle) {
      req.requestedArticle = requestedArticle;
      next();
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  },
  (req, res) => {
    res.status(200).json(req.requestedArticle);
  }
]

export const createArticleHandler = [
  readArticlesFromFile,
  (req, res, next) => {
    const {
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
    } = req.body;

    const newArticle = new Article(author, title, description, url, urlToImage, publishedAt);
    req.updatedArticles = [...JSON.parse(req.data), newArticle];
    next();
  },
  writeDataToFile,
  (req, res) => {
    res.status(200).json({ message: 'Article added!'});
  }
]

export const updateArticleHandler = [
  readArticlesFromFile,
  (req, res, next) => {
    const parsedData = JSON.parse(req.data);
    const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

    if (requestedArticleIndex !== -1) {
      parsedData[requestedArticleIndex] = {...parsedData[requestedArticleIndex], ...req.body};
      req.updatedArticles = parsedData;
      next();
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  },
  writeDataToFile,
  (req, res) => {
    res.status(200).json({ message: 'Article updated!'});
  }
]

export const deleteArticleHandler = [
  readArticlesFromFile,
  (req, res, next) => {
    const parsedData = JSON.parse(req.data);
    const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

    if (requestedArticleIndex !== -1) {
      parsedData.splice(requestedArticleIndex, 1);
      req.updatedArticles = parsedData;
      next();
    } else {
      res.status(400).json({ message: 'Article not found!'});
    }
  },
  writeDataToFile,
  (req, res) => {
    res.status(200).json({ message: 'Article deleted!'});
  }
]