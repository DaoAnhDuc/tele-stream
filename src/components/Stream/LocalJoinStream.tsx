import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux';
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import { IRemoteStreams } from '../../models/reducers/stream/remoteStream';
import { RoomClient } from '../../module/RoomClientNew';
import { UserClient } from '../../module/UserClient';
import { setLoadingStream } from '../../reducers/stream/loading';
import { setLocalStreams } from '../../reducers/stream/localStreams';
import { setRemoteStream } from '../../reducers/stream/remoteStreams';
import VideoComponent from '../AudioComponent/VideoComponent';

interface Props {
    localStreams: ILocalStreams;
    setLocalStreams: Function;
    modeStream: number;
    remoteStreams: Array<IRemoteStreams>
    setRemoteStream: Function;
    setLoadingStream: Function
}
interface State {
}

class LocalJoinStream extends Component<Props, State> {
    onActiveVideos = async (index: number) => {
        this.props.setLoadingStream(true)
        const { localStreams, modeStream } = this.props;
        const roomClient: RoomClient = window.roomClient;
        const user: UserClient | null = roomClient.localUser;
        if (modeStream === 0) {
            const newLocalStreams = { ...localStreams };
            if (newLocalStreams.videos[index].active) {
                await user?.closeProducer(newLocalStreams.videos[index].producer);
                newLocalStreams.videos[index].producer = null;
            } else {
                const stream = newLocalStreams.videos[index].stream;
                const track = stream.getVideoTracks()[0];
                const producer = await user?.produce(
                    roomClient.routerCapabilities,
                    roomClient.producerTransport,
                    track,
                    "camera"
                );
                newLocalStreams.videos[index].producer = producer;
            }
            newLocalStreams.videos[index].active = !newLocalStreams.videos[index].active;
            await this.props.setLocalStreams(newLocalStreams);
        } else if (modeStream === 2) {
            const newLocalStreams = { ...localStreams };
            newLocalStreams.videos.forEach(async (v, idx) => {
                if (idx === index) {
                    v.active = true;
                    if (v.producer) {
                        await user?.closeProducer(v.producer);
                    }
                    const stream = v.stream;
                    const track = stream.getVideoTracks()[0];
                    const producer = await user?.produce(
                        roomClient.routerCapabilities,
                        roomClient.producerTransport,
                        track,
                        "camera"
                    );
                    v.producer = producer;
                } else {
                    v.active = false;
                    if (v.producer) {
                        await user?.closeProducer(v.producer);
                        v.producer = null;
                    }
                }
            })
            newLocalStreams.screencast.forEach(async (v, idx) => {
                v.active = false;
                await user?.closeProducer(v.producer);
            })
            await this.props.setLocalStreams(newLocalStreams)
        }
        this.props.setLoadingStream(false)
    }

    onRemoteScreencast = async (index: number) => {
        this.props.setLoadingStream(true)
        const { localStreams, modeStream } = this.props;
        const roomClient: RoomClient = window.roomClient;
        const user: UserClient | null = roomClient.localUser;
        if (modeStream === 0) {
            const newLocalStreams = { ...localStreams };
            if (newLocalStreams.screencast[index].active) {
                newLocalStreams.screencast[index].active = false;
            } else {
                newLocalStreams.screencast[index].active = true;
            }
            await this.props.setLocalStreams(newLocalStreams);
        } else if (modeStream === 2) {
            const newLocalStreams = { ...localStreams };
            newLocalStreams.videos.forEach(async (v, idx) => {
                v.active = false;
                await user?.closeProducer(v.producer);
            })
            newLocalStreams.screencast.forEach(async (v, idx) => {
                if (idx === index) {
                    v.active = true;
                } else {
                    v.active = false;
                }
            })
            await this.props.setLocalStreams(newLocalStreams)
        }
        this.props.setLoadingStream(false)
    }


    render() {
        const { localStreams } = this.props;
        
        return (
            <div id="local-stream">
                <div className="local-stream-container">
                    <div className="stream-name-login">
                        {localStorage.getItem("login-name")} (Me)
                    </div>
                    <div className="streams">
                        {localStreams?.videos.map((item, index) => (
                            <div key={index} className={item.active ? "stream-item active" : "stream-item"} onClick={() => this.onActiveVideos(index)}>
                                <div className="stream-item-name">{item.name}</div>
                                <VideoComponent video={item} />
                            </div>
                        ))}
                        {localStreams?.screencast.map((item, index) => (
                            <div key={index} className={item.active ? "stream-item active" : "stream-item  active"} onClick={() => this.onRemoteScreencast(index)}>
                                <div className="stream-item-name">{item.name}</div>
                                <VideoComponent video={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    localStreams: state.localStreams,
    remoteStreams: state.remoteStreams,
    modeStream: state.modeStream,
})

const mapDispatchToProps = (dispatch: any) => {
    return {
        setRemoteStream: (value: Array<IRemoteStreams>) => dispatch(setRemoteStream(value)),
        setLocalStreams: (data: ILocalStreams) => dispatch(setLocalStreams(data)),
        setLoadingStream: (value: boolean) => dispatch(setLoadingStream(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocalJoinStream)
