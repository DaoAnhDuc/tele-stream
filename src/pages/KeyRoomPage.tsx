import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { patientInfoStream } from "../models/variables/patientInfoStream";
import { RoomClient } from "../module/RoomClientNew";
import { AxiosInstance, StreamAxiosInstance } from "../utils/setupAxiosInterceptors";
import { store } from "../redux/store";
import { setMessage } from "../reducers/stream/messageReducer";
import StreamLayout from "../layout/Stream/StreamLayout";
import { setPatientInfo } from "../reducers/patientInfoReducer";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface Props {
}
interface State { }

class StreamPage extends Component<Props, State> {
    state = {
        pendding: true,
    };

    componentDidMount = async () => {
        const url = new URL(window.location.href);
        const params = url.searchParams.get("params");
        if (params) {
            const decodeParams = decodeURIComponent(window.atob(params));
            const toJson = JSON.parse(decodeParams);
            console.log(toJson, 'toJson');
            
            patientInfoStream.sid = toJson.sid;
            patientInfoStream.svid = toJson.svid;
            const roomClient = new RoomClient(
                toJson.roomname,
                toJson.password,
                localStorage.getItem("login-name") + "",
                async (roomClient: RoomClient) => {
                    await roomClient.init();
                    await roomClient.initSocketEvent();
                    window.roomClient = roomClient;
                    const patientInfoData = await AxiosInstance(`/api/InforExtend/${toJson.roomname}/patient`);
                    const messages = await StreamAxiosInstance.post("/call/getMessageInRoom", {
                        roomname: window.roomClient.roomname,
                    });
                    store.dispatch(setMessage(messages.data));
                    if (patientInfoData.status === 1) {
                        await store.dispatch(setPatientInfo(patientInfoData.data));
                    }
                    this.setState({ pendding: false });
                }

            );

            //     //Anh Duc
            //     RISAxiosInstance.post(`/api/Hubs/notice-stream`, { data: JSON.stringify({ sid: toJson.sid, svid: toJson.svid, onStream: true, type: "STREAM_NOTIFICATION" })})

        }
    };

    render() {
        return (
            <div className="stream-page" style={{width: '100%',height: '100vh', overflow: 'hidden'}}>
                {this.state.pendding ? (
                    <div
                        style={{
                            width: "100%",
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Spin indicator={antIcon} tip="Đang khởi tạo phòng..." />
                    </div>
                ) : (
                    <StreamLayout />
                )}
            </div>
        );
    }
}
const mapStateToProps = (state: any) => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StreamPage);
