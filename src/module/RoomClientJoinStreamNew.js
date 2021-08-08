import * as mediasoupClient from "mediasoup-client";
import { io } from "socket.io-client";
import { EVENTS, RTC_EVENTS } from "../events/EVENTS";
import { setMessage } from "../reducers/messageReducer";
import { setRemoteElement } from "../reducers/remoteElementReducer";
import { store } from "../redux/store";
import { AxiosInstance } from "../utils/setupAxiosInterceptors";
import { Notification } from "./Notification";
import { UserClient } from "./UserClient";

const ETransportType = {
    producer: "producer",
    consumer: "consumer",
};

class RoomClient {
    constructor(roomname, password, username, callback) {
        this.roomname = roomname;
        this.password = password;
        this.username = username;
        this.socket = io(`${window.location.protocol}//${window.serverIp}:${window.port}`);
        this.socket.on("connect", () => {
            callback(this);
        });
        this.localUser = null;
    }
    initSocketEvent = () => {
        this.socket.on(RTC_EVENTS.NEW_PRODUCER, async (data) => {
            const remoteElementState = [...store.getState().remoteElementState];
            const consumer = await this.localUser.consumer(
                this.roomname,
                this.localUser.id,
                this.device.rtpCapabilities,
                this.consumerTransport,
                data.producer_id
            );
            const stream = new MediaStream();
            stream.addTrack(consumer.track);
            const remoteElementIndex = remoteElementState.findIndex((remote) => remote.peerId === data.peerId);
            if (remoteElementIndex !== -1) {
                if (consumer.track.kind === "video") {
                    remoteElementState[remoteElementIndex].video.push({ consumerId: consumer.id, stream });
                } else {
                    remoteElementState[remoteElementIndex].audio = { consumerId: consumer.id, stream };
                }
            } else {
                if (consumer.track.kind === "video") {
                    remoteElementState.push({
                        peerName: data.peerName,
                        peerId: data.peerId,
                        video: [{ consumerId: consumer.id, stream }],
                        audio: null,
                    });
                } else {
                    remoteElementState.push({
                        peerName: data.peerName,
                        peerId: data.peerId,
                        video: [],
                        audio: { consumerId: consumer.id, stream },
                    });
                }
            }
            await store.dispatch(setRemoteElement(remoteElementState));

        });

        this.socket.on(RTC_EVENTS.CLOSE_CONSUME, ({ consumerId, peerId, peerName }) => {
            console.log("closing consumer:", consumerId, peerId, peerName);
            this.localUser.closeConsumer(consumerId, peerId, peerName);
        });

        this.socket.on(EVENTS.SOCKET_USER_LEFT_ROOM, async ({ name, id }) => {
            this.localUser.closeAddConsumerOfUser(id) 
            Notification("warning", name + " đã rời khỏi cuộc họp")
        });

        this.socket.on(EVENTS.SOCKET_USER_JOIN_ROOM, async ({ name, id }) => {
            Notification("info", name + " đã tham gia vào cuộc họp")
        });

        this.socket.on(EVENTS.INCOMMING_MESSAGE, (data) => {
            store.dispatch(setMessage(data));
        })

        this.socket.on(EVENTS.SOCKET_DISCONNECT, () => {
            this.exit(false);
        });
    };

    exit = async (offline = false) => {

        if (!offline) {
            await AxiosInstance.post("/call/exitRoom",{roomname:this.roomname,userId:this.localUser.id});
        }
        this.consumerTransport.close();
        this.producerTransport.close();
        this.socket.off(EVENTS.SOCKET_USER_JOIN_ROOM);
        this.socket.off(EVENTS.SOCKET_USER_LEFT_ROOM);
        this.socket.off(EVENTS.SOCKET_DISCONNECT);
        this.socket.off(RTC_EVENTS.CLOSE_CONSUME);
        this.socket.off(RTC_EVENTS.NEW_PRODUCER);
        window.close();

    }

