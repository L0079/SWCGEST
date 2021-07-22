import {Titles, MenusItems} from './pageTitlesAndMenu';

function GetTitles() {
    var language = (navigator.language || navigator.userLanguage).split("-")[0];
    var tls = {};
    if (Titles[language] === undefined) tls = Titles.en;
    else tls = Titles[language];
    return tls;
}

function GetMenusItems() {
    var language = (navigator.language || navigator.userLanguage).split("-")[0];
    var mni = {};
    if (MenusItems[language] === undefined) mni = MenusItems.en;
    else mni = MenusItems[language];
    return mni;
}

export {GetTitles, GetMenusItems} 