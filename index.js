import inquirer from "inquirer";
import { inputData } from "./func/inputData.js";

inquirer.prompt([{
    type: "list",
    name: "menu",
    message: "Welcome to GradeDir\nWhat do you want do to ?",
    default: "Browse",
    choices: [
        "Browse", "Search", "Enter new Data", "Remove old Data"
    ]
}]).then((answers) => {
    switch (answers.menu) {
        case "Browse":
            break;
        case "Search":
            break;
        case "Enter new Data":
            inputData();
            break;
        case "Remove old Data":
            break;
    }
})


