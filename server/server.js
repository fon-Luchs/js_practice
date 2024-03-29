const http = require('http');
const url = require('url');
const fs = require('fs');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000,
  'Content-Type': 'text/plain'
};

http.createServer(function(request, response){
  let parts = url.parse(request.url); 
  if (parts.pathname === '/products') { 
    let content = fs.readFileSync('../product-feed.json')
    response.writeHead(200, headers);
    response.end(content);
  }
}).listen(3000);
