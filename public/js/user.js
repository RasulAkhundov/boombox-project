$(document).ready(function() {
    let tokenMe = localStorage.getItem('user');

    if(tokenMe) {
        const me = parseJwt(tokenMe);
        let emailCheck = me.usr;

        //cheking admin profile
        if(emailCheck.email === "resul.axundov2002@mail.ru") {
            $("#create").css("display", "flex");
            $("#user-profile-username").css("border", "0");
        } else {
            $("#create").css("display", "none");
        }
    } else {
        console.log("you have not account yet");
    }
})

// jwt parse
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
    atob(base64)
        .split("")
        .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
}