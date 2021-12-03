var WebSocketClient = require('websocket').client;
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const PORT = process.env.PORT || 5000;
const path = require('path')



var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: " + message.utf8Data );
            var messageData = JSON.parse(message.utf8Data).result;
            for (let i in messageData) {
                if (messageData[i].t){
                    var t = messageData[i].t;
                    var v = messageData[i].v;
                    var c = messageData[i].c;
                    var h = messageData[i].h;
                    var l = messageData[i].l;
                    var o = messageData[i].o;
                    try {
                        const insertingval =  pool.query("INSERT INTO variables (t,v,c,h,l,o) VALUES($1,$2,$3,$4,$5,$6)",
                        [t,v,c,h,l,o]);
                    } catch (err) {
                        console.error(err.message);
                    }
                }
                 
              }
            
            
        }
    });
    
    function sendData() {
        if (connection.connected) {
            var datavar = {"time" : 123456,"channel" : "futures.candlesticks", "event": "subscribe", "payload" : ["1m","BTC_USD"]};
            connection.sendUTF(JSON.stringify(datavar));
        }
    }
    sendData();
});

client.connect('wss://fx-ws.gateio.ws/v4/ws/btc');



///////////////////////////////////////////////////////////////////////////

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./frontend/build"));
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "frontend/build")))
}


app.get('/api/data', async(req,res) => {
    try {
        const allData = await pool.query("select * from variables");
        res.json(allData.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// app.get('*',(req,res) => {
//     res.sendFile(path.join(__dirname,"frontend/build/index.html"))
// })
app.listen(PORT,() => {
    console.log("server has started on port "+PORT)
})