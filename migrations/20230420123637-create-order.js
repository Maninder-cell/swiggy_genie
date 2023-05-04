'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      user_id: {
        type: Sequelize.STRING
      },
      order_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      driver_id: {
        type: Sequelize.INTEGER
      },
      pickup_from: {
        type: Sequelize.STRING
      },
      deliver_to: {
        type: Sequelize.STRING
      },
      item_type: {
        type: Sequelize.STRING
      },
      billing_details: {
        type: Sequelize.INTEGER
      },
      instruction: {
        type: Sequelize.STRING
      },
      order_created_time: {
        type: Sequelize.STRING
      },
      order_completed_time: {
        type: Sequelize.STRING
      },
      order_status: {
        type: Sequelize.ENUM(['0', '1', '2']),
        comment: "0->Pending\n1->Accepted\n2->Completed"
      },
      order_assign: {
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