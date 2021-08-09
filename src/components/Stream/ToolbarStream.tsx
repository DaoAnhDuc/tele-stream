import { Badge, Button, Dropdown, Menu, Layout, Input, message, Tooltip } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RoomClient } from "../../module/RoomClientNew";
import { UserClient } from "../../module/UserClient";
import { store } from "../../redux/store";
import { AxiosInstance } from "../../utils/setupAxiosInterceptors";
import { LogoutOutlined } from "@ant-design/icons";
import { ISiderState } from "../../models/reducers/stream/sider";
import { IMessageState } from "../../models/reducers/stream/message";
import { setMessage } from "../../reducers/stream/messageReducer";
import { patientInfoStream } from "../../models/variables/patientInfoStream";
import { setModeScreenStream } from "../../reducers/stream/modeStream";
import { setSiderState } from "../../reducers/stream/siderReducer";
import { checkServiceConsultation, IRequestServicerConsult } from "../../reducers/stream/consultationCheckReducer";
import { getKeyStreamsNew } from "../../reducers/stream/keyStreamNew";
const { Content, Sider } = Layout;
interface Props {
    modeStream: number;
    setModeScreenStream: Function;
    siderState: ISiderState;
    setSiderState: Function;
    messageState: Array<IMessageState>;
    type: string;
    checkServiceConsultation: Function;
    getKeyStreamsNew: Function;
}
interface State {
    title: string | null;
    mute: boolean;
    titleVisible: boolean;
}

class ToolbarStream extends Component<Props, State> {
    state = {
        mute: true,
        title: "Click để Nhập tiêu đề bạn mong muốn",
        titleVisible: true,
    };

    micProducer: any;

    constructor(props: Props) {
        super(props);
        this.micProducer = null;
    }

    onScreenCast = async () => {
        const { modeStream } = this.props;
        const roomclient: RoomClient = window.roomClient;
        const localUser: UserClient | null = roomclient.localUser;
        if (!localUser) {
            return;
        }
        const mediaConstraints = { video: true, audio: false };
        const mediaDevices: any = navigator.mediaDevices;
        const stream = await mediaDevices?.getDisplayMedia(mediaConstraints);
        const track = stream.getVideoTracks()[0];
        const producer = await localUser?.produce(
            roomclient.routerCapabilities,
            roomclient.producerTransport,
            track,
            "screenshare"
        );

        this.props.getKeyStreamsNew(window.roomClient.roomname);
        // currentLocalStream.screencast.push({ producer, name: "screencast", active: modeStream == 0 ? true : false, stream: stream })
    };

    onChangeMicState = async () => {
        await this.setState({ mute: !this.state.mute });
        if (this.state.mute) {
            if (this.micProducer) {
                this.micProducer.pause();
            }
        } else {
            if (this.micProducer) {
                this.micProducer.resume();
            } else {
                const roomclient: RoomClient = window.roomClient;
                const localUser: UserClient | null = roomclient.localUser;
                if (!localUser) {
                    return;
                }
                const mediaConstraints = { video: false, audio: true };
                const mediaDevices: any = navigator.mediaDevices;
                const stream = await mediaDevices?.getUserMedia(mediaConstraints);
                const track = stream.getAudioTracks()[0];
                const producer = await localUser?.produce(
                    roomclient.routerCapabilities,
                    roomclient.producerTransport,
                    track,
                    "audio"
                );
                this.micProducer = producer.producer;
            }
        }
    };

    setModeScreenStream = (mode: number) => {

    };

    toggleChat = async () => {
        const { siderState } = this.props;
        if (!siderState.chatSiderShow) {
            const messages = await AxiosInstance.post("/call/getMessageInRoom", {
                roomname: window.roomClient.roomname,
            });
            store.dispatch(setMessage(messages.data));
        }

        this.props.setSiderState({ ...siderState, chatSiderShow: !siderState.chatSiderShow });
    };

    toggleRightSider = () => {
        const { siderState } = this.props;
        this.props.setSiderState({ ...siderState, rightSider: !siderState.rightSider });
    };

    onEndCall = async () => {
        if (this.props.type === "KeyStream") {
            const response = await AxiosInstance.post("/api/Conclusion/service-consult", {
                svid: patientInfoStream.svid,
                flag: "Finish",
            });
            if (response.status === 1) {
                window.roomClient?.exit(true);
            } else {
                message.error(response.message);
            }
        } else {
            window.roomClient?.exit(true);
        }
    };

    onExit = async () => {
        if (this.props.type === "KeyStream") {
            const response = await AxiosInstance.post("/api/Conclusion/service-consult", {
                svid: patientInfoStream.svid,
                flag: "Discard",
            });
            if (response.status === 1) {
                window.roomClient?.exit(true);
            } else {
                message.error(response.message);
            }
        } else {
            const response = await AxiosInstance.post("/api/Conclusion/service-consult", {
                svid: patientInfoStream.svid,
                flag: "Exit",
            });
            if (response.status === 1) {
                window.roomClient?.exit(true);
            } else {
                message.error(response.message);
            }
        }
    };

