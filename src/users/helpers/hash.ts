import { genSalt, compare, hash } from 'bcryptjs';

const saltRounds = 10;

export class Hash {
  static encrypt(plaintext: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(saltRounds, (err, salt) => {
        if (err) {
          throw err;
        }
        hash(plaintext, salt, (errx, hashed: string) => {
          if (err || errx) {
            reject(err || errx);
          }
          resolve(hashed);
        });
      });
    });
  }

  static compare(plaintext: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(plaintext, hashed, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
}
