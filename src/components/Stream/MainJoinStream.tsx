
import { Row, Col } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import { IRemoteStreams } from '../../models/reducers/stream/remoteStream';
import LargeVideoComponent from '../AudioComponent/LargeVideoComponent';

interface Props {
    localStreams: ILocalStreams
    modeStream: number
    remoteStreams: Array<IRemoteStreams>
}
interface State {

}

class MainStream extends Component<Props, State> {
    state = {}

    render() {
        const { localStreams, modeStream, remoteStreams } = this.props;
        const maxcolumn = 3;

        const localVideos = localStreams.videos.filter((stream: any) => stream.active === true);
        const localScreencast = localStreams.screencast.filter((stream: any) => stream.active === true);

        const remoteVideos: Array<{ name: string, active: boolean | any, consumer: any, stream: MediaStream }> = [];
        const remoteKeyVideos: Array<{ name: string, active: boolean | any, consumer: any, stream: MediaStream }> = [];
        const remoteNotKeyVideos: Array<{ name: string, active: boolean | any, consumer: any, stream: MediaStream }> = [];

        remoteStreams.forEach((peer, pIndex) => {
            if (peer.isKey) {
                peer.videos.forEach((v, vIndex) => {
                    if (v.active) {
                        remoteKeyVideos.push(v);
                    }
                })
            }else{
                peer.videos.forEach((v, vIndex) => {
                    if (v.active) {
                        remoteNotKeyVideos.push(v);
                    }
                })
            }
            peer.videos.forEach((v, vIndex) => {
                if (v.active) {
                    remoteVideos.push(v);
                }
            })
        })


        const length: number = remoteKeyVideos.length;
        const column = Math.min(maxcolumn, length);

        let stream01 = null;
        let stream02 = null;
        if (localVideos.length === 0) {
            if (localScreencast.length === 0) {
                if (remoteNotKeyVideos.length > 0) {
                    stream01 = remoteNotKeyVideos[0];
                }
            } else {
                stream01 = localScreencast[0];
            }
        } else {
            stream01 = localVideos[0];
        }

        if(remoteKeyVideos.length > 0){
            stream02 = remoteKeyVideos[0];
        }


        return (
            <div id="main-stream">
                {
                    modeStream === 0 &&
                    <Row style={{ position: 'relative' }}>
                        {/* {localVideos.map((item, index) => (
                            <Col className="main-stream-item" span={24 / column} key={index}>
                                <div className="main-stream-item-name">
                                    {item.name}
                                </div>
                                <LargeVideoComponent video={item} />
                            </Col>
                        ))}
                        {localScreencast.map((item, index) => (
                            <Col className="main-stream-item" span={24 / column} key={index}>
                                <div className="main-stream-item-name">
                                    {item.name}
                                </div>
                                <LargeVideoComponent video={item} />
                            </Col>
                        ))} */}
                        {
                            remoteKeyVideos.map((v, vIndex) => {
                                return (
                                    <Col className="main-stream-item" span={24 / column} key={vIndex}>
                                        <div className="main-stream-item-name">
                                            {v.name}
                                        </div>
                                        <LargeVideoComponent video={v} />
                                    </Col>
                                )
                            })
                        }
                    </Row>
                }
                {
                    modeStream === 2 &&
                    <div className="wrapper-stream-03">
                        <div style={{ background: '#fff' }}>
                            {
                                stream01 &&
                                <LargeVideoComponent video={stream01} />
                            }
                        </div>
                        <div style={{ background: '#fff' }}>
                            {
                                stream02 &&
                                <LargeVideoComponent video={stream02} />
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state: any) => ({
    remoteStreams: state.remoteStreams,
    localStreams: state.localStreams,
    modeStream: state.modeStream,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MainStream)
