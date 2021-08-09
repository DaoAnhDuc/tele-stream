
import { store } from "../redux/store";
import { StreamAxiosInstance } from "../utils/setupAxiosInterceptors";

const ETrackKind = {
    AUDIO: "audio",
    VIDEO: "video",
};

class UserClient {
    socket: any;
    id: string;
    username: string;
    iskey: boolean;
    roomname: string;
    constructor(socket: any, id: string, username: string, iskey: boolean, roomname: string) {
        this.socket = socket;
        this.id = id;
        this.username = username;
        this.iskey = iskey;
        this.roomname = roomname;
    }

    produce = async (rtpCapabilities: any, producerTransport: any, track: MediaStreamTrack, type: string) => {
        const params = this.getTrackParamsCodec(rtpCapabilities, track);
        const producer = await producerTransport.produce(params);
        producer.type = type;
        producer.on("trackended", async () => {
            
            const producerInstance = {
                kind: producer.kind,
                id: producer.id,
                producer,
            };
            await this.closeProducer(producerInstance);

        });

        producer.on("transportclose", () => {
            console.log("producer transport close");
        });

        producer.on("close", () => {
            console.log("closing producer");
            alert(1312)
        });
        const producerInstance = {
            kind: producer.kind,
            id: producer.id,
            producer,
        };

        return producerInstance;
    };

    consumer = async (
        roomname: string,
        userId: string,
        rtpCapabilities: any,
        consumerTransport: any,
        producerId: string
    ) => {
        const consumerData = await StreamAxiosInstance.post("/call/createConsumer", {
            roomname,
            userId,
            consumerParams: {
                rtpCapabilities,
                consumerTransportId: consumerTransport.id, // might be
                producerId,
            },
        });
        const { id, kind, rtpParameters } = consumerData.data.params;
        const codecOptions ={};
        const consumer = await consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        });

        return consumer;
    };

    getTrackParamsCodec = (rtpCapabilities: any, track: MediaStreamTrack) => {
        switch (track.kind) {
            case ETrackKind.VIDEO: {
                const codec = rtpCapabilities.codecs.find((codec: any) => codec.mimeType.toLowerCase() === "video/vp8");

                const params = {
                    track,
                    codec,
                    // encodings: [
                    //     { rid: "r0", scalabilityMode: "S1T3" },
                    //     { rid: "r1", scalabilityMode: "S1T3" },
                    //     { rid: "r2", scalabilityMode: "S1T3" },
                    //     { rid: "r3", scalabilityMode: "S1T3" },
                    // ],
                    // codecOptions: {
                    //     videoGoogleStartBitrate: 1000,
                    // },
                };

                return params;
            }
            case ETrackKind.AUDIO: {
                const codec = rtpCapabilities.codecs.find(
                    (codec: any) => codec.mimeType.toLowerCase() === "audio/opus"
                );

                const params = {
                    track,
                    codec,
                };

                return params;
            }

            default:
                break;
        }
    };

    closeProducer = async (producer: any) => {
        if( producer.id){
            await StreamAxiosInstance.post("/call/closeProducer", {
                roomname: this.roomname,
                userId: this.id,
                producerParams: { producerId: producer.id },
            });
        }



        // } else if (producer.type === "screenshare") {
        //     for (let index = 0; index < localVideoState.screenCast.length; index++) {
        //         const element = localVideoState.screenCast[index];
        //         if (element.producer.id === producer.id) {
        //             localVideoState.screenCast.splice(index, 1);
        //         }
        //     }
        // } else {
        //     for (let index = 0; index < localVideoState.audio.length; index++) {
        //         const element = localVideoState.audio[index];
        //         if (element.producer.id === producer.id) {
        //             localVideoState.audio.splice(index, 1);
        //         }
        //     }
        // }
        // store.dispatch(setListLocalCamera(localVideoState));
    };

    closeProducerWithType = async (type: string) => {
        // const localVideoState = { ...store.getState().localElementState };
        // if (type === "camera") {
        //     for (let index = 0; index < localVideoState.videos.length; index++) {
        //         const element = localVideoState.videos[index];
        //         await AxiosInstance.post("/call/closeProducer", {
        //             roomname: this.roomname,
        //             userId: this.id,
        //             producerParams: { producerId: element.producer.id },
        //         });
        //         localVideoState.videos = [];
        //     }
        // } else if (type === "screenshare") {
        //     for (let index = 0; index < localVideoState.screenCast.length; index++) {
        //         const element = localVideoState.screenCast[index];
        //         await AxiosInstance.post("/call/closeProducer", {
        //             roomname: this.roomname,
        //             userId: this.id,
        //             producerParams: { producerId: element.producer.id },
        //         });
        //         localVideoState.screenCast = [];
        //     }
        // } else {
        //     for (let index = 0; index < localVideoState.audio.length; index++) {
        //         const element = localVideoState.audio[index];
        //         await AxiosInstance.post("/call/closeProducer", {
        //             roomname: this.roomname,
        //             userId: this.id,
        //             producerParams: { producerId: element.producer.id },
        //         });
        //         localVideoState.audio = [];
        //     }
        // }
        // store.dispatch(setLocalElementReducer(localVideoState));
    };

    closeConsumer = async (consumerId: string) => {

    };

    closeAddConsumerOfUser = (userId: string) => {
       
    };
}

export { UserClient };
