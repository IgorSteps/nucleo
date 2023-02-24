import IMessageHadnler from "./IMessageHandler";
import Message, { MessagePriority } from "./message";
import MessageSubscriptionNode from "./messageSubscriptionNode";

export default class MessageBus {

    private static m_Subscriptions: {[code: string]: IMessageHadnler[]} = {}; // hashtable: k = code, v = array of Msg handlers
    private static m_QueueLimitPerFrame: number = 10;
    private static m_MessageQueue: MessageSubscriptionNode[] = [];

    private constructor() {}

    public static addSubscription(code: string, handler: IMessageHadnler): void {
        if (MessageBus.m_Subscriptions[code] === undefined) {
            MessageBus.m_Subscriptions[code] = [];
        } 
        if (MessageBus.m_Subscriptions[code].indexOf(handler) !== -1) {
            console.warn(`Attempting to add duplicate handler to code ${code}. Subscription not added`)
        } else {
            MessageBus.m_Subscriptions[code].push(handler);
        }
    }

    public static removeSubscription(code: string, handler: IMessageHadnler): void {
        if (MessageBus.m_Subscriptions[code] === undefined) {
            console.warn(`Can't unsubscribe thandelr from code ${code}, because this code is not subscribed to.`);
            return;
        } 

        let nodeIdx = MessageBus.m_Subscriptions[code].indexOf(handler);
        if (nodeIdx !== -1) {
            MessageBus.m_Subscriptions[code].splice(nodeIdx, 1)
        }
    }

    public static post(msg: Message):void {
        console.log("Message posted", msg);
        
        if (MessageBus.m_Subscriptions[msg.Code]===undefined) {
            return;
        }

        MessageBus.m_Subscriptions[msg.Code].forEach( (h: IMessageHadnler) => {
            if(msg.Priority === MessagePriority.HIGH) {
                h.onMessage(msg);
            } else {
                MessageBus.m_MessageQueue.push(new MessageSubscriptionNode(msg, h));
            }
        })
    }

    public static update(dt: number): void  {
        if( MessageBus.m_MessageQueue.length == 0 ) {
            return;
        }

        let msglimit = Math.min(MessageBus.m_QueueLimitPerFrame, MessageBus.m_MessageQueue.length);
        for(let i=0; i<msglimit; ++i) {
            let node = MessageBus.m_MessageQueue.pop();
            node.Handler.onMessage(node.Message);
        }

    }

}