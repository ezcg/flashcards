module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("categories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category: {
      type: Sequelize.STRING
    },
    parentId: {
      type: Sequelize.INTEGER
    }
  });

  return Categories;
};