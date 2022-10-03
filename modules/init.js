const db = require("./db");
var fs = require('fs');


async function rm_all_tokens() {

    const db_cadastro = await db.selectCustomers();

    fs.readdirSync("tokens").forEach(file => {
        let bool = false;

        for (var i = 0; i <= db_cadastro.length - 1; i++) {
            if (file == db_cadastro[i].id_bot) {
                bool = true;
            }
        }
        if (bool == false) {
            token = "tokens/" + file;
            fs.rmSync(token, { recursive: true, force: true });
        }

    });
     
}

function initialize_all() {

    fs.readdirSync("tokens").forEach(file => {
        console.log(file);
    });

}



module.exports = { rm_all_tokens, initialize_all }