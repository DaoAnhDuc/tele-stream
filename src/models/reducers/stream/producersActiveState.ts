
interface IProducersStreamItem {
    producerId: string;
    active: boolean;
}
export interface IProducersActive {
    listKeyStream: Array<IProducersStreamItem>,
    listConsumerStream: Array<IProducersStreamItem>,
}

export const defaultProducersActive: IProducersActive = {
    listKeyStream: [],
    listConsumerStream: [],
};
