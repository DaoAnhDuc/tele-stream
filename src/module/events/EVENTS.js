const EVENTS = {
    SOCKET_CONNECTION: "connection",
    SOCKET_CHANGE_ROOM_PASSWORD: "SOCKET_CHANGE_ROOM_PASSWORD",
    SOCKET_CREATE_ROOM: "SOCKET_CREATE_ROOM",
    SOCKET_GET_ROOM_INFO: "SOCKET_GET_ROOM_INFO",
    SOCKET_DISCONNECT: "disconnect",
    SOCKET_USER_DISCONNECT: "SOCKET_USER_DISCONNECT",
    SOCKET_REMOVE_ROOM: "SOCKET_REMOVE_ROOM",
    SOCKET_USER_LEFT_ROOM: "SOCKET_USER_LEFT_ROOM",
    SOCKET_USER_JOIN_ROOM: "SOCKET_USER_JOIN_ROOM",
    INCOMMING_MESSAGE: "INCOMMING_MESSAGE",
    SOCKET_EXIT_ROOM: "SOCKET_EXIT_ROOM",
    SOCKET_SEND_MESSAGE: "SOCKET_SEND_MESSAGE",
    SOCKET_GET_MESSAGE_IN_ROOM: "SOCKET_GET_MESSAGE_IN_ROOM",
    CHECK_ROOM_ALREADY: "CHECK_ROOM_ALREADY"

}

const RTC_EVENTS = {
    CREATE_TRANSPORT: "CREATE_RTC_TRANSPORT",
    CONNECT_TRANSPORT: "CONNECT_RTC_TRANSPORT",
    CREATE_PRODUCE: "CREATE_PRODUCE",
    CREATE_CONSUME: "CREATE_CONSUME",
    CONSUME_RESUME: "CONSUME_RESUME",
    GET_ROUTER_CAPABILITIES: "GET_ROUTER_CAPABILITIES",
    GET_PRODUCER: "GET_PRODUCER",
    NEW_PRODUCER: "NEW_PRODUCER",
    CLOSE_PRODUCER: "CLOSE_PRODUCER",
    CLOSE_CONSUME: "CLOSE_CONSUME",
    UPDATE_CONSUME: "UPDATE_CONSUME",
    GET_PRODUCER_OF_USER_KEY: "GET_PRODUCER_OF_USER_KEY"
}


export { EVENTS, RTC_EVENTS };