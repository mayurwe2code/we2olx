import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export  function imageSave(img_path, img_name, baseUrl) {
  return new Promise(async(resolve,reject)=>{
    if(img_path.trim() && img_name.trim() && baseUrl.trim()){
    let img_num = Math.floor(100000 + Math.random() * 900000);
    try {
        if(['.png', '.jpeg', '.jpg'].includes(path.extname(img_name))){
            let imgName = img_name.replaceAll(".",`${img_num}.`)
        
            const folderPath = path.join(__dirname, `../../public/${img_path}/`);
            const filePath = path.join(folderPath, `${imgName}`);
             fs.writeFileSync(filePath, baseUrl, 'base64');
            // console.log(imgsave);
        let pathImg = `/${img_path}/${imgName}`
        resolve({status: true, message:'image save successfully',image_path:pathImg,image_name:imgName});
        }else{
            reject({statusCode:200,status:false,message:"accept only- jpg, png, jpeg, file"})
        } 
    } catch (error) {
        console.log(error)
        reject({status:false, message:'find error',error}) 
    }
}else{
    reject({status:false, message:'bad request',error}) 
}
  })
}