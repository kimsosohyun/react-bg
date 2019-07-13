// import {ChatModel}  from  "../db/models" 这是前台的引用方式
var ChatModel=require("../db/models").ChatModel;
module.exports=function (server) {
    const io=require("socket.io")(server);

    io.on("connection",(socket)=>{
        console.log("有人进来了");

        socket.on("sendMsg",(data)=>{//当接受到消息时
            console.log(data);
            const {from,to,content}=data;
            const chat_id=[from,to].sort().join("_");
            const create_time=Date.now();

            new ChatModel({from,chat_id,to,content,create_time}).save((err,doc)=>{
                if (!err&&doc)
                {

                    io.emit("receiveMsg",doc);//全局广播，在客户端做判断(判断是不是属于我的消息)
                    //socket.emit('name',doc) //单一广播，只发给发消息过来的客户端。
                }
            })

        });

    })
}
//定义成函数就是为了传入server,所以取的时候也要用函数的方式调用。