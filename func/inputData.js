import chalk from "chalk";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";


//A function to retrive data from txt file with two or more columns of data (seperated with tab)
//And write them as json file as array of elements with properity of those rows value
const newEnterence = (source, dest, row1 = "ID", [row2 = null, row3 = null, row4 = null, row5 = null, row6 = null] = []) => {
    console.log(source);
    let s = source;
    let d;

    if (dest) {
        d = path.join("./", "sources", "json", `${dest}.json`);
    } else {
        d = path.join("./", "sources", "json", `${path.parse(s).name}.json`);
    }
    let jsonArray = [];
    class Ele {
        constructor() {
            this.id;
        }
    }
    const re = /[^\t\n\r\s]+/g;
    let rawString = fs.readFileSync(s).toString();
    let afterRegex = rawString.match(re);
    if (afterRegex) {
        if (row6) {
            for (let i = 0; i < rawString.split("\n").length * 6; i += 6) {
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                stu[row5] = afterRegex[i + 4];
                stu[row6] = afterRegex[i + 5];
                jsonArray.push(stu);
            }
        } else if (row5) {
            for (let i = 0; i < rawString.split("\n").length * 5; i += 5) {
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                stu[row5] = afterRegex[i + 4];
                jsonArray.push(stu);
            }
        } else if (row4) {
            for (let i = 0; i < rawString.split("\n").length * 4; i += 4) {
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                stu[row3] = afterRegex[i + 2];
                stu[row4] = afterRegex[i + 3];
                jsonArray.push(stu);
            }
        } else if (row3) {
            for (let i = 0; i < rawString.split("\n").length * 3; i += 3) {
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                stu[row3] = afterRegex[i + 2];
                jsonArray.push(stu);
            }
        } else if (row2) {
            for (let i = 0; i < rawString.split("\n").length * 2; i += 2) {
                let stu = new Ele();
                stu.id = afterRegex[i];
                stu[row2] = afterRegex[i + 1];
                jsonArray.push(stu);
            }
        }
        let data = JSON.stringify(jsonArray);
        fs.writeFileSync(d, data);
        return true
    } else {
        console.error("Couldnt get data");
        return false
    }
}
//A function to preview to certain lines of text 
const filePreview = (source, lineNum) => {
    let file = fs.readFileSync(source, "utf8");
    let nthPos = file.split("\n", lineNum).join("\n").length;
    let t = file.slice(0, nthPos);
    let out = t.concat("\n\t.\n\t.\n\t.");

    return out;
}

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

//A function to ask questions to get data
export const inputData = () => {
    inquirer.prompt([{
        type: "file-tree-selection",
        name: "source",
        message: "Source: ",
        root: "sources/raw"
    },
    {
        type: 'input',
        name: 'destination',
        message: "Save as (.json): ",
    }
        , {
        type: "input",
        name: "rows",
        message: "Rows (1-6?):"
    }
    ]).then((answers) => {
        console.clear();

        let string = answers.rows.split(" ");
        let log = "\n" + chalk.underline("Source: ") + chalk.cyan(answers.source) + "\n" + chalk.bold("Destination: ") + chalk.cyan(answers.destination + ".json") + "\n" + chalk.bold("Rows: ") + "\n" + filePreview(answers.source, 10) + "\n"
        console.log(log)
        inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: "Are these values correct ?"
        }]).then((answer) => {
            if (answer.confirm) {
                newEnterence(answers.source, answers.destination, string[0], [string[1], string[2], string[3], string[4], string[5]])
            }
        })
    })
};