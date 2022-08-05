const jwt = require('jsonwebtoken');

const BlogModel = require('../models/blogModel');

//------------------------------------------------------------------------------------------//

const authenticate = function (req, res, next) {
  try {
    let token = req.headers['x-api-key'];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: 'token must be present' });

    let decodedToken = jwt.verify(token, 'group-21');
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: 'token is not valid' });

    next();
  } catch (err) {
    res.status(500).send({ Status: false, msg: err.message });
  }
};

//------------------------------------------------------------------------------------------//

const authorise = async function (req, res, next) {
  try {
    token = req.headers['x-api-key'];

    let blogId = req.params.blogId;

    let decodedToken = jwt.verify(token, 'group-21');

    let authorId = decodedToken.authorId;

    let findBlog = await BlogModel.findOne({ authorId: authorId, _id: blogId });

    if (!findBlog)
      return res.status(403).send({
        status: false,
        msg: 'Unauthorized User',
      });

    next();
  } catch (err) {
    res.status(500).send({ Status: false, msg: err.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
