
import  axios  from "axios";
//前台项目的引入方式 import xxx from "xxx"
//后台项目的引入方式 var xxx=require("xxx");

export default  function ajax(url,data={},method="GET"){
    if (method==="GET")
    {

        if (JSON.stringify(data)!=="{}"){
            var str="";

            Object.keys(data).forEach((key)=>{
                //console.log(key); 对应的key值

                str+=key+"="+data[key]+"&";
                //函数形参是json对应的key值时要注意是data[key]而不是data.key
                // data.key指的是data json对象里的key属性，
                //data[key] 中的Key才对应函数的形参变量。

            });

            var uStr=str.substring(0,str.length-1);//除去最后的&

            var urlStr=url+"?"+uStr;

            return axios.get(urlStr);
        }
        else{
            return  axios.get(url);
        }


    }
    else{
        return axios.post(url,data);
    }

}
