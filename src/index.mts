import { getPlaystationGames } from "./ps-dot-com/catalogue.mjs";
import fs from "fs";
import _ from "lodash";

const outputDir = "results";

function groupArrayByLetter(array:Array<string | null>)
{
    return _.groupBy(array, e => _.first(e))
};

function prettyJSON(obj:object)
{
    return JSON.stringify(obj, null, 2)
};

async function writeFile(path:string, content:string)
{
    return await fs.writeFile(path, content, ()=>{
        console.log(`Content updated at ${path}`);
    });
}

const games = await getPlaystationGames();
await writeFile(`${outputDir}/games_psplus_games_catalogue.json`, prettyJSON(groupArrayByLetter(games.contemporary)));
await writeFile(`${outputDir}/games_psplus_classics_catalogue.json`, prettyJSON(groupArrayByLetter(games.classics)));