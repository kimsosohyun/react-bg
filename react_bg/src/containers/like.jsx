import React,{Component} from "react";
import {connect}  from  "react-redux";
import {Icon, List, NavBar} from "antd-mobile";
import {getPic} from "../redux/action"
import   Pic_list from "../components/pic_list/pic_list"

class Like extends Component{
    componentDidMount() {
        const to_id=this.props.match.params.userid;
        this.props.getPic(to_id);
    }

    back=()=>{
        this.props.history.goBack();
    };
    handleClick=(el)=>{
        el.target.style="display:none";
    }

    render(){
        const {user}=this.props;
        const users=this.props.msgList.users;//包含所有user的集合
        const pics=this.props.picList;
        const to_id=this.props.match.params.userid;
        if (users[to_id]) {
            return (
                <div id="like">
                    <NavBar icon={<Icon type="left" />} onLeftClick={this.back}>{users[to_id][0]}</NavBar>
                    {
                        pics? <Pic_list picArr={pics.picArr}/> :<span className="pic_span">该用户暂时还没上传照片哦</span>
                    }

                    {/*<div className="like_btn">*/}
                        {/*<img src={require("../components/headChoose/img/22.png")} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div onClick={this.handleClick} className="dislike_btn">*/}
                        {/*<img src={require("../components/headChoose/img/11.png")} alt=""/>*/}
                    {/*</div>*/}
                </div>

            )
        }
        else{
            return null;
        }


    }
}

export default connect(
    state=>({user:state.user,msgList:state.msgList,picList:state.picList}),
    {getPic}
)(Like)