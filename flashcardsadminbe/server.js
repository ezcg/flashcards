const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require('./app/services/logger');
const app = express();

let corsOptions = {
  origin: ["http://localhost:8081", "http://flashcardsadminfe.ezcg.com", "https://flashcardsadminfe.ezcg.com"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// log requests
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  let str = req.method + " " + req.originalUrl + " ";
  if (req.method === 'GET' && Object.values(req.query).length) {
    str+= JSON.stringify(req.query);
  } else if (Object.values(req.body).length && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')){
    let dataArr = {};
    for(let i in req.body) {
      let value = req.body[i];
      if (value && value.length > 400) {
        value = value.substr(0,400) + " __TRUNCATED__";
      }
      dataArr[i] = value;
    }
    str+= JSON.stringify(dataArr);
  }
  logger.log('info', str);
  next();
});

if (process.env.ENVIRONMENT !== 'dev') {
  const db = require("./app/models");
  // force: true will drop the table if it already exists
  db.sequelize.sync({force: false}).then(() => {
    //initial();
    logger.log('info',"db.sequelize.sync run");
  });
}

// const dbConfig = require("./app/config/db.config.js");
// console.log("db prod configs", dbConfig);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

require("./app/routes/tutorial.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.log('info',`Server is running on port ${PORT}.`);
  logger.log('info',`Environment is ${process.env.ENVIRONMENT}.`);
});

function initial() {
//   for(let roleName in Roles) {
//     Role.create({
//       id: Roles[roleName],
//       name: roleName
//     });
//   }
}



process.on('uncaughtException', function (err) {
  logger.log('error',(new Date).toUTCString() + ' uncaughtException:', err.message)
  logger.log('error', err.stack)
})
