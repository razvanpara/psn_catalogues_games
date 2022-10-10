import { getPageHtml } from "../requests/page-content.mjs";
import { getDom } from "../dom-parsing/dom.mjs";

const gamesList = "div.tabbed-component[data-component='tabs']";
const gameTitle = "p.txt-style-base";

interface PlayStationGames  
{ 
    classics: Array<string | null>
    contemporary: Array<string | null>
}

export async function getPlaystationGames() : Promise<PlayStationGames>
{
    const pageContent = await getPageHtml("https://www.playstation.com/en-ro/ps-plus/games/");
    const document = getDom(pageContent);
    const [contemporary, classics] = Array.from(document.querySelectorAll(gamesList)).map(tab => Array.from(tab.querySelectorAll(gameTitle)).map(game => game.textContent));
    
    return {
        contemporary, 
        classics
    };
}

//comment