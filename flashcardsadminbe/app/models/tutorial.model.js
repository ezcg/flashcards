module.exports = (sequelize, Sequelize) => {
  const Tutorial = sequelize.define("tutorial", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    subcategory: {
      type: Sequelize.STRING
    },
    canDrillIt: {
      type: Sequelize.INTEGER
    }

  });
  return Tutorial;
};
