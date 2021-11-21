const fs = require("fs");

var employees = [];
var departments = [];

//*****************************************************************/
module.exports.addEmployee = function (employeeData) {

    var promise = new Promise((resolve, reject) => {
        
       if (typeof employeeData.isManager === "undefined") {
            employeeData.isManager = false;
       } else {
            employeeData.isManager = true;
       }

       employeeData.employeeNum = employees.length + 1;
       employees.push(employeeData);
        
     resolve (employees);
     })
     return promise;

};
//*****************************************************************/
module.exports.getEmployeesByStatus = function (statusId) {
    var emp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].status == statusId) {
               emp.push(employees[i]);
           }
       }
       if(emp.length === 0) {
        var err = "getEmployeesByStatus() Not Filled.";
        reject({message: err});
       }  
    resolve (emp);
    })
    return promise;

};

//*****************************************************************/
module.exports.getEmployeesByDepartment = function (departmentId) {

    var emp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].department == departmentId) {
               emp.push(employees[i]);
           }
       }

       if(emp.length === 0) {
        var err = "getEmployeesByDepartment() Not Filled.";
        reject({message: err});
       }  

    resolve (emp);
    })
    return promise;

};

//*****************************************************************/
module.exports.getEmployeesByManager = function (managerBool) {
   
    var emp = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].isManager == managerBool) {
               emp.push(employees[i]);
           }
       }

       if(emp.length === 0) {
        var err = "getEmployeesByManager() Not Filled.";
        reject({message: err});
       }  

    resolve (emp);
    })
    return promise;

};

//*****************************************************************/
module.exports.getEmployeeByNum = function (num) {
  //  console.log (num);
    var emp;
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < employees.length; i++){
           if (employees[i].employeeNum == num) {
             //  console.log (num + employees[i]);
               emp = employees[i];
               i = employees.length;
           }
       }

       if(emp === "undefined") {
        var err = "getEmployeesByNum() Not Filled.";
        reject({message: err});
       }  

    resolve (emp);
    })
    return promise;

};
//*****************************************************************/

module.exports.initialize = function () {

    var promise = new Promise((resolve, reject) => {
        try {
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;
                employees = JSON.parse(data);
                console.log("employees correctly loaded.");
            })
            fs.readFile('./data/departments.json', (err, data) => {
                if (err) throw err;
                departments = JSON.parse(data);
                console.log("departments correctly loaded.");
            })
        } catch (ex) {
                        console.log("Initialize failed.");
                        reject("Initialize failed.");
                     }
                     console.log("Initialize successful!.");
                     resolve("Initialize successful!.");
    })

    return promise;
};
//*****************************************************************/
module.exports.getAllEmployees = function () {
    var promise = new Promise((resolve, reject) => {
       if(employees.length === 0) {
        var err = "No results returned.";
        reject({message: err});
       }  

    resolve (employees);
    })
    return promise;
};
//*****************************************************************/
exports.getManagers = function () {
    var managersLength = [];
    var promise = new Promise((resolve, reject) => {
       for (var i=0; i < employees.length; i++){
           if (employees[i].isManager == true) {
            managersLength.push(employees[i]);
           }
       }
       if(managersLength.length === 0) {
        var err = "No results returned";
        reject({message: err});
       }  
    resolve (managersLength);
    })
    return promise;
};
//*****************************************************************/
exports.getDepartments = function () {
    var promise = new Promise((resolve, reject) => {
        if(departments.length === 0) {
         var err = "No results returned.";
         reject({message: err});
        }  
     resolve (departments);
     })
     return promise;
};

//***************************************************************/
module.exports.updateEmployee = function (employeeData) {

    var isFound = false;
    var promise = new Promise((resolve, reject) => {
        for (var i=0; i < employees.length; i++){
            if (employees[i].employeeNum == employeeData.employeeNum) {
                employees[i] = employeeData;
                isFound = true;
            }
        }
        if(isFound === false) {
         var err = "Cannot find employee to update.";
         reject({message: err});
        }  
        resolve (employees);
     })
     return promise;
};