import path from "path";

const fileNameParser = (fileName) => {
    let code_regex = /\w+([0-9]{3})(?=_)/;
    let yearInt_regex = /\d{4}/;
    let obj = {};

    if (code_regex.test(fileName)) {
        obj.code = fileName.match(code_regex)[0];
    } else {
        obj.code = undefined;
    }

    if (path.parse(fileName).name.slice(-1) == "F") {
        obj.semester = "Fall";
    } else if (path.parse(fileName).name.slice(-1) == "S") {
        obj.semester = "Spring";
    } else {
        obj.semester = undefined;
    }

    if (yearInt_regex.test(fileName)) {
        obj.yearInt = fileName.match(yearInt_regex)[0];
        if (obj.semester == "Fall") {
            obj.year = Number("20" + obj.yearInt.charAt(0) + obj.yearInt.charAt(1));
        } else if (obj.semester == "Spring") {
            obj.year = Number("20" + obj.yearInt.charAt(2) + obj.yearInt.charAt(3));
        } else {
            obj.year = null;
        };
    } else {
        obj.yearInt = undefined;
    }
    return obj
}

export default fileNameParser