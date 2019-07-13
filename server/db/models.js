var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/server");
//server是对应的数据库名

var md5=require("blueimp-md5");
mongoose.connection.once("connected",()=>{
    console.log("开了");
})
//也可以监听open


const userSchema=mongoose.Schema({
    username: {type: String, required: true}, //用 户 名
    password: {type: String, required: true}, //密 码
    gender: {type: String, required: true,default:"woman"},
    header: {type: String}, //头 像 地 址
    age: {type: Number}, //年龄
    height: {type: String},//身高
    prefer: {type: String},//喜好
    request:{type: String}//要求

});

var UserModel=mongoose.model("users",userSchema);
//users是集合名
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, //发 送 用 户 的 id
    to: {type: String, required: true}, //接 收 用 户 的 id
    chat_id: {type: String, required: true}, // from 和 to组 成 的 字 符 串
    content: {type: String, required: true}, //内 容
    read: {type:Boolean, default: false}, //标 识 是 否 已 读
    create_time: {type: Number} //创 建 时 间
}); //定 义 能 操 作 chats 集 合 数 据 的 Model

var ChatModel=mongoose.model("chats",chatSchema);

const PicSchema = mongoose.Schema({
    user_id: {type: String, required: true}, //发 送 图 片 用 户 的 id
    picArr:{type:Array,required:true}//包含自我照片的数组


});
var PicModel=mongoose.model("pics",PicSchema);

// const likeSchema = mongoose.Schema({
//     user_id: {type: String, required: true}, //本 用 户 的 id
//     // like_id:{type:String,required:true}, // 喜欢的人的id
//     like:{type:String,required:true} ,//组合形成判断的字符串
//     Name:{type:String,required:true} //喜欢的人或者不喜欢的人的名字
//
//
// });
// var LikeModel=mongoose.model("like",likeSchema);
exports.UserModel=UserModel;
exports.ChatModel=ChatModel;
exports.PicModel=PicModel;
// exports.LikeModel=LikeModel;

// module.exports=function () {
//
// }
// module.exports={}

// var userModel=new UserModel({
//     username: "kimso",
//     password: md5(123),
//     //密码用md5加密。
// })
//
// userModel.save((err,doc)=>{
//     if (!err)
//     {
//         console.log(doc);
//     }
// });

