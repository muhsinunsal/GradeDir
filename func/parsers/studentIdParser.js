const facultyIds = {
    "Aviation": 11,
    "Arts Sciences": 20,
    "Arts Architecture": null,
    "Law": null,
    "Business": 23,
    "Engineering": 24,
    "HealthServices": 25,
    "Medical": 26
}

const departmentIds = {
    //Arts Scienes
    "English Language and Literature": null,
    "English Translation and Interpretation": null,
    "Mathematics": 18,
    "Psychology": 20,

    //Arts Architecture
    "Industrial Design": null,
    "Graphic Design": null,
    "Interior Architecture and Environmental Design": null,
    "Architecture": null,
    "Textile and Fashion Design": null,

    //Law
    "Law": null,

    //Business
    "Public Relations and Advertising": 27,
    "Economics": null,
    "Economics (EN)": 28,
    "Business": null,
    "Business (EN)": 29,
    "Public Finance": null,
    "Political Science and Public Administration": null,
    "Tourism Management": 32,
    "International Relations": 33,
    "International Trade and Logistics": 34,

    //Engineering
    "Computer Engineering": 35,
    "Information Systems Engineering": 36,
    "Electrical Electronics Engineering": 37,
    "Industrial Engineering": 38,
    "Energy Systems Engineering": 39,
    "Aerospace Engineering": 48,
    "Manufacturing Engineering": null,
    "Civil Engineering": 41,
    "Chemical Engineering": 42,
    "Mechanical Engineering": 43,
    "Mechatronics Engineering": 45,
    "Metallurgical and Materials Engineering": 45,
    "Automotive Engineering": 46,
    "Software Engineering": 47,

    //Health Sciences
    "Nutrition and Dietetics": 77,
    "Child Development": null,
    "Physiotherapy and Rehabilitation": 79,
    "Nursing": 80,
    "Audiology": 76,

    //Vocational School
    "Justice Program": null,

    //Civil Aviation
    "Aviation Management": 86,
    "Pilot Training": 13,
    "Avionics": 14,
    "Airframe and Powerplant Maintenance": 15,
}

const studentIdParser = (id) => {
    id = String(id)
    const out = {};
    const findInObjectById = (obj, id) => Object.keys(obj).find(e => obj[e] == id)

    out.registerYear = Number("20" + id.slice(0, 2));
    out.faculty = findInObjectById(facultyIds,id.slice(2,4));
    out.department = findInObjectById(departmentIds,id.slice(4,6));
    return out
}
export default studentIdParser