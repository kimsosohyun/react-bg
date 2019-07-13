import React,{Component} from "react";
import {connect}  from  "react-redux";
import ProTypes from "prop-types";
import  {removePic}  from  "../../redux/action"

class Pic_list extends Component{
    static  proTypes= {
        picArr:ProTypes.array.isRequired,
        show:ProTypes.bool.isRequired
    };
    handleClick=(el)=>{
        this.props.removePic({index:el.target.className});
    }


    render(){
        const picArr=this.props.picArr;
        if (picArr)
        {
            return (
                <ul className="pic_list">
                    {
                        picArr.map((pic,index)=>
                            {
                                return <li  key={index}>
                                    <img src={pic.url} alt=""/>
                                    {this.props.show?<div className={index}  onClick={this.handleClick}>X</div>:null}
                                </li>
                            }

                        )
                    }

                </ul>

            )
        }
        else{
            return null;
        }

    }
}

export default connect(
    state=>({}),
    {removePic}
)(Pic_list)