/** 
 * stripped version of ytdl core to reduce size and resolve issues with cloudflare and webpack
 * Basically ytdl-core without actual video downloading part and with the fetch API.
*/


export { getBasicInfo, getFullInfo } from './info';
export { validateID } from './utility';
