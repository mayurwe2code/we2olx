// import connection from "../../Db";
import { queryListen } from "../common/querylistener.js";

export async function addOrder(req, res) {
    let {product_id}=req.body
    let order_no = Math.random().toString().slice(2, 2 + 4)
    let userData ;
    try {
        userData = await queryListen("SELECT * FROM user WHERE id = "+req.user_id+"") ;
    if(userData.length){
console.log(userData)
    }else{
        res.status(200).json({ "statusCode": 200, "status": false, "statusText": "user not found..!" });
    }
    } catch (error) {
     console.log(error)   
     res.status(200).json({ "statusCode": 200, "status": false, "statusText": "user not found..!" });
    }
    
    try {
        
        const result_1 = await queryListen("`id`, `user_id`, `category_id`, `product_name`, `tag`, `detail`, `description`, `price`, `latitude`, `longitude`, `is_active`, `is_deleted`, `created_on`, `updated_on`,`sold_out`, `pickup_location`, `drop_off_location`, `price_per_hour`, `price_per_day`, `necessary_documents_for_booking`, `currently_avalilabel`, `when_available`,`Fee_after_expiry_of_time_period`, `conditions_and_rules`, `available_on_rent`, `extra_charges_for_wear_and_tear`(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id) AS product_images,(SELECT GROUP_CONCAT(image_path) AS product_images FROM `product_image` WHERE product_id=id AND image_position = 'cover') AS cover_image FROM ad_product WHERE is_active = 1 AND is_deleted=0 AND product_id="+product_id+"");
        
        if (result_1.length) {
            let {id, user_id, category_id, product_name, tag, detail, description, price, latitude, longitude, is_active, is_deleted, created_on, updated_on, sold_out, pickup_location, drop_off_location, price_per_hour, price_per_day, necessary_documents_for_booking, currently_avalilabel, when_available, Fee_after_expiry_of_time_period, conditions_and_rules, available_on_rent, extra_charges_for_wear_and_tear,cover_image,product_images} = result_1[0]
            const result = await queryListen("INSERT INTO `orders_data`(`order_id`, `seller_id`, `coustomer_id`, `product_id`, `order_status`, `order_delivery_status`) VALUES ('" + order_no + "','" + req.user_id + "','" + 0 + "','" + product_id + "')");
            if (result.insertId) {
                
                const order_product_result = await queryListen("INSERT INTO `order_product`(id,user_id,category_id,product_name,tag,detail,description,price,latitude,longitude,is_active,is_deleted,created_on,updated_on, sold_out, pickup_location, drop_off_location, price_per_hour, price_per_day, necessary_documents_for_booking, currently_avalilabel, when_available, Fee_after_expiry_of_time_period, conditions_and_rules, available_on_rent, extra_charges_for_wear_and_tear,cover_image,product_images) VALUES ("+id+","+req.user_id+","+category_id+","+product_name+","+tag+","+detail+","+description+","+price+","+latitude+","+longitude+","+is_active+","+is_deleted+","+created_on+","+updated_on+","+sold_out+", "+pickup_location+", "+drop_off_location+", "+price_per_hour+", "+price_per_day+", "+necessary_documents_for_booking+", "+currently_avalilabel+", "+when_available+", "+Fee_after_expiry_of_time_period+", "+conditions_and_rules+", "+available_on_rent+", "+extra_charges_for_wear_and_tear+","+cover_image+","+product_images+"");
                console.log("order_product_result----"+JSON.stringify(order_product_result))

                try {
                    let notfData = {
                        userDeviceToken: userData[0]["token_for_notification"],
                        notfTitle: "we2olx",
                        notfMsg:`order add successfully order-no ${order_no}`,
                        customData: { data: "no" },
                      };
                      if (userData[0]["token_for_notification"] != "") {
                        sendNotification(notfData);
                      }   
                      
                      
                      let notfDataForDB = {
                        actor_id:req.user_id,
                        actor_type: "user",
                        message: "order placed successfully",
                        status: "unread",
                        notification_title: "we2 olx order",
                        notification_type: "order",
                        notification_type_id: order_no,
                      };
                      setNotification(notfDataForDB);
                      
                } catch (error) {
                   console.log(error);
                }
                res.status(200).json({ "statusCode": 200, "status": true, "statusText": "order placed successfully" });

                
            } else {
                res.status(200).json({ "statusCode": 200, "status": true, "statusText": "order not inserted find error" });
            }
        } else {
            res.status(200).json({ "statusCode": 200, "status": true, "statusText": "order product not found..!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ "statusCode": 500, "status": false, "statusText": "find internal server error" });
    }
};


export async function getOrders(req, res) {
    console.log("getOrders------------------------");
    let query = "SELECT id,user_id,category_id,product_name,tag,detail,description,price,latitude,longitude,is_active,is_deleted, order_product.created_on AS order_product_created_on, order_product.updated_on AS order_product_updated_on, `sold_out`, `pickup_location`, `drop_off_location`, `price_per_hour`, `price_per_day`, `necessary_documents_for_booking`, `currently_avalilabel`, `when_available`, `Fee_after_expiry_of_time_period`, `conditions_and_rules`, `available_on_rent`, `extra_charges_for_wear_and_tear`,cover_image,product_images, order_id,seller_id,coustomer_id,product_id,order_status,order_delivery_status , orders_data.created_on AS order_created_on ,orders_data.updated_on AS order_updated_on, booked_from, booked_to, booking_start_time, booking_end_time, total_amount, gst, sgst, cgst, extra_time_taken_after_the_deadline, extra_charges_for_wear_and_tear_or_taked_more_time, order_type FROM  order_product , orders_data WHERE is_deleted = 0 AND is_active = 1 ";
    try {
    const req_body = req.body;
    const keyArray = Object.keys(req_body) 
    
    const queryMaker = () => {
        return new Promise((resolve,reject)=>{
            keyArray.forEach((key, index) => {
                key = key.trim()
              let  value_ = req_body[key].trim()
                if (value_) {
                    if (key === "search") 
                    {
                        query += ` AND (product_name LIKE '%${value_}%' || tag LIKE '%${value_}%' || category_id LIKE '%${value_}%')`;
                    }
                    if (!["search", "is_deleted", "is_active"].includes(key)) 
                    {
                        query += `AND ${key} = '${value_}'`;
                    }
                }
                if(index === keyArray.length-1){
                    resolve(query)
                }
            })
        })
        
    }; 
  
try {
    console.log('queryMaker----0----query------',query);
     query = await queryMaker();
    // res.send(query);
} catch (error) {
    res.send(error);
}
} catch (error) {
    res.send(error);
}
 try {
        const result = await queryListen(query);
        if (result.length) {
            res.status(200).json({ "statusCode": 200, "status": true, "statusText": "ok", "response": result });
        } else {
            res.status(200).json({ "statusCode": 200, "status": true, "statusText": "order data not found..!", "response": [] });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ "statusCode": 500, "status": false, "statusText": "find internal server error" })
    }
}



export async function orderStatusChange(req, res) {
let req_body = req.body
let req_key_ar = Object.keys(req_body)
let query = "";
req_key_ar.forEach((item,index) => {
    let value_ = req_body.item
    if(value_ && ["order_status"].includes(item)){
        query+= `${item} = '${value_}' ,`
    }
});

let result = await queryListen(`UPDATE orders_data SET ${query.slice(0, -1)} WHERE order_id = '${order_id}' AND seller_id = ${req.user_id} `)

if(result.changedRows){
    res.status(200).json({ "statusCode": 200, "status": true, "statusText": "order status change successfully" })
}else{
    res.status(200).json({ "statusCode": 200, "status": false, "statusText": "failed..!" })
}
}


export function orderDelete(req, res) {

}