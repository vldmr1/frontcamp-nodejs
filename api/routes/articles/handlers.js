import mongoose from 'mongoose';
import { Article } from '../../models/index.js';
import { checkAuthentication } from '../../../middleware/index.js';

const processGetArticlesListReq = (req, res, next) => {
  Article
    .find()
    .select('_id source author title description url urlToImage publishedAt content')
    .then(doc => {
      res.status(200);
      req.data = doc;
      next();
    })
    .catch(() => {
      const err = new Error('Error processing request');
      err.status = 500;
      next(err);
    });
}

const processGetArticleReq = (req, res, next) => {
  Article
    .findById(req.params.id)
    .then(doc => {
      res.status(200)
      req.data = doc;
      next();
    })
    .catch(() => {
      const err = new Error(`Error processing GET request for ID ${req.params.id}`);
      err.status = 404;
      next(err);
    });
};

const processCreateArticleReq = (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    ...req.body
  });
  article
    .save()
    .then(data => {
      res.status(201);
      req.data = {
          message: 'Article added!',
          article: data,
      };
      next();
    })
    .catch((error) => {
      console.log(error);
      const err = new Error('Failed to load article');
      err.status = 500;
      next(err);
      }
    );
};

const processUpdateArticleReq = (req, res, next) => {
  Article
    .update(
      { _id: req.params.id },
      { $set: {...req.body} },
    )
    .then(response => {
      if (!response.nModified) {
        const err = new Error(`No article with id of ${req.params.id}`);
        err.status = 400;
        next(err);
      }
      res.status(200)
      req.data = {
        message: 'Article updated!',
        response
      };
      next();
    })
    .catch(() => {
      const err = new Error('Error updating article');
      err.status = 500;
      next(err);
    });
};

const processDeleteArticleReq = (req, res, next) => {
  Article
    .remove({ _id: req.params.id })
    .then(response => {
      if (!response.deletedCount) {
        const err = new Error(`No article with id of ${req.params.id}`);
        err.status = 400;
        next(err);
      }
      res.status(200);
      req.data = {
        message: 'Article deleted!'
      };
      next();
    })
    .catch(() => {
      const err = new Error('Failed to delete article');
      err.status = 500;
      next(err);
    });
};

const sendDataToClient = (req, res) =>
  res
    .type('json')
    .send(req.data);


export const getArticlesListHandler = [
  processGetArticlesListReq,
  sendDataToClient,
];

export const getArticleHandler = [
  processGetArticleReq,
  sendDataToClient,
];

export const createArticleHandler = [
  checkAuthentication,
  processCreateArticleReq,
  sendDataToClient
];

export const updateArticleHandler = [
  checkAuthentication,
  processUpdateArticleReq,
  sendDataToClient
];

export const deleteArticleHandler = [
  checkAuthentication,
  processDeleteArticleReq,
  sendDataToClient
];