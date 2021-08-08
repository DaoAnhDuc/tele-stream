import * as React from 'react';
import { connect } from 'react-redux';

interface Props {

}
interface State {

}
class HomePage extends React.Component<Props, any> {
    render() {
        return (
            <div>
                Home
            </div>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
