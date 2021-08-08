export interface IListKeyCameraItem {
  id: string | number | any;
  name: string;
  active: boolean;
  consume?: any;
  stream?: any;
  producerId?: string | number | any;
}

export const defaultListKeyCamera: { audio: any; videos: Array<IListKeyCameraItem> } = {
  audio: null,
  videos: [],
};
