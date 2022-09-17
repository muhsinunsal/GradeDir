import fs from "fs";

let gradingTypes = JSON.parse(fs.readFileSync("./src/GradingTypes.json"));
const mergeGradings = (mainArr, newArr) => mainArr.filter(e => newArr.find(a2e => a2e[0] === e[0]) === undefined).concat(newArr);

export default class CourseConfigs {
    constructor(dir) {
        this.dir = dir;
        this.data = JSON.parse(fs.readFileSync(this.dir));
    }

    getCourse(c, yInt, s) {
        return this.data.find(course => ((course.code == c) && (course.yearInt == yInt) && (course.semester == s)))
    }

    addCourse(courseObject) {
        courseObject.gradings = mergeGradings(courseObject.gradings, courseObject.newGradings);
        courseObject.newGradings = null;

        courseObject.gradings.sort((a, b) => {
            return gradingTypes.indexOf(a[0]) - gradingTypes.indexOf(b[0])
        })

        this.data.push(courseObject);
        fs.writeFileSync(this.dir, JSON.stringify(this.data));
        this.data = JSON.parse(fs.readFileSync(this.dir));
    }

    updateCourse(courseObject) {
        let oldCourse = this.getCourse(courseObject.code, courseObject.yearInt, courseObject.semester);

        let newCourse_Configs = this.data.filter(course => ((course.code != courseObject.code) || (course.yearInt != courseObject.yearInt) || (course.semester != courseObject.semester)))

        courseObject.gradings = mergeGradings(oldCourse.gradings, courseObject.newGradings);

        courseObject.newGradings = null;

        courseObject.gradings.sort((a, b) => {
            return gradingTypes.indexOf(a[0]) - gradingTypes.indexOf(b[0])
        })

        newCourse_Configs.push(courseObject);
        fs.writeFileSync(this.dir, JSON.stringify(newCourse_Configs))
    }

}