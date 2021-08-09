export interface IKeyStreamsNew {
    userId: string;
    username: string;
    listProducer: Array<IProducer>;
}

export interface IProducer {
    producerId: string;
    producerType: string;
}

export const defaultKeyStreamsNew: Array<IKeyStreamsNew> = [];
