import inquirer from "inquirer";
import { cacheObj } from "./stats.js";
import inquirer_search_list from "inquirer-search-list"

inquirer.registerPrompt('search-list', inquirer_search_list);

export const promptCourseList = () => {
    console.clear(); 
    inquirer.prompt([{
        message :"How you want to search ?",
        name:"pref",    
        type: "search-list",
        choices: cacheObj.courses
    }]).then(({pref})=>{
        console.log(pref)
    })
}