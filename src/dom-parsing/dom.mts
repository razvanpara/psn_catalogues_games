import jsdom from "jsdom";


export function getDom(html: string): Document
{
    return new jsdom.JSDOM(html).window.document;
}