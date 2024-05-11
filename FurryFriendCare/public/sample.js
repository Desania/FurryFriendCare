app.get("/contact-careTaker",function(req,resp){

  var email= req.query.email;
  var citizen=req.query.citizen;
  var caretaker=req.query.caretaker;
  var citizenName;
  var phone;
  mysql.query(
    "select * from citizen_profile where email=?",[citizen],
    function (err, json) {
      if (err == null) {
        // console.log(json);
        // resp.send(json);
         citizenName= json.name;
         phone= json.mobile;
      } else resp.send(err);
    }
  );

  //---nodemailer---
    //transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 299,
      secure: true, // Use true for port 465, false for all other ports
      rejectUnauthorized: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    //mail
    const mail = {
      from: {
        name: "pet care",
        address: process.env.USER,
      },
      to: [email],
      subject: "Inquiry About Pet Care Services",
      text: `Dear ${caretaker},

      I hope this email finds you well. 
      
      I am reaching out to inquire about your pet care services. I am in need of a caring and reliable caretaker for my beloved pet, 
      
      Could you please provide me with some information about the services you offer?
      
      I am looking forward to hearing from you and potentially arranging a meeting to discuss further.

      please contact me : ${citizen} , ${phone}
      
      Thank you for your time and consideration.
      
      Best regards,
      ${citizenName}`,
    };

    const sendMail = async (transporter, mail) => {
      try {
        const result = await transporter.sendMail(mail);
        console.log("email send success");
        resp.send("mail was sent to careTaker");
      } catch (error) {
        console.error("email sent failed" + error);
        resp.send(error);
      }
    };

    sendMail(transporter, mail);


})