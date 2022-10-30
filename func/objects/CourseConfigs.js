import fs from "fs";

let gradingTypes = JSON.parse(fs.readFileSync("./func/objects/GradingTypes.json"));

export default class CourseConfigs {
    constructor(dir) {
        this.dir = dir;
        this.data = JSON.parse(fs.readFileSync(this.dir));
    }

    getCourse(c, yInt, s) {
        return this.data.find(course => ((course.code == c) && (course.yearInt == yInt) && (course.semester == s))) || null
    }

    addCourse(courseObject) {
        courseObject.gradings = {...courseObject.gradings, ...courseObject.newGradings}
        courseObject.newGradings = null;

        this.data.push(courseObject);
        fs.writeFileSync(this.dir, JSON.stringify(this.data));
        this.data = JSON.parse(fs.readFileSync(this.dir));
    }

    removeCourse(filepath,courseObject) {
        fs.rmSync(filepath);
        this.data = this.data.filter(({ code, yearInt, semester }) => !(courseObject.code == code && courseObject.yearInt == yearInt && courseObject.semester == semester));
        fs.writeFileSync(this.dir, JSON.stringify(this.data));
    }

    updateCourse(courseObject) {
        let oldCourse = this.getCourse(courseObject.code, courseObject.yearInt, courseObject.semester);

        let newCourse_Configs = this.data.filter(course => ((course.code != courseObject.code) || (course.yearInt != courseObject.yearInt) || (course.semester != courseObject.semester)));
        courseObject.gradings = Object.assign(oldCourse.gradings, courseObject.newGradings);
        courseObject.newGradings = null;
        newCourse_Configs.push(courseObject);
        fs.writeFileSync(this.dir, JSON.stringify(newCourse_Configs))
    }

}