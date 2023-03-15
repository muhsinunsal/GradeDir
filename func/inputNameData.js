import fs from "fs";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";

import Student from "./objects/Student.js";

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const inputNameData = () => {
    inquirer.prompt([{
        name: "dir",
        type: "file-tree-selection",
        message: "Please choose file you want to enter: ",
        hideRoot: true,
        root: "./src/raw"
    }]).then(({ dir }) => {
        const rawString = fs.readFileSync(dir, "utf-8");
        if(rawString){
            const rows  = rawString.split("\n");
            let out = rows.map(row =>  row.trim().split("\t"));
            out.forEach(row => {
                let student = new Student(row[0]);
                if(!student){
                    console.count("Unreconised Student Id");
                }
            })

        }
    })
}

export default inputNameData