const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorial = require("./tutorial.model.js")(sequelize, Sequelize);
db.card = require("./card.model.js")(sequelize, Sequelize);
db.tutorials_num_created = require("./tutorials_num_created.model.js")(sequelize, Sequelize);
db.num_action = require("./num_action.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.hint_categories = require("../models/hint_categories.model.js")(sequelize, Sequelize);
db.categories = require("../models/categories.model.js")(sequelize, Sequelize);

/*
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.user_role = require("../models/user_role.model.js")(sequelize, Sequelize);

db.user_role.belongsToMany(db.user, {
  through: "roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

 */
db.user.hasMany(db.tutorial, {
  foreignKey: "userId"
});
db.tutorial.belongsTo(db.user, {foreignKey: 'userId'});

module.exports = db;
