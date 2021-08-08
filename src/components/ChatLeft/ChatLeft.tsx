import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Col, Input, Row, Form, Layout, Avatar } from "antd";
import { AxiosInstance } from "../../utils/setupAxiosInterceptors";
import { IMessageState } from "../../models/reducers/stream/message";
const { Footer, Content } = Layout;

interface Props {
    messageState: Array<IMessageState>;
}
interface State {}

class ChatLeft extends Component<Props, State> {
    state = {};
    refForm: any;

    sendMessage = (values: any) => {
        const res = AxiosInstance.post("/call/sendMessage", {
            roomname: window.roomClient.roomname,
            message: values.message,
            userId: window.roomClient.localUser.id,
        });
        this.refForm?.resetFields();
    };
    render() {
        const { messageState } = this.props;
        return (
            <Layout style={{ width: "100%", height: "100%" }}>
                <Content style={{ width: "100%" }}>
                    {messageState.map((item: any, index: number) => {
                        console.log(item);
                        return (
                            <Row key={index}>
                                <Col span={3} style={{ alignItems: "flex-end", display: "flex", padding: 5 }}>
                                    {item.id === window.roomClient.socket.id ? null : (
                                        <Avatar src="./icons/avatar.png" />
                                    )}
                                </Col>
                                <Col span={21}>
                                    {item.id === window.roomClient.socket.id ? null : (
                                        <Row style={{ width: "100%" }}>
                                            <div style={{ fontSize: 11, color: "#90949c" }}>{item.name}</div>
                                        </Row>
                                    )}

                                    <Row style={{ width: "100%" }}>
                                        <div
                                            style={
                                                item.id === window.roomClient.socket.id
                                                    ? {
                                                          marginTop: 2,
                                                          marginBottom: 2,
                                                          marginRight: 5,
                                                          background: "#42a5f5",
                                                          color: "#fff",
                                                          borderRadius: "20px 20px 3px 20px",
                                                          display: "block",
                                                          maxWidth: "75%",
                                                          padding: "7px 13px 7px 13px",
                                                          marginLeft: "auto",
                                                          fontSize: 13,
                                                      }
                                                    : {
                                                          marginTop: 2,
                                                          marginBottom: 2,
                                                          background: "#ddd",
                                                          borderRadius: "20px 20px 20px 3px",
                                                          display: "block",
                                                          maxWidth: "75%",
                                                          padding: "7px 13px 7px 13px",
                                                          float: "left",
                                                          fontSize: 13,
                                                          color: "#444950",
                                                      }
                                            }
                                        >
                                            {item.message}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        );
                    })}
                </Content>
                <Footer
                    style={{ padding: 0, margin: 10, display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <Form
                        ref={(ref) => (this.refForm = ref)}
                        layout="inline"
                        name="horizontal_login"
                        onFinish={this.sendMessage}
                    >
                        <Form.Item name="message">
                            <Input placeholder="Nhập tin nhắn" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                style={{ justifyContent: "center", alignItems: "center", display: "flex" }}
                                type="primary"
                                htmlType="submit"
                                icon={<i className="material-icons">send</i>}
                            ></Button>
                        </Form.Item>
                    </Form>
                </Footer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        messageState: state.messageState,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatLeft);
