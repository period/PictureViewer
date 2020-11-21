export default (context, inject) => {
    const parseCaption = (caption) => {
        return caption.replace(/\[(.*?)\]/g, (match, $1) => {
            let registration = match.replace("[", "").replace("]", "");
            return "<a href=\"/search/" + btoa(JSON.stringify([[{field: "registration", operator: "equals", value: registration}]])) + "\">" + registration + "</a>";
            // TODO: investigate vue compile to use internal nuxt routing
        });
    };
    inject("parseCaption", parseCaption);
}