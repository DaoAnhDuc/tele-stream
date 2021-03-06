import React, { Component } from "react";
import HomePage from "./pages/HomePage";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import ErrorBoundry from "./components/ErrorBoundry/ErrorBoundry";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./style/App.scss";
import "./style/stream.scss";
import { serverConfig } from "./models/variables/serverConfig";
import { checkUserPermision, setupAxiosInterceptors } from "./utils/setupAxiosInterceptors";
import { setAuth } from "./reducers/authenticateReducer";
import { getToken } from "./utils/storeManager";
import { Spin } from "antd";
import KeyRoomPage from "./pages/KeyRoomPage";
import { ILocalStreamsNew } from "./models/reducers/stream/localStreamsNew";
import { setLocalStreamsNew } from "./reducers/stream/localStreamsNew";
interface Props {}
interface State {
    checkingPermision: boolean;
}

declare global {
    interface Window {
        roomClient: any;
    }
}

class App extends Component<Props, State> {
    state = {
        checkingPermision: true,
    };

    constructor(props: Props) {
        super(props);
        this.setGlobalWindowVariable();
        this.getConfig();
        setupAxiosInterceptors(() => {});
        this.initializeInfo();
    }

    setGlobalWindowVariable = () => {
        window.roomClient = null;
    };

    initializeInfo = async () => {
        try {
            const token = getToken();
            const hasPermision = await checkUserPermision(token);
            if (token && hasPermision) {
                await store.dispatch(setAuth(true));
            } else {
                await store.dispatch(setAuth(false));
            }

            await this.setState({ checkingPermision: false });
            await this.getDevices();
        } catch (error) {
            console.log(error);
        }
    };

    getDevices = async () => {
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        const deviceList = [];
        for (let index = 0; index < devices.length; index++) {
            const deviceInfo = devices[index];
            const deviceKind = deviceInfo.kind;
            const deviceName = deviceInfo.label;
            const deviceId = deviceInfo.deviceId;
            const localDevice: ILocalStreamsNew = {
                name: deviceName,
                active: true,
                type: deviceKind,
                deviceId,
                producer: null,
            };
            deviceList.push(localDevice);
        }
        store.dispatch(setLocalStreamsNew(deviceList))
    };

    getConfig = () => {
        const scStr: string | any = localStorage.getItem("serverConfig");
        const sc = JSON.parse(scStr);
        if (window.location.protocol === "http:") {
            serverConfig.scuServerUrl = sc.HTTP_SCU_SERVER;
            serverConfig.risServerUrl = sc.HTTP_RIS_SERVER;
            serverConfig.socketServerUrl = sc.HTTP_SOCKET_SERVER;
        } else {
            serverConfig.scuServerUrl = sc.HTTPS_SCU_SERVER;
            serverConfig.risServerUrl = sc.HTTPS_RIS_SERVER;
            serverConfig.socketServerUrl = sc.HTTPS_SOCKET_SERVER;
        }
        serverConfig.hospitalLogo = sc.LOGO;
        serverConfig.hospitalName = sc.HOSPITAL;
        serverConfig.hospitalAddress = sc.HOSPITAL_ADDRESS;
    };

    render() {
        return (
            <Provider store={store}>
                <ErrorBoundry />
                {this.state.checkingPermision ? (
                    <div
                        style={{
                            background: "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100vh",
                        }}
                    >
                        <Spin tip="Checking user permision..."></Spin>
                    </div>
                ) : (
                    <KeyRoomPage />
                )}
            </Provider>
        );
    }
}

export default App;
