import { Button } from 'antd';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import { IRemoteStreams } from '../../models/reducers/stream/remoteStream';
import { RoomClient } from '../../module/RoomClientNew';
import { UserClient } from '../../module/UserClient';
import { setLocalStreams } from '../../reducers/stream/localStreams';
import { setRemoteStream } from '../../reducers/stream/remoteStreams';
import AudioComponent from '../AudioComponent/AudioComponent';
import VideoComponent from '../AudioComponent/VideoComponent';

interface Props {
    remoteStreams: Array<IRemoteStreams>
    setRemoteStream: Function
    modeStream: number
    localStreams: ILocalStreams
    setLocalStreams: Function
}
interface State {

}

class RemoteJoinStream extends Component<Props, State> {
    state = {}
    componentDidMount = async () => {
        const roomclient: RoomClient = window.roomClient;
        const localUser: UserClient | null = roomclient.localUser;
        const producerInRoomData = await window.roomClient?.getProducerInRoom();
        const producerInRoom = producerInRoomData.data;

        const { remoteStreams } = this.props;

        if (!localUser) {
            return;
        }

        for (let index = 0; index < producerInRoom.length; index++) {
            const element = producerInRoom[index];
            if (element.peerId !== localUser.id) {

                const consumer = await localUser.consumer(
                    roomclient.roomname,
                    localUser.id,
                    roomclient.device.rtpCapabilities,
                    roomclient.consumerTransport,
                    element.producerId
                );
                const stream = new MediaStream();
                stream.addTrack(consumer.track);

                const remoteElementIndex = remoteStreams.findIndex((remote: IRemoteStreams) => remote.peerId === element.peerId);
                if (remoteElementIndex !== -1) {
                    if (consumer.track.kind === "video") {
                        remoteStreams[remoteElementIndex].videos.push({ consumer, stream, active: true, name: element.isKey ? `Key` : `` })
                    } else {
                        remoteStreams[remoteElementIndex].audio = consumer
                    }
                } else {
                    let obj: IRemoteStreams;
                    if (consumer.track.kind === "video") {
                        obj = {
                            peerId: element.peerId,
                            peerName: element.peername,
                            videos: [{ consumer, stream, active: true, name: element.isKey ? `Key` : `` }],
                            audio: null,
                            isKey: element.isKey,
                        }
                    } else {
                        obj = {
                            peerId: element.peerId,
                            peerName: element.peername,
                            videos: [],
                            audio: consumer,
                            isKey: element.isKey,
                        }
                    }
                    remoteStreams.push(obj)
                }

            }
        }
        this.props.setRemoteStream(remoteStreams)
    }

    onActiveStream = (peerId: string, videoIndex: number) => {
        const { remoteStreams, modeStream, localStreams } = this.props;
        if (modeStream === 0) {
            remoteStreams.forEach((peer) => {
                if (peer.peerId === peerId) {
                    peer.videos[videoIndex].active = !peer.videos[videoIndex].active
                }
            })
            this.props.setRemoteStream(remoteStreams);
        } else if (modeStream === 2) {
            remoteStreams.forEach((peer) => {
                if (peer.peerId === peerId) {
                    peer.videos.forEach((v, vIndex) => {
                        if (vIndex === videoIndex) {
                            v.active = true;
                        } else {
                            v.active = false;
                        }
                    })
                } else {
                    peer.videos.forEach((v, vIndex) => {
                        v.active = false;
                    })
                }
            })
            this.props.setRemoteStream(remoteStreams);

            localStreams.videos.forEach((v) => {
                v.active = false
            })
            localStreams.screencast.forEach((v) => {
                v.active = false
            })
            this.props.setLocalStreams(localStreams)
        }
    }

    onMuted = (pIndex: number, muted: boolean) => {
        const { remoteStreams } = this.props;
        remoteStreams[pIndex].audio.muted = muted;
        this.props.setRemoteStream(remoteStreams)
    }

    render() {
        const { remoteStreams } = this.props;
        console.log(remoteStreams, "remoteStreams");
        
        return (
            <div id="remote-join-stream" style={{flex: 1, maxHeight: '100%', overflow: 'auto'}}>
                {
                    remoteStreams.map((peer, index) => {
                        return (
                            <div className="user-stream" key={index}>
                                <div className="stream-name-login">
                                    <span>{peer.peerName}</span>
                                    {
                                        peer.audio &&
                                        <Button
                                            className="btn-audio"
                                            onClick={() => this.onMuted(index, !peer.audio.muted)}
                                            type="link"
                                            icon={
                                                (!peer.audio.muted) ? (
                                                    <i className="material-icons">volume_up</i>
                                                ) : (
                                                    <i className="material-icons">volume_mute</i>
                                                )
                                            }
                                        ></Button>
                                    }
                                    {peer.audio && <AudioComponent audio={peer.audio} muted={peer.audio.muted ? peer.audio.muted : false} />}
                                </div>
                                <div className="streams">
                                    {peer?.videos.map((item: any, videoIndex: any) => (
                                        <div key={videoIndex} className={item.active ? "stream-item active" : "stream-item"} onClick={() => this.onActiveStream(peer.peerId, videoIndex)}>
                                            <div className="stream-item-name">{item.name}</div>
                                            <VideoComponent video={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })

                }
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    remoteStreams: state.remoteStreams,
    modeStream: state.modeStream,
    localStreams: state.localStreams,
})

const mapDispatchToProps = (dispatch: any) => {
    return {
        setRemoteStream: (value: Array<IRemoteStreams>) => dispatch(setRemoteStream(value)),
        setLocalStreams: (value: ILocalStreams) => dispatch(setLocalStreams(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoteJoinStream)
