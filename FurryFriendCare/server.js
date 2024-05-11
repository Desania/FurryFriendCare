var express = require("express");
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
var nodemailer = require('nodemailer');

var app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(fileuploader());

let configObj=
{
    host:"127.0.0.1",
    user:"root",
    password:"Diyagarg12##",
    database:"Project",
    dateStrings:true
}
app.listen(1980,function(req,resp){
    console.log("server started at 1980");
});
app.get("/",function(req,resp){
    let path = __dirname+"/public/index.html";
    resp.sendFile(path);
});
app.get("/dash-admin",function(req,resp){
    let path = __dirname+"/public/dash-admin.html";
    resp.sendFile(path);
});
var MyDatabase = mysql.createConnection(configObj);

MyDatabase.connect(function(err){
    if(err==null)
        console.log("connection established successfully !");
    else
        console.log(err.message);

});

app.get("/ajax-send",function(req,resp){
    MyDatabase.query("insert into users values(?,?,?,1)",[req.query.myEmail,req.query.myPwd,req.query.myChoice],function(err){
        if(err==null)
        {
            resp.send("Sign Up Successfully");
            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user :'gargdesania@gmail.com',
                    pass: 'bvwrdlevrmwaiuwk'
                }
            });
            var mailOptions = {
                from:'gargdesania@gmail.com',
                to:req.query.myEmail,
                subject: 'Welcome To FurryFriendCare',
                text:"You Are Log In Successfully,We Provide you the Information about the FurryFriendCare.Our Team Will soon contact You!!<br><br>ThanYou!, For SignUp in FurryFriendCare"
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error)
                {
                    resp.send(error);
                }
                else{
                   resp.send("Email Sent Successfully");
                }
            });
        }
        else
            resp.send(err.message+"Email already used");
    });
});
app.get("/check-login",function(req,resp)
{
// console.log(req.query);
    MyDatabase.query("select * from users where Email=? && Password=?",[req.query.E,req.query.P],function(err,records)
    {
    //     if(records.length==0)
    //         resp.send("Invalid Email or Password");

    //     else
    //     {
    //         // resp.send("login Successfully");
    //         resp.send("Login Successfully,"+"<br>"+"You are - "+records[0].User_Type);
    //         // let fileName=__dirname+"/public/citizen-profile.html";
    //         // resp.send(fileName);
    //     }
    // });
    if (err==null) {
        if (records.length > 0) {
            resp.send(records[0].User_Type);
        }
        else {
            resp.send("Invalid ID/Password");
        }
    }
    else {
        resp.send(err.message);
    }
})
});
app.post("/LogIn-Save",function(req,resp){

    let picName= "nopic.jpg";
    if(req.files!= null)
    {
        picName = req.files.inputImg.name;
        let fullpath = __dirname+"/public/uploads/"+ picName;
        req.files.inputImg.mv(fullpath);
    }
    req.body.picName=picName;
    console.log(picName);

    MyDatabase.query("insert into citizen values(?,?,?,?,?,?,?,?)",[req.body.picName,req.body.inputEmail,req.body.inputFName,req.body.inputLName,req.body.inputAddress,req.body.inputState,req.body.inputCity,req.body.inputMobile],function(err){
        if(err==null)
            resp.send("Record Saved ");
        else   
            resp.send(err.message);
    });

});
app.post("/LogIn-Edit",function(req,resp){
    let picName= "nopic.jpg";
    if(req.files!= null)
    {
        picName = req.files.inputImg.name;
        let fullpath = __dirname+"/public/uploads/"+ picName;
        req.files.inputImg.mv(fullpath);
    }
    else if(req.files==null)
    { 
        picName=req.body.hdn;
        console.log(picName);
    }
    req.body.picName=picName;
    console.log(picName);
    
    MyDatabase.query("update citizen set Image=?,First_Name=?,Last_Name=?,Address=?,Mobile=?,State=?,City=? where Email_Id=?",[req.body.picName,req.body.inputFName,req.body.inputLName,req.body.inputAddress,req.body.inputMobile,req.body.inputState,req.body.inputCity,req.body.inputEmail],function (err) 
    {
        if(err == null)
             resp.send("Record Updated successfully");
        else
             resp.send(err.message);
      });
});
app.get("/json-fetch-one",function(req,resp)
{
    MyDatabase.query("select * from citizen where Email_Id=?",req.query.myEmail,function(errKuch,recordsKuch)
    {
            if(errKuch==null)
               {
                resp.send(recordsKuch);
               }
            else
            resp.send(errKuch.message);
    });
});
app.get("/check-email",function(req,resp){
    MyDatabase.query("select * from citizen where Email_Id=?",[req.query.Email],function(errKuch,recordsKuch)
    {
            if(errKuch==null)
               {
                resp.send(recordsKuch);
               }
            else
            resp.send(errKuch.message);
    });
});
app.post("/post-requirement",function(req,resp){
        MyDatabase.query("insert into post_req values(?,?,?,?,?,?,?)",[req.body.inputId,req.body.inputEmail,req.body.petType,req.body.dateFrom,req.body.dateTo,req.body.info,req.body.inputCity],function(err){
            if(err==null)
                resp.send("Your request have been posted");
            else
                resp.send(err.message);
        });
});
app.get("/pwd-check",function(req,resp)
{

    MyDatabase.query("select * from users where Email=? AND Password=?",[req.query.SE,req.query.SP],function(err,record)
    {
        if (err==null) {
            if (record.length > 0) 
            {
                MyDatabase.query("update users set Password=? where Email=?",[req.query.NP,req.query.SE],function(err){
                    if(err==null)
                        resp.send("password updated");
                    else
                        resp.send(err.message);
            });
            }
            else {
               resp.send("Invalid ID/Password");
            }
        }
        else {
            resp.send(err.message);
        }
    });
});
app.get("/angular-fetch",function(req,resp)
    {
        MyDatabase.query("select * from users",[req.query.myEmail],function(err,recordsJsonAry)
        {
            resp.send(recordsJsonAry);//here fail() will be called
        });

    });
