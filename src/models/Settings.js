import { DataTypes, Model } from 'sequelize'

export function initSettings(sequelize) {
  class Settings extends Model {}

  Settings.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        defaultValue: 1
      },
      theme: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pomodoro'
      },
      minutes: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '25:00:5:00'
      },
      loops: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      freesoundApiKey: {
        type: DataTypes.STRING,
        allowNull: true
      },
      debugMode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Settings',
      tableName: 'settings',
      timestamps: true
    }
  )

  return Settings
}
