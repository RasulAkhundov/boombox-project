$(document).ready(function() {

    if(window.location.pathname === "/") {
        localStorage.removeItem('order');
        localStorage.removeItem('category');
        localStorage.removeItem('newsID');
    }

    let passwordShow = false;

    $("#password_eye").click(() => {
        if(passwordShow === false) {
            $("#password_eye").removeClass('far fa-eye');
            $("#password_eye").addClass('far fa-eye-slash');
            $("#password").attr('type', 'text');
            passwordShow = true;
        } else {
            $("#password_eye").removeClass('far fa-eye-slash');
            $("#password_eye").addClass('far fa-eye');
            $("#password").attr('type', 'password');
            passwordShow = false;
        }
    })

    let tokenMe = localStorage.getItem('user');

    if(tokenMe) {
        $("#dash-login-btn").css("display", "none")
        $("#user-profile").css("display", "flex");
        //logout
        $("#dash-logout-btn").click(function() {
            localStorage.removeItem('user');
            $("#dash-login-btn").css("display", "flex");
            $("#user-profile").css("display", "none");
            $("#user-profile-modal").css("display", "none");
            window.location.reload();
        })
    } else {
        $("#user-profile").css("display", "none");
        $("#user-profile-modal").css("display", "none");
        
        //register
        let formData = {};

        $("#register").click(async function() {
            formData.username = $("#username").val();
            formData.email = $("#email").val();
            formData.password = $("#password").val();

            if(formData.username === "" || formData.email === "" || formData.password === "") {
                $('.warning-modal').css('display', 'flex');
            } else {
                const token = await axios
                .post(`${window.development}/api/register`, formData)
                .then(res => res.data)
                if(token.user) {
                    $('.warning-modal').css('display', 'none');
                    localStorage.setItem('user', token.user);
                    window.location.href = "/";
                } else {
                    console.log(token);
                }
            }
        });

        //login
        $("#login").click(async function() {
            formData.email = $("#email").val();
            formData.password = $("#password").val();

            if(formData.email === "" || formData.password === "") {
                $('.warning-modal').css('display', 'flex');
            } else {
                const token = await axios
                .post(`${window.development}/api/login`, formData)
                .then(res => res.data)
                if(token.user) {
                    $('.warning-modal').css('display', 'none');
                    localStorage.setItem('user', token.user);
                    window.location.href = "/";
                } else {
                    console.log(token);
                }
            }
        });
    }
});