app.get("/angular-block",function(req,resp)
{
    MyDatabase.query("update users set status=0 where Email=?",[req.query.emailkuch],function(err,record){
        if(err==null)
        {
            if(record.affectedRows==1)
                resp.send("blocked user");
            else    
                resp.send("invalid");
        }
        else    
            resp.send(err);

    });
});
app.get("/angular-resume",function(req,resp)
{
    MyDatabase.query("update users set status=1 where Email=?",[req.query.emailkuch],function(err,record){
        if(err==null)
        {
            if(record.affectedRows==1)
                resp.send("Unblocked");
            else    
            resp.send("invalid");
        }
        else
            resp.send(err);
    });
});
app.post("/care-Taker-Send",function(req,resp)
{
    let picName = "nopic.jpg";
    if (req.files.inputId!=null) 
    {
        picName = req.files.inputId.name;
        let fullpath = __dirname + "/public/uploads/" + picName;
        req.files.inputId.mv(fullpath);
  }
  req.body.picName = picName;

    MyDatabase.query("insert into takerProfile values(?,?,?,?,?,?,?,?,?)",[req.body.inputEmail,req.body.inputName,req.body.inputContact,req.body.inputAddress,req.body.inputCity,req.body.inputFirm,req.body.inputExp,req.body.inputPet.toString(),req.body.picName],function(err){
        if(err==null)
            resp.send("record saved");
        else    
            resp.send(err.message);
    });
});
app.get("/care-Taker-fetch",function(req,resp)
{
    MyDatabase.query("select * from takerProfile where Email=?",req.query.myEmail,function(errKuch,recordsKuch)
    {
            if(errKuch==null)
               {
                resp.send(recordsKuch);
               }
            else
            resp.send(errKuch.message);
    });
});

