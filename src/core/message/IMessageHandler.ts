import Message from "./message";

export default interface IMessageHadnler{
    onMessage(message: Message): void;
}