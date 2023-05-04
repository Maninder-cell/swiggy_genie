'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      user_id: {
        type: Sequelize.STRING
      },
      Order_Id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      Driver_Id: {
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
      Order_Created_time: {
        type: Sequelize.STRING
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
      pickup_latitude: {
        type: Sequelize.DECIMAL
      },
      pickup_longitude: {
        type: Sequelize.DECIMAL
      },
      delivery_latitude: {
        type: Sequelize.DECIMAL
      },
      delivery_longitude: {
        type: Sequelize.DECIMAL
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