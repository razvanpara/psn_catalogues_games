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

function writeFile(path:string, content:string)
{
    fs.writeFileSync(path, content);
    console.log(`Content updated at ${path}`);
}

const games = await getPlaystationGames();
writeFile(`${outputDir}/games_psplus_games_catalogue.json`, prettyJSON(groupArrayByLetter(games.contemporary)));
writeFile(`${outputDir}/games_psplus_classics_catalogue.json`, prettyJSON(groupArrayByLetter(games.classics)));