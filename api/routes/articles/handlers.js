import Article from '../../models/article.js';
import mongoose from 'mongoose';

const processGetArticlesListReq = (req, res, next) => {
  Article
    .find()
    .then(doc => {
      res.status(200)
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
    .find({ id: req.params.id })
    .then(doc => {
      if (!doc.length) {
        const err = new Error(`No article with id of ${req.params.id}`);
        err.status = 400;
        next(err);
      }

      res.status(200)
      req.data = doc;
      next();
    })
    .catch(() => {
      const err = new Error('Error processing request');
      err.status = 500;
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
    .catch(() => {
      const err = new Error('Failed to load article');
      err.status = 500;
      next(err);
      }
    );
};

const processUpdateArticleReq = (req, res, next) => {
  Article
    .update(
      { id: req.params.id },
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
    .remove({ id: req.params.id })
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
  processCreateArticleReq,
  sendDataToClient
];

export const updateArticleHandler = [
  processUpdateArticleReq,
  sendDataToClient
];

export const deleteArticleHandler = [
  processDeleteArticleReq,
  sendDataToClient
];