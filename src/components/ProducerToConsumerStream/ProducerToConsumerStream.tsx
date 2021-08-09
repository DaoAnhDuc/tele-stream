import React, { Component, PureComponent, VideoHTMLAttributes } from "react";

interface Props {
    producerId: string;
    onClick: Function;
}
interface State {}

class ProducerToConsumerStream extends PureComponent<Props, State> {
    videoRef: HTMLVideoElement | null;
    consumer: any;
    constructor(props: Props) {
        super(props);
        this.videoRef = null;
        this.consumer = null;
    }

    componentDidMount = () => {
        console.log("componentDidMount");
        this.getConsumerFromProducerId(this.props.producerId);
    };

    componentDidUpdate = async (prevProps: Props) => {
        if (prevProps.producerId !== this.props.producerId) {
            const roomClient = window.roomClient;
            await roomClient.localUser.closeConsumer(this.consumer.id);
            this.getConsumerFromProducerId(this.props.producerId);
            console.log("componentDidUpdate", this.consumer.id);
        }
    };

    componentWillUnmount = async () => {
        const roomClient = window.roomClient;
        await roomClient.localUser.closeConsumer(this.consumer.id);
        console.log("componentWillUnmount",this.consumer.id);
    };

    getConsumerFromProducerId = async (producerId: string) => {
        const roomClient = window.roomClient;
        const consumer = await roomClient.getConsumerFromProducerId(producerId);
        const stream = new MediaStream();
        stream.addTrack(consumer.track);
        if (this.videoRef) {
            this.videoRef.srcObject = stream;
        }
        this.consumer = consumer;
    };

    render() {
        console.log(this.props.producerId);
        return (
            <div style={{ width: "100%", height: 120, borderRadius: 4,  }} onClick={() => this.props.onClick()}>
                <video
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    autoPlay
                    ref={(ref) => (this.videoRef = ref)}
                ></video>
            </div>
        );
    }
}

export default ProducerToConsumerStream;
