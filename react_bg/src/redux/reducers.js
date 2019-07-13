import  {combineReducers} from "redux";  //联合众多reducers形成一个总体的数组对象
//里面就是各个reducer所对应的单个状态值(json对象)
import {
    R_ERROR_MSG,
    L_ERROR_MSG,
    SUCCESS_SUB,
    SUCCESS_SAVE,
    S_ERROR_MSG,
    GET_LIST,
    GET_MSGLIST,
    GET_MSG,
    UPDATE_READ,
    GET_PICLIST,
    SEND_PIC,
    REMOVE_PIC

} from "./action_type";

import  {setPageTo}  from  "../utils/index"
import Pic_list from "../components/pic_list/pic_list";
const list={
    username:"",
    gender:"",
    msg_r:"",
    msg_l:"",
    msg_s:"",
    to:""
};
function user(state=list,action) {
    switch (action.type) {
        case SUCCESS_SUB:
            return {...action.data,to:setPageTo(action.data.gender,action.data.header)};//返回一个新对象
            //..action.data包含action.data中的所有属性，然后加上to属性。
        case  L_ERROR_MSG:
            return {...state,msg_l:action.data};
        case  R_ERROR_MSG:
            return {...state,msg_r:action.data};
        case SUCCESS_SAVE:
            return action.data;//to属性给了它的大哥main页面
        case S_ERROR_MSG:
            return {...list,msg_s: action.data};//有清空redux的作用，可用于退出登录

        default:
            return state;
    }
    //记住是case  ERROR_MSG:  而不是case "ERROR_MSG"
}

function userList(state=[],action) {
    switch (action.type) {
        case GET_LIST:

            return action.data;
        default:
            return state;
    }

}
var initMsg={
    users:{},
    docs:[],
};//第一次render就会返回这个初始state

function msgList(state=initMsg,action) {
    switch (action.type) {
        case GET_MSGLIST:

            return {...action.data};
        case GET_MSG:

            return {users:state.users,
                docs: [...state.docs,action.data],
            };
        case  UPDATE_READ:
            return {
                users:state.users,
                docs:action.data
            };
        default:
            return state;

    }
}
var initPic={
    userid:"",
    picList:[]

};//第一次render就会返回这个初始state
function picList(state=initPic,action) {
    switch (action.type) {
        case SEND_PIC:

            return action.data;
        case GET_PICLIST:

            return action.data;
        case REMOVE_PIC:
            return action.data;
        default :
            return state;
    }
}

export default combineReducers(
    {user,userList,msgList,picList}

)