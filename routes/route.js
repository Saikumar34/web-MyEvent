var express = require('express');
var router = express.Router();
var path = require('path');
var models  = require(path.join(__dirname,"..","models","schema"));

/* GET users listing. */

// home page
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home' ,name : req.session.name,flash:{login:req.flash('login'),signup:req.flash('signup')}});
});

// about page
router.get('/about', function(req, res, next) {
  res.render('about', { title:'About' ,name : req.session.name});
});

// login page
router.get('/login', function(req, res, next) {
  res.render('login', { title:'Login',flash:{login:req.flash('login'),signup:req.flash('signup')}});
});

// signup page
router.get('/signup', function(req, res, next) {
  res.render('signup', { title:'Signup',flash:{login:req.flash('login'),signup:req.flash('signup')}});
});

// upcoming events page
router.get('/upcomingevents', function(req, res, next) {
  var codes=[];
  if(req.session.name && req.session.email){
    models.Register.find({email:req.session.email},(err,entries)=>{
      if(err)
        res.redirect('/');
      else{
        for(i=0;i<entries.length;i++)
          codes.push(entries[i].code);
        models.Events.find({code:{$nin:codes}},(err,events)=>{
          res.render('upcomingevents',{ title: 'Upcomingevents', name: req.session.name,events:events});
        });
      }
    });
  }
  else{
    models.Events.find((err,events)=>{
      if(err)
        res.redirect('/');
      else
        res.render('upcomingevents', { title:'Upcomingevents' ,name : req.session.name,events:events});
    });
  }
});

// registered events page
router.get('/registeredEvents',function(req,res,next){
  models.Register.find({email:req.session.email},(err,entries)=>{
    if(err)
      res.redirect('/');
    else{
      var codes=[];
      for(i=0;i<entries.length;i++)
        codes.push(entries[i].code);
      models.Events.find({code:{$in:codes}},(err,events)=>{
        res.render('registeredEvents',{ title: 'Registeredevents', name: req.session.name,events:events});
      });
    }
  });
});

// Events description page
router.post("/eventdescription/:code",(req,res,next)=>{
  models.Events.find({code:req.params.code},(err,event)=>{
    if(err)
      res.redirect('/');
    else{
      console.log(event);
      res.render("eventDescription",{ title: 'EventDescription',name:req.session.name,event:event});
    }
  });
});

// login verification
router.post('/login',function(req,res,next){
  var email   =   req.body.email;
  var pwd     =   req.body.pwd;
  models.Users.findOne({email:email,password:pwd},(err,row)=>{
      if(row!=null){
          console.log("login successful");
          req.flash('login','');
          req.session.name = row.firstname;
          req.session.email = row.email;
          res.redirect('/');
      }
      else{
          console.log(err);
          req.flash('login','login failed..try again');
          res.redirect("/login");
      }
  });
});

// Creating a new user
router.post("/signup",(req,res,next)=>{
  let newUser = new models.Users({
      firstname : req.body.fn,
      lastname  : req.body.ln,
      email     : req.body.email,
      password  : req.body.pwd
  });
  newUser.save((err,user)=>{
      if(err){
          console.log("error occured : " + err);
          req.flash('signup','Failed to signup..try again');
          res.redirect("/signup");
      }
      else{
          console.log("successfully added");
          req.flash('signup','');
          req.session.name = user.firstname;
          req.session.email = user.email;
          res.redirect("/");
      }
  });
});

// Logout 
router.get("/logout",(req,res,next)=>{
  req.session.destroy();
  res.redirect("/");
});

// Registering for an event
router.post("/register/:code",(req,res,next)=>{
  var email = req.session.email;
  var code  = req.params.code;
  if(email){
    let newEntry = new models.Register({
      email: email,
      code: code
    });
    newEntry.save((err,entry)=>{
      if(err){
        console.log("error in creating new entry in register table : "+err);
        res.redirect("/");
      }
      else{
        console.log("successfully registered for the event : " + code);
        res.redirect("/upcomingevents");
      }
    });
  }
  else{
    res.redirect("/login");
  }
});


// Admin usage through postman -- start
router.get("/users",(req,res,next)=>{
  models.Users.find((err,users)=>{
    res.json(users);
  });
});
router.delete("/users/:id",(req,res,next)=>{
  models.Users.deleteMany({_id:req.params.id},(err,user)=>{
    if(err){
      res.json(err);
    }
    else{
        res.json(user);
    }
  });
});

router.get("/events",(req,res,next)=>{
  models.Events.find((err,events)=>{
    res.json(events);
  });
});
router.post("/events",(req,res,next)=>{
  let newEvent = new models.Events({
    code: req.body.code,
    name: req.body.name,
    imgname: req.body.imgname,
    caption: req.body.caption,
    description: req.body.description
  });
  newEvent.save((err,event)=>{
    if(err)
      res.json({msg:'error in adding event'});
    else  
      res.json(event);
  });
});
router.delete("/events/:code",(req,res,next)=>{
  models.Events.deleteMany({code:req.params.code},(err,event)=>{
    if(err){
      res.json(err);
    }
    else{
        res.json(event);
    }
  });
});

router.get("/rgstrevents",(req,res,next)=>{
  models.Register.find((err,entries)=>{
    res.json(entries);
  });
});
router.delete("/rgstrevents/:code",(req,res,next)=>{
  models.Register.deleteMany({code:req.params.code},(err,entry)=>{
    if(err){
      res.json(err);
    }
    else{
        res.json(entry);
    }
  });
});

// Admin usage through postman ---end

module.exports = router;
