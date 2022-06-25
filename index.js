import inquirer from "inquirer";
import { inputData } from "./func/inputData.js";
import { divFile } from "./func/misc.js";
import { removeData } from "./func/removeData.js";


const start = () => {
    console.clear();
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Welcome to GradeDir\nWhat do you want do to ?",
        default: "Browse",
        choices: [
            "Browse", "Search", "Enter new Data", "Remove old Data", "Others"
        ]
    }]).then(({ menu }) => {
        switch (menu) {
            case "Browse Courses":
                break;
            case "Search Student":
                break;
            case "Enter new Data":
                inputData();
                break;
            case "Remove old Data":
                removeData()
                break;
            case "Others":
                inquirer.prompt([{
                    type: "list",
                    name: "other",
                    default: "Back",
                    choices: [
                        "Divide source", "Back", /* .... */
                    ]
                }]).then(({ other }) => {
                    switch (other) {
                        case "Divide source":
                            divFile();
                            break;
                        default:
                            start();
                            break;
                    }
                })
                break;
        }
    })
}

start()
