import bcrypt from 'bcrypt';

const matchPassword = async function (enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

const createHash = async function (password) {
  console.log('password =====> ', password);
  const salt = await bcrypt.genSalt(4);
  const hashed = await bcrypt.hash(password, salt);
  console.log('hashed =====> ', hashed);
  return hashed;
};

export { matchPassword, createHash };
