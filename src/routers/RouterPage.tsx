import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import HomePage from "../pages/HomePage";
import JoinStreamPage from "../pages/JoinStreamPage";
import KeyRoomPage from "../pages/KeyRoomPage";
import RedirectPage from "../pages/RedirectPage";
import { StreamAxiosInstance } from "../utils/setupAxiosInterceptors";
import { checkAuth } from "../utils/storeManager";

const PrivateRoute = ({ children, ...rest }: any) => {
    return (
        <Route
            {...rest}
            render={({ location }: any) =>
                checkAuth() ? (
                    children
                ) : (
                    <RedirectPage/>
                )
            }
        />
    );
};

interface Props {}
interface State {}

class RouterPage extends Component<Props, State> {
    state = {};

    render() {
        console.log("object",StreamAxiosInstance);
        return (
            <Router>
                <Switch>
                    <PrivateRoute  path="/stream">
                        <KeyRoomPage/>
                    </PrivateRoute>
                    <PrivateRoute path="/joinstream">
                        <JoinStreamPage/>
                    </PrivateRoute>
                </Switch>
            </Router>
        );
    }
}

export default RouterPage;
