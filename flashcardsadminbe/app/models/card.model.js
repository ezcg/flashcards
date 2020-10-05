module.exports = (sequelize, Sequelize) => {
  const Card = sequelize.define("card", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: {
      type: Sequelize.STRING
    },
    answer: {
      type: Sequelize.STRING
    },
    tutorialId: {
      type: Sequelize.INTEGER
    },
    published: {
      type: Sequelize.INTEGER
    },
    rank: {
      type: Sequelize.INTEGER
    }
  });

  return Card;
};
