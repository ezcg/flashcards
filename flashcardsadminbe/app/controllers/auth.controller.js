const db = require("../models");
const User = db.user;
let jwt = require("jsonwebtoken");
const roles = require("../config/roles.config");

//const google = require('googleapis').google;

// Google's OAuth2 client
//const OAuth2 = google.auth.OAuth2;

const config = require("../config/auth.config");
/*
 For use with google Oauth2.
 Create user if not found and/or sign user in and return bearer token.
 */
exports.signin = (req, res) => {

  try {
    let googleId = req.body.sub
    let user = {};
    User.findOne({raw:true, where: {googleId: googleId}})
    .then(async user => {
      if (!user) {
        let username = req.body.name.replace(/[^\x00-\x7F]/g, "");
        username = username.replace(/ /g, "_");
        user = await User.create({
          username: username,
          name:req.body.name,
          imageUrl:req.body.imageUrl,
          googleId:googleId,
          role:1
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: (86400 * 360)
      });

      let authorities = [];
      for(let roleName in roles) {
        let role = roles[roleName];
        if ((role & user.role) === role) {
          authorities.push("ROLE_" + roleName.toUpperCase());
        }
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        name: user.name,
        roles: authorities,
        accessToken: token
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

  } catch (e) {
    res.status(500).send({ message: err.message });
  }

}
