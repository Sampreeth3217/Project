const bcrypt = require('bcrypt');
const hash = "$2a$10$y4HigNJ9BGbvH0.z5mNVj.HxF1diQNvPGHPjIdYE96/i0ZEv24gmq"; // Replace with actual hash from MongoDB

bcrypt.compare("SecurePassword123", hash, (err, res) => {
  console.log(res); // Should print true
});
