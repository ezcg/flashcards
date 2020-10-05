const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Roles = require("../config/roles.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.validatedUserId = decoded.id;
    let userObj = await User.findOne({where:{ id: req.validatedUserId}});
    if (!userObj) {
      return res.status(401).send({message: "Did not find a row in users table with userId:" + req.validatedUserId});
    } else {
      req.validatedAccessLevel = userObj.role;
      if (req.validatedAccessLevel === 0) {
        return res.status(401).send({message: "You no longer have access to anything because you have been banned."});
      } else {
        next();
      }
    }
  });
};

isAdmin = (req, res, next) => {
  if (!(Roles.admin & req.validatedAccessLevel)) {
    return res.status(401).send({message: "'admin' role required to access this. "});
  }
  next();
};

isModerator = (req, res, next) => {
  if (!(Roles.moderator & req.validatedAccessLevel)) {
    return res.status(401).send({message: "'moderator' role or more required to access this. "});
  }
  next();
};
isModeratorOrAdmin = isModerator;

// isModeratorUser = (req, res, next) => {
//   if (!(Roles.moderator_user & req.validatedAccessLevel)) {
//     return res.status(401).send({message: "'moderator_user' role or more required to access this. "});
//   }
//   next();
// };

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  // isModeratorUser: isModeratorUser,
};
module.exports = authJwt;
