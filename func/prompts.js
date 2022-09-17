import chalk from "chalk";
import fs from "fs";

const filePreview = (source, lineNum, spacing) => {
    let string = " ".repeat(spacing) + chalk.bold("Preview:") + "\n";
    let file = fs.readFileSync(source, "utf8");
    let strArr = file.split("\n", lineNum);
    let newArr = [];
    spacing += 2;
    strArr.forEach(line => newArr.push(" ".repeat(spacing) + line))
    newArr.push((" ".repeat(8) + " ".repeat(spacing) + "." + "\n").repeat(3));
    string += newArr.join("\n") + "\n"
    return string
}

const fileNaming = (spacing, code = "EXAMPLE101", interval = "2122", semester = "F") => {
    console.log(chalk.bold.red(" ".repeat(spacing) + "Your file naming is wrong please correct it as shown bellow.\n"));
    console.log(" ".repeat(spacing) + chalk.yellowBright(code) + "_" + chalk.yellowBright(interval) + chalk.yellowBright(semester) + chalk.yellowBright(".txt"));
    let rep;
    //spacing += 2;
    if (code.length % 2) {
        rep = Math.ceil(code.length / 2) - 2;
        console.log(" ".repeat(spacing) + `╘${"═".repeat(rep)}╤${"═".repeat(rep)}╛ ╘═╤═╛ ╘╤╛`);
        console.log(" ".repeat(spacing) + "Course code  │  Text format");
        console.log(" ".repeat(spacing) + `       Year and Semester (${chalk.bold("F")} for Fall , ${chalk.bold("S")} for Spring)`);
    } else {
        rep = Math.ceil(code.length / 2) - 2;
        console.log(" ".repeat(spacing) + `╘${"═".repeat(rep)}╤${"═".repeat(rep + 1)}╛ ╘═╤═╛ ╘╤╛`);

        console.log(" ".repeat(spacing) + "Course code  │  Text format"),
            console.log(" ".repeat(spacing) + `       Year and Semester (${chalk.bold("F")} for Fall , ${chalk.bold("S")} for Spring)`);
    }
}

const gradingNaming = (spacing) => {
    const arr = JSON.parse(fs.readFileSync("./src/GradingTypes.json", "utf-8"));
    let str = "";
    arr.forEach(grading => str += " ".repeat(spacing + 2) + chalk.bold.yellow(grading) + "\n");
    return str
}

const gradingsAndRatios = (gradingArr, spacing) => {
    if (gradingArr) {
        let sumRatio = 0;
        console.log(chalk.bold(" ".repeat(spacing) + "Registered Gradings: "))
        spacing += 2
        gradingArr.forEach(grading => {
            let [name, ratio] = grading;

            sumRatio += ratio;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            if (name != "Id") {
                console.log(`${" ".repeat(spacing)}${chalk(name)} ${chalk.gray("→")} ${chalk.green(ratio + "%")}`)
            }
        })
        if (100 - sumRatio > 0) {
            console.log(`${" ".repeat(spacing)}Missing ${chalk.yellow("-") + chalk.yellow(100 - sumRatio + "%")}`);
        } else if (100 - sumRatio < 0) {
            console.log(`${" ".repeat(spacing)}Excess ${chalk.red("+") + chalk.red(Math.abs(100 - sumRatio) + "%")}`);
        }
    }
}

const courseConfigStatus = (spacing, courseObject) => {
    console.log(chalk.bold.green("✓") + chalk.bold(" New course/gradings added succesfully.\n"));
    console.log(" ".repeat(spacing) + chalk.bold.green("Course Code: ") + chalk.bold(courseObject.code));
    console.log(" ".repeat(spacing) + chalk.bold.green("Course Year: ") + chalk.bold(courseObject.year));
    console.log(" ".repeat(spacing) + chalk.bold.green("Course Semester: ") + chalk.bold(courseObject.semester));
    console.log(" ".repeat(spacing) + chalk.bold.green("Course Gradings: ") + courseObject.gradings.map(grading => chalk.bold(grading[0]) + " " + chalk.bold.blue(grading[1])).join(" , "));
    console.log(" ".repeat(spacing) + chalk.bold.green("Course Directory: ") + chalk.bold(courseObject.directory));
}

export default { filePreview, fileNaming, gradingNaming, gradingsAndRatios, courseConfigStatus }
