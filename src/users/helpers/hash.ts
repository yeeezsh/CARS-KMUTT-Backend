import { genSalt, compare, hash } from 'bcrypt';

const saltRounds = 10;

export class Hash {

    encrypt(plaintext: string): Promise<string> {
        return genSalt(saltRounds, (err, salt) => {
            if (err) { throw err; }
            hash(plaintext, salt, (errx, hash: string) => {
                if (err || errx) { throw err || errx; }
                return hash;
            });
        });
    }

    compare(plaintext: string, hashed: string): Promise<boolean> {
        return compare(plaintext, hashed, (err, res) => {
            if (err) { throw err; }
            return res;
        });
    }

}
