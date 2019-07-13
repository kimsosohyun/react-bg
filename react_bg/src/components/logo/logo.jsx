import React,{Component} from "react";
import  logo from "./logo.jpg";
import  "./logo.less";
export default class Logo extends Component{
    render(){
        return (
          <div className="logo">
              <img  src={logo} alt=""/>
          </div>
        )
    }
}