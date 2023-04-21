'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Pickup_from: {
        type: Sequelize.STRING
      },
      Deliver_To: {
        type: Sequelize.STRING
      },
      Add_Task_details: {
        type: Sequelize.STRING
      },
      Instruction: {
        type: Sequelize.STRING
      },
      feedback: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.STRING
      },
      OrderId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};