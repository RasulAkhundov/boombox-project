$(document).ready(async function() {

    if(!Cookies.get('user')) {
        window.location.href = "/"
    }
    if(window.location.pathname === "/settings") {
        localStorage.removeItem('newsID');
    }

    //GETTING USER INFORMATION FROM LOCAL STORAGE
    let tokenMe = Cookies.get('user');
    let userData = parseJwt(tokenMe);

    let userMe = await axios.get(`${window.development}/api/user/${userData.usr._id}`).then(res => res.data.userInfo);

    let userName = userMe.username;
    let userImage = userMe.image;
    let userBio = userMe.bio;
    
    let userProfileToggle = false;
    //user profile image gives
    $("#user-profile").css('background-image', `url(${userImage})`);
    $("#user-profile-modal").css("display", "none");
    //give username to user-profile
    $("#user-profile-username").text(userName);
    //user-profile modal opening and closing
    $("#user-profile").click(function() {
        if(userProfileToggle === false) {
            $("#user-profile-modal").slideDown(300);
            userProfileToggle = true;
        } else {
            $("#user-profile-modal").slideUp(300);
            userProfileToggle = false;
        }
    });
    $(document).on('click', function(e) {
        if(!(($(e.target).closest("#user-profile-modal").length > 0 ) ||
        ($(e.target).closest("#user-profile").length > 0 ))) {
            $("#user-profile-modal").slideUp(300);
            userProfileToggle = false;
        }
    });

    //update img default src
    $("#user_profile_image").css('background-image', `url(${userImage})`);
    $("#name-change").val(`${userName}`);
    $("#bioqrafia").val(`${userBio}`);


    let fdata = new FormData();
    $("#image-file").on('change', function(e) {
        fdata.append('image', e.target.files[0]);
    });

    $("#change-btn").click(async function() {
        $(".loading-wrapper").css("display", "flex");
        fdata.append('username', $("#name-change").val() || userName);
        fdata.append('bio', $("#bioqrafia").val() || userBio);

        const usr = await axios
        .put(`/api/settings/profile-update/${userData.usr._id}`, fdata)
        .then(res => res.data.user);
        if(usr.settingsAlert) {
            window.location.href = "/"
        }
        console.log(usr.settingsAlert);

        Cookies.set('user', usr);
        window.location.href = "/settings"
    });
})