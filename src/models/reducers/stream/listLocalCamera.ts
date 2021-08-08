export interface IListLocalCameraItem {
  id?: string | number | any;
  producer?: string | number | any;
  name: string;
  active: boolean;
  stream?: any;
}

export const defaultListLocalCamera: Array<IListLocalCameraItem> = [
  
];


