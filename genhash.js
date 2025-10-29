import bcrypt from 'bcrypt';

const password = 'ABcd123!';
const hash = bcrypt.hashSync(password, 10);

console.log(hash);