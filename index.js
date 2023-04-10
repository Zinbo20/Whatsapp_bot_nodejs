module.exports = { whatsapp_venom }

const db = require("./modules/db");
const init = require("./modules/init");

init.rm_all_tokens();
init.initialize_all();

(async () => {

    //console.log('Começou!');

    //console.log('SELECT * FROM cadastro');
    const db_cadastro = await db.selectCustomers();
    //console.log(db_cadastro);
})();

const express = require('express');
var cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors());

app.listen(3030, () => console.log("Server is running on port http://127.0.0.1:3030"));

const venom = require('venom-bot');

let sessions = [];

var QRcodes = [];
function my_QRcode(qr, clientId) {
    this.qr = qr;
    this.clientId = clientId;
}

var session_stts = [];
function my_session(status, clientId) {
    this.status = status;
    this.clientId = clientId;
}

app.post("/Cadastro_do_prestador", (req, res) => {

    var milliseconds = new Date().getTime();

    const { nome, whatsapp, boas_vindas } = req.body;
    const prestador = { nome, whatsapp, boas_vindas };

    (async () => {
        try {
            await db.insertCustomer({ id_bot: milliseconds, nome: prestador.nome, whatsapp: prestador.whatsapp, boas_vindas: prestador.boas_vindas });
            const new_prestador = await db.last_insert();
            return res.status(201).json(new_prestador); //id do banco de dados return
        } catch (e) {
            console.error('Error when create: ', e.message); //return object error
            return res.status(500).json("False");
        }
    })();
});

app.post("/update/:prestador_id", (req, res) => {

    const { prestador_id } = req.params;

    const { nome, whatsapp, boas_vindas } = req.body;
    const prestador = { nome, whatsapp, boas_vindas };

    (async () => {
        try {
            update_prestador = await db.find(prestador_id);
            await db.updateCustomer(prestador_id, { id_bot: update_prestador.id_bot, nome: prestador.nome, whatsapp: prestador.whatsapp, boas_vindas: prestador.boas_vindas });//nome: prestador.nome,
            update_prestador = await db.find(prestador_id);
            return res.status(201).json(update_prestador);
        } catch (e) {
            console.error('Error when update: ', e.message); //return object error
            return res.status(500).json("False");
        }
    })();
});


// app.post("/delete/:prestador_id", (req, res) => {

//     const { prestador_id } = req.params;

//     (async () => {
//         try {
//             //await db.deleteCustomer(prestador_id);
//             const itemIndex = sessions.findIndex(obj => obj.session === prestador_id);
//             if (itemIndex > -1) {
//                 client = sessions[itemIndex];
//                 client.getSessionTokenBrowser(true)
//                 client.close();
//                 return res.status(201).json("del and close");
//             }
//             else return res.status(201).json("del and session not found");

//             } catch (e) {
//                 console.error('Error when update: ', e.message); //return object error
//                 return res.status(500).json("False");
//             }

//         })();

// });

app.get("/prestadores", (req, res) => {
    (async () => {
        const db_cadastro = await db.selectCustomers();
        return res.status(200).json(db_cadastro);
    })();
});

app.get("/RequestQR/:prestador_id", (req, res) => {

    const { prestador_id } = req.params;

    (async () => {
        try {
            const prestador = await db.find(prestador_id);
            console.log(prestador);
            if (prestador) {
                const itemIndex = QRcodes.findIndex(obj => obj.clientId === prestador_id);
                if (itemIndex > -1) {
                    var qrcode = QRcodes[itemIndex].qr
                    res.json(qrcode);
                }
                else res.status(404).json("QRcode not found");
            }
            else res.status(404).json("not found");
        } catch (e) {
            console.error('Error when find: ', e.message); //return object error
            return res.status(500).json(e.message);
        }
    })();
});

app.get("/sessions/:prestador_id", (req, res) => {

    const { prestador_id } = req.params;

    (async () => {

        try {

            const prestador = await db.find(prestador_id);
            if (prestador) {
                try {
                    const Index = sessions.findIndex(obj => obj.session == prestador.id_bot);
                    //if (Index > -1) {
                    //    client = sessions[Index];
                    //    const state = await client.getConnectionState();
                    //    //console.log(state);
                    //}
                }
                catch (e) {
                    return res.status(500).json("Disconnected");
                }

                const itemIndex = session_stts.findIndex(obj => obj.clientId === prestador_id);
                if (itemIndex > -1) {
                    var stt = session_stts[itemIndex].status
                    res.json(stt);
                }
                else res.status(404).json("Session Status not found");
            }
            else res.status(404).json("not found");
        } catch (e) {
            console.error('Error when find: ', e.message); //return object error
            return res.status(500).json(e.message);
        }
    })();
});


app.post("/initialize/:prestador_id", (req, res) => {

    const { prestador_id } = req.params;

    (async () => {
        try {
            const prestador = await db.find(prestador_id);
            if (prestador) {
                const itemIndex = QRcodes.findIndex(obj => obj.clientId === prestador.id_bot);
                if (itemIndex > -1) {
                    QRcodes.splice(itemIndex, 1);
                }
            }
            else console.log("not found");
        } catch (e) {
            console.error('Error when find: ', e.message); //return object error
        }

        var milliseconds = new Date().getTime();

        try {
            update_prestador = await db.find(prestador_id);
            await db.updateCustomer(prestador_id, { id_bot: milliseconds, nome: update_prestador.nome, whatsapp: update_prestador.whatsapp, boas_vindas: update_prestador.boas_vindas });
        } catch (e) {
            console.error('Error when update: ', e.message); //return object error
        }

        try {
            const prestador = await db.find(prestador_id);
            if (prestador) {
                whatsapp_venom(prestador.id, prestador.id_bot);
                res.status(200).json("client initialize " + prestador.id_bot);
            }
            else res.status(404).json("not found");
        } catch (e) {
            console.error('Error when find: ', e.message); //return object error
            return res.status(500).json(e.message);
        }
    })();

});

