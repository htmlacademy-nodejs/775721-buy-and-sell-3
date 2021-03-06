'use strict';

const {Router} = require(`express`);

const {HttpStatusCode} = require(`../../constants`);
const {isRequestDataValid} = require(`../middlewares/is-request-data-valid`);
const {isRequestParamsValid} = require(`../middlewares/is-request-params-valid`);
const {isUserAuthorized} = require(`../middlewares/is-user-authorized`);
const {isCommentExists} = require(`../middlewares/is-comment-exists`);
const {isCommentBelongsToUser} = require(`../middlewares/is-comment-belongs-to-user`);
const {commentDataSchema, commentParamsSchema} = require(`../schema/comment`);

const Route = {
  INDEX: `/`,
  COMMENT: `/:commentId`,
};

const createCommentRouter = ({commentService, logger}) => {
  const router = new Router({mergeParams: true});
  const isRequestParamsValidMiddleware = isRequestParamsValid({schema: commentParamsSchema, logger});
  const isRequestDataValidMiddleware = isRequestDataValid({schema: commentDataSchema, logger});
  const isUserAuthorizedMiddleware = isUserAuthorized({logger});
  const isCommentExistsMiddleware = isCommentExists({logger, service: commentService});
  const isCommentBelongsToUserMiddleware = isCommentBelongsToUser({logger, service: commentService});

  router.get(Route.INDEX, async (req, res, next) => {
    const {offerId} = req.params;

    try {
      const comments = await commentService.findAll(offerId);

      res.status(HttpStatusCode.OK).json(comments);
    } catch (error) {
      next(error);
    }
  });

  router.post(Route.INDEX, [isUserAuthorizedMiddleware, isRequestDataValidMiddleware], async (req, res, next) => {
    const {userId} = res.locals;
    const {offerId} = req.params;
    const {text} = req.body;

    try {
      const newComment = await commentService.create({userId, offerId, text});

      res.status(HttpStatusCode.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  });

  router.delete(Route.COMMENT, [
    isUserAuthorizedMiddleware,
    isRequestParamsValidMiddleware,
    isCommentExistsMiddleware,
    isCommentBelongsToUserMiddleware,
  ], async (req, res, next) => {
    const {commentId} = req.params;

    try {
      const deletedComment = await commentService.delete(commentId);

      return res.status(HttpStatusCode.OK).json(deletedComment);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

exports.createCommentRouter = createCommentRouter;
