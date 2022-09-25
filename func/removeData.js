import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer"
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import path from "path";


import { default as home } from "../index.js"
import fileNameParser from "./parsers/fileNameParser.js";
import CourseConfigs from "./objects/CourseConfigs.js";

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const configeDir = "./src/courses/course_configs.json";
let course_config = new CourseConfigs(configeDir)

export const removeCourseData = () => {
    inquirer.prompt([{
        message: "Which file(s) are you want to delete?",
        type: "file-tree-selection",
        multiple: true,
        name: "files",
        root: "./src/courses",
        hideRoot: true,
        onlyShowValid: true,
        transformer: (url) => {
            let { code, semester, year } = fileNameParser(url);
            return chalk.bold(code + " " + year + " " + semester);
        },
        validate: (url) => {
            let { code, semester, yearInt } = fileNameParser(url);
            if (code && semester && yearInt && yearInt) {
                return true
            } else false
        }
    }, {
        name: "confirm",
        message: "Do you confirm?",
        type: "confirm"
    }]).then(({ files, confirm }) => {
        if (confirm) {
            files.forEach((url) => {
                const { code, yearInt, semester } = fileNameParser(url);
                course_config.removeCourse(url, course_config.getCourse(code, yearInt, semester));
                console.log(chalk.green(`${path.parse(url).name} removed ${chalk.green("✓")}`))
            });
        } else {
            console.clear();
            home();
        }

    })
}