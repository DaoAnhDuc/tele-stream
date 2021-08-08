
export interface ILocalStreams {
    audio: any;
    videos: Array<{ name: string, active: boolean| any, producer: any, stream: MediaStream }>;
    screencast: Array<{ name: string, active: boolean | any, producer: any, stream: MediaStream }>;
}

export const defaultLocalStreams = {
    audio: null,
    videos: [
    ],
    screencast: [
    ]
}
