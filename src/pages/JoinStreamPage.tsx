import React, { Component } from "react";
import { connect } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { patientInfoStream } from "../models/variables/patientInfoStream";
import { RoomClient } from "../module/RoomClientNew";
import { AxiosInstance, StreamAxiosInstance } from "../utils/setupAxiosInterceptors";
import { setMessage } from "../reducers/stream/messageReducer";
import { store } from "../redux/store";
import { setPatientInfo } from "../reducers/patientInfoReducer";
import StreamJoinLayout from "../layout/Stream/StreamJoinLayout";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
interface Props {
}
interface State { }

class JoinStreamPage extends Component<Props, State> {
  state = {
    pendding: true,
  };

  componentDidMount = async () => {
    document.title = "Join Stream Page"
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

    }
  };

  render() {
    return (
      <div className="stream-page" style={{width: '100%',height: '100vh', overflow: 'hidden'}}>
        {this.state.pendding ? (
          <div
            style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Spin indicator={antIcon} tip="Đang tham gia vào phòng..." />
          </div>
        ) : (
          <StreamJoinLayout />
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

export default connect(mapStateToProps, mapDispatchToProps)(JoinStreamPage);
