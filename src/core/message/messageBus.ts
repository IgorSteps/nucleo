import IMessageHadnler from "./IMessageHandler";
import Message, { MessagePriority } from "./message";
import MessageSubscriptionNode from "./messageSubscriptionNode";

export default class MessageBus {

    private static m_Subscriptions: {[code: string]: IMessageHadnler[]} = {}; // hashtable: k = code, v = array of Msg handlers
    private static m_QueueLimitPerFrame: number = 10;
    private static m_MessageQueue: MessageSubscriptionNode[] = [];

    private constructor() {}

    public static addSubscription(code: string, handler: IMessageHadnler): void {
        let subscription = MessageBus.m_Subscriptions[code];
        if (subscription !== undefined) {
            MessageBus.m_Subscriptions[code] = [];
        } 
        if (subscription.indexOf(handler) !== -1) {
            console.warn(`Attempting to add duplicate handler to code ${code}. Subscription not added`)
        } else {
            subscription.push(handler);
        }
    }

    public static removeSubscription(code: string, handler: IMessageHadnler): void {
        let subscription = MessageBus.m_Subscriptions[code];
        if (subscription === undefined) {
            console.warn(`Can't unsubscribe thandelr from code ${code}, because this code is not subscribed to.`);
            return;
        } 

        let nodeIdx = subscription.indexOf(handler);
        if (nodeIdx !== -1) {
            subscription.splice(nodeIdx, 1)
        }
    }

    public static post(msg: Message):void {
        console.log(`Message ${msg} posted`);
        
        let handlers = MessageBus.m_Subscriptions[msg.Code];
        if (handlers===undefined) {
            return;
        }

        handlers.forEach( (h: IMessageHadnler) => {
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