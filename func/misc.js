import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

//A function to divide a file to multiple files
const divideF = (f, q) => {
    if (q == 0) return false
    const base = JSON.parse(fs.readFileSync(f, "utf-8"));
    const fileQuantity = Math.ceil(base.length / q); // Rounds upward
    let ddata = [];
    let k = 0;
    let dest = path.parse(f).name
    for (let i = 0; i < fileQuantity; i++) {
        ddata = [];
        for (let j = 0; j < q; j++) {
            if (base[k + j]) {
                ddata.push(base[k + j]);
            }
        }
        k += q;

        let p = path.join("./", "sources", "json", `${dest}_${i}.json`);
        fs.writeFileSync(p, JSON.stringify(ddata), "utf-8");
    }
    fs.rmSync(f)
}

//A function to ask questions to make preferences to divide file
export const divFile = () => {
    inquirer.prompt([{
        type: "file-tree-selection",
        name: "source",
        message: "Source: ",
        root: "sources/json"
    },
    {
        type: "confirm",
        name: "confirm",
        default: true,
        message: ({source}) => {
            let f = JSON.parse(fs.readFileSync(source,"utf-8"));
            return `This files contains ${chalk.red(f.length)} lines. Are you sure? `
        }
    },
    {
        type: "number",
        name: "quantity",
        message: "How many lines do you want to have in one file ?: ",
        when: ({confirm}) => confirm === true
    }]).then(({ source, confirm , quantity }) => {
        if(confirm) divideF(source, quantity)
    });
}