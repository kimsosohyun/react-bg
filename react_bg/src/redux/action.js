
import {L_ERROR_MSG,R_ERROR_MSG,SUCCESS_SUB,S_ERROR_MSG,
    SUCCESS_SAVE,GET_LIST,GET_MSG,GET_MSGLIST,UPDATE_READ,
    GET_PICLIST,SEND_PIC,REMOVE_PIC
} from  "./action_type";
import {
    reqLogin, reqRegister, reqSave, reqAutoSave,
    reqList, reqGetMsgList, reqUpdateRead, reqSavePic, reqGetPic,reqRemovePic
} from "../api/index"
import io from "socket.io-client";

const  r_errSend=(msg)=>({type:R_ERROR_MSG,data:msg});
const  l_errSend=(msg)=>({type:L_ERROR_MSG,data:msg});
const succSend=(data)=>({type:SUCCESS_SUB,data:data});
const succSave=(data)=>({type:SUCCESS_SAVE,data:data});
export const  s_errSend=(msg)=>({type:S_ERROR_MSG,data:msg});
const succGet=(data)=>({type:GET_LIST,data:data});
const getMsgList=(data)=>({type:GET_MSGLIST,data:data});
const showMsg=(data)=>({type:GET_MSG,data:data});
const updateReadMsg=(data)=>({type:UPDATE_READ,data:data});
const sendPicList=(data)=>({type:SEND_PIC,data:data});
const getPicList=(data)=>({type:GET_PICLIST,data:data});
const removePicList=(data)=>({type:REMOVE_PIC,data:data});

function socket(userid,dispatch) {
    if (!io.socket){
        io.socket=io("ws://localhost:4000");
        io.socket.on("receiveMsg",(data)=>{
            if (data.to===userid||data.from===userid){//只要是有关于我的
                //无论是发给我的，还是我发的，都需要显示
                dispatch(showMsg(data));
            }
        });

    }
}

function msgList(dispatch,userid){//得到消息列表数据，因为无论是登陆，自动登陆等多处
                                  //都需要使用，所以定义成函数.
    socket(userid,dispatch);
    var req=reqGetMsgList();
    req.then(response=>{
        const  result=response.data;

        dispatch(getMsgList(result.data));

        }

    )

}

export const register=(user)=>{
    // var sendUser={username:user.username,password:user.password,gender:user.gender};

    return dispatch=>{
        if (user.password!==user.password2) {
            dispatch (r_errSend("两次密码不对应"));
            setTimeout(function () {
                dispatch(r_errSend(""));
            },2200)
        }
        else if (user.password===""||user.username===''||user.password2==="")
        {
            dispatch (r_errSend("不可以留空白哦"));
            setTimeout(function () {
                dispatch(r_errSend(""));
            },2200)
        }
        else{
            var req=reqRegister(user);
            req.then(response=>{
                const  result=response.data;
                if (result.code===1)
                {
                    dispatch(r_errSend(result.msg));
                    setTimeout(function () {
                        dispatch(r_errSend(""));
                    },2200)
                }
                else{
                    dispatch(succSend(result.data));
                }
            })
        }

    }

};

export const login=(user)=>{

        // if (user.password===""||user.username==='')
        // {
        //     return l_errSend("不可以留空白哦");
        //     setTimeout(function () {
        //         dispatch(l_errSend(""));
        //     },2200);
        // }  不能用setTimeout.
        return dispatch=>{//只有在异步的action里面才能用setTimeout!!!(只能在dispatch后用,
            // return代表结束，return下面的代码将不再被读取)。
            if (user.password===""||user.username==='')
            {
                dispatch(l_errSend("不可以留空白哦"));
                setTimeout(function () {
                    dispatch(l_errSend(""));
                },2200);
            }
            else{
                var req=reqLogin(user);
                req.then(response=>{
                    const  result=response.data;
                    if (result.code===1)
                    {
                        dispatch(l_errSend(result.msg));
                        setTimeout(function () {
                            dispatch(l_errSend(""));
                        },2200)
                    }
                    else{
                        msgList(dispatch,result.data._id);
                        dispatch(succSend(result.data));
                    }
                })
            }
        }

};

export const save=(user)=>{//用于保存完善信息

    return dispatch=>{

        var req=reqSave(user);
        req.then(response=>{
                const  result=response.data;
                if (result.code===1)
                {
                    dispatch(s_errSend(result.msg));

                }
                else{

                    dispatch(succSave(result.data));
                }
            }

        )

    }
};

export const autoSave=()=>{//用于自动登陆

    return dispatch=>{
        var req=reqAutoSave();
        req.then(response=>{
                const  result=response.data;

                    msgList(dispatch,result.data._id);
                    dispatch(succSave(result.data));
                    //在有cookie Id 且没有 redux id 的时候才发请求
                    //我觉得如果你不篡改cookie的情况下是不会有错误情况发生的。
                    //就算得到错误情况msg我也没有用，所以就不分发了。

            }

        )

    }
};

export const getList=(data)=>{//用于获取用户列表

    return dispatch=>{
        var req=reqList(data);
        req.then(response=>{
            const  result=response.data;
            dispatch(succGet(result.data));

            }

        )

    }
};

export const sendMsg=({from,to,content})=>{//用于发送消息

    return dispatch=> {//异步action必须是这个形式，就算没有用到dispatch分发消息
       // socket(from,dispatch); //有收消息的功能，不可能只在发消息的时候才收消息把（只有发了消息后才能显示消息），应该在登陆的时候就收消息.
        io.socket.emit("sendMsg", {from, to, content})
    }
};

export const updateRead=(from)=>{//用于修改未读消息数量

    return async dispatch=> {
        //需要的数据形式：{key1:value1,key2:value2~}

        var response=await reqUpdateRead({from});
        var result=response.data;
        //console.log(result);  两种发请求得到数据的方式
        //在await之后得到的数据就是response,然后就直接可以通过.data获取到result

        // var req=reqUpdateRead({from});
        // req.then(response=> {
        //     const result = response.data;
        //     console.log(result);
        // })
        //直接得到的数据要then之后才是response,然后才可以通过.data获取到result

        //result包含data和code两个属性
        dispatch(updateReadMsg(result.data));
    }
};

export const savePic=(picList)=>{//用于上传图片列表
    return async dispatch=> {

        var response=await reqSavePic(picList);
        var result=response.data;
        if (result.code===0){
            dispatch(sendPicList(result.data));


        }


    }
};

export const getPic=(user_id)=>{//用于得到图片列表

    return async dispatch=> {

        var response=await reqGetPic({user_id});
        var result=response.data;


            dispatch(getPicList(result.data));



    }
};

export const removePic=(index)=>{//用于得到图片列表

    return async dispatch=> {

        var response=await reqRemovePic(index);
        var result=response.data;

        if (result.code===0) {
            dispatch(removePicList(result.data));
        }




    }
};

