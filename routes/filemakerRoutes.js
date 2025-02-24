const { getFileMakerData, getFileMakerRecordById } = require('../controllers/filemakerGet');
const{putFileMakerData} =require('../controllers/filemakerPut');
const{deleteFileMakerData} =require('../controllers/filemakerDelete');

const { postFileMakerData } = require('../controllers/filemakerPost');
const {routeNotFound} =require('../utils/constants');

function filemakerRouter(req, res) {

    res.setHeader('Content-Type', 'application/json');

    switch (req.method) {
        case "GET": getRequestCollection(req, res);
            break;
        case "POST": postRequestCollection(req,res);
            break;
        case "PUT": putRequestCollection(req, res);
            break;
        case "DELETE": deleteRequestCollection(req, res);
            break;
        default:
            res.statusCode = 404;
            res.setHeader("content-Type", "application/json");
            res.write(routeNotFound);
            res.end();
    }


    function getRequestCollection(req, res) {
        let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
        if (req.url == '/getEmployee') {
            getFileMakerData(req, res);
        }
        else if (baseUrl == '/getEmployee/') {
            const recordId = req.url.split('/')[2];
            req.params = { recordId };
            getFileMakerRecordById(req, res);
        }
        else{
            res.statusCode = 404;
            res.setHeader("content-Type", "application/json");
            res.write(routeNotFound)
            res.end();
        }
    }

    function postRequestCollection(req,res){
      if(req.url=='/addEmployee'){
        postFileMakerData(req, res);
      }
      else{
        res.statusCode = 404;
            res.setHeader("content-Type", "application/json");
            res.write(routeNotFound)
            res.end();
      }
    }

    function deleteRequestCollection(req,res){
        let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
        if (baseUrl == '/deleteEmployee/') {
            deleteFileMakerData(req,res);
        }
        else{
            res.statusCode = 404;
            res.setHeader("content-Type", "application/json");
            res.write(routeNotFound)
            res.end();
        }
    }

    function putRequestCollection(req,res){
        let baseUrl = req.url.substring(0, req.url.lastIndexOf("/") + 1);
        if (baseUrl == '/updateEmployee/') {
            putFileMakerData(req,res);
        }
        else{
            res.statusCode = 404;
            res.setHeader("content-Type", "application/json");
            res.write(routeNotFound)
            res.end();
        }
    }
}

module.exports = { filemakerRouter };
