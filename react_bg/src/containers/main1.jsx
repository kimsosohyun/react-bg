import React,{Component} from "react";
import  {Switch,Route,Redirect}  from  "react-router-dom";
import Girl_infor from "./girl_infor";
import Boy_infor from "./boy_infor";
import  Chat  from "./chat";
import {connect}  from "react-redux";
import  Cookies  from  'js-cookie';
import  {setPageTo}   from  "../utils/index";
import    {autoSave}  from "../redux/action";
import  Boy   from "./boy";
import  Girl from "./girl";
import   Message from "./message";
import Personal from "./personal"
import  {NavBar}   from "antd-mobile";
import  Footer  from  "../components/footer/footer";
import NotFound from "../components/notFound/notFound";
import  PubSub from "pubsub-js";
import Like from "./like";
class Main extends Component{

    sendUnMsg=(docs,m_id)=>{//分发总的未读的消息数量
        var lastMsgObjs={};
        let comUnRead=0;

        docs.forEach((msg)=>{ //forEach遍历函数不需要return
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
        lastMsgs.forEach(msg=>{
            comUnRead+=msg.unRead;

            PubSub.publish("unRead",comUnRead);
        });
    };


    componentDidMount() {


        const _id=Cookies.get("userid");
        //
        // PubSub.publish("getLastMsg",this.gerLastMsg);

        if (_id){
            if (!this.props.user._id)
            {

                this.props.autoSave();

            }
        }

    }//在第一次render()之后调用，一般用于发ajax请求。

    lists=[
        {
            path:"/boy",
            component:Boy,
            title:"小姐姐们",
            icon:"girl",
            text:"小姐姐",
            hide:""
        },
        {
            path:"/girl",
            component:Girl,
            title:"小哥哥们",
            icon:"girl",
            text:"小哥哥",
            hide:""
        },
        {
            path:"/message",
            component:Message,
            title:"消息界面",
            icon:"message",
            text:"看消息",
            hide:""

        },
        {
            path:"/personal",
            component:Personal,
            title:"个人界面",
            icon:"personal",
            text:"关于我",
            hide:""

        }
    ];

    render(){
        // const {_id}=this.props.user;
        // if(!_id){
        //     return(
        //         <Redirect to="/login"/>
        //         //要访问girl_infor,boy_infor等等Main页面下的子路由
        //         //必须要经过main这个主路由
        //         //可以防止直接输入路由进入子路由（跳过登陆）等等问题。
        //     )

        // }
        const _id=Cookies.get("userid");
        const pathName=this.props.location.pathname;
        const {header,gender}=this.props.user;
        if (_id){
            if (this.props.user._id)
            {  

                if (pathName==="/"||(pathName==="/girl"&&gender==="man")||(pathName==="/boy"&&gender==="woman")){//只有在路由是/时才有自动跳转功能。
                    // pathName==="/"一般用于自动登陆或错误页面返回首页，实现 自动帮你跳到你应该在的页面 这个功能。
                    var path=setPageTo(gender,header);
                    return  <Redirect to={path}/>

                }

                else{

                    let page=this.lists.find(value => (pathName===value.path));
                    if (page)
                    {
                        if(gender==="woman")
                        {
                            this.lists[0].hide=true;
                        }
                        else if (gender==="man"){
                            this.lists[1].hide=true;
                        }
                        var lists1=this.lists.filter((value)=>(!value.hide));
                        // console.log(this.lists.find((value)=>(!value.hide)));
                        //array.filter() 遍历数组返回 返回值会true的数据。
                        //array.find()  返回 第一个返回值会true的数据，只返回一个数据。
                    }
                    if (this.props.msgList.docs[0]){
                        this.sendUnMsg(this.props.msgList.docs,this.props.user._id);
                    }

                    return (

                        <div>
                            {page?<NavBar className="title">{page.title}</NavBar>:null}
                            <Switch>
                                {
                                    this.lists.map((value)=>(
                                        <Route getLastMsg={this.getLastMsg} key={value.title} path={value.path} component={value.component}/>
                                    ))
                                }
                                <Route path="/girl_infor" component={Girl_infor}/>
                                <Route path="/boy_infor" component={Boy_infor}/>
                                <Route path="/chat/:userid" component={Chat}/>
                                <Route path="/like/:userid" component={Like}/>
                                <Route  component={NotFound}/>
                            </Switch>
                            {page?<Footer lists={lists1}/>:null}
                        </div>
                    )
                }
            }
            else{
                return null;
            }
        }
        else{
            return  <Redirect to="/login"/>
        }
    }
}

export default  connect(
    state=>({user:state.user,msgList:state.msgList}),
    {autoSave}
)
(Main)