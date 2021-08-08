const checkAuth = (key = "token") => {
    const token = localStorage.getItem(key);
    if (token) {
        return true;
    } else {
        return false;
    }
};

const saveToken = (token: string, key = "token") => {
    localStorage.setItem(key, token);
};

const getToken = (key = "token") => {
    const token = localStorage.getItem(key);
    return token;
};

const clearToken = (key = "token") => {
    localStorage.removeItem(key);
};

const saveTokenRefresh = (tokenRefresh: string, key = "tokenRefresh") => {
    localStorage.setItem(key, tokenRefresh);
};

const getTokenRefresh = (key = "tokenRefresh") => {
    return localStorage.getItem(key);
};

const clearRefreshtoken = (key = "tokenRefresh") => {
    localStorage.removeItem(key);
};

const clearAll = () => {
    clearToken("token");
    clearRefreshtoken("tokenRefresh");
};

export { checkAuth, saveToken, getToken, clearAll };
