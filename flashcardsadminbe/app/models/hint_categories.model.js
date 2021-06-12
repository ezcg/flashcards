module.exports = (sequelize, Sequelize) => {
  const HintCategory = sequelize.define("hint_categories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hintCategory: {
      type: Sequelize.STRING
    },
    explanation: {
      type: Sequelize.STRING
    }
  });

  return HintCategory;
};