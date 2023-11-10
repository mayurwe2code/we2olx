import connection from "../../Db.js";

export const queryListen = async (query = "", data = "") => {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log(result);
                resolve(result);
            }
        });
    });
};
export const queryListen1 = async (query,values) => {
    return new Promise((resolve, reject) => {
        connection.query(query,values, (error, result) => {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log(result);
                resolve(result);
            }
        });
    });
};