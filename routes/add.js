const express=require('express')
const DbUsers = require("../model/Users");
const DbProduct=require('../model/Product')
const uploads=require('../md/multer').single('photo')

const fs=require('fs')
// const fetch = require("node-fetch");
const router=express.Router()

const def=(req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger','iltimos ro`yxatdan o`ting');
        res.redirect('/')
    }
}



router.get('/add',def, (req,res)=>{
    res.render('add',{title:"Maxsulot qo`shish sahifasi"})
})

router.post('/add', uploads,(req,res)=>{
    req.checkBody('title', "maxsulotning nomini kiriting").notEmpty()
    req.checkBody('price', "maxsulotning narxini kiriting").notEmpty()
    req.checkBody('category', "maxsulotning toifasini kiriting").notEmpty()
    req.checkBody('comments', "komment kiriting").notEmpty()
    // req.checkBody('sale', "maxsulotga chegirmani kiriting").notEmpty()
    
    const errors=req.validationErrors()

    if(errors){
        res.render('add',{
            title:'Xatolik bor',
            errors:errors
        })
    }else{
        
        const db=new DbProduct({
            title:req.body.title.toLowerCase(),
            price:req.body.price,
            author:req.user._id,
            category:req.body.category,
            comments:req.body.comments,
            sale:req.body.sale,
            photo:req.file.path,
        })
        db.save((err)=>{
            if(err)
                throw err
            else{
                req.flash('success', 'Maxsulot qo`shildi')
                res.redirect('/')
            }
        })
    }

    
    
})

router.post('/edit/:Userid', uploads,(req,res)=>{
    req.checkBody('title', "maxsulotning nomini kiriting").notEmpty()
    req.checkBody('price', "maxsulotning narxini kiriting").notEmpty()
    req.checkBody('category', "maxsulotning toifasini kiriting").notEmpty()
    req.checkBody('comments', "komment kiriting").notEmpty()
    
    
    const errors=req.validationErrors()

    if(errors){
        res.render('add',{
            title:'Xatolik bor',
            errors:errors
        })
    }else{

        DbProduct.findById(req.params.Userid, (err, data) => {
            console.log(data.photo);
            fs.unlink(data.photo,()=>{
                if(err)console.log(err,"eski faylni o`chirishda xato")
                else console.log("oldingi fayl o`chirildi"); })
        });
        const db={
            title:req.body.title.toLowerCase(),
            price:req.body.price,
            // like:req.body.like,
            category:req.body.category,
            comments:req.body.comments,
            sale:req.body.sale,
            photo:req.file.path,
        }
        const ids={_id:req.params.Userid}
        DbProduct.updateOne(ids,db,(err)=>{
            if(err)
                console.log(err)
            else{
                req.flash('success', 'Maxsulot qo`shildi')
                res.redirect('/')
            }
        })
    }
})
router.get("/cards/:id",def, (req, res) => {
    DbProduct.findById(req.params.id, (err, data) => {
        DbUsers.findById(data.author,(err,auth)=>{
        
        res.render("cards", {
            title: "Cards sahifasi",
            db: data,
            auth:auth
        });
        })
    });
    });

router.post('/like/:id', (req,res)=>{
    DbProduct.findById(req.params.id, (err,data)=>{
        if(err){
            console.log(err)
        }else{
            console.log(data)
            data.like=data.like+1
            data.save()
            res.send(data)
        }
    })
})

router.get("/edit/:id", def,(req, res) => {
    DbProduct.findById(req.params.id, (err, data) => {
        if(data.author != req.user._id){
            req.flash('danger','Yo`l yo`q')
            res.redirect('back')
        }
        res.render("add", {
            title: "Cards sahifasi",
            db: data,
        });
    });
});
router.get("/auth_pro/:id", def,(req, res) => {
    
    DbProduct.find({author:req.params.id}, (err, data) => {
        res.render("auth_pro", {
            title: "Maxsulotlar sahifasi",
            arr: data,
        
        })
    });
});
router.get('/delete/:id',def,(req,res)=>{
    console.log(req.params.id)
    DbProduct.findById(req.params.id, (err, data) => {
        console.log('req.params.id='+req.params.id,"  req.user._id="+req.user._id)
        if(data.author != req.user._id){
            req.flash('danger','Yo`l yo`q')
            res.redirect('back')
        }else{
            fs.unlink(data.photo,()=>{
                if(err)console.log(err,"eski faylni o`chirishda xato")
                else console.log("oldingi fayl o`chirildi"); })
            DbProduct.findByIdAndDelete(req.params.id,(err)=>{
                if(err){console.log('dokumentni o`chirishda xato')}
                else{console.log('dokument o`chirildi')}
                res.redirect("/");
            });
        }        
    });
})
module.exports=router