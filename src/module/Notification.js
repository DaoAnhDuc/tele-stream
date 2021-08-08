import { notification } from "antd";

const Notification = (type, message) => {
    notification[type]({
        message: 'Thông báo!',
        description: message,
        placement: "bottomRight",
    });
}

export { Notification }