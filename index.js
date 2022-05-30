const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname,"sources","Grades Raw","IDs with Departmans copy.txt"),(err,data) =>{
    if (err) throw err;
    //console.log(data.toString());

});
//A function to retrive data from txt file with two column data (seperated with tab)
//And write them as json file as array of elements with properity of those rows value
const newEnterence = (source, dest ,row1 = "ID",[row2 = null,row3 = null,row4 = null,row5 = null,row6 = null] = []) =>{
    let jsonArray = [];
    class Ele {
        constructor(){
            this.id;
        }
    }
    const re = /[^\t\n\r\s]+/g;
    let rawString =fs.readFileSync(source).toString();
    let afterRegex = rawString.match(re);
    if(afterRegex){
        if(row6){
            for(let i = 0; i < rawString.split("\n").length * 6;i +=6){
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i +1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                stu[row5] = afterRegex[i + 4];
                stu[row6] = afterRegex[i + 5];
                jsonArray.push(stu);
            }
        }else if(row5){
            for(let i = 0; i < rawString.split("\n").length * 5;i +=5){
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i +1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                stu[row5] = afterRegex[i + 4];
                jsonArray.push(stu);
            }
        }else if(row4){
            for(let i = 0; i < rawString.split("\n").length * 4;i +=4){
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i +1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                jsonArray.push(stu);
            }
        }else if(row3){
            for(let i = 0; i < rawString.split("\n").length * 3;i +=3){
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                stu[row3] = afterRegex[i + 2];
                jsonArray.push(stu);
            }
        }else if(row2){
            for(let i = 0; i < rawString.split("\n").length * 2;i +=2){
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i +1];
                jsonArray.push(stu);
            }
        }        
        data = JSON.stringify(jsonArray);
        fs.writeFileSync(dest,data);
    }else{
        console.error("Couldnt get data");
    }
}
