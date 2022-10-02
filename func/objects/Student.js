import studentIdParser from "../parsers/studentIdParser.js";

export class Student {
    constructor(id) {
        const {registerYear,faculty,department} = studentIdParser(id);
        this.id = id;
        this.name;
        this.registerYear = registerYear;
        this.faculty = faculty;
        this.department = department;
        this.tookenCourses = [];
    }
}
