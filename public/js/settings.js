$(document).ready(function() {
    //GETTING USER INFORMATION FROM LOCAL STORAGE
    let tokenMe = localStorage.getItem('user');
    let userData = parseJwt(tokenMe);
    let user = userData.usr;
    let userName = user.username;
    let userImage = user.image;
    let userBio = user.bio;
    
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
    $("#user_profile_image").attr('src', `${userImage}`);
    $("#name-change").val(`${userName}`);
    $("#bioqrafia").val(`${userBio}`);


    let fdata = new FormData();
    $("#image-file").on('change', function(e) {
        fdata.append('image', e.target.files[0]);
    });

    $("#change-btn").click(async function() {
        fdata.append('username', $("#name-change").val() || userName);
        fdata.append('bio', $("#bioqrafia").val() || userBio);

        let usr = await axios
        .put(`/api/settings/profile-update/${user._id}`, fdata)
        .then(res => res.data.user)

        localStorage.setItem('user', usr);
        window.location.href = "/settings"
    });
})