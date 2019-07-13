var express = require('express');
var router = express.Router();

var UserModel=require("../db/models").UserModel;
var ChatModel=require("../db/models").ChatModel;
var PicModel=require("../db/models").PicModel;
var limit={__v:0};
var md5=require("blueimp-md5");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




// router.post('/register',
//     function (req, res, next) {
//   const {username, password} = req.body;
//         console.log('register', username, password);
//         if (username === 'admin')
//         { res.send({code: 1, msg: '此用户已存在'}) }
//         else { res.send({code: 0, data: {_id: 'abc', username, password}}) }
//         });


router.post("/register",(req,res)=>{
    const {username,password,gender}=req.body;
    UserModel.findOne({username},(err,doc)=>{
        if (!err){
            if (doc){
                res.send({code: 1, msg: '此用户已存在'})
            }
            else{
                new UserModel ({username,gender,password:md5(password)}).save((err,doc)=>{
                    if (!err)
                    {
                        res.cookie('userid', doc._id, {maxAge: 1000*60*60*24*7})
                        //1000>1s 60>1min 60>1hour 24>1tian 7>7tian
                        res.send({code:0,data:{username,gender,_id:doc._id}});
                    }
                })
            }
        }
    })
})
router.post("/login",(req,res)=>{
    const {username,password}=req.body;
    UserModel.findOne({username},limit,(err,doc)=>{
        if (!err){
            if (!doc){
                res.send({code: 1, msg: '查无此用户'})
            }
            else{

                if (md5(password)!==doc.password) {
                        res.send({code: 1, msg: '密码或用户名错误'})
                    }
                    else{
                        res.cookie('userid', doc._id, {maxAge: 1000*60*60*24*7})
                        //1000>1s 60>1min 60>1hour 24>1tian 7>7tian
                    res.send({code:0,data:{username:doc.username,gender:doc.gender,
                            _id:doc._id,header:doc.header,age:doc.age,prefer:doc.prefer,
                            request:doc.request,height:doc.height
                    }});
                    }



            }
        }
    })
})
router.post("/update",(req,res)=>{
    const user=req.body;
    const user_id=req.cookies.userid;//获取cookie的方式
    if (!user_id){
        res.send({code:1,msg:"你还没登陆哦！"});

    }
    else{
        //这里的必须是user 而不是什么{user}!!!!
        UserModel.findOneAndUpdate({_id:user_id},user,(err,old)=>{
            if (!err) {
                if (old){
                    const {username,gender,_id}=old;//新的user里没有的数据从老的里面去取。
                    const data=Object.assign(user,{username,gender,_id});
                    res.send({code:0,data});
                }
                else{
                    res.clearCookie(userid);//清理掉没有用的cookie
                    res.send({code:1,msg:"你还没登陆哦！"});
                }
            }
        })
    }

})

router.get("/autoSave",(req,res)=>{

    const user_id=req.cookies.userid;//获取cookie的方式


        UserModel.findOne({_id:user_id},{password:0,__v:0},(err,doc)=>{
            if (!err&&doc)
            {
                res.send({data:doc});
            }

        })


})
router.get("/list",(req,res)=>{
    //get 方式获取数据的方式：
    //var {xxx}=req.query

    //post 方式获取数据的方式：
    //var {xxx}=req.body




    //console.log(req.query);
    //{gender:man}
    var gender=req.query.gender;

    UserModel.find({gender},{password:0,__v:0},(err,doc)=>{
        if (!err&&doc)
        {

            res.send({data:doc});
        }

    })
});

router.get("/connect",(req,res)=>{

    const user_id=req.cookies.userid;

    UserModel.find({},{password:0,__v:0},(err,docs)=>{
        if (!err&&docs)
        {
           var users={};
           docs.forEach((doc)=>{
               users[doc._id]=[doc.username,doc.header];
           });
            //得到Key值为_id,value值为header和username的全部user的对象。
            //可以很方便的通过_id找到对应的header.
            ChatModel.find({"$or":[{from:user_id},{to:user_id}]},(err,docs)=>{
                if (!err&&docs){

                    res.send({data:{users,docs}})
                }
            })
        }

    })

});

router.post("/updateRead",(req,res)=>{


    const {from}=req.body;
    const to=req.cookies.userid;

    ChatModel.update({from,to,read:false},{$set:{read:true}},{multi:true},(err,docs)=>{
        if (!err&&docs)
        {

            //{multi:true} 可以更改多条。
            //为什么不直接发docs：发送的是这次更改的那些doc,不是所有的数据都被更改了。
            ChatModel.find({"$or":[{from:to},{to:to}]},(err,docs)=>{//查找和我有关的数据再重新显示
                if (!err&&docs){
                    res.send({data:docs})
                }
            });
        }
    });


});
//一般来说需要改数据就用post,不需要改只用查询就用get
router.post("/sendPic",(req,res)=>{
    const pic_Arr=req.body;//{url:xxx}

    const user_id=req.cookies.userid;

    PicModel.findOne({user_id},limit, (err,doc) => {
        if (doc) {
            doc.picArr.push(pic_Arr);
            doc.save();
            res.send({code:0,data:doc})
        }
        else{
            console.log("chushihua");
            new PicModel ({user_id,picArr: pic_Arr}).save((err,doc)=>{
                if (!err)
                {
                    res.send({code:0,data:doc});
                }
                else{
                    res.send({code:1});
                }
            })
        }

    })


})
router.get("/getPic",(req,res)=> {

    const {user_id} = req.query;
    PicModel.findOne({user_id},limit, (err,doc) => {
        if (!err) {
            // console.log(docs);
            res.send({data:doc})
        }

    })
});
router.post("/removePic",(req,res)=> {
    const {index}=req.body;
    const user_id=req.cookies.userid;
    console.log(index);

    PicModel.findOne({user_id},limit, (err,doc) => {
        if (doc) {

            doc.picArr.splice(index,1);

            doc.save();

            res.send({code: 0,data:doc})

        }
        else{
            res.send({code: 1})
        }
    })
})

// router.post("/like",(req,res)=> {
//
//     const user_id=req.cookies.userid;
//     const like_id=req.body.like_id;
//     const like=[user_id,]
//
// })


module.exports = router;
