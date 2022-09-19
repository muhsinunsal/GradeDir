import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import chalk from "chalk";

import {default as home} from "../index.js"
import fileNameParser from "./parsers/fileNameParser.js";
import prompts from "../func/prompts.js";
import CourseConfigs from "../func/objects/CourseConfigs.js";
import Course  from "../func/objects/Course.js";
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const configeDir = "./src/courses/course_configs.json";
let gradingTypes = JSON.parse(fs.readFileSync("./src/GradingTypes.json"));

const spacing_offset = 2;


let configs = new CourseConfigs(configeDir);

let toBeRecordedToCache;

const chooseDirectory = (courseObject) => {  // 0
    //console.log(chalk.bgGray("0"));
    inquirer.prompt([{
        name: "directory",
        message: "Please choose sourse file destination",
        type: "file-tree-selection",
        root: "./src/raw",
        hideRoot: true
    }]).then(({ directory }) => {

        courseObject.rawDirectory = directory;
        courseObject.code = fileNameParser(courseObject.rawDirectory).code;
        courseObject.year = fileNameParser(courseObject.rawDirectory).year;
        courseObject.yearInt = parseInt(fileNameParser(courseObject.rawDirectory).yearInt);
        courseObject.semester = fileNameParser(courseObject.rawDirectory).semester;

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
                    chooseGradingTypes(courseObject)
                } else {
                    home()
                }
            })

        } else {
            prompts.fileNaming(spacing_offset);
        }

    })
}

const gradingStringParse = (string) => string
    .split(",")
    .map(string => string.trim())
    .map(string => string.split(" "))
    .map(grading => [grading[0].charAt(0).toUpperCase() + grading[0].slice(1), Number(grading[1])]);

const chooseGradingTypes = (courseObject2) => { // 2
    //console.log(chalk.bgGray("2"));

    console.log("");

    inquirer.prompt([{
        name: "rawGradings",

        message: `Please enter your grading types and ratios if its more than one seperate with comma (Enter student id with ratio of 0):`,
        type: "input",
        prefix: prompts.filePreview(courseObject2.rawDirectory, 5, spacing_offset) + chalk.bold.green("?"),
        validate(rawGradings) {
            let gradingArr = gradingStringParse(rawGradings);

            gradingArr.forEach(([name, ratio]) => {
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
        const newGradings = gradingStringParse(rawGradings);
        const newGradingsNames = newGradings.map(grading => grading[0]);
        let notReady = [];
        let ready = [];
        let courseConfig = configs.data.find(course => course.code == courseObject2.code && course.yearInt == courseObject2.yearInt)

        if (courseConfig) {
            newGradings.forEach(([newName, newRatio], i) => {
                if (courseConfig.gradings.some(([oldName, oldRatio]) => oldName == newName)) {
                    notReady.push([newName, newRatio]);
                    console.log(" ".repeat(spacing_offset) + chalk.bold.red(newName))
                } else {
                    ready.push([newName, newRatio]);
                    console.log(" ".repeat(spacing_offset) + chalk.bold.green(newName))
                }
            })
            if (notReady.length) {
                inquirer.prompt([{
                    name: "conflict",
                    type: "checkbox",
                    message: "Please choose gradings to overwrite." + chalk.bgYellowBright("?"),
                    choices: notReady.map(course => course[0])
                }]).then(({ conflict }) => {
                    conflict.forEach(gradingName => {
                        let x = notReady.find(([gName]) => gName == gradingName);
                        if (x) {
                            ready.push([gradingName, x[1]]);
                        }
                    })
                    ready.sort((a, b) => {
                        return newGradingsNames.indexOf(a[0]) - newGradingsNames.indexOf(b[0])
                    })
                    courseObject2.newGradings = [["Id", 0], ...ready];

                    lastConfirmation(courseObject2);
                })
            } else {
                courseObject2.newGradings = [["Id", 0], ...ready];
                lastConfirmation(courseObject2);
            }
        } else {
            courseObject2.newGradings = [["Id", 0], ...newGradings];
            lastConfirmation(courseObject2);
        }
    })
}

const lastConfirmation = (courseObject3) => {
    inquirer.prompt([{
        name: "confirm",
        type: "confirm",
        message: "Do you confirm?"
    }]).then(({ confirm }) => {
        if (confirm) {
            generateFile(courseObject3);
        } else {
            home()
        }
    })
}


const generateFile = (courseObject4) => { // 3
    //console.log(chalk.bgGray("3"));
    let rawString;
    const { code, rawDirectory, newGradings } = courseObject4;
    const newGradingsNames = newGradings.map((grading) => grading[0]);
    let semester = courseObject4.semester == "Fall" ? "F" : courseObject4.semester == "Spring" ? "S" : undefined;
    courseObject4.directory = path.join(path.parse(path.parse(rawDirectory).dir).dir, "courses", `${courseObject4.code}_${courseObject4.yearInt}${semester}.json`);

    const outArr = [];

    if (fs.existsSync(courseObject4.directory) && (rawString = fs.readFileSync(rawDirectory, "utf-8").trim())) {
        const courseConfig = configs.getCourse(courseObject4.code, courseObject4.yearInt, courseObject4.semester);
        if (!courseConfig) {
            console.log(chalk.bgRed("Course file exists but we don't have an archive of it."));
        } else {
            const course = JSON.parse(fs.readFileSync(courseObject4.directory, "utf-8"));
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
            fs.writeFileSync(courseObject4.directory, JSON.stringify(result))
            configs.updateCourse(courseObject4);
            finnish(courseObject4);
        }
    } else {
        rawString = fs.readFileSync(rawDirectory, "utf-8").trim();
        let rows = rawString.split("\n");
        let out = rows.map(row => {
            let nums = row.split("\t").map(word => word.trim()).map(num => num = !isNaN(num) ? Number(num) : num == "-" ? null : undefined)
            let student = {};
            for (let i in newGradingsNames) {
                student[newGradingsNames[i].toLowerCase()] = nums[i]
            }
            return student
        })
        console.countReset("Not Attended")
        fs.writeFileSync(courseObject4.directory, JSON.stringify(out));
        configs.addCourse(courseObject4);
        finnish(courseObject4);
    }

}

const finnish = (courseObject5) => {
    prompts.courseConfigStatus(spacing_offset, courseObject5)
}
const generateEnteryObj = () => {
    const object = new Course();
    chooseDirectory(object);

}
export default generateEnteryObj