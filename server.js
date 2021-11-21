/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* Name: Sahar HosseiniChegeni Student ID: 139670202   Date: 21-11-07
* Online (Heroku) Link: https://radiant-headland-93757.herokuapp.com/
********************************************************************************/

const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require ("express-handlebars");
var dataService = require("./data-service.js");
var app = express();

app.engine(".hbs", exphbs.engine({ extname: ".hbs",
defaultLayout: "main",
helpers: {       
  navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
    '><a href="' + url + '">' + options.fn(this) + '</a></li>';},
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this); }}  
      }
}));
app.set('view engine', '.hbs');

app.engine(".hbs", exphbs.engine({ extname: ".hbs",
defaultLayout: "main",
helpers: {       
  navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
    '><a href="' + url + '">' + options.fn(this) + '</a></li>';},
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
      throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this); }}  
      }
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
  });

  var HTTP_PORT = process.env.PORT || 8080;
  function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

  app.get("/", function (req, res) {
    res.render("home");
  });
  
  app.get("/about", function (req, res) {
    res.render("about");
  });
  
  app.get("/employees/add", function (req, res) {
    res.render("addEmployee");
  });
  
  app.get("/images/add", function (req, res) {
   res.render("addImage");
  });

  app.post("/employees/add", function (req, res) {
    dataService.addEmployee(req.body)
      .then(() => {
        res.redirect("/employees");
      });
  });
  
  app.get("/employees", function (req, res) {

    if (req.query.status) {
      dataService.getEmployeesByStatus(req.query.status)
        .then((data) => {
          res.render("employees", {employees: data});
        })
        .catch((err) => {
          res.render({message: "no results"});
        })
    }
    else
      if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
          .then((data) => {
            res.render("employees", {employees: data});
          })
          .catch((err) => {
            res.render({message: "no results"});
          })
      }
      else 
      if (req.query.isManager) {
        dataService.getEmployeesByManager(req.query.isManager)
          .then((data) => {
            res.render("employees", {employees: data});
          })
          .catch((err) => {
            res.render({message: "no results"});
          })
      }
      else {
        dataService.getAllEmployees()
          .then((data) => {
            res.render("employees", {employees: data});
          })
          .catch((err) => {
            res.render({message: "no results"});
          })
      }
  });

  app.get("/employee/:num", function (req, res) {
    dataService.getEmployeeByNum(req.params.num)
    .then((data) => {
      res.render("employee", { employee: data });
    })
    .catch((err) => {
      res.render("employee",{message:"no results"});
    })
  }); 

  app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {
      res.redirect("/employees");
    })
    .catch((err)=>{
      console.log (err);
    })
  });
  

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), function (req, res) {
  res.redirect("/images");
});

app.get("/images", function (req, res) {
  var imagePath = '/public/images/uploaded'; 
  fs.readdir(path.join(__dirname, imagePath), function (err, items) {
    var imagesContent = { images: [] };
    var size = items.length;
    for (var i = 0; i < items.length; i++) {
      imagesContent.images.push(items[i]);
    }
    res.render("images",imagesContent);
  });

});


app.get("/departments", function (req, res) {
  dataService.getDepartments()
    .then((data) => {
      res.render("departments", {departments: data});
    })
    .catch((err) => {
     res.render({message: "no results"});
    })
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

console.log ("Ready for initialize");
dataService.initialize()
  .then(() => {
    console.log ("Initialize");
    app.listen(HTTP_PORT, onHttpStart);
 })
  .catch(err => {
    console.log(err);
 })