    init = async () => {
        const user = new UserClient(this.socket, this.socket.id, this.username, true, this.roomname);

        const hasRoom = await AxiosInstance.post("/call/checkRoomExistence", { roomname: this.roomname });
        if (hasRoom) {
            user.iskey = false;
            const roomState = await this.joinRoom(user);
            if (roomState.status !== 1) {
                return;
            }
            console.log("join room");
        } else {
            user.iskey = true;
            const roomState = await this.createRoom(user);
            if (roomState.status !== 1) {
                return;
            }
            console.log("create room");
        }
        const routerCapabilitiesData = await AxiosInstance.post("/call/getRouterCapacities", {
            roomname: this.roomname,
        });
        const routerCapabilities = routerCapabilitiesData.data;
        this.device = await this.loadDevice(routerCapabilities);
        const producerTransport = await this.initTransports(this.device, ETransportType.producer);
        console.log(producerTransport);
        producerTransport.on("connect", async (dtlsData, callback, errback) => {
            try {
                await AxiosInstance.post("/call/connectTransport", {
                    roomname: this.roomname,
                    userId: this.socket.id,
                    connectTransport: {
                        dtlsParameters: dtlsData.dtlsParameters,
                        transportId: producerTransport.id,
                    },
                });
                callback();
            } catch (error) {
                errback(error);
            }
        });
        producerTransport.on("produce", async (producerParameters, callback, errback) => {
            try {
                const { kind, rtpParameters } = producerParameters;
                const producerData = await AxiosInstance.post("/call/createProducer", {
                    roomname: this.roomname,
                    userId: this.socket.id,
                    producerParams: {
                        producerTransportId: producerTransport.id,
                        kind,
                        rtpParameters,
                    },
                });
                const producerId = producerData.data;

                callback({ id: producerId });
            } catch (err) {
                errback(err);
            }
        });

        const consumerTransport = await this.initTransports(this.device, ETransportType.consumer);
        consumerTransport.on("connect", async (dtlsData, callback, errback) => {
            try {
                await AxiosInstance.post("/call/connectTransport", {
                    roomname: this.roomname,
                    userId: this.socket.id,
                    connectTransport: {
                        dtlsParameters: dtlsData.dtlsParameters,
                        transportId: consumerTransport.id,
                    },
                });

                console.log("connectconsumer");
                callback();
            } catch (error) {
                errback(errback);
            }
        });

        this.producerTransport = producerTransport;
        this.consumerTransport = consumerTransport;
        this.routerCapabilities = routerCapabilities;
        this.localUser = user;
    };

    getProducerInRoom = async () => {
        const listProducer = await AxiosInstance.post("/call/getProducerInRoom", {
            roomname: this.roomname,
        });
        return listProducer;
    };

    createRoom = async (user) => {
        const roomState = await AxiosInstance.post("/call/createRoom", {
            roomname: this.roomname,
            password: this.password,
            userId: user.id,
            username: user.username,
        });

        return roomState;
    };

    joinRoom = async (user) => {
        console.log(user);
        const roomState = await AxiosInstance.post("/call/joinRoom", {
            roomname: this.roomname,
            password: this.password,
            userId: user.id,
            username: user.username,
        });

        return roomState;
    };

    loadDevice = async (routerRtpCapabilities) => {
        let device;
        try {
            device = new mediasoupClient.Device();
        } catch (error) {
            if (error.name === "UnsupportedError") {
                console.error("browser not supported");
            }
            console.error(error);
        }
        await device.load({
            routerRtpCapabilities,
        });
        return device;
    };

    initTransports = async (device, type) => {
        const roomname = this.roomname;
        const userId = this.socket.id;
        const data = await AxiosInstance.post("/call/createTransport", {
            roomname,
            userId,
        });

        if (data.status === 1) {
            const producerTransport =
                type == ETransportType.producer
                    ? device.createSendTransport(data.data)
                    : device.createRecvTransport(data.data);
            return producerTransport;
        }
    };

    produce = async (producerTransport, track) => {
        console.log(track.kind);
        let params = {
            track,
            codec: this.device.rtpCapabilities.codecs.find((codec) => codec.mimeType.toLowerCase() === "video/vp8"),
            encodings: [
                { rid: "r0", scalabilityMode: "S1T3" },
                { rid: "r1", scalabilityMode: "S1T3" },
                { rid: "r2", scalabilityMode: "S1T3" },
                { rid: "r3", scalabilityMode: "S1T3" },
            ],
            codecOptions: {
                videoGoogleStartBitrate: 1000,
            },
        };

        const producer = await producerTransport.produce(params);
        const producerInstance = {
            kind: producer.kind,
            id: producer.id,
            producer,
        };
    };

    consumer = async (consumerTransport, producerId) => {
        const { rtpCapabilities } = this.device;
        const consumerData = await AxiosInstance.post("/call/createConsumer", {
            roomname: this.roomname,
            userId: this.socket.id,
            consumerParams: {
                rtpCapabilities,
                consumerTransportId: consumerTransport.id, // might be
                producerId,
            },
        });

        const { id, kind, rtpParameters } = consumerData.data.params;
        const codecOptions = [{ ssrc: 222220, scalabilityMode: "S4T1" }];
        const consumer = await consumerTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        });
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        const video = document.createElement("video");
        video.srcObject = stream;
        video.style.width = "512px";
        video.style.height = "512px";
        video.style.background = "black";
        video.style.float = "left";
        video.autoplay = true;
        document.getElementById("container")?.append(video);
    };
}

export { RoomClient };
