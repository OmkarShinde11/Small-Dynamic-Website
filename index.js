const fs=require('fs');
const http=require('http');
const url=require('url');
let replacedTemp=require('./ownmodule');
//Reading File Synchronous
// const readFile=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(readFile);
//Writing File  Synchronous
// const textIn=`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
// fs.writeFileSync('./txt/output.txt',textIn);
// console.log('File Written');

//Non-blocking code 

// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     console.log(data1);
// })
//Reading file using callback hell
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,err=>{
//                 console.log('File Written');
//             })
//         })
//     });
// });

//An Simple api for file read and send data in responce.
const data=fs.readFileSync('./dev-data/data.json','utf-8');
const tempCard=fs.readFileSync('./templates/templateOverview.html','utf-8');
const tempoverview=fs.readFileSync('./templates/overview.html','utf-8');
const producthtml=fs.readFileSync('./templates/product.html','utf-8');
const dataObj=JSON.parse(data);
// console.log(dataObj);


//Creating a Web Server`
const server=http.createServer((req,res)=>{
    const { query,pathname }=url.parse(req.url,true);
    if(req.url=='/' || req.url=='/overview'){
        res.writeHead(200,{
            'Content-type':'text/html',
        });
        let replaceData=dataObj.map(el=>replacedTemp(tempCard,el)).join('');// templateOverview data replace
        let overviewData=tempoverview.replace(/{%PRODUCTS_CARDS%}/,replaceData);
        // console.log(replaceData);
        res.end(overviewData);
    }
    else if(pathname=='/product'){
        res.writeHead(200,{
            'Content-type':'text/html',
        });
        console.log(query.id);
        const productData=dataObj[query.id];
        console.log(productData);
        const prdDetailData=replacedTemp(producthtml,productData);
        console.log(prdDetailData);
        res.end(prdDetailData);
    }
        else if(req.url=='/api'){
        res.writeHead(200,{
            'Content-type':'application/json',
        });
        res.end(data);
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
        });
        res.end('<h1>Page Not Found</h1>');
    }

}).listen(8080,()=>{
    console.log('Server is listen on port 8080')
});