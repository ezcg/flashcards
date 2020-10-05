module.exports = (sequelize, Sequelize) => {
  const NumAction = sequelize.define("num_action", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    yyyymmdd: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    num: {
      type: Sequelize.INTEGER
    }
  });
  return NumAction;
};
