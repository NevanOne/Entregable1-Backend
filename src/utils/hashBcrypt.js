const bcrypt = require('bcrypt');

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

module.exports = { 
    createHash,
    isValidPassword
};
