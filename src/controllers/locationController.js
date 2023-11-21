import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getLocations(req,res) {
    let {state,district}=req.query
    if(district!=""){
        state="";
    }
    console.log(__dirname);
    // return false
    try {
        const data = await fs.readFile(`${path.join(__dirname,"../")}/assets/locations.json`, 'utf8');
        const jsonData = JSON.parse(data);

        if(state.trim()!=""){
           let states = jsonData["states"];
           for (let index = 0; index < states.length; index++) {
            const obj_state_dist = states[index];

            if(obj_state_dist.state == state.trim()){
                res.status(200).json({ "statusCode": 200, "status": true, "statusText": "ok", "response": obj_state_dist });
                break;
            }  
            if(index==states.length-1){
                res.status(200).json({ "statusCode": 200, "status": true, "statusText": "ok", "response": [] });
            } 
           }
        }else{
            if(district!=""){
                const data = await fs.readFile(`${path.join(__dirname,"../")}/assets/pinArea.json`, 'utf8');
                console.log(data)
                const jsonData = await JSON.parse(data);
                const resData = jsonData[district]
                resData["District"]=district;
                res.status(200).json({ "statusCode": 200, "status": true, "statusText": "ok", "response": resData });
            }else{
            res.status(200).json({ "statusCode": 200, "status": true, "statusText": "ok", "response": jsonData });
            }
        }
        
      } catch (err) {
        console.error('Error reading JSON file:', err);
        res.status(200).json({ "statusCode": 200, "status": false, "statusText": "find some error", "response": [] });
      }
}