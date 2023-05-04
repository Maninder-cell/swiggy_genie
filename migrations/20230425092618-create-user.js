'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CallingCode:{
        type: Sequelize.STRING
      },
      Phone: {
        type: Sequelize.BIGINT
      },
      Name: {
        type: Sequelize.STRING
      },
      Email: {
        type: Sequelize.STRING
      },
      Address: {
        type: Sequelize.STRING
      },
      account_type: {
        type: Sequelize.ENUM(['0', '1','2']),
        comment: "0->Customer\n1->Driver\n2->Admin"
      },
      tokens: {
        type: Sequelize.STRING
      },
      photoUri: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(['0', '1']),
        comment: "0->Off\n1->On"
      },
      fcmtoken:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('Users');
  }
};