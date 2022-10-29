export default class Course {
    constructor() {
        this.code = null; //EXAMPLE101
        this.directory = null; //"C:\\Users\\..."
        this.rawDirectory = null; //"C:\\Users\\..."
        this.year = null; // Number
        this.yearInt = null; // Number
        this.semester = null; // Fall | Spring
        this.gradings = {}; // {Id:0, Midterm_1: 20, Midterm_2: 20, Final: 40}
        this.newGradings = {}; // {}
    }
}