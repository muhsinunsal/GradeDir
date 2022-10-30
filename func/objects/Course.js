import fileNameParser from "../parsers/fileNameParser.js";
export default class Course {
    constructor(directory) { 
        const {code , year , yearInt,semester} = fileNameParser(directory);
        this.directory = null; //"C:\\Users\\..."
        this.code = code; //EXAMPLE101
        this.rawDirectory = directory; //"C:\\Users\\..."
        this.year = year; // Number
        this.yearInt = yearInt; // Number
        this.semester = semester; // Fall | Spring
        this.gradings = {}; // {Id:0, Midterm_1: 20, Midterm_2: 20, Final: 40}
        this.newGradings = {}; // {}
    }
}