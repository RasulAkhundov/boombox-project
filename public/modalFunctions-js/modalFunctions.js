$(document).ready(async function() {

    ///LOADING WRAPPER
    $(window).on('load', function() {
        $(".loading-wrapper").css('display', 'none');
    })

    ///SMOOTH SCROLL UP
    $(window).scroll(function() {
        let scrollY = window.scrollY;
        if(scrollY >= 400) {
            $(".scroll-up").css("display", "flex");
        } else {
            $(".scroll-up").css("display", "none");
        }
    })

    //GETTING USER INFORMATION FROM LOCAL STORAGE

    let tokenMe = Cookies.get('user');

    if(tokenMe) {
        let userData = parseJwt(tokenMe);

        let userMe = await axios.get(`${window.development}/api/user/${userData.usr._id}`).then(res => res.data.userInfo);

        let userName = userMe.username;
        let userImage = userMe.image;

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
    } else {
        $("#dash-login-btn").css("display", "flex");
    }

    //Search Modal Function
    let searchToggle = false;
    $("#search-icon").click(function() {

        if(searchToggle === false) {
            $(".search-box").slideDown(300);
            searchToggle = true;
        } else {
            $(".search-box").slideUp(300);
            searchToggle = false;
        }
    });

    $(document).on('click', function(e) {
        if(!(($(e.target).closest(".search-box").length > 0 ) ||
        ($(e.target).closest("#search-icon").length > 0 ))) {
            $(".search-box").slideUp(300);
            searchToggle = false;
        }
    });

    ///Menu Navigation Toggle
    $(".header-comp-1 .burger").click(function() {
        $(".menu-navigation-cover").css("display", "flex");
        $(".menu-navigation").removeClass('menu-close');
        $(".menu-navigation").addClass('menu-open');
        $(".main-container").css("overflow-y", "hidden");
    });
    $("#close-menu").click(function() {
        $(".menu-navigation").removeClass('menu-open');
        $(".menu-navigation").addClass('menu-close');
        setTimeout(function() {
            $(".menu-navigation-cover").css("display", "none");
        }, 300)
        $(".main-container").css("overflow-y", "auto");
    });
    $(".menu-navigation-cover").on('click', function(e) {
        if(!(($(e.target).closest(".menu-navigation").length > 0 ) ||
        ($(e.target).closest("#close-menu").length > 0 ))) {
            $(".menu-navigation").removeClass('menu-open');
            $(".menu-navigation").addClass('menu-close');
            setTimeout(function() {
                $(".menu-navigation-cover").css("display", "none");
            }, 300)
            $(".main-container").css("overflow-y", "auto");
        }
    });

});
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