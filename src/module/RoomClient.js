import { EVENTS, RTC_EVENTS } from "./events/EVENTS";
// import { Role } from "../global/Role";
// import { setLargeVideo } from "../reducers/largeVideoReducer";
// import { setLocalElementReducer } from "../reducers/localElementReducer";
// import { setMessage } from "../reducers/messageReducer";
// import { setRemoteElement } from "../reducers/remoteElementReducer";
import { store } from "../redux/store";
import { Notification } from "./Notification";
import { SocketClone } from "./Socket";
import { localStoreState } from "../model/vars/localStoreState";
import { setListRemoteCamera } from "../reducer/stream/listRemoteCamera";
import { setListLocalCamera } from "../reducer/stream/listLocalCamera";
import { setMessage } from "../reducer/stream/messageReducer";

export const mediaType = {
    audio: "audioType",
    video: "videoType",
    screen: "screenType",
};

class RoomClientClone {
    constructor(roomname, username, password, callback) {
        this.roomname = roomname;
        this.username = username;
        this.password = password;
        this.mic = null;
        this.producerTransport = null;
        this.consumeTransport = null;
        this.device = null;
        this.listProduce = { videos: [], audio: [], screenCast: [] };
        this.initRoomClient();
        this.callback = callback;
    }

    initRoomClient = async () => {
        const create = await this.createRoom()
        if (!create) {
            return
        }
        if (create.roomname) {
            await this.initSocket()
            await this.joinRoom(this.username, this.roomname, this.password)
            await this.getMessageInRoom();
            //test
            const listCamera = [...store.getState().listLocalCameraState]

            for (let index = 0; index < listCamera.length; index++) {
                const item = listCamera[index];
                if (item.active === true) {
                    const { producer, stream } = await this.produce(mediaType.video, item.id)
                    item.producer = producer;
                    item.stream = stream;
                }
            }
            await store.dispatch(setListLocalCamera(listCamera))


            // await this.produce(mediaType.video, null)
            // await this.produce(mediaType.audio, null)
            // await this.produce(mediaType.screen,null);
            this.callback(this)
        }
    }

    initRTC = async () => {
        const routerCapabilities = await this.getRouterCapabilities()
        this.device = await this.loadDevice(routerCapabilities);
        this.producerTransport = await this.initProducerTransport(this.device);
        this.consumeTransport = await this.initConsumeTransport(this.device);
        console.log("this.producerTransport", this.producerTransport)
    }

    initSocket = () => {

        this.socket.on(EVENTS.INCOMMING_MESSAGE, (data) => {
            store.dispatch(setMessage(data));
        })

        this.socket.on(EVENTS.SOCKET_USER_JOIN_ROOM, async ({ name, id }) => {
            await this.getProducerOfRoom();
            Notification("info", name + " đã tham gia vào cuộc họp")
        });

        this.socket.on(EVENTS.SOCKET_USER_LEFT_ROOM, async ({ name, id }) => {
            await this.getProducerOfRoom();
            Notification("warning", name + " đã rời khỏi cuộc họp")
        });

        this.socket.on(EVENTS.SOCKET_DISCONNECT, () => {
            this.exit(false);
        });

        this.socket.on(RTC_EVENTS.CLOSE_CONSUME, ({ consumerId, peerId, peerName }) => {
            console.log("closing consumer:", consumerId, peerId, peerName);
            this.closeConsumer(consumerId, peerId, peerName);
        });

        this.socket.on(RTC_EVENTS.NEW_PRODUCER, async (data) => {
            const remoteElement = [...store.getState().listRemoteCameraState];
            for (let index = 0; index < data.length; index++) {
                const { producer_id, peerName, peerId } = data[index];
                if (peerId !== this.socket.id) {
                    const consume = await this.consume(producer_id, peerName, peerId);
                    const rl = remoteElement.findIndex((item) => item.peerId == peerId);
                    if (rl === -1) {
                        const remoteElementClone = {
                            video: [],
                            audio: null,
                            peerId, peerName
                        };
                        if (consume.kind === "video") {
                            remoteElementClone.video.push(consume)
                        }
                        if (consume.kind === "audio") {
                            remoteElementClone.audio = { consume, muted: false }
                        }
                        remoteElement.push(remoteElementClone)
                    } else {
                        const remoteElementClone = remoteElement[rl];
                        if (consume.kind === "video") {
                            remoteElementClone.video.push(consume);
                        }
                        if (consume.kind === "audio") {
                            remoteElementClone.audio = { consume, muted: false }
                        }
                    }

                }
            }
            store.dispatch(setListRemoteCamera(remoteElement));
        });
    }

