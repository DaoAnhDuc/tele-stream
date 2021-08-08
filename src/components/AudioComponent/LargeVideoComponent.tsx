import React, { Component } from "react";

interface Props {
    video: any;
}
interface State {}

class LargeVideoComponent extends Component<Props, State> {
    videoRef: any;
    componentDidMount = async () => {
        const { video } = this.props;
        if (this.videoRef) {
            this.videoRef.srcObject = video.stream.clone();
        }
    };

    componentDidUpdate = async (prevProp: Props) => {
        if (prevProp.video !== this.props.video) {
            const { video } = this.props;
            if (this.videoRef) {
                this.videoRef.srcObject = video.stream.clone();
            }
        }
    };

    componentWillUnmount=()=>{
       const stream= this.videoRef.srcObject;
       const tracks=stream.getTracks();
       tracks.forEach((track:any) => {
        track.stop();
       });
    }

    onDoubleClick = (e: any) => {
        if(e.target.offsetParent){
            if(e.target.offsetParent.className.indexOf("active-only") === -1){
                e.target.offsetParent.className = e.target.offsetParent.className+= " active-only"
            }else{
                e.target.offsetParent.className = e.target.offsetParent.className.split(" active-only")[0]
            }
            console.log(e.target.offsetParent.className);
        }
    }

    render() {
        // console.log(this.props.video);
        return (
            <video
                onDoubleClick={this.onDoubleClick}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
                autoPlay={this.props.video.active === undefined ? true : this.props.video.active}
                ref={(ref) => (this.videoRef = ref)}
            ></video>
        );
    }
}

export default LargeVideoComponent;
