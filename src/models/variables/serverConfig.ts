export interface IServerConfig {
    risServerUrl: string;
    scuServerUrl: string;
    socketServerUrl: string;
    hospitalLogo: string,
    hospitalName: string,
    hospitalAddress: string,
}
export const serverConfig: IServerConfig = {
    risServerUrl: "",
    socketServerUrl: "",
    scuServerUrl: '',
    hospitalLogo: '',
    hospitalName: '',
    hospitalAddress: "",
}