import { Injectable } from '@nestjs/common';

const bcrypt = require('bcrypt');

@Injectable()
export class HashService {

  saltRounds: number;

  constructor(){
    this.saltRounds = Number(process.env.BCRYPT_SALTROUNDS);
  }

  // Using worker_threads for non-blocking
  public async hashPassword(plainText: string): Promise<string>{
    return new Promise((rs, rj) => {
      bcrypt.hash(plainText, this.saltRounds, function(err, hash) {
        if(err) return rj(err)
        return rs(hash)
      });
    })
  }

  // Using worker_threads for non-blocking
  public async comparePassword(plainText: string, hash: string): Promise<boolean>{
    return new Promise((rs, rj) => {
      bcrypt.compare(plainText, hash, function(err, result) {
        if(err) return rj(err)
        return rs(result);
      });
    })
  }
}


