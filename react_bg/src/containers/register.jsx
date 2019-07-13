import React,{Component} from "react";
import {NavBar,InputItem,Radio,Button,List,WhiteSpace,WingBlank}   from "antd-mobile";
import  Logo from "../components/logo/logo";
import {connect}  from "react-redux";
import  {register}  from "../redux/action";
import {Redirect}  from "react-router-dom";
class Register extends Component{
    handleClick=()=>{
        this.props.history.push("/login");
    };
    state={
        username:"",
        password:"",
        password2:"",
        gender:"woman"
    };
    submit=()=>{
        this.props.register(this.state);

    }
    handleChange=(value,name)=>{
        this.setState(
            {
                [name]:value
            }
        )
    }


    render(){

        const {msg_r,to}=this.props.user;
        if (to)
        {
            return <Redirect to={to} />

        }

        return (
            <div className="register">

                <NavBar>kimsosohyun</NavBar>
                <Logo />
                <div style={{textAlign:"center",fontSize:"20px",color:"red"}}>{msg_r}</div>
                <WingBlank>
                    <List>
                        <WhiteSpace/>
                        <InputItem onChange={(value)=>{this.handleChange(value,"username")}}>用户名:</InputItem>
                        <InputItem onChange={(value)=>{this.handleChange(value,"password")}}  type="password" >密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <InputItem onChange={(value)=>{this.handleChange(value,"password2")}}  type="password" >确认密码:</InputItem>
                        <div style={{fontSize:"17px",padding:"10px 0px 10px 16px",marginRight:"5px"}}>
                            <span>选择性别:</span>
                            &nbsp;&nbsp;&nbsp;<Radio checked={this.state.gender==="man"}  onChange={()=>{this.handleChange("man","gender")}}>小哥哥</Radio>
                            &nbsp;&nbsp;&nbsp;<Radio checked={this.state.gender==="woman"} onChange={()=>{this.handleChange("woman","gender")}}>小姐姐</Radio>
                        </div>
                        <WhiteSpace/>
                    </List>
                </WingBlank>
                <br />
                <Button onClick={this.submit} type="primary">注册</Button>
                <br />
                <Button onClick={this.handleClick}>已有账户</Button>


            </div>
        )
    }
}

export default connect(
    state=>({user:state.user}),
    {register}
)(Register)