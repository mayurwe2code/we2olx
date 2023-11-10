import { queryListen } from "../common/querylistener.js";
export async function test_control(req,res) {
    console.log("1");
    try {
        let response = await queryListen("SELECT * FROM `cities` WHERE id=11111");
        res.send(response);
    } catch (error) {
        // Handle errors here
        res.status(500).send({ error: "An error occurred" });
    }
}
