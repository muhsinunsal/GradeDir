import inquirer from "inquirer";
import { promptCourseList } from "./func/courseList.js"; 1
import { inputData } from "./func/inputData.js";
import { divFile } from "./func/misc.js";
import { removeData } from "./func/removeData.js";
import { promptStats, cacheObj } from "./func/stats.js";

// UNUTMA !!   import chalk from "chalk";

const start = () => {
    console.clear();
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Welcome to GradeDir\nWhat do you want do to ?",
        default: "Browse",
        choices: [
            "Browse Courses", "Search Students", "Enter new Data", "Remove old Data", "Others"
        ]
    }]).then(({ menu }) => {
        switch (menu) {
            case "Browse Courses":
                promptCourseList()
                break;
            case "Search Students":
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
                            cacheObj.reCount();
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
