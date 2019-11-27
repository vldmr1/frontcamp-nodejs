import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Article } from '../../../components/index.js';
import fs from 'fs';
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
};

const processGetArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticle = parsedData.find((article) => article.id === +req.params.id);

  if (requestedArticle) {
    req.message = requestedArticle;
    next();
  } else {
    res.status(400).json({ message: 'Article not found!'});
  }
};

const processCreateArticleReq = (req, res, next) => {
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
  req.message = { message: 'Article added!'};
  next();
};

const processUpdateArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

  if (requestedArticleIndex !== -1) {
    parsedData[requestedArticleIndex] = {...parsedData[requestedArticleIndex], ...req.body};
    req.updatedArticles = parsedData;
    req.message = { message: 'Article updated!'};
    next();
  } else {
    res.status(400).json({ message: 'Article not found!'});
  }
};

const processDeleteArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

  if (requestedArticleIndex !== -1) {
    parsedData.splice(requestedArticleIndex, 1);
    req.updatedArticles = parsedData;
    req.message = { message: 'Article deleted!'};
    next();
  } else {
    res.status(400).json({ message: 'Article not found!'});
  }
};

const sendDataToClient = (req, res) => {
  res.status(200).send(req.message);
};

export const getArticlesListHandler = [
  readArticlesFromFile,
  (req, res) => {
    res.status(200).send(req.data);
  }
];

export const getArticleHandler = [
  readArticlesFromFile,
  processGetArticleReq,
  sendDataToClient,
];

export const createArticleHandler = [
  readArticlesFromFile,
  processCreateArticleReq,
  writeDataToFile,
  sendDataToClient
];

export const updateArticleHandler = [
  readArticlesFromFile,
  processUpdateArticleReq,
  writeDataToFile,
  sendDataToClient
];

export const deleteArticleHandler = [
  readArticlesFromFile,
  processDeleteArticleReq,
  writeDataToFile,
  sendDataToClient
];