import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer"
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import path from "path";

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

export const removeData = () => {
    inquirer.prompt([{
        message: "Which file(s) are you want to delete? :\n To select press Space then to send press Enter",
        type: "file-tree-selection",
        multiple: true,
        name: "files",
        root: "./sources",
        hideRoot: true,
        transformer: (url) => {
            if (/\w+([0-9]{3})/.test(url)) {
                let out;
                const wantedText = url.match(/\w+([0-9]{3})/)[0];
                const colored = chalk.bold(wantedText);
                const p = path.parse(url);

                out = p.name.replace(wantedText, colored)
                return out
            } else return url.split(path.sep).pop();
        }
    }]).then(({ files }) => {
        files.forEach(url => {
            if (fs.statSync(url).isDirectory()) {
                console.log(chalk.red("Directories can't be choosen."))
            } else {
                fs.rmSync(url);
                console.log(chalk.green("Files removed successfully."))
            }
        });
    })
}