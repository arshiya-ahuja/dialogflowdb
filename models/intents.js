module.exports = (sequelize, type) => {
    return sequelize.define('intents', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING
    })
}
