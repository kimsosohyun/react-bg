import React,{Component} from "react";
import {Button, InputItem, List, NavBar, WhiteSpace, WingBlank} from "antd-mobile";
import Logo from "../components/logo/logo";
import {Redirect} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {login} from "../redux/action";
 class Login extends Component{
    state= {
        username: "",
        password: ""
    }
    handleChange=(value,name)=>{
        this.setState(
            {
                [name]:value
            }
        )
    }
    handleClick=()=>{
        this.props.history.push("/register");
    }
    login=()=>{
        this.props.login(this.state);
    }
    render(){
        const {msg_l,to}=this.props.user;
        if (to)
        {
            return <Redirect to={to} />
            //直接跳转
        }
        return (
        <div>
            <NavBar>kimsosohyun</NavBar>
            <Logo />
            <div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{msg_l}</div>
            <WingBlank>
                <List>
                    <WhiteSpace/>
                    <InputItem onChange={(value)=>{this.handleChange(value,"username")}}>用户名:</InputItem>
                    <InputItem onChange={(value)=>{this.handleChange(value,"password")}}  type="password" >密&nbsp;&nbsp;&nbsp;码:</InputItem>
                    <WhiteSpace/>
                </List>
            </WingBlank>
            <br />
            <Button onClick={this.login} type="primary">登陆</Button>
            <br />
            <Button onClick={this.handleClick}>还没有账户</Button>


        </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {login}
)(Login)