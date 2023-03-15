import fs from "fs";

const faculties = JSON.parse(fs.readFileSync("./func/objects/Faculties.json", "utf-8"));

const studentIdParser = (id) => {
    id = String(id)
    const out = {};
    out.registerYear = Number("20" + id.slice(0, 2));
    out.faculty = faculties.find(faculty => faculty.code == id.slice(2, 4));
    if(out.faculty){
        out.department = out.faculty.departments.find(dep => dep.code == id.slice(4, 6));
    }else{
        return null
    }
    return out
}

export default studentIdParser