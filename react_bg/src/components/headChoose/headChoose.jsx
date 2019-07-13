import React,{Component} from "react";
import  {List,Grid}  from  "antd-mobile";
import ProTypes  from "prop-types";

export default class HeadChoose extends Component{
    static  proTypes= {
        setHeader:ProTypes.func.isRequired
    };
    state={
        head:""
    };


    constructor(props){
        super(props);
        this.data=[];
        for (var i=0;i<20;i++)
        {
            this.data.push(
                {
                    icon:require("./img/头像"+Number(i+1)+".png"),//对应IMG
                    text:"头像"+Number(i+1)//文字描述
                }
            )
        }
    }  //定义要用到的数据可以在构造函数constructor中定义,如类似定义this.xxx=xxx 这种类型的数据。
    handleClick=(el)=>{
        //el.icon才是地址，而且不是相对地址，是完整路径。

        this.setState(
            {
                head:el.icon
            }
        )
        setTimeout(()=>{

            this.props.setHeader(this.state.head);
        },100);
        // console.log(this.state);
        //立马得不到this.state的改变，不知道是为什么，所以加了个延迟。
    }
    handleonChange=(event)=>{

        //console.log(event.target.value); 对于非受控组件：
        // 如果是本身使用则可以直接用event.target(event.target等于this)
        //如果是别的标签的函数使用，则在原标签上定义ref={(input) => this.input = input}
        //然后使用this.input。
        //对于受控组件： 需要定义状态和配和着onChange函数进行相应状态的改变。
        //<input type="text" value={this.state.userName} onChange={this.handleName}/>
        // handleName= (event) =>{
        //     const userName=event.target.value;
        //     this.setState({
        //         userName
        //     })
        // }

        // event.target等于input[0].onclick=function(){}函数中的this,也就是这个input本身。
        const file = event.target.files[0];
        if (file.type.indexOf("image")!==-1)
        {
            // const imgURL = window.URL.createObjectURL(file);//通过这个得到完整路径,
            // 但是只能显示一小会，然后就找不到了。
            var imgURL;
            var reader = new FileReader();
            reader.readAsDataURL(file);//发起异步请求
            reader.onload = function(){
                imgURL=this.result;
            };


            setTimeout(()=>{
                this.setState(
                    {
                        head:imgURL
                    }
                )

                this.props.setHeader(this.state.head);
            },100);
        }

    }
    render(){
        const path=this.state.head;

        const  header=!this.state.head ?"请选择你喜欢的头像":(
            <div>
                已选择头像：<img className="head_img" src={path} alt=""/>
            </div>
        );
        return (
          <List  renderHeader={()=>header}>
              <Grid onClick={this.handleClick} data={this.data} colimnNum={4} />
              <label className="input_file">
                  <input onChange={this.handleonChange} type="file"/>
                  {/*在react中onChange函数等于onchange onClick函数等于onclick*/}
                  <span>上传图片</span>
              </label>
          </List>
        )
    }
}