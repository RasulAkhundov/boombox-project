$(document).ready(async function() {
    let tokenMe = Cookies.get('user');

    if(tokenMe) {
        const userData = parseJwt(tokenMe);
        
        let userMe = await axios.get(`${window.development}/api/user/${userData.usr._id}`).then(res => res.data.userInfo);

        //cheking admin profile
        if(userMe.email === "resul.axundov2002@mail.ru") {
            $("#create").css("display", "flex");
            $("#user-profile-username").css("border", "0");
        } else {
            $("#create").css("display", "none");
        }
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