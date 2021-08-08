import React, { Component } from "react";

interface Props {
    video: any;
}
interface State {}

class VideoComponent extends Component<Props, State> {
    videoRef: any;
    componentDidMount = async () => {
        // console.log("componentDidMount", this.props.video);

        const { video } = this.props;
        if (this.videoRef) {
            // if (this.videoRef.srcObject) {
            //     this.stopStream();
            // }
            this.videoRef.srcObject = video.stream;
        }
    };


    componentDidUpdate = async (prevProps: Props) => {
        // console.log("componentDidUpdate", this.props.video);
        const { video } = this.props;
        if(prevProps.video !== video){
            if (this.videoRef) {
                // if (this.videoRef.srcObject) {
                //     this.stopStream();
                // }
                this.videoRef.srcObject = video.stream;
            }
        }

    };

    componentWillUnmount = () => {
        console.log("componentWillUnmount", this.props.video);
        // this.stopStream();
        // stream.onended = () => {
        //   console.info("ScreenShare has ended");
        // };
        // if (stream) {
        //   const tracks = stream.getTracks();
        //   console.log(tracks)
        //   tracks.forEach((track: any) => {
        //     track.stop();
        //   });
        // }
    };

    stopStream = () => {
        console.log("stop");
        const stream = this.props.video.stream;
        const tracks = stream.getTracks();
        console.log(tracks);
        tracks.forEach((track: any) => {
            track.stop();
        });
    };

    render() {
        return (
            <video
                width={"100%"}
                height={"100%"}
                autoPlay={ true }
                ref={(ref) => (this.videoRef = ref)}
            ></video>
        );
    }
}

export default VideoComponent;
