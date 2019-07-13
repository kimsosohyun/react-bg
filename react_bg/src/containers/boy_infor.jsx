import React,{Component} from "react";
import  {Redirect}  from "react-router-dom";
import {save}  from "../redux/action";
import {NavBar, InputItem, TextareaItem, Button} from "antd-mobile";
import   {connect}  from "react-redux";
import  HeadChoose from "../components/headChoose/headChoose";
class Boy_infor extends Component{
    state={
        header:"",
        age:"",
        height:"",
        prefer:"",
        request:"",
        display:"none"

    }
    setHeader=(data)=>{
        this.setState(
            {
                header:data
            }
        )
    }

    handleChange=(value,name)=>{

        this.setState(
            {
                [name]:value
            }
        )
    }
    save=()=>{
        const {header,age,height,prefer,request}=this.state;
        if (header===""||age===""||height===""||prefer===""||request==="")
        {
            this.setState(
                {
                    display:"block"
                }
            )
            setTimeout(()=>{
                this.setState(
                    {
                        display:"none"
                    }
                )
            },2200)
        }
        else{

            this.props.save(this.state);
        }


    };
    render(){
        const {_id,header}=this.props.user;
        if (_id&&header){
            return(
                <Redirect to="/boy" />
            )
        }
        else{
            return (
                <div>

                    <NavBar>男神信息完善</NavBar>
                    <HeadChoose setHeader={this.setHeader}/>
                    <InputItem onChange={(val)=>{this.handleChange(val,"age")}}>年&nbsp;&nbsp;&nbsp;龄:</InputItem>
                    <InputItem onChange={(val)=>{this.handleChange(val,"height")}}>身&nbsp;&nbsp;&nbsp;高:</InputItem>
                    <InputItem onChange={(val)=>{this.handleChange(val,"prefer")}}>喜&nbsp;&nbsp;&nbsp;好:</InputItem>
                    <TextareaItem onChange={(val)=>{this.handleChange(val,"request")}} title="具体要求："  rows={3} />


                    <div style={{display:this.state.display,textAlign:"center",fontSize:"16px",padding:"5px",color:"red"}}>每条信息都需要哦！</div>
                    <Button type="primary" onClick={this.save} >保存</Button>
                </div>
            )
        }

    }
}

export default connect(
    state=>({user:state.user}),
    {save}
)(Boy_infor)