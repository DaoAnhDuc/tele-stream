export interface ILocalStreamsNew {
    deviceId: string;
    name: string;
    active: boolean | any;
    producer?: any;
    type: string;
}

export const defaultLocalStreamsNew: Array<ILocalStreamsNew> = [];
