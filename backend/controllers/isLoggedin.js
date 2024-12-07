

const isLoggedin = (req, res) => {
    if(req.user){
        res.json({isLoggedin:true,user:req.user});
    }
    else{
        res.json({isLoggedin:false,user:{}});
    }
}
export default isLoggedin