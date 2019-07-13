import React,{Component} from "react";
import {connect}  from  "react-redux";
import  List  from "../components/list/list";
import {getList} from "../redux/action";
import {setPageTo} from "../utils";
import {Redirect} from "react-router-dom";

class Girl extends Component{
    // state={
    //     UserList:[]
    // };

    componentDidMount() {
       this.props.getList({gender:"man"});//这只是发请求
        // setTimeout(()=>{
        //     var data=this.props.userList;//得到数据的方法
        //     console.log(data);//必须要做延迟，不然刚发请求就获取得到的是空数组。
        // },100)

        // this.setState(
        //     {userList:data}
        // )  //不用这么麻烦，直接传入props就可以了
    }//自动发ajax请求都在这


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
    state=>({userList:state.userList,user:state.user}),
    {getList}
)(Girl)