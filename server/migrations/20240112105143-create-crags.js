const DataTypes = require('sequelize').DataTypes

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('crags', {
      cragName: {
        type: DataTypes.STRING,
        field: 'crag_name',
        allowNull: false
      },
      location: {
        type: DataTypes.STRING,
        field: 'location'
      },
      country: {
        type: DataTypes.STRING,
        field: 'country'
      },
      osx: {
        type: DataTypes.STRING,
        field: 'osx',
        allowNull: false
      },
      osy: {
        type: DataTypes.STRING,
        field: 'osy',
        allowNull: false
      },
      ukcUrl: {
        type: DataTypes.STRING,
        field: 'ukc_url'
      },
      rockType: {
        type: DataTypes.STRING,
        field: 'rock_type'
      },
      routes: {
        type: DataTypes.STRING,
        field: 'routes'
      },
      faces: {
        type: DataTypes.STRING,
        field: 'faces'
      },
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('crags');
  },
};