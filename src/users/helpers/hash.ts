import bcrypt from 'bcrypt';

const saltRounds = 10;

export class Hash {

    encrypt(plaintext: string): string {
        return bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { throw new Error(err); }
            bcrypt.hash(plaintext, salt, (err, hash: string) => {
                if (err) { throw new Error(err); }
                return hash;
            });
        });
    }

    compare(plaintext: string, hash: string): string {
        return bcrypt.compare(plaintext, hash, (err, res) => {
            if (err) { throw new Error(err); }
            return res;
        });
    }

}
