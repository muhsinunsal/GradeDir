import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

const cacheDir = "./sources/cache.json";

const fileQuantity = (dir) => {
    if (fs.existsSync(dir)) {
        return fs.readdirSync(dir).length
    } else {
        console.log(`There isn't directory located at: ${dir}`)
    }
}

const courseQuantity = (dir) => {
    const files = fs.readdirSync(dir);
    let scanned = [];
    files.forEach((file) => {
        if (/\w+([0-9]{3})/.test(file)) {
            let courseCode = file.match(/\w+([0-9]{3})/)[0]
            if (!scanned.includes(courseCode)) {
                scanned.push(courseCode);
            }
        }
    })
    return scanned.length
}

const recordQuantity = (dir) => {
    const files = fs.readdirSync(dir);
    let total = 0;
    files.forEach((file) => {
        let f = fs.readFileSync(path.join("./", "sources", "json", file));
        let parsed_f = JSON.parse(f);
        total += parsed_f.length;
    })
    return total
}

const personQuantity = (dir) => {
    const files = fs.readdirSync(dir);
    let scanned = []
    files.forEach((file) => {
        let f = fs.readFileSync(path.join("./", "sources", "json", file));
        let parsed_f = JSON.parse(f);
        parsed_f.forEach((person) => {
            if (!scanned.includes(person.id)) {
                scanned.push(person.id);
            }
        })
    })
    return scanned.length
}

export const reCount = () => {
    const cache = {};
    /*
    {
        "source": null,
        "rawsource": null,
        "person": null,
        "records": null,
        "courses": null,
        "timeStamp": null
    }
    */

    cache.source = fileQuantity("./sources/json");
    cache.rawsource = fileQuantity("./sources/raw");
    cache.person = personQuantity("./sources/json");
    cache.courses = courseQuantity("./sources/json")
    cache.records = recordQuantity("./sources/json");

    const updateDate = new Date();
    cache.timeStamp = updateDate.getTime();

    fs.writeFileSync(cacheDir, JSON.stringify(cache), "utf-8");
}

export const promptStats = () => {
    const cacheFile = fs.readFileSync(cacheDir, "utf-8");
    const cacheObj = JSON.parse(cacheFile);
    const last_updated = new Date(cacheObj.timeStamp);
    const now = new Date();
    let diff = now.getTime() - cacheObj.timeStamp;
    let hours_past_from_last_recount = Math.floor(2.77777778 * Math.pow(10, -7) * (now.getTime() - cacheObj.timeStamp));
    let prompt = () => {
        console.log(chalk.cyan("Stats:"))
        console.log();
        console.log(`Produced sources: ${chalk.bold(cacheObj.source)}`);
        console.log(`Raw sources: ${chalk.bold(cacheObj.rawsource)}`);
        console.log();
        console.log(`Active Course Records: ${chalk.bold(cacheObj.courses)}`)
        console.log(`Active Student Records: ${chalk.bold(cacheObj.person)}`);
        console.log(`Active Records: ${chalk.bold(cacheObj.records)}`);
        console.log(`\nStats last updated at [${chalk.green(last_updated.toLocaleString())}]`);
    }

    console.clear();
    if (Math.floor(hours_past_from_last_recount / 24) >= 30) {
        inquirer.prompt([{
            name: "confirm",
            message: `Do you want to recompute stats ? Last computation were ${chalk.inverse(Math.floor(hours_past_from_last_recount / 24), " days ", hours_past_from_last_recount % 24, " hours ago.")}`,
            type: "confirm",
            default: true,
        }]).then(({ confirm }) => {
            if (confirm) {
                reCount();
                prompt();
            }
        })
    } else {
        prompt();
    }
} 