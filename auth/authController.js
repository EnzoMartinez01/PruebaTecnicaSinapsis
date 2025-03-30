const jwt = require('jsonwebtoken');
const { getCustomerByName } = require('../services/customerModel');

const SECRET_KEY = process.env.SECRET_KEY;

exports.customerLogin = async (req, res) => {
    const { name, password } = req.body;

    const customerArray = await getCustomerByName(name);
    if (!customerArray || customerArray.length === 0) {
        return res.status(401).json({ message: 'User not found or deleted' });
    }

    const customer = customerArray[0];

    if (customer.deleted) {
        return res.status(401).json({ message: 'User is deleted' });
    }

    if (password.trim().toLowerCase() !== customer.name.trim().toLowerCase()) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        { customerId: customer.id },
        SECRET_KEY,
        { expiresIn: '2h' }
    );

    res.json({ token });
};
