const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data) 

const server = http.createServer((req,res)=>{
    
    const {query, pathname} = url.parse((req.url), true)
    if(pathname === '/' || pathname === '/overview'){
        const output = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        const finalOutput = tempOverview.replace(/{%PRODUCT_CARDS%}/g, output)
        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(finalOutput)
    }else if(pathname === `/product`){
        res.writeHead(200, {'Content-type': 'text/html'})
        const output = replaceTemplate(tempProduct, dataObj[query.id])
        res.end(output)
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    }else{
        res.writeHead(404, {'Content-type': 'Not Found'})
        res.end(`<h3>Page Not Found !!!</h3>`)
    }
    
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log("Running on Server 8000 . . . ")
})