const mongoose = require('mongoose');

const paramValidator = async (req, res, next) => {
  try {
    if (req.params.id) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send({ message: `Id invalid: ${req.params.id}` });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = paramValidator