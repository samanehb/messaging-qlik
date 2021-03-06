import {process, getApiVersion} from '../../../helpers/responseProcessing';
import {ErrorCodes} from '../../../helpers/errorCodes';
import {Strings} from '../../../strings/strings-en';
import {getMessageById} from '../../../database/cloudantClient';
import MessageModel from '../../../models/messageModel';
import ErrorModel from '../../../models/errorModel';

export default function processGetById(req, res) {
    getById(req, (errStatus, responseObj) => {
        if(!errStatus) {
            errStatus = 200;
        }
        return process({status: errStatus, data: responseObj}, req, res);
    });
}

/**
 * gets the message by it id (provided as path param to req)
 * calls callback function when finished. first argument to callback is error (status code), or null upon success
 *      second argument to callback is the api response object ready to be sent back (either an error object, or message object)
 */
export function getById(req, callback) {
    const messageId = req.params ? req.params.messageId : undefined;
    if(!messageId) {
        return callback(400, new ErrorModel(ErrorCodes.MESSAGE_ID_MISSING, Strings.MESSAGE_ID_MISSING));
    }
    getMessageById(messageId).then((message) => {
        if(!message) { // message not found
            return callback(404, new ErrorModel(ErrorCodes.MESSAGE_NOT_FOUND, Strings.MESSAGE_RETREIVE_FAIL));
        }
        const messageModel = MessageModel.copy(message);
        return callback(null, messageModel.getApiModel(getApiVersion(req)));
    }).catch((err) => {
        if(err && err.modelName === 'ErrorModel') {
            // cloudant client already built an api ready error, so use it
            return callback(500, err);
        } else {
            console.log(err);
            return callback(500, new ErrorModel(ErrorCodes.MESSAGE_DELETE_FAIL, Strings.MESSAGE_RETREIVE_FAIL));
        }
    });
}