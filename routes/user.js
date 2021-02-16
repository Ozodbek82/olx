const express = require("express");
// const DbProduct = require("../model/Product");
const DbUsers = require("../model/Users");
const bcryptjs = require('bcryptjs');
// const passport = require("../md/passport");
const passport=require('passport')

const router = express.Router();

router.get("/user", (req, res) => {
    res.render("register", {
        title: "Registratsiya",
        })
    
    
})

router.post('/user',(req,res)=>{
    req.checkBody('name', "Ismingizni kiriting").notEmpty()
    req.checkBody('username', "Username kiriting").notEmpty()
    req.checkBody('phone', "telefon raqamingiz").notEmpty()
    req.checkBody('email', "emailni kiriting").notEmpty()
    req.checkBody('password', "parolni kiriting").notEmpty()
    req.checkBody('password2', "parolni qayta kiriting").equals(req.body.password)
    
    
    const errors=req.validationErrors()

    if(errors){
        res.render('register',{
            title:'Xatolik bor',
            errors:errors
        })
    }else{
        const db=new DbUsers({
            name:req.body.name,
            username:req.body.username,
            phone:req.body.phone,            
            email:req.body.email,
            password:req.body.password,
        
        })
        bcryptjs.genSalt(10,(err,pass)=>{
            bcryptjs.hash(db.password,pass,(err,hash)=>{
                if(err){
                    console.log(err)
                }
                else{
                    db.password=hash
                    db.save((err)=>{
                        if(err)
                            throw err
                        else{
                            req.flash('success','Foydalanuvchi muvaffaqiyatli ro`yxatdan o`tdi')
                            res.redirect('/login')
                        }
                    })
                }
            })
        })
        
    }
})
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Ro`yxatdan o`tish",
        })
})
// router.post("/login",
//     passport.authenticate('local',{
//     successRedirect:'/',
//     failureRedirect:'/login',
//     failureFlash:'login  jarayonida xatolik bor',
//     successFlash:'ulandik'
// }) )
router.post("/login", (req, res,next) => {
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:'login  jarayonida xatolik bor',
        successFlash:'ulandik'
    })(req,res,next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash('success','Tizimdan chiqdingiz')
    res.redirect('/')
})


module.exports = router;
