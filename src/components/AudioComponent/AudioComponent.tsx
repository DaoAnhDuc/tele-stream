import React, { Component } from "react";

interface Props {
  audio: any;
  muted:boolean
}
interface State {}

class AudioComponent extends Component<Props, State> {
  audioRef: any;
  componentDidMount = async () => {
    const { audio } = this.props;
    const stream = audio?.stream
    if (this.audioRef) {
      this.audioRef.srcObject = stream;
    }
  };

  componentDidUpdate = async (prevProp: Props) => {
    if (prevProp.audio !== this.props.audio) {
      const { audio } = this.props;
      const stream = audio?.stream
      if (this.audioRef) {
        this.audioRef.srcObject = stream;
      }
    }
  };

  componentWillUnmount = () => {
    console.log("componentWillUnmount", this.props.audio.name);
    // window.roomClient?.closeConsumer(this.props.video?.consumer.id)
    // const stream = this.props.video.stream;
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

  render() {
    return <audio muted={this.props.muted} style={{display:"none"}} controls={true} autoPlay={true} ref={(ref) => (this.audioRef = ref)}></audio>;
  }
}

export default AudioComponent;
