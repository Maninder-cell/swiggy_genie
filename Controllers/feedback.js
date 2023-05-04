const { validationResult } = require("express-validator");
const db = require("../models");
const Feedback = db.Feedback;

exports.feedBack = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const feedback = await Feedback.create(req.body);

  return res.status(200).json({
    feedback: feedback,
  });
};

exports.listFeedbacks = async (req, res, next) => {
  const feedbacks = await Feedback.findAll({
    where: { submit_by_id: 4 },
  });

  return res.status(200).json({
    feedbacks: feedbacks,
  });
};