import React,{Component} from "react";
import  {Card,Button,WhiteSpace} from "antd-mobile"
export default class NotFound extends Component{
    handleClick=()=>{
        this.props.history.replace("/");
        //返回路由"/"之后main页面会自动进行判断应该去的页面。
    };
    render(){
        return (
        <div>
            <Card full>
                <Card.Header
                    title="404 Not Found"
                />
                <Card.Body>
                    <div>您所访问的页面不存在</div>
                </Card.Body>
                <Card.Footer  content="Not Found" extra={<div>请返回到首页</div>} />
            </Card>
            <WhiteSpace />
            <Button  onClick={this.handleClick} >返回首页</Button>
        </div>
        )
    }
}