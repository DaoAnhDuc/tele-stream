// import { patientInfoStream } from './../reducers/stream/stream.model';
import * as mediasoupClient from "mediasoup-client";
import { io } from "socket.io-client";
import { IMessageState } from "../models/reducers/stream/message";
import { serverConfig } from "../models/variables/serverConfig";
import { setConsumerStreamsNew } from "../reducers/stream/consumerStreamNew";
import { setKeyStreamsNew } from "../reducers/stream/keyStreamNew";
import { setMessage } from "../reducers/stream/messageReducer";
import { store } from "../redux/store";
import { StreamAxiosInstance } from "../utils/setupAxiosInterceptors";
import { EVENTS, RTC_EVENTS } from "./events/EVENTS";
import { Notification } from "./Notification";
import { UserClient } from "./UserClient";

enum ETransportType {
    producer = "producer",
    consumer = "consumer",
}

class RoomClient {
    roomname: string;
    password: string;
    username: string | any;
    socket: any;
    localUser: UserClient | null;
    device: any;
    producerTransport: any;
    consumerTransport: any;
    routerCapabilities: any;
    constructor(roomname: string | any, password: string | any, username: string | any, callback: Function) {
        this.roomname = roomname;
        this.password = password;
        this.username = username;
        this.socket = io(serverConfig.socketServerUrl);
        this.socket.on("connect", () => {
            callback(this);
        });
        this.localUser = null;
    }
    initSocketEvent = () => {
        this.socket.on(
            RTC_EVENTS.NEW_PRODUCER,
            async (data: { producer_id: string; isKey: boolean; peerId: string; peerName: string }) => {
                console.log("NEW_PRODUCER");
                StreamAxiosInstance.post("/call/getConsumerUser", {
                    roomname: this.roomname,
                }).then((consumerUser:any) => {
                    store.dispatch(setConsumerStreamsNew(consumerUser.data));
                });
                StreamAxiosInstance.post("/call/getKeyUser", { roomname: this.roomname }).then((keyUser:any) => {
                    store.dispatch(setKeyStreamsNew(keyUser.data));
                });
               
            }
        );

        this.socket.on(RTC_EVENTS.CLOSE_CONSUME, async ({ consumerId, peerId, peerName }: any) => {
            console.log("closing consumer:", consumerId, peerId, peerName);
            StreamAxiosInstance.post("/call/getConsumerUser", {
                roomname: this.roomname,
            }).then((consumerUser:any) => {
                store.dispatch(setConsumerStreamsNew(consumerUser.data));
            });
            StreamAxiosInstance.post("/call/getKeyUser", { roomname: this.roomname }).then((keyUser:any) => {
                store.dispatch(setKeyStreamsNew(keyUser.data));
            });
        });

        this.socket.on(EVENTS.SOCKET_USER_LEFT_ROOM, async ({ name, id, isKey }: any) => {
            if (!this.localUser) {
                return;
            }
            if (isKey) {
                window.close();
            }
            Notification("warning", name + " đã rời khỏi cuộc họp");
        });

        this.socket.on(EVENTS.SOCKET_USER_JOIN_ROOM, async ({ name, id }: any) => {
            Notification("info", name + " đã tham gia vào cuộc họp");
        });

        this.socket.on(EVENTS.INCOMMING_MESSAGE, (data: IMessageState) => {
            store.dispatch(setMessage(data));
        });

        this.socket.on(EVENTS.SOCKET_DISCONNECT, () => {
            this.exit(false);
        });
    };

    exit = async (offline = false) => {
        if (!offline) {
            await StreamAxiosInstance.post("/call/exitRoom", { roomname: this.roomname, userId: this.localUser?.id });
        }
        this.consumerTransport.close();
        this.producerTransport.close();
        this.socket.off(EVENTS.SOCKET_USER_JOIN_ROOM);
        this.socket.off(EVENTS.SOCKET_USER_LEFT_ROOM);
        this.socket.off(EVENTS.SOCKET_DISCONNECT);
        this.socket.off(RTC_EVENTS.CLOSE_CONSUME);
        this.socket.off(RTC_EVENTS.NEW_PRODUCER);
        window.close();
    };

    init = async () => {
        const user = new UserClient(this.socket, this.socket.id, this.username, true, this.roomname);
        console.log(this.roomname);
        const hasRoom = await StreamAxiosInstance.post("/call/checkRoomExistence", { roomname: this.roomname });
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
        const routerCapabilitiesData = await StreamAxiosInstance.post("/call/getRouterCapacities", {
            roomname: this.roomname,
        });
        const routerCapabilities = routerCapabilitiesData.data;
        this.device = await this.loadDevice(routerCapabilities);
        const producerTransport = await this.initTransports(this.device, ETransportType.producer);
        console.log(producerTransport);
        producerTransport.on("connect", async (dtlsData: any, callback: Function, errback: Function) => {
            try {
                await StreamAxiosInstance.post("/call/connectTransport", {
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
        producerTransport.on("produce", async (producerParameters: any, callback: Function, errback: Function) => {
            try {
                const { kind, rtpParameters } = producerParameters;
                const producerData = await StreamAxiosInstance.post("/call/createProducer", {
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
        consumerTransport.on("connect", async (dtlsData: any, callback: Function, errback: Function) => {
            try {
                await StreamAxiosInstance.post("/call/connectTransport", {
                    roomname: this.roomname,
                    userId: this.socket.id,
                    connectTransport: {
                        dtlsParameters: dtlsData.dtlsParameters,
                        transportId: consumerTransport.id,
                    },
                });
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

    getConsumerFromProducerId = async (producerId: string) => {
        if (!this.localUser) {
            console.log("not found user in room");
            return;
        }
        const consumer = await this.localUser.consumer(
            this.roomname,
            this.localUser.id,
            this.device.rtpCapabilities,
            this.consumerTransport,
            producerId
        );
        return consumer;
    };

    getProducerInRoom = async () => {
        const listProducer = await StreamAxiosInstance.post("/call/getProducerInRoom", {
            roomname: this.roomname,
        });
        return listProducer;
    };

    createRoom = async (user: UserClient) => {
        const roomState = await StreamAxiosInstance.post("/call/createRoom", {
            roomname: this.roomname,
            password: this.password,
            userId: user.id,
            username: user.username,
        });

        return roomState;
    };

    joinRoom = async (user: UserClient) => {
        console.log(user);
        const roomState = await StreamAxiosInstance.post("/call/joinRoom", {
            roomname: this.roomname,
            password: this.password,
            userId: user.id,
            username: user.username,
        });

        return roomState;
    };

    loadDevice = async (routerRtpCapabilities: any) => {
        let device: any;
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

    initTransports = async (device: any, type: ETransportType) => {
        const roomname = this.roomname;
        const userId = this.socket.id;
        const data = await StreamAxiosInstance.post("/call/createTransport", {
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
}

export { RoomClient };
