import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import chalk from "chalk";

import { default as goHome } from "../index.js"
import fileNameParser from "./parsers/fileNameParser.js";
import prompts from "../func/prompts.js";
import CourseConfigs from "../func/objects/CourseConfigs.js";
import Course from "../func/objects/Course.js";
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const configeDir = "./src/courses/course_configs.json";
let gradingTypes = JSON.parse(fs.readFileSync("./func/objects/GradingTypes.json"));

const spacing_offset = 2;


let configs = new CourseConfigs(configeDir);

let toBeRecordedToCache;

let courseObject;

const chooseDirectory = () => {  // 0
    //console.log(chalk.bgGray("0"));
    inquirer.prompt([{
        name: "directory",
        message: "Please choose sourse file destination",
        type: "file-tree-selection",
        root: "./src/raw",
        hideRoot: true
    }]).then(({ directory }) => {
        courseObject = new Course(directory);

        if (courseObject.code && courseObject.yearInt && courseObject.semester) {
            let isRecorded = configs.getCourse(courseObject.code, courseObject.yearInt, courseObject.semester);

            let courseConfig = configs.getCourse(courseObject.code, courseObject.yearInt, courseObject.semester)
            if (courseConfig) {
                console.log("");
                prompts.gradingsAndRatios(courseConfig.gradings, spacing_offset);
                console.log("");
            } inquirer.prompt([{
                name: "to_be_recorded",
                message: `There is course ${!isRecorded ? chalk.red("isn't") : "is"} in cache. Do you want to continue?`,
                type: "confirm"
            }]).then(({ to_be_recorded }) => {
                if (to_be_recorded) {
                    toBeRecordedToCache = true;
                    chooseGradingTypes()
                } else {
                    goHome()
                }
            })

        } else {
            prompts.fileNaming(spacing_offset);
        }

    })
}

const gradingStringParse = (string) => {
    let parsedArr = string.split(",").map(str => str.trim());
    let obj = {};
    parsedArr.forEach(gradingRatioCombo => {
        let [grading, ratio] = gradingRatioCombo.split(" ");
        grading = grading.charAt(0).toUpperCase() + grading.slice(1);
        obj[grading] = ratio;
    });
    return obj
}

const chooseGradingTypes = () => { // 2
    //console.log(chalk.bgGray("2"));

    console.log("");

    inquirer.prompt([{
        name: "rawGradings",

        message: `Please enter your grading types and ratios if its more than one seperate with comma (Enter student id with ratio of 0):`,
        type: "input",
        prefix: prompts.filePreview(courseObject.rawDirectory, 5, spacing_offset) + chalk.bold.green("?"),

        validate(rawGradings) {
            let gradingArr = gradingStringParse(rawGradings);


            Object.keys(gradingArr).forEach(grading => {
                let name = grading;
                let ratio = gradingArr[grading];
                if (isNaN(ratio)) {
                    throw Error("Grading ratio is not reconised.");
                }
                if (ratio < 0 || ratio > 100) {
                    throw Error(`Grading ratio must be between 0 and 100`);
                }
                if (!gradingTypes.includes(name)) {
                    throw Error(`Grading type didn't reconised. Please look up to list bellow.\n${prompts.gradingNaming(spacing_offset)}`);
                }
            })
            return true
        }
    }]).then(({ rawGradings }) => {
        const newGradings = {};
        rawGradings = gradingStringParse(rawGradings);

        Object.keys(rawGradings).forEach(grading => {
            let gradingName = grading;
            let gradingRatio = rawGradings[grading]
            newGradings[gradingName] = Number(gradingRatio);
        })

        let notReady = {};
        let ready = {};
        let courseConfig = configs.data.find(course => course.code == courseObject.code && course.yearInt == courseObject.yearInt)

        if (courseConfig) {
            Object.keys(newGradings).forEach((grading) => {
                let newName = grading;
                let newRatio = newGradings[grading];

                if (Object.keys(courseConfig.gradings).some(gradingg => gradingg == newName)) {
                    notReady[newName] = newRatio;
                    console.log(" ".repeat(spacing_offset) + chalk.bold.red(newName))
                } else {
                    ready[newName] = newRatio;
                    console.log(" ".repeat(spacing_offset) + chalk.bold.green(newName))
                }
            })
            if (Object.keys(notReady).length != 0) {
                inquirer.prompt([{
                    name: "conflict",
                    type: "checkbox",
                    message: "Please choose gradings to overwrite." + chalk.bgYellowBright("?"),
                    choices: Object.keys(notReady)
                }]).then(({ conflict }) => {
                    conflict.forEach(gradingName => {
                        let x = Object.keys(notReady).some(grading => grading == gradingName);
                        if (x) {
                            ready = { ...ready };
                            ready[gradingName] = notReady[gradingName];
                        }
                    })
                    courseObject.newGradings = { "Id": 0, ...ready };

                    lastConfirmation();
                })
            } else {
                courseObject.newGradings = { "Id": 0, ...ready };
                lastConfirmation();
            }
        } else {
            courseObject.newGradings["Id"] = 0;
            Object.keys(newGradings).forEach(grading => {
                courseObject.newGradings[grading] = newGradings[grading];
            })
            lastConfirmation();
        }
    })
}

