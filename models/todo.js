"use strict";
const { Model, DataTypes } = require("sequelize");

class Todo extends Model {
  static associate(models) {
    // Define associations here
  }

  static addTodo({ title, dueDate }) {
    return this.create({ title, dueDate, completed: false });
  }

  static getTodos() {
    return this.findAll({ order: [["id", "ASC"]] });
  }

  markAsCompleted() {
    return this.update({ completed: true });
  }
}

Todo.init(
  {
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: "Todo",
  }
);

module.exports = Todo;
