import jwt from 'jsonwebtoken';
export async function jwtMaker(tokenData) {
    return new Promise((resolve,reject)=>{
        try {
            const token = jwt.sign(tokenData,process.env.ADMIN_JWT_SECRET_KEY); 
            resolve(token)
        } catch (err) {
          reject(err)
        }
    })
  }
  