    createRoom = async () => {
        const cs = new SocketClone(localStoreState.socketServerUrl);
        this.socket = cs.socket;
        this.socket.request = cs.request;
        const createRoom = await this.socket.request(EVENTS.CHECK_ROOM_ALREADY, { roomname: this.roomname, password: this.password });
        // if (createRoom) {
        //     return { roomname: this.roomname, password: this.password }
        // } else {
        //     return await this.socket.request(EVENTS.SOCKET_CREATE_ROOM, { roomname: this.roomname, password: this.password });
        // }

        if (!createRoom) {
            return await this.socket.request(EVENTS.SOCKET_CREATE_ROOM, { roomname: this.roomname, password: this.password });
        }

        return Notification("error", "Room create fail!")
    };

    getProducerOfRoom = async () => {
        const listProducer = await this.socket.request(RTC_EVENTS.GET_PRODUCER);
        const remoteElement = [];
        for (let index = 0; index < listProducer.length; index++) {
            const { producer_id, peerName, peerId, isKey } = listProducer[index];
            if (peerId !== this.socket.id) {
                const consume = await this.consume(producer_id, peerName, peerId);
                const rl = remoteElement.findIndex((item) => item.peerId == peerId)
                if (rl === -1) {
                    const remoteElementClone = {
                        video: [],
                        audio: null,
                        peerId, peerName
                    };
                    if (consume.kind === "video") {
                        remoteElementClone.video = [consume]
                    }
                    if (consume.kind === "audio") {
                        remoteElementClone.audio = { consume, muted: false }
                    }
                    remoteElement.push(remoteElementClone)
                } else {
                    const remoteElementClone = remoteElement[rl];
                    if (consume.kind === "video") {
                        remoteElementClone.video.push(consume);
                    }
                    if (consume.kind === "audio") {
                        remoteElementClone.audio = { consume, muted: false }
                    }
                }

            }
        }
        store.dispatch(setListRemoteCamera(remoteElement));
    }

    joinRoom = async (username, roomname, password) => {
        await this.socket.request(EVENTS.SOCKET_USER_JOIN_ROOM, { username, roomname, password: password });
        await this.initRTC()
        await this.getProducerOfRoom();
    };

    getRouterCapabilities = async () => {
        const routerCapabilities = await this.socket.request(RTC_EVENTS.GET_ROUTER_CAPABILITIES);
        return routerCapabilities;
    }

