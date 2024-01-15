import {
  Association,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize'
import type { Crag } from './Crag'

type ClimbingTypeAssociations = 'crags'

export class ClimbingType extends Model<
  InferAttributes<ClimbingType, {omit: ClimbingTypeAssociations}>,
  InferCreationAttributes<ClimbingType, {omit: ClimbingTypeAssociations}>
> {
  declare climbingType: string
  // declare id: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // ClimbingType belongsToMany Crag (as Crag)
  declare crags?: NonAttribute<Crag[]>
  declare getCrags: BelongsToManyGetAssociationsMixin<Crag>
  declare setCrags: BelongsToManySetAssociationsMixin<Crag, number>
  declare addCrag: BelongsToManyAddAssociationMixin<Crag, number>
  declare addCrags: BelongsToManyAddAssociationsMixin<Crag, number>
  declare createCrag: BelongsToManyCreateAssociationMixin<Crag>
  declare removeCrag: BelongsToManyRemoveAssociationMixin<Crag, number>
  declare removeCrags: BelongsToManyRemoveAssociationsMixin<Crag, number>
  declare hasCrag: BelongsToManyHasAssociationMixin<Crag, number>
  declare hasCrags: BelongsToManyHasAssociationsMixin<Crag, number>
  declare countCrags: BelongsToManyCountAssociationsMixin

  declare static associations: {
    crags: Association<ClimbingType, Crag>
  }


  static initModel(sequelize: Sequelize): typeof ClimbingType {
    ClimbingType.init({
      climbingType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      // id: {
      //   type: DataTypes.UUID,
      //   primaryKey: true,
      //   autoIncrement: true,
      //   unique: true,
      //   allowNull: false,
      // },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize
    })

    return ClimbingType
  }
}