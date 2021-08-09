import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Image, Layout, Popover, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { Footer } from "antd/lib/layout/layout";
import ChatLeft from "../../components/ChatLeft/ChatLeft";
import { serverConfig } from "../../models/variables/serverConfig";
import ToolbarStream from "../../components/Stream/ToolbarStream";
import { store } from "../../redux/store";
import CameraManager from "../../components/CameraManager/CameraManager";
import { ILocalStreamsNew } from "../../models/reducers/stream/localStreamsNew";
import { setLocalStreamsNew } from "../../reducers/stream/localStreamsNew";
import { getKeyStreamsNew } from "../../reducers/stream/keyStreamNew";
import KeyStream from "../../components/Stream/KeyStream";
import ConsumerStream from "../../components/Stream/ConsumerStream";
import { getConsumerStreamsNew } from "../../reducers/stream/consumerStreamNew";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Header, Sider, Content } = Layout;
interface Props {
    chatSiderShow: boolean;
    rightSider: boolean;
    loadingStream: boolean;
    setLocalStreamsNew: Function;
    getKeyStreamsNew: Function;
    getConsumerStreamsNew: Function;
}
interface State {
    userCustombanner: string | undefined;
    userCustombannerBottom: string | undefined;
}

class StreamLayout extends Component<Props, State> {
    state = {
        userCustombanner: undefined,
        userCustombannerBottom: undefined,
    };

    componentDidMount = async () => {
        const currentLocalStream = [...store.getState().localStreamsNewState];
        for (let index = 0; index < currentLocalStream.length; index++) {
            const deviceInfo = currentLocalStream[index];
            if (deviceInfo.type === "videoinput") {
                const roomclient = window.roomClient;
                const localUser = roomclient.localUser;
                const mediaConstraints = { video: { deviceId: deviceInfo.deviceId }, audio: false };
                const mediaDevices = navigator.mediaDevices;
                const stream = await mediaDevices.getUserMedia(mediaConstraints);
                const track = stream.getVideoTracks()[0];
                const producer = await localUser?.produce(
                    roomclient.routerCapabilities,
                    roomclient.producerTransport,
                    track,
                    "camera"
                );
                currentLocalStream[index].producer = producer;
            }
        }

        await this.props.setLocalStreamsNew(currentLocalStream);
        this.props.getKeyStreamsNew(window.roomClient.roomname);
        this.props.getConsumerStreamsNew(window.roomClient.roomname);

        console.log(store.getState().localStreamsNewState);
    };

    uploadBannerImage = (name: string) => {
        const input = document.createElement("input");
        input.type = "file";
        input.removeEventListener("change", (input) => this.readURL(input, name));
        input.addEventListener("change", (input) => this.readURL(input, name));
        input.click();
    };

