// Genera el hash bcrypt para ADMIN_PASSWORD_HASH.
// Uso: npx tsx scripts/hash-password.ts "la-contraseña-elegida"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Uso: npx tsx scripts/hash-password.ts "la-contraseña-elegida"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});
