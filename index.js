const express=require("express");
const body_parser=require("body-parser");
const res = require("express/lib/response");
const axios=require("axios");
const req = require("express/lib/request");
require('dotenv').config(); 

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

app.listen(process.env.PORT | 8000,()=>{
    //console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side 'verify token' in facebook account
app.get("/webhook",(req,res)=>{
    let mode=req.query["hub.mode"];
    let challenge=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    if( mode && token){
        if(mode==='subscribe' && token===mytoken){
            res.status(200).send(challenge);
        }else{
            res.status(403);
        }
    };
});




app.post("/webhook",(req,res)=>{

    let body_param=req.body;

    

    if(body_param.object){
        //console.log("Inside body param object");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
            ){
                //console.log("Inside body param entry");
                let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
                let from=body_param.entry[0].changes[0].value.messages[0].from;
                let mmsg_body=body_param.entry[0].changes[0].value.messages[0].text.body;

                console.log("phone_number_id "+phon_no_id);
                console.log("from "+from);
                console.log("Msg_body "+mmsg_body);

                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v17.0/"+phon_no_id+"/messages?access_token="+token,
                    data:{
                        messaging_product:"whatsapp",
                        to:from,
                        text:{
                            body:"Hi....I am Akram. and your message is "+ mmsg_body
                        }
                    },
                    headers:{
                        "Content-Type":"application/json"
                    }
                });
                res.sendStatus(200);
            }else{
                //res.sendStatus(404);
                //console.log("No messages sent to the number")
            }
    };
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup by akram");
})