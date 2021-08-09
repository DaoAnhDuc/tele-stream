import { Button } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IProducersActive } from "../../models/reducers/stream/producersActiveState";
import { setProducersActive } from "../../reducers/stream/producersActiveReducer";
import ProducerToConsumerStream from "../ProducerToConsumerStream/ProducerToConsumerStream";

interface Props {
    consumerStreamsNewState: Array<any>;
    producersActiveState: IProducersActive;
    setProducersActive: Function;
    // setRemoteStream: Function;
    // modeStream: number;
}
interface State {
    name: string | null;
}

class ConsumerStream extends Component<Props, State> {
    state = { name: "" };

    componentDidMount = async () => {

    };

    onActiveVideos = (index: number) => {

    };

    onMuted = (muted: boolean) => {

    };

    onActiveProducer = (producerId: string | any) => {
        const { producersActiveState } = this.props;
        const producerIndex = producersActiveState.listConsumerStream.findIndex((item, index) => item.producerId === producerId);
        if (producerIndex === -1) {
            producersActiveState.listConsumerStream.push({ producerId, active: true })
        } else {
            const active = !producersActiveState.listConsumerStream[producerIndex].active
            producersActiveState.listConsumerStream[producerIndex] = ({ producerId, active })
        }
        this.props.setProducersActive(producersActiveState)
    }

    render() {
        const { consumerStreamsNewState, producersActiveState } = this.props;
        console.log(consumerStreamsNewState);

        return (
            <div id="local-stream">
                <div className="local-stream-container">
                    {consumerStreamsNewState.map((user, index) => {
                        const listProducer = user.listProducer;
                        return (
                            <div style={{ border: "1px solid blue" }}>
                                <span>{user.username}</span>
                                {listProducer.map((producer: any, index: number) => {
                                    if (producer.producerType === "video") {
                                        const producerIndex = producersActiveState.listConsumerStream.findIndex((item, index) => item.producerId === producer.producerId);
                                        const active = producersActiveState.listConsumerStream[producerIndex]?.active;
                                        return <div style={active ? { border: '2px solid orange' } : { border: '2px solid gray' }}>
                                            <ProducerToConsumerStream producerId={producer.producerId} onClick={() => this.onActiveProducer(producer.producerId)} />
                                        </div>

                                    }
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    consumerStreamsNewState: state.consumerStreamsNewState,
    modeStream: state.modeStream,
    producersActiveState: state.producersActiveState
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setProducersActive: (data: IProducersActive) => dispatch(setProducersActive(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerStream);
