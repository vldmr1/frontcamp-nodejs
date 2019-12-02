import { Article } from '../../../components/index.js';
import { readData, writeData } from '../../../data/dataInstruments.js';

const articlesDataPath = './data/articles.json';

const readArticlesFromDb = async (req, res, next) => {
  const data = await readData(articlesDataPath)
    .catch(err => next(err));

  req.data = data;
  next();
};

const writeArticlesToDb = async (req, res, next) => {
  const data = JSON.stringify(req.updatedArticles, null, 2);
  await writeData(articlesDataPath, data)
    .catch(err => next(err));

  next();
};

const processGetArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticle = parsedData.find((article) => article.id === +req.params.id);

  if (requestedArticle) {
    res.status(200);
    req.data = requestedArticle;
    next();
  } else {
    const err = new Error('Article not found!');
    err.status = 400;
    next(err);
  }
};

const processCreateArticleReq = (req, res, next) => {
  const newArticle = new Article(req.body);
  req.updatedArticles = [...JSON.parse(req.data), newArticle];

  res.status(201);
  req.data = {
    message: 'Article added!',
    article: newArticle
  };

  next();
};

const processUpdateArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

  if (requestedArticleIndex !== -1) {
    parsedData[requestedArticleIndex] = {...parsedData[requestedArticleIndex], ...req.body};
    req.updatedArticles = parsedData;

    res.status(202);
    req.data = {
      message: 'Article updated!',
      data: parsedData[requestedArticleIndex],
    };

    next();
  } else {
    const err = new Error('Article not found!');
    err.status = 400;
    next(err);
  }
};

const processDeleteArticleReq = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const requestedArticleIndex = parsedData.findIndex((article) => article.id === +req.params.id);

  if (requestedArticleIndex !== -1) {
    const deletedArticle = parsedData.splice(requestedArticleIndex, 1);
    req.updatedArticles = parsedData;

    res.status(200);
    req.data = {
      message: 'Article deleted!',
      deletedArticle,
    };

    next();
  } else {
    const err = new Error('Article not found!');
    err.status = 400;
    next(err);
  }
};

const sendDataToClient = (req, res) =>
  res
    .type('json')
    .send(req.data);


export const getArticlesListHandler = [
  readArticlesFromDb,
  sendDataToClient
];

export const getArticleHandler = [
  readArticlesFromDb,
  processGetArticleReq,
  sendDataToClient,
];

export const createArticleHandler = [
  readArticlesFromDb,
  processCreateArticleReq,
  writeArticlesToDb,
  sendDataToClient
];

export const updateArticleHandler = [
  readArticlesFromDb,
  processUpdateArticleReq,
  writeArticlesToDb,
  sendDataToClient
];

export const deleteArticleHandler = [
  readArticlesFromDb,
  processDeleteArticleReq,
  writeArticlesToDb,
  sendDataToClient
];