import IMessageHadnler from "./IMessageHandler";
import Message from "./message";

/**  */
export default class MessageSubscriptionNode {

    public Message: Message;
    public Handler: IMessageHadnler;

    constructor(msg: Message, hdlr: IMessageHadnler) {
        this.Message = msg;
        this.Handler = hdlr;
    }
}