import { DataTypes, Model } from 'sequelize'

export function initTimestamp(sequelize) {
  class Timestamp extends Model {}

  Timestamp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'sessions', key: 'id' },
        onDelete: 'SET NULL'
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds'
      },
      type: {
        type: DataTypes.ENUM('pomodoro', 'short_break', 'long_break'),
        allowNull: false,
        defaultValue: 'pomodoro'
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Timestamp',
      tableName: 'timestamps',
      timestamps: true
    }
  )

  return Timestamp
}
