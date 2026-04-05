import { DataTypes, Model } from 'sequelize'

export function initSession(sequelize) {
  class Session extends Model {}

  Session.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      totalLoops: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      completedLoops: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds'
      },
      status: {
        type: DataTypes.ENUM('running', 'completed', 'stopped', 'cancelled'),
        allowNull: false,
        defaultValue: 'running'
      }
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true
    }
  )

  return Session
}
