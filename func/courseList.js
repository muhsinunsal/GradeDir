import inquirer from "inquirer";
import inquirer_search_list from "inquirer-search-list";
import fs from "fs";
import { default as goHome } from "../index.js"
import CourseConfigs from "./objects/CourseConfigs.js";
import chalk from "chalk";
import ervy from "ervy";
import CourseStats from "./objects/CourseStats.js"

let config = new CourseConfigs("./src/courses/course_configs.json")


inquirer.registerPrompt('search-list', inquirer_search_list);

const promptCourseList = () => {
    console.clear();
    const optionArr = config.data.sort((a, b) => a.code - b.code).map(course => `${course.code.padEnd(12)} ${course.year} ${course.semester} ${course.yearInt}`);
    optionArr.push("Exit");
    inquirer.prompt([{
        message: "How you want to search ?",
        name: "pref",
        type: "search-list",
        choices: optionArr
    }]).then(({ pref }) => {

        if (pref == "Exit") {
            goHome()
        } else {
            let [x, y, z, f] = pref.split(" ").filter(x => x != "");
            const courseStat = new CourseStats(config.getCourse(x, f, z));
            const gradingParticipation = courseStat.gradingParticipation;
            const gradingAverage = courseStat.gradingAverage100;
            const gradingAverageR = courseStat.gradingAverageR;
            console.log(`Registered Student: ${chalk.bold(courseStat.registeredStudent)}`);
            console.log();
            console.log("Partipition to spesific Gradings: ");
            Object.keys(gradingParticipation).forEach(parti => console.log(`  ${parti}: ${chalk.bold(gradingParticipation[parti])}`));
            console.log();
            console.log("Grading Averages to spesific Gradings (100): ");
            Object.keys(gradingAverage).forEach(avrg => console.log(`  ${avrg}: ${chalk.bold(gradingAverage[avrg]) }`));
            console.log();
            console.log("Grading Averages to spesific Gradings to its Ratios: ")
            Object.keys(gradingAverageR).forEach(avrg => console.log(`  ${avrg}: ${chalk.bold(gradingAverageR[avrg]) }`))
        }
    })
}
export default promptCourseList;