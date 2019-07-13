import React,{Component} from "react";
import {connect}  from  "react-redux";
import  List  from "../components/list/list";
import {getList} from "../redux/action";
import {setPageTo} from "../utils";
import {Redirect} from "react-router-dom";

class Boy extends Component{


    componentDidMount() {
        this.props.getList({gender:"woman"});
    }//自动发ajax请求都在这,在这更新用户列表


    render(){
        const {header,gender}=this.props.user;
        if (header) {
            return (
                <List userList={this.props.userList}/>
            )
        }
        else{
            var path=setPageTo(gender,header);
            return  <Redirect to={path}/>
        }

    }
}

export default connect(
    state=>({userList: state.userList,user:state.user}),
    {getList}
)(Boy)