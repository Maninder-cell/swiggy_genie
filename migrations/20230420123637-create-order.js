'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      Pickup_from: {
        type: Sequelize.STRING
      },
      Deliver_To: {
        type: Sequelize.STRING
      },
      Item_Type: {
        type: Sequelize.STRING
      },
      Billing_Details: {
        type: Sequelize.INTEGER
      },
      Instruction: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(['0', '1', '2', '3', '4']),
        comment: "0->Pending\n1->Accepted\n2->Completed\n3->Rejected\n4->Cancelled"
      },
      DriverId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Orders');
  }
};