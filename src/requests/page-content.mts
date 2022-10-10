import fetch from "node-fetch";

export async function getPageHtml(url :string): Promise<string>{
    const response =  await fetch(url);
    if(!response.ok) 
        throw new Error(`GET ${url} failed !`);
    return response.text();
};