import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {

  // expire time of created token
  exp: number = 60 * 60 * 24; // 1 days

  constructor(){}

  public generate(objectData: Object, exp?: number): string{
    let generatedJWT = jwt.sign(
      {data: objectData}, 
      process.env.HASH_JWT_SECRET,
      {expiresIn: (exp) ? exp : this.exp}
    );
    return generatedJWT
  }

  public decode(inputJWT: string): Promise<object>{
    return new Promise(function(rs, rj){
      jwt.verify(inputJWT, process.env.HASH_JWT_SECRET, function(err, decoded) {
        if(err) rs({error: true, message: "Invalid token"});
        return rs(decoded);
      });
    })
  }
  
}
