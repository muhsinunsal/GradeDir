import studentIdParser from "../parsers/studentIdParser.js";

export default class Student {
    constructor(id, name = undefined, tookenCourses = []) {
        const { registerYear, faculty, department } = studentIdParser(id);
        this.id = id;
        this.name = name;
        this.registerYear = registerYear;
        this.faculty = faculty.name; 
        this.department = department.name;
        this.takenCourses = tookenCourses;
    }
    addCourse(tookenCourse) {
        this.takenCourses.push()
    }
}