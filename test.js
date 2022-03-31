const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'secret');
const decoded = jwt.verify(token, 'secret');
console.log(decoded)