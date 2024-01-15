import type { Sequelize, Model } from 'sequelize'
import { Crag } from './Crag'
import { ClimbingType } from './ClimbingType'

export {
  Crag,
  ClimbingType
}

export function initModels(sequelize: Sequelize) {
  Crag.initModel(sequelize)
  ClimbingType.initModel(sequelize)

  Crag.belongsToMany(ClimbingType, {
    as: 'climbingTypes',
    through: 'crags_climbing_types',
    onDelete: 'CASCADE'
  })
  ClimbingType.belongsToMany(Crag, {
    as: 'crags',
    through: 'crags_climbing_types',
    onDelete: 'CASCADE'
  })


  // sequelize.sync({
  //   alter: true,
  // })

  return {
    Crag,
    ClimbingType
  }
}