import { Button } from 'antd';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux';
import { IRemoteStreams } from '../../models/reducers/stream/remoteStream';
import { patientInfoStream } from '../../models/variables/patientInfoStream';
import { setRemoteStream } from '../../reducers/stream/remoteStreams';
import { AxiosInstance } from '../../utils/setupAxiosInterceptors';
import AudioComponent from '../AudioComponent/AudioComponent';
import VideoComponent from '../AudioComponent/VideoComponent';

interface Props {
    remoteStreams: Array<IRemoteStreams>
    setRemoteStream: Function;
    modeStream: number;
}
interface State {
    name: string | null
}

class KeyJoinStream extends Component<Props, State> {
    state = {name: ""}


    componentDidMount = async () => {
       const response = await AxiosInstance.get(`/api/InforExtend/${patientInfoStream.sid}/patient`)
       this.setState({
           name: response.data.pName
       })
    }

    onActiveVideos = (index: number) => {
        const { remoteStreams, modeStream } = this.props;
        if (modeStream === 0) {
            remoteStreams.forEach((item) => {
                if (item.isKey) {
                    item.videos.forEach((v, vIndex) => {
                        if (vIndex === index) {
                            v.active = !v.active
                        }
                    })
                }
            })
        } else if (modeStream === 2) {
            remoteStreams.forEach((item) => {
                if (item.isKey) {
                    item.videos.forEach((v, vIndex) => {
                        if (vIndex === index) {
                            v.active = true
                        } else {
                            v.active = false
                        }
                    })
                }
            })
        }
        this.props.setRemoteStream(remoteStreams)
    }

    onMuted = (muted: boolean) => {
        const { remoteStreams } = this.props;
        const keyStream: Array<IRemoteStreams> = remoteStreams.filter((item) => item.isKey === true)
        keyStream[0].audio.muted = muted;
        this.props.setRemoteStream(remoteStreams)
    }

    render() {
        const { remoteStreams } = this.props;
        const keyStream = remoteStreams.filter((item) => item.isKey === true);
        console.log(keyStream,'keyStream');
        
        return (
            <div id="local-stream">
                <div className="local-stream-container">
                    {
                        keyStream[0] && <>
                            <div className="stream-name-login">
                                <span>{this.state.name}</span>
                                {
                                    keyStream[0].audio &&
                                    <Button
                                        type="link"
                                        onClick={() => this.onMuted(!keyStream[0].audio.muted)}
                                        className="btn-audio"
                                        icon={
                                            (!keyStream[0].audio.muted) ? (
                                                <i className="material-icons">volume_up</i>
                                            ) : (
                                                <i className="material-icons">volume_mute</i>
                                            )
                                        }
                                    ></Button>
                                }
                                {keyStream[0].audio && <AudioComponent audio={keyStream[0].audio} muted={keyStream[0].audio.muted ? keyStream[0].audio.muted : false} />}
                            </div>
                            <div className="streams">
                                {keyStream[0]?.videos.map((item, index) => (
                                    <div key={index} className={item.active ? "stream-item active" : "stream-item"} onClick={() => this.onActiveVideos(index)}>
                                        <div className="stream-item-name">{item.name}</div>
                                        <VideoComponent video={item} />
                                    </div>
                                ))}
                                {
                                    keyStream[0].videos.length === 0 &&
                                    <h1>Chưa có kết nối camera</h1>
                                }
                            </div>
                        </>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    remoteStreams: state.remoteStreams,
    modeStream: state.modeStream,
})

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setRemoteStream: (data: Array<IRemoteStreams>) => dispatch(setRemoteStream(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeyJoinStream)
