import React,{Component} from "react";
import {connect}  from  "react-redux";
import  {NavBar,WingBlank,List,Icon,Grid}  from "antd-mobile";
import  {sendMsg,updateRead}  from  "../redux/action";
// import  QueueAnim from "rc-queue-anim";
const  Item=List.Item;


class Chat extends Component{
    state={
        isShow:false
    };
    componentDidUpdate () { // 更 新 显 示 列 表
            window.scrollTo(0, document.body.scrollHeight);
    }

    componentDidMount() { //在第一次render之后初始显示列表,即：点击进chat页面就直接到底部。

            window.scrollTo(0, document.body.scrollHeight);
    }



    componentWillMount() {//在第一次render之前
    const emojis=["💓","🤤","😋","😱","🤗","😽","😚", "😍" ,"💞" ,"💚","🤮","💓","🤤","😋",
        "😱","🤗","😽","😚", "😍" ,"💞" ,"💚","🤮","💓","🤤","😋","😱","🤗","😽",
        "😚", "😍" ,"💞" ,"💚","🤮","💓","🤤","😋","😱","🤗","😽","😚", "😍" ,"💞" ,"💚","🤮"];
    this.emojis=emojis.map(emoji=>({text:emoji}));
    }//Grid表格data属性需要个数组[{icon:???,text:???},{icon:???,text:???}~]
    //其中icon是头像,text是文字描述。

    componentWillUnmount() {

        const from=this.props.match.params.userid;
        this.props.updateRead(from)
    }

    handleClick=()=>{
        // console.log(this.input.value);
        const from=this.props.user._id;
        const to=this.props.match.params.userid;
        const content=this.input.value.trim();
        if (content){
                this.props.sendMsg({from,to,content})
            this.input.value="";
            this.setState({isShow:false});
        }
    };
    chooseEmoji=(el)=>{
        this.input.value+=el.text;
    };
    openEmoji=()=>{
        var isShow=!this.state.isShow;
        this.setState({isShow});
        if(isShow) {//当要显示时。

            setTimeout(() => { window.dispatchEvent(new Event('resize'))
                window.scrollTo(0, document.body.scrollHeight);
            }, 0);
            //解决表情显示BUG
        }

    };
    focus=()=>{
        this.setState({isShow:false});
    };
    back=()=>{
        this.props.history.goBack();
    };


    render(){
        const docs=this.props.msgList.docs;//得到有关于我的所有消息列表的数组
        const users=this.props.msgList.users;
        const m_id=this.props.user._id;
        // console.log(docs); 得到一个空数组[],[]===[]并不能作为判断条件,它们并不是引用同一个基对象，
                           // 所以永不相等，空数组不是undefined!!
        // console.log(docs[1]);//空数组内的元素才是undefined!!可以作为判断条件！
        //但是docs[1]不能作为判断条件，因为如果它没和任何人聊过天它就进不来。
        //console.log(users[m_id]);users是包含所有用户的对象，一直都会有值。
        if (users[m_id])
        {
            //判断是否是和这个人的聊天
            const m_header=users[m_id][1];
            const o_id=this.props.match.params.userid;
            const o_header=users[o_id][1];
            const chatId=[m_id,o_id].sort().join("_");

            var newList=docs.filter(msg=>(msg.chat_id===chatId));
            return (
                <div id='chat-page'>
                    <NavBar icon={<Icon type="left" />} onLeftClick={this.back} style={{position: "fixed",top:0,zIndex:10,width:"100%"}}>{users[o_id][0]}</NavBar>
                    <WingBlank style={{marginBottom:50,marginTop:50}}>
                        <List>
                            {/*<QueueAnim type="right" > 动画有BUG，会出现不能
                            跳到消息底部，提示未读数量不消失等问题。
                            */}
                            {
                                newList.map(msg=>(
                                    msg.from===m_id?(
                                        <Item key={msg._id}
                                              thumb={m_header}
                                              className="chat-me"
                                              wrap={true}
                                        >
                                            {msg.content}
                                        </Item>

                                        )
                                        :(
                                            <Item key={msg._id}
                                                  thumb={o_header}
                                                  wrap={true}
                                            >
                                                {msg.content}
                                            </Item>
                                        )
                                ))

                            }
                            {/*</QueueAnim>*/}
                        </List>
                    </WingBlank>



                    <div className="chat-footer" >
                        <input onFocus={this.focus} placeholder="请输入内容" type="text" ref={input=>(this.input=input)}/>
                        <span onClick={this.openEmoji}>😍</span>
                        <button  onClick={this.handleClick}>发送</button>
                    </div>

                    {this.state.isShow?
                        <Grid  style={{marginBottom:50,marginTop:-50}}
                               data={this.emojis}
                               columeNum={8}
                               carouselMaxRow={3}
                               isCarousel={true}
                               onClick={this.chooseEmoji}
                        />:null}



                </div>

            )

        }
        else{

            return null;
        }






    }
}

export default connect(
    state=>({user:state.user,msgList:state.msgList}),
    {sendMsg,updateRead}
)(Chat)