app.post("/envio_de_mensagem", (req, res) => {

    //const { token } = req.params;
    const { id, whatsapp, mensagem } = req.body;
    const envio = { id, whatsapp, mensagem };

    if (sessions.length == 0) return res.status(200).json("0 sessions");

    const itemIndex = sessions.findIndex(obj => obj.session == envio.id);
    if (itemIndex > -1) {
        client = sessions[itemIndex];
        var destino = envio.whatsapp + "@c.us";
        try {
            client.sendText(destino, envio.mensagem);
            var received = new my_received(destino, client.session);
            client_received.push(received);
            return res.status(200).json("Mensagem enviada para " + destino);
        } catch (e) {
            console.error('Error when send: ', e.message);
            return res.status(500).json(e.message);
        }
    }
    else return res.status(404).json("Not found Session");

});

app.get("/token_id/:prestador_id", (req, res) => {

    const { prestador_id } = req.params;

    (async () => {
        try {
            prestador = await db.find(prestador_id);
            if (prestador) {
                return res.status(200).json(prestador.id_bot);
            }
            else return res.status(404).json("not found prestador");
        } catch (e) {
            console.error('Error when find: ', e.message);
            return res.status(500).json(e.message);
        }
    })();

});

var client_received = [];

function my_received(received, prestador_id) {
    this.received = received;
    this.prestador_id = prestador_id;
}

app.post("/resetar_dia", (req, res) => {
    client_received = [];
    return res.status(200).json("Client_received resetado");
});


function whatsapp_venom(id, id_bot) {

    prestador_bot = id_bot.toString();
    prestador_id = id.toString();

    //console.log(prestador_id);
    venom
        .create(
            //session
            prestador_bot, //Pass the name of the client you want to start the bot
            //catchQR
            (base64Qrimg, asciiQR, attempts, urlCode) => {
                //console.log('Number of attempts to read the qrcode: ', attempts);
                //console.log(prestador_id + ' Terminal qrcode:\n', asciiQR);
                //console.log('base64 image string qrcode: ', base64Qrimg);
                //console.log('urlCode (data-ref): ', urlCode);
                var QR = new my_QRcode(base64Qrimg, prestador_id);
                const itemIndex = QRcodes.findIndex(obj => obj.clientId === QR.clientId);
                if (itemIndex > -1) {
                    QRcodes[itemIndex] = QR;
                } else {
                    QRcodes.push(QR);
                }
                //console.log(QRcodes);

            },
            (statusSession, session) => {
                //console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
                //Create session wss return "serverClose" case server for close
                //console.log('Session name: ', prestador_id);
                var stt = new my_session(statusSession, prestador_id);
                const itemIndex = session_stts.findIndex(obj => obj.clientId === stt.clientId);
                if (itemIndex > -1) {
                    session_stts[itemIndex] = stt;
                } else {
                    session_stts.push(stt);
                }

            },
            // options
            {
                multidevice: true, // for version not multidevice use false.(default: true)
                headless: true, // Headless chrome
                logQR: false, // Logs QR automatically in terminal
                disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
                disableWelcome: true, // Will disable the welcoming message which appears in the beginning
                autoClose: 120000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
            },
        )
        .then((client) => {
            start(client);
        })
        .catch((erro) => {
            console.log(erro);
        });
}

function start(client) {

    //console.log("ready");

    sessions.push(client);

    const itemIndex = QRcodes.findIndex(obj => obj.clientId === client.session);
    if (itemIndex > -1) {
        QRcodes.splice(itemIndex, 1);
    }

    // console.log(client);
    // console.log(client.session);

    client.onMessage(async (message) => {

        let bool_msg = false;

        console.log(message.from);

        for (var i = 0; i <= client_received.length - 1; i++) {
            if (message.from == client_received[i].received && client.session == client_received[i].prestador_id) {
                bool_msg = true;
            }
        }

        if (bool_msg == false && message.type == "chat" && message.from != "status@broadcast") {   //&& message.body == '!res'
            //console.log("entrou no bem_vindo")
            // (async () => {
            //console.log("entrou no async");
            try {
                const prestador = await db.find_bot(client.session);
                if (prestador) {
                    client.sendText(message.from, prestador.boas_vindas);
                    client.markUnseenMessage(message.from);
                    var received = new my_received(message.from, client.session);
                    client_received.push(received);
                }
            } catch (e) {
                console.error('Error when sending: ', e.message);
            }

            // })();
        }

        if (message.body == '!Hi' && message.type == "chat") {
            client.sendText(message.from, 'Welcome Venom 🕷')
                .then((result) => {
                    console.log('Result: ', result); //return object success
                })
                .catch((erro) => {
                    console.error('Error when sending: ', erro); //return object error
                });
        }
    });

}






