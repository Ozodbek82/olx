const express=require('express')
const DbUsers = require("../model/Users");
const DbProduct=require('../model/Product')
const DbMessage=require('../model/Message')
const router=express.Router()

const def=(req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger','iltimos ro`yxatdan o`ting');
        res.redirect('/')
    }
}
router.get("/auth_pro/:id", def,(req, res) => {
    DbProduct.find({author:req.params.id}, (err, data) => {
        res.render("auth_pro", {
            title: "Maxsulotlar sahifasi",
            arr: data,
        
        })
    });
});
router.get("/auth_messages/:reader_id/:writer_id", def,(req, res) => {
    
    const r_id=req.params.reader_id, w_id=req.params.writer_id;
    console.log('w_id='+w_id,'  req.user._id='+req.user._id)
    if(w_id!=req.user._id){
        req.flash('danger','Yo`l yo`q');
        res.redirect('/')
    }else{
        DbUsers.findById(r_id,(err,reader)=>{
            if(err){
                console.log('findById da xato');
            }else{
                DbMessage.find({$or:[{reader_id:{$in:[r_id,w_id]}},
                    {writer_id:{$in:[w_id,r_id]}}]}, (err, data) => {
                    if(err){console.log(err)};                 
                    // console.log('reader._id=',reader._id)
                    // console.log('req.user._id=',req.user._id)
                    let sum2=(reader._id+req.user._id).split('').reverse().slice(-5);
                    let sum1=(reader._id+req.user._id).split('').reverse().slice(0,43);
                    for(let sums of sum1){
                        sum2.push(sums);
                    }
                    let sum=sum2.join('');
                        // let sum=sum1.join('');      
                    if (data==''){                
                        res.render("auth_message", {
                            title: "Xabar qoldirish sahifasi",
                            arr:[],
                            names: reader,
                            sum:sum  
                            });            
                    }else{
                            res.render("auth_message", {
                                        title: "Xabar qoldirish sahifasi",
                                        names:reader,
                                        arr: data,
                                        sum:sum
                                    });  
                                }   
                    }    
                );
            }
        })
    }
    // console.log('params',r_id,w_id);
    
    
});



router.post('/msg_send',(req,res)=>{     
    req.checkBody('sms', "xabarni yozing").notEmpty()
    req.checkBody('reader_name', "xabar oluvchida xato").notEmpty()
    req.checkBody('kod', "jo`natuvchini ruyhatga olishda xato").notEmpty()
    
    let reader_id, writer_id;
    const errors=req.validationErrors()
    if(errors){
        res.render('index',{
            title:'Xatolik bor',
            errors:errors
        })
    }else{
            try {
                let sum2=req.body.kod
                let sum5=sum2.split('').slice(0,5)
                let sum4=sum2.split('').slice(-43)
                for(let sum of sum5){
                sum4.push(sum);}
            // console.log(sum4)
                let sum6=sum4.reverse()
                reader_id=sum6.slice(0,24).join('');
                writer_id=sum6.slice(-24).join('');
                // console.log('r_id=',reader_id)
                // console.log('w_id=',writer_id)
    
            } catch (error) {
                res.render('index',)}
        
        
        setTimeout(()=>{
            DbUsers.findById(reader_id,(err,reader)=>{
                if(err||reader==''){
                    console.log('foydalanuvchi bazadan topilmadi');
                    res.render('index',)
                }else{
                    const db=new DbMessage({
                        reader_name:req.body.reader_name,
                        writer_name:req.body.user_name,
                        reader_id:reader_id,
                        writer_id:writer_id,
                        message:req.body.sms,
                            
                        })
                    db.save((err)=>{
                        if(err)
                            throw err
                        else{
                            const r_id=db.reader_id, w_id=db.writer_id;
                            DbMessage.find({$or:[{reader_id:{$in:[r_id,w_id]}},
                                {writer_id:{$in:[w_id,r_id]}}]}, (err, data) => {
                                if(err){console.log('xabarni qidirishda xato')};                 
                                if (data==''){                
                                    console.log('nimagadir xabar bazaga yozilmadi')
                                }else{
                                    let names={_id:r_id, username:db.reader_name}
                                    let user={username:req.body.user_name,
                                        _id:writer_id} 
                                    setTimeout(() =>(res.render("auth_message", {
                                        title: "Xabar qoldirish sahifasi",                            
                                        arr: data,
                                        user:user,
                                        names:names,
                                        sum:req.body.kod
            
                                        }), 500))
                                    
                                }       
                                }
                            );
                        }    
                    })
                }
                })
        },100)    

        }
})
router.get('/mail',(req,res)=>{
    DbUsers.find({},(err,users)=>{
        DbUsers.findById(req.user._id,(err,useri)=>{
            DbMessage.find({$or:[{reader_id:req.user._id},
                {writer_id:req.user._id}]}, (err, data) => {
                    res.render('mails',{
                        title:'Xatlar sahifasi',
                        users:users,
                        arr:data,
                        user:useri,
                    })
                })
        })
    })
    
});

module.exports=router