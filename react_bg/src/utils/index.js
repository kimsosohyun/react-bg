//定义一些需要使用的函数

export function setPageTo (gender,header){
    var to;
    if (gender==="man"){
        if (!header){
            to="/boy_infor";

        }
        else{
            to="/boy";
        }
    }
    else{
        if (!header){
            to="/girl_infor";
        }
        else {
            to="/girl"
        }
    }
    return to;
}