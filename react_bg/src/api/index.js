
import ajax from "./ajax";

export const reqRegister=(data)=>(ajax("/register",data,"POST"));

export const reqLogin=(data)=>(ajax("/login",data,"POST"));

export const reqSave=(data)=>(ajax("/update",data,"POST"));

export const reqAutoSave=()=>(ajax("/autoSave"));

export const reqList=(data)=>(ajax("/list",data));

export const reqGetMsgList=()=>(ajax("/connect"));

export const reqUpdateRead=(data)=>(ajax("/updateRead",data,"POST"));

export const reqSavePic=(data)=>(ajax("/sendPic",data,"POST"));

export const reqGetPic=(data)=>(ajax("/getPic",data));

export const reqRemovePic=(data)=>(ajax("/removePic",data,"POST"));