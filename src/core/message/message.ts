import IMessageHadnler from "./IMessageHandler";
import MessageBus from "./messageBus";

export enum MessagePriority {
    NORMAL,
    HIGH,
}

export default class Message {
    public Code: string;
    public Context: any;
    public Sender: any;
    public Priority: MessagePriority;

    /**
     * Creates a new message
     * @param code The code for this message, which is subscribed to and listened for
     * @param sender The class instance which sent this message
     * @param context Free-form context data to be included with this message
     * @param priority The priority of this message
     */
    constructor(code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL) {
        this.Code = code;
        this.Sender = sender;
        this.Priority = priority;
        this.Context = context;
    } 


    public static send(code: string, sender: any, ctx?: any): void {
        MessageBus.post(new Message(code, sender, ctx));
    }

    public static sendPriority(code: string, sender: any, ctx?: any): void {
        MessageBus.post(new Message(code, sender, ctx, MessagePriority.HIGH));
    }

    public static subscribe(code: string, handler: IMessageHadnler): void {
        MessageBus.addSubscription(code, handler);
    }

    public static unsubscribe(code: string, handler: IMessageHadnler): void {
        MessageBus.removeSubscription(code, handler);
    }
}