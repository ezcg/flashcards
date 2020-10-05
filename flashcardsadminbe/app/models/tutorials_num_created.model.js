module.exports = (sequelize, Sequelize) => {
  const TutorialsNumCreated = sequelize.define("tutorials_num_created", {
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

  },{freezeTableName: true});
  return TutorialsNumCreated;
};
