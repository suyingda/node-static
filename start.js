let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');

let mine = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
};
http.createServer(function (req, res) {
    const { pathname, query } = url.parse(req.url, true);
 
    console.log(pathname)
    console.log(req.method)
    if (pathname === '/admin') {
        let data = new Date();
        res.end(JSON.stringify({'time':data.toLocaleDateString()}));
        return ;
    }
    fs.stat('./' + pathname, function (err, stats) {
        if (err) {
            res.statusCode = '404';
            res.end('not found ' + pathname);
        } else if (stats.isFile()) { //是文件的情况
            let extName = pathname.match(/\.\w+$/)[0];
            res.setHeader('Content-Type', mine[extName] + ';charset=utf8');
            fs.readFile('.' + pathname, function (err, data) {
                res.end(data)
            })
        } else if (stats.isDirectory()) {
            res.setHeader('Content-Type', 'text/html;charset=utf8');
            let p = path.join('.' + pathname, './index.html')
            fs.readFile(p, function (err, data) {
                res.end(data)
            })
        }

    })
    // fs.createReadStream('index.html').pipe(res);

}).listen(3000, function () {
    console.log('启动成功')
})

 