const lastConfirmation = () => {
    inquirer.prompt([{
        name: "confirm",
        type: "confirm",
        message: "Do you confirm?"
    }]).then(({ confirm }) => {
        if (confirm) {
            generateFile();
        } else {
            goHome()
        }
    })
}


const generateFile = () => { // 3
    //console.log(chalk.bgGray("3"));
    let rawString;
    const { rawDirectory, newGradings } = courseObject;
    const newGradingsNames = Object.keys(newGradings);
    let semester = courseObject.semester == "Fall" ? "F" : courseObject.semester == "Spring" ? "S" : undefined;
    courseObject.directory = path.join(path.parse(path.parse(rawDirectory).dir).dir, "courses", `${courseObject.code}_${courseObject.yearInt}${semester}.json`);

    const outArr = [];

    if (fs.existsSync(courseObject.directory) && (rawString = fs.readFileSync(rawDirectory, "utf-8").trim())) {
        const courseConfig = configs.getCourse(courseObject.code, courseObject.yearInt, courseObject.semester);
        if (!courseConfig) {
            console.log(chalk.bgRed("Course file exists but we don't have an archive of it."));
        } else {
            const course = JSON.parse(fs.readFileSync(courseObject.directory, "utf-8"));
            let rows = rawString.split("\n");
            let out = rows.map(row => {
                let nums = row.split("\t").map(word => word.trim()).map(num => num = !isNaN(num) ? Number(num) : num == "-" ? null : undefined)
                let student = {};
                for (let i in newGradingsNames) {
                    student[newGradingsNames[i].toLowerCase()] = nums[i]
                }
                return student
            })
            const result = course.map(student => ({ ...student, ...out.find(stu => stu.id === student.id) }))
            fs.writeFileSync(courseObject.directory, JSON.stringify(result))
            configs.updateCourse(courseObject);
            finnish();
        }
    } else {
        rawString = fs.readFileSync(rawDirectory, "utf-8").trim();
        let rows = rawString.split("\n");
        let out = rows.map(row => {
            let nums = row.split("\t").map(word => word.trim()).map(num => num = !isNaN(num) ? Number(num) : num == "-" ? null : undefined)
            let student = {};
            for (let i in newGradingsNames) {
                student[newGradingsNames[i].toLowerCase()] = nums[i]//TODO
            }
            return student
        })
        fs.writeFileSync(courseObject.directory, JSON.stringify(out));
        configs.addCourse(courseObject);
        finnish();
    }
}

const finnish = () => {
    prompts.courseConfigStatus(spacing_offset, courseObject)
}
const generateEnteryObj = () => {
    chooseDirectory();

}
export default generateEnteryObj