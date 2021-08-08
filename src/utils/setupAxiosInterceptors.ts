import axios from "axios";
import Axios from "axios";
import { serverConfig } from "../models/variables/serverConfig";
import { setAuth } from "../reducers/authenticateReducer";
import { setErrorBoundry } from "../reducers/errorBoudryReducer";
import { store } from "../redux/store";
import { clearAll, getToken } from "./storeManager";

const TIMEOUT = 1 * 60 * 100000;

let AxiosInstance: any;
let StreamAxiosInstance: any;
const setupAxiosInterceptors = (onUnauthenticated: Function) => {
    const AxiosInstanceTemp = Axios.create({
        timeout: TIMEOUT,
        baseURL: serverConfig.risServerUrl
    });
    const StreamAxiosInstanceTemp = Axios.create({
        timeout: TIMEOUT,
        baseURL: serverConfig.socketServerUrl
    });

    const onRequestSuccess = (config: any) => {
        //run with authen

        const token = localStorage.getItem("token") ? localStorage.getItem("token"): "";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    };

    const onRequestSuccess1 = (config: any) => {
        //run with authen

        // const token = localStorage.getItem("token") ? localStorage.getItem("token"): "";
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    };
    const onResponseSuccess = (response: any) => response?.data;

    const onResponseError = (err: any) => {
        //run with authen

        // const status = err.status || (err.response ? err.response.status : 0);
        // if (status === 403 || status === 401) {
        //     clearAll();
        //     store.dispatch(setAuth(false));
        // } else {
        //     store.dispatch(
        //         setErrorBoundry({
        //             show: true,
        //             error: `From: ${err.config.url}\n` + err,
        //         })
        //     );
        // }

        //run without authen
        store.dispatch(
            setErrorBoundry({
                show: true,
                error: `From: ${err.config.url}\n` + err,
            })
        );
        return Promise.reject(err);
    };

    AxiosInstanceTemp.interceptors.request.use(onRequestSuccess);
    AxiosInstanceTemp.interceptors.response.use(onResponseSuccess, onResponseError);

    StreamAxiosInstanceTemp.interceptors.request.use(onRequestSuccess1);
    StreamAxiosInstanceTemp.interceptors.response.use(onResponseSuccess, onResponseError);
    AxiosInstance=AxiosInstanceTemp
    StreamAxiosInstance=StreamAxiosInstanceTemp

    console.log(StreamAxiosInstance)
};

const checkUserPermision = (token: string | null) => {
    const promise = new Promise(async (resolve, reject) => {
        if (!token) {
            resolve(false);
        } else {
            const RISAxios = axios.create({
                timeout: 1 * 60 * 100000,
                baseURL: serverConfig.risServerUrl,
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            try {
                const response = await RISAxios.get("/api/Users/info");    
                resolve(true);
            } catch (error) {
                resolve(false);
            }
        }
    });

    return promise;
};

export { setupAxiosInterceptors, AxiosInstance, StreamAxiosInstance, checkUserPermision };