    render() {
        const { modeStream } = this.props;
        const { title, titleVisible } = this.state;
        return (
            <Layout>
                <Content style={{ background: "#096dd9", color: "#fff" }}>
                    {titleVisible ? (
                        <div style={{ width: '100%', height: '100%' }} onClick={() => {
                            this.setState({
                                titleVisible: false,
                            });
                        }}>
                            <div
                                style={{
                                    fontSize: 20,
                                    lineHeight: "40px",
                                    padding: "0 10px",
                                    overflow: "hidden",
                                    fontWeight: "bold",
                                }}

                            >
                                {title}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", height: "100%", padding: "5px 10px", background: "#fff" }}>
                            <Input
                                value={title}
                                style={{ height: 32 }}
                                onChange={(e) =>
                                    this.setState({
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Button
                                onClick={() => {
                                    this.setState({
                                        titleVisible: true,
                                    });
                                }}
                                type="primary"
                            >
                                Ok
                            </Button>
                        </div>
                    )}
                </Content>
                <Sider width={220} style={{ height: 40, background: "#fff" }}>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Badge size="small" count={this.props.messageState.length}>
                            <Button
                                type="link"
                                icon={<i className="material-icons">chat</i>}
                                onClick={this.toggleChat}
                            ></Button>
                        </Badge>
                        <Button
                            type="link"
                            icon={<i className="material-icons">tv</i>}
                            onClick={this.onScreenCast}
                        ></Button>

                        <Tooltip
                            placement="topLeft"
                            title={
                                this.props.type === "KeyStream"
                                    ? "Kết thúc hội chẩn (Cập nhật trạng thái HỘI CHẨN XONG)"
                                    : "Thoát khỏi hội chẩn"
                            }
                        >
                            <Button
                                style={{
                                    margin: "0px 5px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                // size="large"
                                type="primary"
                                shape="circle"
                                danger
                                icon={<i className="material-icons">call_end</i>}
                                onClick={this.onEndCall}
                            ></Button>
                        </Tooltip>
                        <Tooltip
                            placement="topLeft"
                            title={
                                this.props.type === "KeyStream"
                                    ? "Hủy bỏ hội chẩn (Cập nhật trạng thái CHƯA HỘI CHẨN)"
                                    : "Thoát khỏi hội chẩn  (Cập nhật trạng thái ĐANG CHỜ HỘI CHẨN)"
                            }
                        >
                            <Button
                                style={{ margin: "0px 5px" }}
                                type="primary"
                                shape="circle"
                                danger
                                icon={<LogoutOutlined style={{ fontWeight: "bold" }} />}
                                onClick={this.onExit}
                            ></Button>
                        </Tooltip>
                        <Button
                            type="link"
                            onClick={this.onChangeMicState}
                            icon={
                                this.state.mute ? (
                                    <i className="material-icons">mic_off</i>
                                ) : (
                                    <i className="material-icons">mic</i>
                                )
                            }
                        ></Button>
                        <Dropdown
                            overlay={
                                <Menu id="choose-layout-stream">
                                    <div
                                        className={
                                            modeStream === 0
                                                ? "layout-stream layout-stream-01 active"
                                                : "layout-stream layout-stream-01"
                                        }
                                        onClick={() => this.setModeScreenStream(0)}
                                    >
                                        <div className="wrapper-stream-01">Normal</div>
                                    </div>
                                    <div
                                        className={
                                            modeStream === 2
                                                ? "layout-stream layout-stream-03 active"
                                                : "layout-stream layout-stream-03"
                                        }
                                        onClick={() => this.setModeScreenStream(2)}
                                    >
                                        <div className="wrapper-stream-03">
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>
                                </Menu>
                            }
                        >
                            <Button
                                type="link"
                                // onClick={this.onModeTwoCamera}
                                icon={<i style={{ marginBottom: 2 }} className="fas fa-columns"></i>}
                            ></Button>
                        </Dropdown>
                        <Button
                            type="link"
                            onClick={this.toggleRightSider}
                            icon={<i className="material-icons">grid_on</i>}
                        ></Button>
                    </div>
                </Sider>
            </Layout>
        );
    }
}

const mapStateToProps = (state: any) => ({
    modeStream: state.modeStream,
    siderState: state.siderState,
    messageState: state.messageState,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        setModeScreenStream: (value: number) => dispatch(setModeScreenStream(value)),
        setSiderState: (value: ISiderState) => dispatch(setSiderState(value)),
        checkServiceConsultation: (data: IRequestServicerConsult) => dispatch(checkServiceConsultation(data)),
        getKeyStreamsNew: (roomname: string) => dispatch(getKeyStreamsNew(roomname)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolbarStream);
