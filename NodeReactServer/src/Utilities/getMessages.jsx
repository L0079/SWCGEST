import Messages from './messages';

export default function GetMessages() {
    var language = (navigator.language || navigator.userLanguage).split("-")[0];
    var msgs={};
    if (Messages[language] === undefined) msgs = Messages.en;
    else msgs = Messages[language];
    return msgs;
}