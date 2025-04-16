import bcrypt from 'bcrypt'

export async function hashPassword(userPassword: string) {
    const combinedPassword = userPassword + process.env.BCRYPT_KEY
    const saltRounds = 10;
    
    return await bcrypt.hash(combinedPassword, saltRounds);
}

export async function comparePassword(userPassword: string, hashedDbPassword: string) {
    const combinedPassword = userPassword + process.env.BCRYPT_KEY;
    
    return await bcrypt.compare(combinedPassword, hashedDbPassword);
}