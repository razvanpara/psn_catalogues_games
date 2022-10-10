import { getPlaystationGames } from "./ps-dot-com/catalogue.mjs";
import fs from "fs";
import _ from "lodash";
import { diffArrays, diffChars, Change } from "diff";

const outputDir = "results";
const contemporaryCataloguePath = `${outputDir}/games_psplus_games_catalogue.txt`;
const classicsCataloguePath = `${outputDir}/games_psplus_classics_catalogue.txt`;
const contemporaryHtmlPath = `${outputDir}/games_psplus_games_catalogue.html`;
const classicsHtmlPath = `${outputDir}/games_psplus_classics_catalogue.html`;

function groupArrayByLetter(array:Array<string | null>)
{
    return _.groupBy(array, e => _.first(e))
};

function prettyJSON(obj:object)
{
    return JSON.stringify(obj, null, 2)
};

function getColouredSpans(change: Change): string
{
    let color = null;
    if(change.added || change.removed)
        color = change.added ? "green" : "red";
    return color ? `<span style='color:${color}'>${change.value}</span>` : change.value;
}

function getDifferencesHtml(oldText:string, newText:string)
{
    const differences = diffChars(oldText, newText).map(getColouredSpans);
    return `<html><body style='background-color:black;color:gray;'>${differences.join("").replaceAll("\n","<br>")}</body></html>`;
}

async function writeFile(path:string, content:string)
{
    return await fs.writeFile(path, content, () => {
        console.log(`Content updated at ${path}`);
    });
}

const oldContemporary = fs.readFileSync(contemporaryCataloguePath, "utf-8");
const oldClassics = fs.readFileSync(classicsCataloguePath, "utf-8");

const { contemporary, classics } = await getPlaystationGames();
const 
    contemporaryText = contemporary.map((x, i) => (i + 1).toString().padStart(4,'0') + '. ' + x).join("\n"), 
    classicsText = classics.map((x, i) => (i + 1).toString().padStart(4,'0') + '. ' + x).join("\n");


await writeFile(contemporaryHtmlPath, getDifferencesHtml(oldContemporary, contemporaryText));
await writeFile(classicsHtmlPath, getDifferencesHtml(oldClassics, classicsText));

await writeFile(contemporaryCataloguePath, contemporaryText);
await writeFile(classicsCataloguePath, classicsText);