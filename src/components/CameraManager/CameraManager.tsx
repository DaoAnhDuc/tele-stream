import React, { Component } from "react";
import { connect } from "react-redux";
import { ILocalStreamsNew } from "../../models/reducers/stream/localStreamsNew";
import { setLocalStreamsNew } from "../../reducers/stream/localStreamsNew";

interface Props {
    localStreamsNewState: Array<ILocalStreamsNew>;
    setLocalStreamsNew: Function;
}
interface State {}

class CameraManager extends Component<Props, State> {
    changeVideoState = (index: number) => {
        const currentLocalStreamsNewState = [...this.props.localStreamsNewState];
        currentLocalStreamsNewState[index].active = !currentLocalStreamsNewState[index].active;
        if (currentLocalStreamsNewState[index].active===false) {
            currentLocalStreamsNewState[index].producer?.producer.pause();
        }else{
            currentLocalStreamsNewState[index].producer?.producer.resume();
        }
        this.props.setLocalStreamsNew(currentLocalStreamsNewState);
    };

    render() {
        return (
            <div style={{cursor:"pointer"}}>
                {this.props.localStreamsNewState.map((item, index) => {
                    return (
                        item.type === "videoinput" && (
                            <div
                                onClick={() => this.changeVideoState(index)}
                                key={index}
                                style={{
                                    border: item.active ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                    padding: 5,
                                }}
                            >
                                {item.name}
                            </div>
                        )
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    localStreamsNewState: state.localStreamsNewState,
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        setLocalStreamsNew: (data: Array<ILocalStreamsNew>) => dispatch(setLocalStreamsNew(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraManager);
