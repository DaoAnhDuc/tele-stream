import React, { Component } from "react";
import { connect } from "react-redux";
import { IError } from "../../models/reducers/error.model";
import { setErrorBoundry } from "../../reducers/errorBoudryReducer";

interface Props {
    errorBoundryState: IError;
    setErrorBoundry: Function;
}
interface State {}

class ErrorBoundry extends Component<Props, State> {
    state = {};

    render() {
        const { errorBoundryState } = this.props;
        if (errorBoundryState.show && errorBoundryState.error) {
            return <div></div>;
        } else {
            return null;
        }
    }
}

function mapStateToProps(state: any) {
    return {
        errorBoundryState: state.errorBoundryState,
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        setErrorBoundry: (error: IError) => dispatch(setErrorBoundry(error)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundry);
