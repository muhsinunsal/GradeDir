import inquirer from "inquirer";
//import { promptCourseList } from "./func/courseList.js"; 1
import inputData from "./func/inputData.js";
import { divFile } from "./func/misc.js";
import { removeCourseData } from "./func/removeData.js";
//import { promptStats, cacheObj } from "./func/stats.js";

const start = () => {
    console.clear();
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "Welcome to GradeDir\nWhat do you want do to ?",
        default: "Browse",
        choices: [
            "Browse Courses", "Search Students", "Enter new Data", "Remove old Course Data", "Others"
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
            case "Remove old Course Data":
                removeCourseData()
                break;
            case "Others":
                inquirer.prompt([{
                    type: "list",
                    name: "other",
                    default: "Back",
                    choices: [
                        {
                            name: "Divide source",
                            disabled: "Unavailable right now."
                        },
                        {
                            name: "Stats",
                            disabled: "Unavailable right now."
                        },
                        {
                            name: "ReCount Stats",
                            disabled: "Unavailable right now."
                        },
                        , "Back", /* .... */
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

export default start