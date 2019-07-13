import React,{Component} from "react";
import {WingBlank} from "antd-mobile";
import  ProTypes   from "prop-types";
import {withRouter}  from "react-router-dom";
import  QueueAnim from "rc-queue-anim";//引入动画库

class List extends Component{
    static proTypes={
        userList:ProTypes.array.isRequired
    };
    handleClick_p=(userid)=>{
        this.props.history.push("/like/"+userid+"")
    };
    handleClick_c=(userid)=>{
        this.props.history.push("/chat/"+userid+"")
    };
    //带有参数的函数调用：
    //<Card onClick={()=>{this.handleClick(value._id)}}>
    //不带参数的函数调用：
    //<Card onClick={this.handleClick}>
    render(){
        const  {userList}=this.props;
        return (
            <WingBlank style={{marginTop:"60px",marginBottom:"60px"}}>
                <QueueAnim  type="scale">
                    {
                        userList.map((value)=>(
                            <div key={value._id} className="card">
                                <span onClick={()=>{this.handleClick_p(value._id)}} className="photo">photo</span>
                                <span onClick={()=>{this.handleClick_c(value._id)}} className="chat">chat></span>
                                <div className="c_title">
                                    <img src={value.header} alt=""/>
                                    <strong>{value.username}</strong>

                                </div>
                                <ul className="c_body">
                                    <li>年龄：{value.age}</li>
                                    <li>身高：{value.height}</li>
                                    <li>爱好：{value.prefer}</li>
                                    <li>要求：{value.request}</li>
                                </ul>
                            </div>
                            )

                        )
                    }
                </QueueAnim>

            </WingBlank>
        )
    }
}

export default withRouter(List)