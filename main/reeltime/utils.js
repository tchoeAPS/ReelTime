

// function serves up an object as a JSON string
exports.sendJSONObj = function(res,status,out) {

    res.writeHead(status, { "Content-Type" : "application/json" });
    console.log(JSON.stringify(out));
    res.write(JSON.stringify(out));
    res.end();

}

