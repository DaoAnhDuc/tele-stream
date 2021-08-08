
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Layout, Spin } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";
import Avatar from 'antd/lib/avatar/avatar';
import { Footer } from 'antd/lib/layout/layout';
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import ChatLeft from '../../components/ChatLeft/ChatLeft';
import { serverConfig } from '../../models/variables/serverConfig';
import RemoteStream from '../../components/Stream/RemoteStream';
import MainStream from '../../components/Stream/MainStream';
import LocalStream from '../../components/Stream/LocalStream';
import ToolbarStream from '../../components/Stream/ToolbarStream';
import { setLocalStreams } from '../../reducers/stream/localStreams';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Header, Sider, Content } = Layout;
interface Props {
    localStreams: ILocalStreams
    setLocalStreams: Function
    chatSiderShow: boolean
    rightSider: boolean
    loadingStream: boolean
}
interface State {
    userCustombanner: string | undefined;
    userCustombannerBottom: string | undefined;

}

class StreamLayout extends Component<Props, State> {
    state = {
        userCustombanner: undefined,
        userCustombannerBottom: undefined
    }

    componentDidMount = async () => {
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        const currentLocalStream = { ...this.props.localStreams }
        for (let index = 0; index < devices.length; index++) {
            const deviceInfo = devices[index];
            if (deviceInfo.kind === "videoinput") {
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
                currentLocalStream.videos.push({ producer, name: deviceInfo.label, active: true, stream: stream })
            }
        }
        await this.props.setLocalStreams(currentLocalStream);
    }

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
                if(name === "userCustombanner"){
                    this.setState({ userCustombanner: e.target.result });
                }else{
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
            <Layout id="stream-layout" style={{ position: 'relative' }}>
                {
                    loadingStream &&
                    <div
                        style={{ width: "100%", height: "100vh", background: '#ffffff4a', position: 'absolute', zIndex: 10, top: 0, left: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                        <Spin size="large" indicator={antIcon} tip="Loading..." />
                    </div>

                }
                {/* <Header className="stream-header">
                    <ToolbarStream />
                </Header> */}
                <Layout className="">
                    {
                        <Sider width={chatSiderShow ? 300 : 0} className="stream-sider stream-sider-chat">
                            <ChatLeft />
                        </Sider>
                    }
                    <Sider width={220} className="stream-sider stream-sider-remote">
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ padding: 0 }} onClick={() => this.uploadBannerImage("userCustombanner")}>
                                {userCustombanner ? (
                                    <img
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        src={userCustombanner ? userCustombanner : ""}
                                        alt=""
                                    />
                                ) : (<div style={{ padding: 10 }}>
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <Avatar
                                            style={{ width: 80, height: 80 }}
                                            src={<Image src={serverConfig.hospitalLogo} />}
                                        />
                                        <p style={{ color: "#2c44c5", fontWeight: "bold", marginBlockEnd: 0, marginTop: 5, fontSize: '16px' }}>
                                            {serverConfig.hospitalName}
                                        </p>
                                        <p style={{ fontSize: "12px", color: "#2c44c5", marginBlockStart: 0, marginBlockEnd: 5 }}>
                                            {serverConfig.hospitalAddress}
                                        </p>
                                    </div>
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <div style={{ color: "red", alignItems: 'center', display: 'flex', justifyContent: 'center' }} >
                                            <i className="material-icons" style={{ marginBottom: 8, marginRight: 5 }}>live_tv</i> <span>TRỰC TIẾP</span>
                                        </div>
                                        <p style={{ color: "#2c44c5", marginTop: 0, marginBlockEnd: 0 }} >
                                            KHÁM CHỮA BỆNH TỪ XA
                                        </p>
                                    </div></div>)}
                            </div>
                            <RemoteStream />
                            <div style={{ padding: 0 }} onClick={() => this.uploadBannerImage("userCustombannerBottom")}>
                                {userCustombannerBottom ? (
                                    <img
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        src={userCustombannerBottom ? userCustombannerBottom : ""}
                                        alt=""
                                    />
                                ) : (<div style={{ padding: 10 }}>
                                    <div style={{ width: "100%", textAlign: "center", padding: 10 }}>
                                        <Avatar
                                            style={{ width: 80, height: 80 }}
                                            src={<Image src={serverConfig.hospitalLogo} />}
                                        />
                                        <p style={{ color: "#2c44c5", fontWeight: "bold", marginBlockEnd: 0, marginTop: 5, fontSize: '16px' }}>
                                            {serverConfig.hospitalName}
                                        </p>
                                        <p style={{ fontSize: "12px", color: "#2c44c5", marginBlockStart: 0, marginBlockEnd: 5 }}>
                                            {serverConfig.hospitalAddress}
                                        </p>
                                    </div>
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <div style={{ color: "red", alignItems: 'center', display: 'flex', justifyContent: 'center' }} >
                                            <i className="material-icons" style={{ marginBottom: 8, marginRight: 5 }}>live_tv</i> <span>TRỰC TIẾP</span>
                                        </div>
                                        <p style={{ color: "#2c44c5", marginTop: 0, marginBlockEnd: 0 }} >
                                            KHÁM CHỮA BỆNH TỪ XA
                                        </p>
                                    </div></div>)}
                            </div>
                        </div>
                    </Sider>
                    <Content className="stream-content">
                        <MainStream />
                    </Content>
                    {
                        <Sider width={rightSider ? 220 : 0} className="stream-sider stream-sider-local">
                            <LocalStream />
                        </Sider>
                    }
                </Layout>
                <Footer style={{ height: 40, padding: 0 }}>
                    <ToolbarStream  type="KeyStream" />
                </Footer>

            </Layout>
        )
    }
}

const mapStateToProps = (state: any) => ({
    localStreams: state.localStreams,
    chatSiderShow: state.siderState.chatSiderShow,
    rightSider: state.siderState.rightSider,
    loadingStream: state.loadingStream
})

const mapDispatchToProps = (dispatch: any) => {
    return {
        setLocalStreams: (value: ILocalStreams) => dispatch(setLocalStreams(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamLayout)
