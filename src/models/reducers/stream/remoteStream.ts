
export interface IRemoteStreams {
    peerId: string,
    videos: Array<{ name: string, active: boolean | any, consumer: any, stream: MediaStream }>,
    audio: null | any,
    peerName: string,
    isKey: boolean,

}

export const defaulttRemoteStreams: Array<IRemoteStreams> = []