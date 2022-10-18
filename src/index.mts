import { getPlaystationGames } from "./ps-dot-com/catalogue.mjs";
import fs from "fs";
import _ from "lodash";
import moment from "moment";

const outputDir = "results";
const dateStr = moment.utc().format(`D-M-YYYY-HH-MM`)
const contemporaryCataloguePath = `${outputDir}/games_psplus_games_catalogue.txt`;
const classicsCataloguePath = `${outputDir}/games_psplus_classics_catalogue.txt`;
const contemporaryHtmlPath = `${outputDir}/games_psplus_games_catalogue_${dateStr}.html`;
const classicsHtmlPath = `${outputDir}/games_psplus_classics_catalogue_${dateStr}.html`;


function getColouredSpans(items: Array<string | null>, color:string = "gray"): Array<{value:string, html:string}>
{
    return items.map(e => ({value: e?e:"" ,html:`<div style="margin:5px;"><span style='color:${color}'>${e}</span></div>`}));
}

function getDifferencesHtml(oldText:Array<string | null>, newText:Array<string | null>)
{
    const added = newText.filter(itm => !oldText.includes(itm)).map(itm => `${itm} +++`);
    const removed = oldText.filter(itm => !newText.includes(itm)).map(itm => `${itm} ---`);
    const unchanged = newText.filter(itm => oldText.includes(itm));
    const output = [
        ...getColouredSpans(unchanged),
        ...getColouredSpans(removed, "red"),
        ...getColouredSpans(added, "green")
    ].sort((x,y)=>x.value.localeCompare(y.value))
    .map(x=>x.html)
    .join("");
    return `<html><body style='background-color:black;color:gray;'><div style="display:flex;flex-flow: column wrap;max-height:100%;">${output}</div></body></html>`;
}

async function writeFile(path:string, content:string)
{
    return await fs.writeFile(path, content, () => {
        console.log(`Content updated at ${path}`);
    });
}

const oldContemporary = fs.readFileSync(contemporaryCataloguePath, "utf-8").split("\n");
const oldClassics = fs.readFileSync(classicsCataloguePath, "utf-8").split("\n");

const { contemporary, classics } = await getPlaystationGames();
const 
    contemporaryText = contemporary, 
    classicsText = classics;


await writeFile(contemporaryHtmlPath, getDifferencesHtml(oldContemporary, contemporaryText));
await writeFile(classicsHtmlPath, getDifferencesHtml(oldClassics, classicsText));

await writeFile(contemporaryCataloguePath, contemporaryText.join("\n"));
await writeFile(classicsCataloguePath, classicsText.join("\n"));