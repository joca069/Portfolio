const express=require('express')
const bodyparser=require('body-parser')
const server=express()

const static="/var/blog"

function log(log){
    console.log(log)
}

function generatehash(){
    const alfabet="QWERTYUIOPLKJHGFDSAZXCVBNMmnbvcxzasdfghjkloiuytrewq"
    let ret=""
    for(let i=0;i<10;i++){
        ret+=alfabet.charAt(parseInt(Math.random()*alfabet.length))
    }
    return ret
}

function updateforum(forum,message){ 
    for(comment of forum){ 
        if(message.hash==comment.hash){ 
            const newcomment={
                hash:generatehash(),
                author:message.author,
                content:message.content,
                comments:[]
            }
            comment.comments.push(newcomment) 
        }else{
        updateforum(comment.comments,message)
        }


    }
}

server.use(express.static(static))


const fs=require('fs')

server.get('/',(req,res)=>{
    res.redirect('/aboutMe.html')
})

server.post('/post',express.text(),(req,res)=>{

    const message=JSON.parse(req.body)
	
	log(`post recived ${JSON.stringify(message)}`)
    const forum=JSON.parse(fs.readFileSync(`${static}/forum.json`).toString())
    
    
    if(message.hash==""){
        forum.push(
            {
            hash:generatehash(),
            author:message.author,
            content:message.content,
            comments:[]
        }
        )
    }else{
    updateforum(forum,message)
    }

    fs.writeFile(`${static}/forum.json`,JSON.stringify(forum),()=>{})
    res.send("OK")

})


server.listen(8080,()=>{
    log("server started")
})
