import React,{Component} from "react";
import  {TabBar} from  "antd-mobile";
import  {withRouter} from "react-router-dom";
import ProTypes from  "prop-types";
import PubSub from "pubsub-js";
const Item=TabBar.Item;
 class Footer extends Component{
    static proTypes={
      lists:ProTypes.array.isRequired
    };
    state={
        unRead:0
    };

    componentDidMount() {
        PubSub.subscribe("unRead",(msg,data)=>{

            this.setState({
                unRead:data
            })

        })
    }
     render(){
        const {lists}=this.props;
        var pathname=this.props.location.pathname;
        //必须是路由组件才有this.props.location.pathname这个属性
        return (
         <TabBar className="TabBar">
             {
                 lists.map((value)=>(
                     <Item key={value.path}
                           title={value.text}
                           badge={value.path==="/message"?this.state.unRead:0}
                           icon={{uri:require("./img/"+value.icon+".png")}}
                           selectedIcon={{uri:require("./img/"+value.icon+"-selected.png")}}
                           selected={pathname===value.path}

                           onPress={()=>{
                               this.props.history.replace(value.path);
                           }}
                     />
                 ))
             }
         </TabBar>
        )
    }
}
export default withRouter(Footer);