module.exports = (sequelize, type) => {
    return sequelize.define( 'sessions', {
        id:{
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text:type.STRING
    })
}

