import inquirer from "inquirer";
import { inputData } from "./func/inputData.js";
import { divFile } from "./func/misc.js";
import { removeData } from "./func/removeData.js";
import { promptStats, reCount } from "./func/stats.js";

import chalk from "chalk";

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
            case "Browse":
                break;
            case "Search":
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
                        "Divide source", "Stats", "ReCount Stats", "Back", /* .... */
                    ]
                }]).then(({ other }) => {
                    switch (other) {
                        case "Divide source":
                            divFile();
                            break;
                        case "Stats":
                            promptStats();
                            break;
                        case "ReCount Stats":
                            reCount();
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
