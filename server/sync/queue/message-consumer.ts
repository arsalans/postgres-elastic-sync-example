'use strict';

let stompit = require('stompit');
import {DecoratedQueueObject} from "./decorated-queue-object";
import {elasticRequestRouter} from "../elastic/elastic-request-router";
let logger = require("../../logger");

class MessageConsumer {

  constructor(ip: string, port: number, username: string, password: string, destination: string) {
    let connectOptions = {
      'host': ip,
      'port': port,
      'connectHeaders': {
        'host': '/',
        'login': username,
        'passcode': password,
        'heart-beat': '5000,5000'
      }
    };

    stompit.connect(connectOptions, function (error, client) {

      if (error) {
        logger.error('connect error ' + error.message);
        return;
      }

      logger.info("Message Consumer Connected.");

      let subscribeHeaders = {
        'destination': destination,
        'ack': 'client-individual'
      };

      client.subscribe(subscribeHeaders, function (error, message) {

        if (error) {
          logger.error('subscribe error ' + error.message);
          return;
        }

        console.log("this callback function is invoked whenever our a client receives a message body = " + message);

        message.readString('utf-8', function (error, body) {

          if (error) {
            logger.error('read message error ' + error.message);
            return;
          }

          logger.debug('received message: ' + body);
          //do router logic here based on insert/update and delete
          let decoratedQueueObject: DecoratedQueueObject = DecoratedQueueObject.fromJson(body);
          logger.debug("decoratedQueueObject.getObjectId = " + decoratedQueueObject.getObjectId);
          logger.debug("decoratedQueueObject.getIndex = " + decoratedQueueObject.getIndex);
          logger.debug("decoratedQueueObject.getObject = " + JSON.stringify(decoratedQueueObject.getObject));
          logger.debug("decoratedQueueObject.getRequestType = " + decoratedQueueObject.getRequestType);

          // elasticRequestRouter(decoratedQueueObject.getObjectId, decoratedQueueObject.getRequestType, decoratedQueueObject.getObject, decoratedQueueObject.getIndex)
          //   .then(function (fullfill, reject) {
          //     console.log("************Acknowledging **************");
          //     client.ack(message)
          //   })
          //   .catch(function (error) {
          //     console.log("Error: Can't handle message received, NACKing");
          //     console.log(error);
          //     client.nack(message);
          //   });
          //client.ack(message);

          let p1 = elasticRequestRouter(decoratedQueueObject.getObjectId, decoratedQueueObject.getRequestType, decoratedQueueObject.getObject, decoratedQueueObject.getIndex);

          p1.then(() => {
            logger.info("************Acknowledging **************");
            client.ack(message)
          }).catch((error) => {
            logger.error("Error received while posting to elastic search, can't consume the message.", error);
            client.nack(message);
          });
        });
      });
    });
  }
}

let messageConsumer: MessageConsumer = new MessageConsumer('127.0.0.1', 61613, 'user', 'pw', '/queue/queue1');
export = messageConsumer;

