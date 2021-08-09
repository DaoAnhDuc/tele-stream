import { Button } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IProducersActive } from "../../models/reducers/stream/producersActiveState";
import { setProducersActive } from "../../reducers/stream/producersActiveReducer";
import ProducerToConsumerStream from "../ProducerToConsumerStream/ProducerToConsumerStream";

interface Props {
    keyStreamsNewState: Array<any>;
    setProducersActive: Function;
    producersActiveState: IProducersActive
    modeStream: number;
}
interface State {
    name: string | null;
}

class KeyStream extends Component<Props, State> {
    state = { name: "" };

    componentDidMount = async () => {

    };

    onActiveVideos = (index: number) => {

    };

    onMuted = (muted: boolean) => {

    };

    onActiveProducer = (producerId: string | any) => {
        const { keyStreamsNewState, producersActiveState } = this.props;
        const producerIndex = producersActiveState.listKeyStream.findIndex((item, index) => item.producerId === producerId);
        if (producerIndex === -1) {
            producersActiveState.listKeyStream.push({ producerId, active: true })
        } else {
            const active = !producersActiveState.listKeyStream[producerIndex].active
            producersActiveState.listKeyStream[producerIndex] = ({ producerId, active })
        }
        this.props.setProducersActive(producersActiveState)
    }

    render() {
        const { keyStreamsNewState, producersActiveState } = this.props;
        return (
            <div id="local-stream">
                <div className="local-stream-container">
                    {keyStreamsNewState.map((user, index) => {
                        const listProducer = user.listProducer;
                        return listProducer.map((producer: any, index: number) => {
                            if (producer.producerType === "video") {
                                const producerIndex = producersActiveState.listKeyStream.findIndex((item, index) => item.producerId === producer.producerId);
                                const active = producersActiveState.listKeyStream[producerIndex]?.active;
                                return <div style={active?{border: '2px solid orange'}: {border: '2px solid gray'}}>
                                    <ProducerToConsumerStream producerId={producer.producerId} onClick={() => this.onActiveProducer(producer.producerId)} />
                                </div>

                            }
                        });
                    })}
                    {/* {
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
                    } */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    keyStreamsNewState: state.keyStreamsNewState,
    modeStream: state.modeStream,
    producersActiveState: state.producersActiveState
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setProducersActive: (data: IProducersActive) => dispatch(setProducersActive(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyStream);
