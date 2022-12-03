const db = require("./db");
const index = require("../index");
var fs = require('fs');


async function rm_all_tokens() {

    const db_cadastro = await db.selectCustomers();

    fs.readdirSync("./tokens").forEach(file => {
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

async function initialize_all() {

    const db_cadastro = await db.selectCustomers();

    fs.readdirSync("./tokens").forEach(file => {

        for (var i = 0; i <= db_cadastro.length - 1; i++) {
            if (file == db_cadastro[i].id_bot) {
                index.whatsapp_venom(db_cadastro[i].id,file);
            }
        }

    });

}



module.exports = { rm_all_tokens, initialize_all }
