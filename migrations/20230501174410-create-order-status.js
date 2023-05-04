'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderStatuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      Order_Id: {
        type: Sequelize.INTEGER
      },
      Driver_Id: {
        type: Sequelize.INTEGER
      },
      Order_Completed_time: {
        type: Sequelize.STRING
      },
      Order_Status: {
        type: Sequelize.ENUM(['0', '1', '2']),
        comment: "0->Pending\n1->Accepted\n2->Completed"
      },
      Order_Assign: {
        type: Sequelize.ENUM(['0', '1']),
        comment: "0->No-Assign\n1->Assign"
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
    await queryInterface.dropTable('OrderStatuses');
  }
};