
const LocalStrategy=require('passport-local').Strategy
const bcryptjs=require('bcryptjs')
const Users=require('../model/Users')


module.exports=(passport)=>{
    passport.use(new LocalStrategy(
        function(username,password,done){
            Users.findOne({username:username},function(err,user){
                if(err){return done(err);}
                if(!user){return done(null,false);}

                bcryptjs.compare(password,user.password,(err,match)=>{
                    if(err){
                        console.log(err)
                    };
                    if(match){
                        done(null,user)
                    }else{
                        done(null,false,{message:"parolda hatolik bor"})
                    }
                })
            });
            
        }
    ));
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        Users.findById(id,function(err,user){
            done(err,user);
        });
    });
}