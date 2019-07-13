import React,{Component} from "react";
import {connect}  from  "react-redux";
import  {List,Badge}  from  "antd-mobile";
import {setPageTo} from "../utils";
import {Redirect} from "react-router-dom";


const  Item=List.Item;
const Brief=Item.Brief;


class  Message extends Component{

    getLastMsg=(docs,m_id)=>{//得到最后一条消息和显示未读消息数量
        var lastMsgObjs={};
        docs.forEach((msg)=>{ //forEach遍历函数不需要return，是直接更改本身数组。
            if (msg.to===m_id&&!msg.read){

                msg.unRead=1;
            }
            else{
                msg.unRead=0;
            }

            if (lastMsgObjs[msg.chat_id])
            {
                const unRead=lastMsgObjs[msg.chat_id].unRead;//记录并保存上一个lastMsg的未读数量
                //lastMsgObjs[msg.chat_id]就是msg
                if (msg.create_time>lastMsgObjs[msg.chat_id].create_time) {
                    lastMsgObjs[msg.chat_id]=msg;//得到新的lastMsg

                    lastMsgObjs[msg.chat_id].unRead=unRead+msg.unRead;//给新的lastMsg赋值

                }
            }
            else{
                lastMsgObjs[msg.chat_id]=msg;
            }
        });
        const lastMsgs=Object.values(lastMsgObjs);//定义一个包含value值的数组

        lastMsgs.sort((m1,m2)=>{
            return m2.create_time-m1.create_time;//减下来的值小于0，则把m1排到前面！
        });

        return lastMsgs;
    };

    handleClick=(userid)=>{
        this.props.history.push("/chat/"+userid+"")
    };


    render(){
        const {msgList}=this.props;
        const {user}=this.props;
        const m_id=user._id;
        if (user.header) {
            if (msgList.users[m_id]){
                var lastMsg=this.getLastMsg(msgList.docs,m_id);
                return (
                    <List style={{marginTop:50}}>
                        {lastMsg.map(msg=>
                            {   //如果map函数内要写一些别的代码，不是都是返回值
                                //就不用(),采用{别的代码+return代码}
                                //map函数才需要return,map不会更改原来的数组，而是返回一个新数组

                                const o_id = msg.to === m_id ? msg.from : msg.to;
                                return <Item key={msg._id}
                                             extra={<Badge text={msg.unRead}/>}
                                             onClick={()=>{this.handleClick(o_id)}}
                                             className="message_item"
                                             arrow='horizontal'//右边有一个箭头
                                             thumb={msgList.users[o_id][1]}
                                >
                                    {msgList.users[o_id][0]}
                                    <Brief>{msg.content}</Brief>
                                </Item>
                            }
                        )
                        }
                    </List>
                )
            }
            else{
                return null;
            }
        }
        else{
            var path=setPageTo(user.gender,user.header);
            return  <Redirect to={path}/>
        }

    }
}

export default connect(
    state=>({msgList:state.msgList,user:state.user}),
    {}
)(Message)