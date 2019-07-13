import React,{Component} from "react";
import {connect}  from  "react-redux";
import {Result,List,WhiteSpace,Button,Modal}  from "antd-mobile";
import  Pic_List  from "../components/pic_list/pic_list";

import  Cookie from "js-cookie";
import  {s_errSend,savePic,getPic}  from "../redux/action";
import {setPageTo} from "../utils";
import {Redirect} from "react-router-dom";

const Item=List.Item;
const Brief=Item.Brief;

class Personal extends Component{
    state={
        show:false
    }
    componentDidMount() {
        const user_id=this.props.user._id;
        this.props.getPic(user_id);
    }


    handleClick=()=>{
    Modal.alert(
        "退出","确定退出登陆吗？",[
            {text:"取消"},
            {text: "确认",
                onPress:()=>{
                Cookie.remove("userid");
                this.props.s_errSend("")
                }
            }
        ]
    )
  }
    handleonChange=(event)=>{

        const file = event.target.files;
        for (var i=0;i<file.length;i++)
        {
            if (file[i].type.indexOf("image")!==-1)
            {

                var imgURL="";
                var reader = new FileReader();
                reader.readAsDataURL(file[i]);
                reader.onload = function(){
                    imgURL=this.result;

                };
                setTimeout(()=>{

                    this.props.savePic({url:imgURL})//记住！！传入数据的方式
                    //一般都是{value:key} 这样通过value就能取到Key值  pic.url
                    //不需要再通过getPic去取了，后台设置在上传后直接返回数据

                    // setTimeout(()=> {
                    //     this.props.getPic(userid);
                    // },300) //给上传图片一点时间，然后我再去取！
                },100);



            }
        }


    }
    handleRemove=(el)=>{
        var show=!this.state.show;
        if (!show){
            el.target.innerHTML="删除"
        }
        else{
            el.target.innerHTML="关闭"
        }
        this.setState({
        show
        })
    }
    render(){
        const {header,username,gender,age,height,prefer} =this.props.user;
        const {pics}=this.props;
        if (header)
        {
            return (
                <div  style={{marginTop:"60px",marginBottom:60}}>
                    <Result
                        img={<img src={header} alt=""/>}
                        title={username}
                        message={gender}
                    />
                    <WhiteSpace />

                    <List  renderHeader={()=>'详细信息：'}>
                        <Item multipleLine={true}>
                            <Brief>
                                年龄：{age}
                            </Brief>
                            <Brief>
                                身高：{height}
                            </Brief>
                            <Brief>
                                爱好：{prefer}
                            </Brief>

                        </Item>


                    </List>

                    <WhiteSpace />

                    <List  renderHeader={()=>{
                        if (pics)
                        {
                            if (pics.picArr) {
                                return "我的照片("+pics.picArr.length+")"
                            }
                            else{
                                return null;//在等待上传的时候有pics,但是没有pics.picArr
                            }

                        }
                        else{
                            return "上传照片";
                        }

                    }}>

                        {
                            pics?<Pic_List show={this.state.show} picArr={pics.picArr}/>:null
                        }
                        <Item multipleLine={true} extra={<span onClick={this.handleRemove}>删除</span>}>



                            <label className="input_file">
                                <input onChange={this.handleonChange}  type="file"/>
                                {/*在react中onChange函数等于onchange onClick函数等于onclick*/}
                                <span>上传图片</span>
                            </label>

                        </Item>

                    </List>

                    <Button onClick={this.handleClick} type="warning">退出登录</Button>

                </div>
            )
        }
        else{
            var path=setPageTo(gender,header);
            return  <Redirect to={path}/>
        }

    }
}

export default connect(
    state=>({user:state.user,pics:state.picList}),
    {s_errSend,savePic,getPic}
)(Personal)