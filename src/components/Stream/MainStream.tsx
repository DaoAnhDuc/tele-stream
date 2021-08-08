
import { Row, Col } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ILocalStreams } from '../../models/reducers/stream/localStreams';
import { IRemoteStreams } from '../../models/reducers/stream/remoteStream';
import LargeVideoComponent from '../AudioComponent/LargeVideoComponent';

interface Props {
    localStreams: ILocalStreams
    remoteStreams: Array<IRemoteStreams>
    modeStream: number
}
interface State {

}

class MainStream extends Component<Props, State> {
    state = {

    }

    render() {
        const { localStreams, modeStream, remoteStreams } = this.props;
        const maxcolumn = 3;

        const localVideos = localStreams.videos.filter((stream: any) => stream.active === true);
        const localScreencast = localStreams.screencast.filter(((stream: any) => stream.active === true))

        const remoteVideos: Array<{ name: string, active: boolean | any, consumer: any, stream: MediaStream }> = [];
        remoteStreams.map((peer, pIndex) => {
            peer.videos.map((v, vIndex) => {
                if (v.active) {
                    remoteVideos.push(v);
                }
            })
        })

        const length: number = localVideos.length + localScreencast.length ;
        const column = Math.min(maxcolumn, length);

        let stream01 = null;
        let stream02 = null;
        if (localVideos.length === 0) {
            localStreams.screencast.forEach((s) => {
                if (s.active) {
                    stream02 = s;
                }
            })
        } else {
            stream02 = localVideos[0];
        }

        if (remoteVideos.length > 0) {
            stream01 = remoteVideos[0];
        }

        return (
            <div id="main-stream">
                {
                    modeStream === 0 &&
                    <Row style={{ position: 'relative' }}>
                        {localVideos.map((item, index) => (
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
                        ))}
                        {/* {remoteVideos.map((item, index) => (
                            <Col className="main-stream-item" span={24 / column} key={index}>
                                <div className="main-stream-item-name">
                                    {item.name}
                                </div>
                                <LargeVideoComponent video={item} />
                            </Col>
                        ))} */}
                    </Row>
                }
                {
                    modeStream === 2 &&
                    <Row  style={{position: 'relative'}}>
                        <Col span={12}  className="main-stream-item" >
                            {
                                stream01 &&
                                <LargeVideoComponent video={stream01} />
                            }
                        </Col>
                        <Col span={12}  className="main-stream-item" >
                            {
                                stream02 &&
                                <LargeVideoComponent video={stream02} />
                            }
                        </Col>
                    </Row>
                }
                {/* {
                    modeStream === 1 &&
                    <div className="wrapper-stream-02">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                } */}
                {/* {
                    modeStream === 3 &&
                    <div className="wrapper-stream-04">
                        <div>
                            <div>
                                <div></div>
                                <div></div>
                            </div>
                            <div></div>
                        </div>
                        <div>
                            <div>
                                <div></div>
                                <div></div>
                            </div>
                            <div></div>
                        </div>
                    </div>
                } */}
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