app.post("/care-Taker-Modify",function(req,resp)
{
    let picName = "nopic.jpg";
    if (req.files!=null) 
    {
        picName = req.files.inputId.name;
        let fullpath = __dirname + "/public/uploads/" + picName;
        req.files.inputId.mv(fullpath);
  }
  req.body.picName = picName;

  MyDatabase.query("update takerProfile set Name=?,Contact=?,Address=?,City=?,Firm_Name=?,Experience=?,Preferred_Pet=?,Id_Proof=? where Email=?",[req.body.inputName,req.body.inputContact,req.body.inputAddress,req.body.inputCity,req.body.inputFirm,req.body.inputExp,req.body.inputPet.toString(),req.body.picName,req.body.inputEmail],function(err){
    if(err==null)
            resp.send("record updated");
        else    
            resp.send(err.message);
  });
});
app.get("/angular-fill-city",function(req,resp){
    MyDatabase.query("select * from takerProfile"[req.query.inputEmail],function(err,recordsJsonAry)
    {
        resp.send(recordsJsonAry);//here fail() will be called
    });
});
app.get("/fetch-user-data", function(req,resp)
{
    MyDatabase.query("select * from takerProfile",function(err, records)
    {
        if(err)
        {
            resp.send(err.message);
        }
        else{
            resp.send(records);
        }
    });
});
app.get("/do-fetch-city",function(req,resp){
    MyDatabase.query("select distinct City from takerProfile",function(err,record){
        if(err)
        {
            resp.send(err.message);
        }
        else{
            resp.send(record);
        }
    });
});
app.get("/do-fetch-pets",function(req,resp){
    MyDatabase.query("select Preferred_Pet from takerProfile",function(err,record){
        if(err)
        {
            resp.send(err.message);

        }
        else
            resp.send(record);
    });
});
app.get("/do-fetch-caretaker",function(req,resp)
{
    // let city = req.query.City;//bti
    // let pet = req.query.Preferred_Pet;
    MyDatabase.query("select * from takerProfile where City=? and Preferred_Pet like ?",[req.query.City, "%"+req.query.Preferred_Pet+"%"],function(err,record){
        if(err)
            resp.send(err.message);
        else
        {
            // console.log(record);
            resp.send(record);
        }
    });
});

app.get("/send-email",function(req,resp){
    var Email=req.query.Email;
    var Email_Id=req.query.Email_Id;
    var CareName=req.query.Name;
    // var cityName=req.query.First_Name;
    // var Mob=req.query.Mobile;
    // console.log(cityName,Mob);
    MyDatabase.query("select * from citizen where Email_Id=?",[Email_Id],function(err,record){
        if(err==null)
        {
            
            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user :'gargdesania@gmail.com',
                    pass: 'bvwrdlevrmwaiuwk'
                }
            });
            var mailOptions = {
                from:req.query.Email_Id,
                to:req.query.Email,
                subject: "Inquiry About Pet Care Services",
                text: `Dear ${CareName},
                Welcome To FurryFriendCare,
                          I hope this email finds you well. 
                
                I am reaching out to inquire about your pet care services. I am in need of a caring and reliable caretaker for my beloved pet, 
                
                Could you please provide me with some information about the services you offer?
             
                I am looking forward to hearing from you and potentially arranging a meeting to discuss further.
          
                please contact me : ${Email_Id} 
                
                Thank you for your time and consideration.
                
                Best regards`
            };
            transporter.sendMail(mailOptions,function(error,info){
                if(error)
                {
                    resp.send(error);
                }
                else{
                   resp.send("Email Sent Successfully");
                }
            });
        }
        else
            console.log(err.message);
    });
});
app.get("/do-fetch-pet-city",function(req,resp)
{
    MyDatabase.query("select distinct City from post_req",function(err,record){
        if(err)
        {
            resp.send(err.message);
        }
        else{
            resp.send(record);
        }
    });
});
app.get("/do-pet-finder-pets",function(req,resp)
{
  
    MyDatabase.query("select Pet_Type from post_req",function(err,record){
        if(err)
        {
            resp.send(err.message);

        }
        else
            resp.send(record);
    });
});
app.get("/do-fetch-caretaker-pet",function(req,resp)
{
    // let city = req.query.City;//bti
    // let pet = req.query.Preferred_Pet;
    MyDatabase.query("select * from post_req where City=? and Pet_Type like ?",[req.query.City, "%"+req.query.Pet_Type+"%"],function(err,record){
        if(err)
            resp.send(err.message);
        else
        {
            // console.log(record);
            resp.send(record);
        }
    });
});
