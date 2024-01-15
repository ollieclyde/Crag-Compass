const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('crags', {
      fields: ['id'],
      type: 'foreign key',
      name: 'crags_id_fkey',
      references: {
        table: 'climbing_types',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('crags', 'crags_id_fkey')
  }
};