    loadDevice = async (routerRtpCapabilities) => {
        let device;
        try {
            device = new window.mediasoupClient.Device();
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
    }

    initProducerTransport = async (device) => {
        const transport = await this.socket.request(RTC_EVENTS.CREATE_TRANSPORT, {
            forceTcp: false,
            rtpCapabilities: device.rtpCapabilities,
        });

        const producerTransport = device.createSendTransport(transport);

        producerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                await this.socket.request(RTC_EVENTS.CONNECT_TRANSPORT, { dtlsParameters, transport_id: transport.id });
                callback();
            } catch (error) {
                errback(error);
            }
        });

        producerTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
            try {
                const producerTransportId = producerTransport.id
                const { producerId, socketId } = await this.socket.request(RTC_EVENTS.CREATE_PRODUCE, {
                    producerTransportId,
                    kind,
                    rtpParameters,
                });
                callback({ id: producerId, socketId });
            } catch (err) {
                errback(err);
            }
        });

        producerTransport.on("connectionstatechange", (state) => {
            switch (state) {
                case "connecting":
                    break;
                case "connected":
                    break;
                case "failed":
                    producerTransport.close();
                    break;
                default:
                    break;
            }
        });

        return producerTransport
    }

    initConsumeTransport = async (device) => {
        const transport = await this.socket.request(RTC_EVENTS.CREATE_TRANSPORT, { forceTcp: false });

        const consumerTransport = device.createRecvTransport(transport);

        consumerTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
            try {
                await this.socket.request(RTC_EVENTS.CONNECT_TRANSPORT, { transport_id: consumerTransport.id, dtlsParameters });
                callback();
            } catch (error) {
                errback(errback);
            }
        });

        consumerTransport.on("connectionstatechange", async (state) => {
            switch (state) {
                case "connecting":
                    break;

                case "connected":
                    break;

                case "failed":
                    consumerTransport.close();
                    break;

                default:
                    break;
            }
        });

        return consumerTransport
    }

    produce = async (type, deviceId = null) => {
        let mediaConstraints = {};
        let audio = false;
        let screen = false;
        switch (type) {
            case mediaType.audio:
                mediaConstraints = {
                    audio: {
                        deviceId: deviceId,
                    },
                    video: false,
                };
                audio = true;
                break;
            case mediaType.video:
                mediaConstraints = {
                    audio: false,
                    video: {
                        width: {
                            min: 640,
                            ideal: 1920,
                        },
                        height: {
                            min: 400,
                            ideal: 1080,
                        },
                        deviceId: deviceId,
                    },
                };
                break;
            case mediaType.screen:
                mediaConstraints = false;
                screen = true;
                break;
            default:
                break;
        }

        if (!this.device.canProduce("video") && !audio) {
            console.error("cannot produce video");
            return;
        }

        try {
            const stream = screen ? await navigator.mediaDevices.getDisplayMedia() : await navigator.mediaDevices.getUserMedia(mediaConstraints);

            const track = audio ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            const params = {
                track,
            };
            if (type === mediaType.video) {
                // params.encodings = [
                //     { rid: 'r0', maxBitrate: 100000, scalabilityMode: 'S1T3' },
                //     { rid: 'r1', maxBitrate: 300000, scalabilityMode: 'S1T3' },
                //     { rid: 'r2', maxBitrate: 600000, scalabilityMode: 'S1T3' },
                //     { rid: 'r3', maxBitrate: 1500000, scalabilityMode: 'S1T3' }
                // ]
                // params.codecOptions = {
                //     videoGoogleStartBitrate: 1000,
                // };
                // store.dispatch(setLargeVideo({ stream }));

            }
            const producer = await this.producerTransport.produce(params);
            producer.type = type;
            producer.on("trackended", () => {
                this.closeProducer(producer);
            });

            producer.on("transportclose", () => {
                console.log("producer transport close");
                // producers.delete(this.producer.id);
            });

            producer.on("close", () => {
                console.log("closing producer");
                // producers.delete(this.producer.id);
            });

            if (type === mediaType.screen) {
                const localElementState = [...store.getState().listLocalCameraState]
                localElementState.push({ stream, producer: producer, name: "Screencast", id: null, active: true })
                store.dispatch(setListLocalCamera(localElementState))

            }
            if (type === mediaType.audio) {
                this.mic = producer;
            }
            return { producer, stream };

        } catch (error) {
            console.log(error)
        }
    };

    consume = async (producerId, peerName, peerId) => {
        const consume = await this.getConsumeStream(producerId);
        return consume;
    };

    getConsumeStream = async (producerId) => {

        const { rtpCapabilities } = this.device;
        const data = await this.socket.request(RTC_EVENTS.CREATE_CONSUME, {
            rtpCapabilities,
            consumerTransportId: this.consumeTransport.id, // might be
            producerId,
        });
        const { id, kind, rtpParameters } = data?.params;

        const codecOptions = [
            // { ssrc: 222220, scalabilityMode: 'S4T3' }
        ];
        const consumer = await this.consumeTransport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions,
        });

        consumer.on("trackended", () => {
            console.log("consumer trackend")
            // this.removeConsumer(consumer.id);
        });
        consumer.on("transportclose", () => {
            console.log("consumer transportclose")
            // this.removeConsumer(consumer.id);
        });

        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        return { consumer, stream, kind, };
    };

    closeProducer = async (producer) => {
        const producer_id = producer.id;
        await this.socket.request(RTC_EVENTS.CLOSE_PRODUCER, { producer_id, });
        if (producer.type === mediaType.screen) {
            producer?.track?.stop();
            let localElementState = store.getState().listLocalCameraState
            localElementState = localElementState.filter((prod) => prod.producer.id !== producer_id)
            store.dispatch(setListLocalCamera(localElementState))
        }
    };

    closeConsumer = (consumerId, peerId, peerName) => {
        const remoteElement = [...store.getState().listRemoteCameraState];
        for (let index = 0; index < remoteElement.length; index++) {
            const element = remoteElement[index];
            if (element.audio?.consume?.consumer.id === consumerId) {
                element.audio = null;
            } else {
                for (let j = 0; j < element.video.length; j++) {
                    const video = element.video[j];

                    if (video.consumer.id === consumerId) {
                        element.video.splice(j, 1);
                        break;
                    }
                }
            }
        }
        store.dispatch(setListRemoteCamera(remoteElement))
    };

    exit = async (offline = false) => {

        if (!offline) {
            await this.socket.request(EVENTS.SOCKET_EXIT_ROOM);
        }
        this.consumeTransport?.close();
        this.producerTransport?.close();
        this.socket.off(EVENTS.SOCKET_USER_JOIN_ROOM);
        this.socket.off(EVENTS.SOCKET_USER_LEFT_ROOM);
        this.socket.off(EVENTS.SOCKET_DISCONNECT);
        this.socket.off(RTC_EVENTS.CLOSE_CONSUME);
        this.socket.off(RTC_EVENTS.NEW_PRODUCER);
        window.close();

    }

    getMessageInRoom = async () => {
        const messages = await this.socket.request(EVENTS.SOCKET_GET_MESSAGE_IN_ROOM);
        store.dispatch(setMessage(messages))
    }

    sendMessageChat = async (message) => {
        const messages = await this.socket.request(EVENTS.SOCKET_SEND_MESSAGE, message);
    }

    roomInfo = async () => {
        const info = await this.socket.request(EVENTS.SOCKET_GET_ROOM_INFO);
        return info;
    };

    changePassword = async () => {
        // const res = await this.socket.request(EVENTS.SOCKET_CHANGE_ROOM_PASSWORD, Role.password);
        // Notification("info", res)

    }
}

export { RoomClientClone }