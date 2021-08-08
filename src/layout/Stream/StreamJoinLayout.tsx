
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, Layout, Spin } from 'antd'
import ToolbarStream from '../../components/Stream/ToolbarStream';
import LocalJoinStream from '../../components/Stream/LocalJoinStream';
import RemoteJoinStream from '../../components/Stream/RemoteJoinStream';
import MainJoinStream from '../../components/Stream/MainJoinStream';
import KeyJoinStream from '../../components/Stream/KeyJoinStream';

import { LoadingOutlined } from "@ant-design/icons";
import Avatar from 'antd/lib/avatar/avatar';
import { serverConfig } from '../../models/variables/serverConfig';
import Title from 'antd/lib/skeleton/Title';
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import ChatLeft from '../../components/ChatLeft/ChatLeft';
import { setLocalStreams } from '../../reducers/stream/localStreams';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Header, Sider, Content,Footer } = Layout;
interface Props {
    localStreams: ILocalStreams
    setLocalStreams: Function
    chatSiderShow: boolean
    rightSider: boolean
    loadingStream: boolean
}
interface State {
    userCustombanner: string | undefined;
}

class StreamJoinLayout extends Component<Props, State> {
    state = { userCustombanner: undefined }

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

    uploadBannerImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.removeEventListener("change", this.readURL);
        input.addEventListener("change", this.readURL);
        input.click();
    };

    readURL = (input: any) => {
        if (input.target.files && input.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.setState({ userCustombanner: e.target.result });
            };
            reader.readAsDataURL(input.target.files[0]);
        }
    };

    render() {
        const { chatSiderShow, rightSider, loadingStream } = this.props;
        const { userCustombanner } = this.state;
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
                    <Sider width={rightSider ? 220 : 0} className="stream-sider stream-sider-local">
                        <div style={{ padding: 10 }} onClick={this.uploadBannerImage}>
                            {userCustombanner ? (
                                <img
                                    style={{ width: "100%", height: "100%", maxHeight: 200, objectFit: "contain" }}
                                    src={userCustombanner ? userCustombanner : ""}
                                    alt=""
                                />
                            ) : (<>
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
                                </div></>)}
                        </div>
                        <LocalJoinStream />
                        <RemoteJoinStream />
                    </Sider>
                    <Content className="stream-content">
                        <MainJoinStream />
                    </Content>
                    <Sider width={rightSider ? 220 : 0} className="stream-sider stream-sider-local">
                        <KeyJoinStream  />
                    </Sider>
                </Layout>
                <Footer style={{ height: 40, padding: 0 }}>
                    <ToolbarStream type="JoinStream"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(StreamJoinLayout)
