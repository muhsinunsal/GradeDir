export default class TakenCourse{
    constructor(){
        this.code; // EXAMPLE101
        this.yearInt; // Number
        this.semester; // Fall | Spring
        this.gradeRatios = {} // {midterm_1: 20, midterm_2: 20, final: 40}
        this.grades = {} // { midterm_1: 54, midterm_2: 61, final: 23}
    }
}