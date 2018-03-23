const bycrypt = require('bcrypt');

const to = (promise) => promise.then(r => [null, r]).catch(err => [err]);
const saltRounds = 10;

module.exports.hashPassword = async (password) => to(bycrypt.hash(password, saltRounds))
module.exports.comparePassword = async (password, hash) => to(bycrypt.compare(password, hash))
