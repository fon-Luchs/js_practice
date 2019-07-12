const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function(request, response){
  let parts = url.parse(request.url); 
  if (parts.pathname === '/products') { 
    let content = fs.readFileSync('../product-feed.json')
    let jsonContent = JSON.parse(content);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(JSON.stringify(jsonContent, null, 3));
  }
}).listen(3000);
