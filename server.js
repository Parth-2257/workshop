const express=require('express')
const path=require('path')
const fs=require("fs")

const app=express()
const port=3000

const cache={}

const pathToFile=path.join(__dirname,"db.json")

async function readFile(){
    try{
        let data= await fs.readFileSync(pathToFile,"utf-8")
        return JSON.parse(data)
    }catch(err){
        console.log(err)
    }
}

async function readFileWithDelay(){
    await new Promise((resolve,reject)=>{
        setTimeout(resolve,1500)
    })
    let products=await readFile()
    return products
}

app.get("/products",async(req,res)=>{
    try{
        let key=req.url;
        let value=cache[key];
        if(value){
            return res.json(value)
        }
        let products= await readFileWithDelay()
        cache[key]=products
        return res.json(products)
    }catch(err){
        console.log(err)
    }
})



app.get("/products/:id",async(req,res)=>{
    try{
        let key=req.url;
        let value=cache[key];
        if(value){
            return res.json(value)
        }
        let products= await readFileWithDelay()
        let {id}=req.params
        id=Number(id)
        let product=products.find((item)=>{
            return item.id===id
        })
        cache[key]=product
        return res.json(product)
    }catch(err){
        console.log(err)
    }
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})