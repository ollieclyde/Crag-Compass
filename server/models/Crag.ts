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
import type { ClimbingType } from './ClimbingType'

type CragAssociations = 'climbingTypes'

export class Crag extends Model<
  InferAttributes<Crag, {omit: CragAssociations}>,
  InferCreationAttributes<Crag, {omit: CragAssociations}>
> {
  // declare id: CreationOptional<number>
  declare cragName: string
  declare location: string | null
  declare country: string | null
  declare osx: string | null
  declare osy: string | null
  declare ukcUrl: string | null
  declare rockType: string | null
  declare routes: string | null
  declare faces: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Crag belongsToMany ClimbingType (as ClimbingTypes)
  declare climbingTypes?: NonAttribute<ClimbingType[]>
  declare getClimbingTypes: BelongsToManyGetAssociationsMixin<ClimbingType>
  declare setClimbingTypes: BelongsToManySetAssociationsMixin<ClimbingType, number>
  declare addClimbingType: BelongsToManyAddAssociationMixin<ClimbingType, number>
  declare addClimbingTypes: BelongsToManyAddAssociationsMixin<ClimbingType, number>
  declare createClimbingType: BelongsToManyCreateAssociationMixin<ClimbingType>
  declare removeClimbingType: BelongsToManyRemoveAssociationMixin<ClimbingType, number>
  declare removeClimbingTypes: BelongsToManyRemoveAssociationsMixin<ClimbingType, number>
  declare hasClimbingType: BelongsToManyHasAssociationMixin<ClimbingType, number>
  declare hasClimbingTypes: BelongsToManyHasAssociationsMixin<ClimbingType, number>
  declare countClimbingTypes: BelongsToManyCountAssociationsMixin

  declare static associations: {
    climbingTypes: Association<Crag, ClimbingType>
  }

  static initModel(sequelize: Sequelize): typeof Crag {
    Crag.init({
      // id: {
      //   type: DataTypes.UUID,
      //   primaryKey: true,
      //   autoIncrement: true,
      //   allowNull: false
      // },
      cragName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING(100)
      },
      country: {
        type: DataTypes.STRING(100)
      },
      osx: {
        type: DataTypes.STRING(100)
      },
      osy: {
        type: DataTypes.STRING(100)
      },
      ukcUrl: {
        type: DataTypes.STRING(100)
      },
      rockType: {
        type: DataTypes.STRING(100)
      },
      routes: {
        type: DataTypes.STRING(100)
      },
      faces: {
        type: DataTypes.STRING(100)
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize
    })

    return Crag
  }
}