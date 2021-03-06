export interface IPatientInfo {
  assDepartment: any;
  assDoctor: any;
  assTime: any;
  bed: any;
  bodyPart: any;
  clinicalHistory: any;
  diagnose: any;
  excutors: any;
  indication: any;
  modality: any;
  pAddress: any;
  pAge: any;
  pBirthDay: any;
  pCode: any;
  pEmail: any;
  pGender: any;
  pId: any;
  pName: any;
  pPhoneNo: any;
  pTypeCode: any;
  room: any;
  sCode: any;
  sId: any;
  state: any;
  studyTime: any;
  svId: any;
  template: any;
  timeEx: any;
}

export const defaultPatientInfo = {
  assDepartment: "",
  assDoctor: "",
  assTime: null,
  bed: "",
  bodyPart: "ABDOMEN",
  clinicalHistory: "<p>teasdasdadasdasdasd</p>",
  diagnose: "",
  excutors: [],
  indication: "",
  modality: null,
  pAddress: "",
  pAge: 0,
  pBirthDay: "1952-05-13T00:00:00",
  pCode: "",
  pEmail: "",
  pGender: "",
  pId: 1888,
  pName: "",
  pPhoneNo: "",
  pTypeCode: "",
  room: "",
  sCode: null,
  sId: 856,
  state: null,
  studyTime: null,
  svId: -1,
  template: [],
  timeEx: null,
};
