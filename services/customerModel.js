const db = require('../db/connection');

exports.getCustomerByName = async (name) => {
    const result = await db.query(
        'SELECT * FROM sinapsisprueba.customers WHERE name = ? AND deleted = 0', [name]
    )
    return result[0];
}