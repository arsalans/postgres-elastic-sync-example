'use strict';
let stompit = require('stompit');
class MessageProducer {
    constructor(ip, port, username, password) {
        this.m_connectOptions = {
            'host': ip,
            'port': port,
            'connectHeaders': {
                'host': '/',
                'login': username,
                'passcode': password,
                'heart-beat': '5000,5000'
            }
        };
    }
    sendMessageToDefaultQueue(messageToPublish) {
        let sendHeaders = {
            'destination': '/queue/queue1',
            'content-type': 'text/plain'
        };
        this.sendMessage(sendHeaders, messageToPublish);
    }
    ;
    sendMessage(sendHeaders, messageToPublish) {
        //Hydrating stomp client object
        // let client = Object.create(Stomp.prototype);
        // Object.assign(client, this.m_stompClient);
        stompit.connect(this.m_connectOptions, function (error, client) {
            console.log("Message Producer Connected.");
            let frame = client.send(sendHeaders);
            frame.write(messageToPublish);
            frame.end();
            client.disconnect();
        });
    }
    ;
}
let messageProducer = new MessageProducer('127.0.0.1', 61613, 'user', 'pw');
module.exports = messageProducer;
//# sourceMappingURL=message-producer.js.map