    readURL = (input: any, name: string) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (name === "userCustombanner") {
                    this.setState({ userCustombanner: e.target.result });
                } else {
                    this.setState({ userCustombannerBottom: e.target.result });
                }
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    };

    render() {
        const { chatSiderShow, rightSider, loadingStream } = this.props;
        const { userCustombanner, userCustombannerBottom } = this.state;
        return (
            <Layout id="stream-layout" style={{ position: "relative" }}>
                {loadingStream && (
                    <div
                        style={{
                            width: "100%",
                            height: "100vh",
                            background: "#ffffff4a",
                            position: "absolute",
                            zIndex: 10,
                            top: 0,
                            left: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin size="large" indicator={antIcon} tip="Loading..." />
                    </div>
                )}
                {/* <Header className="stream-header">
                    <ToolbarStream />
                </Header> */}
                <Layout>
                    {
                        <Sider width={chatSiderShow ? 300 : 0} className="stream-sider stream-sider-chat">
                            <ChatLeft />
                        </Sider>
                    }
                    <Sider width={220} className="stream-sider stream-sider-remote">
                        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            <div style={{ padding: 0 }} onClick={() => this.uploadBannerImage("userCustombanner")}>
                                {userCustombanner ? (
                                    <img
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        src={userCustombanner ? userCustombanner : ""}
                                        alt=""
                                    />
                                ) : (
                                    <div style={{ padding: 10 }}>
                                        <div style={{ width: "100%", textAlign: "center" }}>
                                            <img
                                                style={{ width: 80, height: 80, }}
                                                src={serverConfig.hospitalLogo}
                                            />
                                            <p
                                                style={{
                                                    color: "#2c44c5",
                                                    fontWeight: "bold",
                                                    marginBlockEnd: 0,
                                                    marginTop: 5,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {serverConfig.hospitalName}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#2c44c5",
                                                    marginBlockStart: 0,
                                                    marginBlockEnd: 5,
                                                }}
                                            >
                                                {serverConfig.hospitalAddress}
                                            </p>
                                        </div>
                                        <div style={{ width: "100%", textAlign: "center" }}>
                                            <div
                                                style={{
                                                    color: "red",
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <i
                                                    className="material-icons"
                                                    style={{ marginBottom: 8, marginRight: 5 }}
                                                >
                                                    live_tv
                                                </i>
                                                <span>TRỰC TIẾP</span>
                                            </div>
                                            <p style={{ color: "#2c44c5", marginTop: 0, marginBlockEnd: 0 }}>
                                                KHÁM CHỮA BỆNH TỪ XA
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{flex: 1}}>
                            <ConsumerStream />
                            </div>
                            <div
                                style={{ padding: 0 }}
                                onClick={() => this.uploadBannerImage("userCustombannerBottom")}
                            >
                                {userCustombannerBottom ? (
                                    <img
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        src={userCustombannerBottom ? userCustombannerBottom : ""}
                                        alt=""
                                    />
                                ) : (
                                    <div style={{ padding: 10 }}>
                                        <div style={{ width: "100%", textAlign: "center", padding: 10 }}>
                                        <img
                                                style={{ width: 80, height: 80, }}
                                                src={serverConfig.hospitalLogo}
                                            />
                                            <p
                                                style={{
                                                    color: "#2c44c5",
                                                    fontWeight: "bold",
                                                    marginBlockEnd: 0,
                                                    marginTop: 5,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {serverConfig.hospitalName}
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#2c44c5",
                                                    marginBlockStart: 0,
                                                    marginBlockEnd: 5,
                                                }}
                                            >
                                                {serverConfig.hospitalAddress}
                                            </p>
                                        </div>
                                        <div style={{ width: "100%", textAlign: "center" }}>
                                            <div
                                                style={{
                                                    color: "red",
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <i
                                                    className="material-icons"
                                                    style={{ marginBottom: 8, marginRight: 5 }}
                                                >
                                                    live_tv
                                                </i>{" "}
                                                <span>TRỰC TIẾP</span>
                                            </div>
                                            <p style={{ color: "#2c44c5", marginTop: 0, marginBlockEnd: 0 }}>
                                                KHÁM CHỮA BỆNH TỪ XA
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Sider>
                    <Content className="stream-content">{/* <MainStream /> */}</Content>
                    {
                        <Sider width={rightSider ? 220 : 0} className="stream-sider stream-sider-local">
                            <Popover content={<CameraManager />} trigger="click" title="Danh sach camera">
                                <Button style={{ width: "100%" }} type="primary">Camera</Button>
                            </Popover>
                            <KeyStream />
                        </Sider>
                    }
                </Layout>
                <Footer style={{ height: 40, padding: 0 }}>
                    <ToolbarStream type="KeyStream" />
                </Footer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: any) => ({
    chatSiderShow: state.siderState.chatSiderShow,
    rightSider: state.siderState.rightSider,
    loadingStream: state.loadingStream,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        getKeyStreamsNew: (roomname: string) => dispatch(getKeyStreamsNew(roomname)),
        getConsumerStreamsNew: (roomname: string) => dispatch(getConsumerStreamsNew(roomname)),
        setLocalStreamsNew: (data: Array<ILocalStreamsNew>) => dispatch(setLocalStreamsNew(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StreamLayout);
