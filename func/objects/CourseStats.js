import Course from "./Course.js"
import fs from "fs";

class CourseStats extends Course {
    constructor({ directory, code, gradings, rawDirectory, year, yearInt, semester }) {
        super(directory, code, rawDirectory, year, yearInt, semester);
        this.directory = directory;
        this.gradings = gradings;
    }
    get data() {
        return JSON.parse(fs.readFileSync(this.directory, "utf-8"));
    }
    get registeredStudent() {
        return this.data.length;
    }
    get gradingParticipation() {
        let obj = {}
        Object.keys(this.gradings).forEach(x => {
            const grading = x.toLocaleLowerCase();
            const ratio = this.gradings[x];
            obj[grading] = 0;

            this.data.forEach(student => {
                if (student[grading] == null) {
                    obj[grading]++
                }
            })
        })
        delete obj.id;
        return obj;
    }
    get gradingAverage100() {
        let obj = {}
        Object.keys(this.gradings).forEach(x => {
            const grading = x.toLocaleLowerCase();
            const ratio = this.gradings[x];
            obj[grading] = 0;

            let sum = 0;
            let i = 0;
            this.data.forEach(student => {
                sum += student[grading];
                i++;
            })
            obj[grading] = Math.round(sum * 100 / i) / 100;

        })
        delete obj.id;
        return obj;
    }
    get gradingAverageR() {
        let obj = {}
        Object.keys(this.gradings).forEach(x => {
            const grading = x.toLocaleLowerCase();
            const ratio = this.gradings[x];
            obj[grading] = 0;

            let sum = 0;
            let i = 0;
            this.data.forEach(student => {
                sum += student[grading];
                i++;
            })
            obj[grading] = Math.round(ratio * sum / i) / 100;
        })
        delete obj.id;
        return obj;
    }

}
export default CourseStats