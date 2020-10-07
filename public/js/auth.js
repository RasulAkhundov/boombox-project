$(document).ready(function() {

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

    let tokenMe = Cookies.get('user');

    if(tokenMe) {
        $("#dash-login-btn").css("display", "none")
        $("#user-profile").css("display", "flex");
        //logout
        $("#dash-logout-btn").click(function() {
            Cookies.remove('user');
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

            $(".warning-modal").remove();
            if(formData.username === "" || formData.email === "" || formData.password === "") {
                $(".warning-modal-comp").append(`
                    <div class="warning-modal">
                        <p>Zəhmət olmasa bütün boşluqları doldurun!</p>
                    </div>
                `)
            } else {
                const token = await axios
                .post(`${window.development}/api/register`, formData)
                .then(res => res.data)
                if(token.user) {
                    $('.warning-modal-comp').css('display', 'none');
                    Cookies.set('user', token.user, { expires: 365 } );
                    window.location.href = "/";
                } else {
                    if(token.error) {
                        if(token.error.errors.username && token.error.errors.email) {
                            $(".warning-modal-comp").append(`
                                <div class="warning-modal">
                                    <p>Bu e-poçt və istifadəci adı artıq istifadə olunur!</p>
                                </div>
                            `)
                        } else if(token.error.errors.email) {
                            $(".warning-modal-comp").append(`
                                <div class="warning-modal">
                                    <p>Bu e-poçt artıq istifadə olunur!</p>
                                </div>
                            `)
                        } else {
                            $(".warning-modal-comp").append(`
                                <div class="warning-modal">
                                    <p>Bu istifadəci adı artıq istifadə olunur!</p>
                                </div>
                            `)
                        }
                    }
                    if(token.alert) {
                        token.alert.forEach((error) => {
                            $(".warning-modal-comp").append(`
                                <div class="warning-modal">
                                    <p>${error.msg}</p>
                                </div>
                            `)
                        })
                    }
                }
            }
        });

        //login
        $("#login").click(async function() {
            formData.email = $("#email").val();
            formData.password = $("#password").val();

            $(".warning-modal").remove();
            if(formData.email === "" || formData.password === "") {
                $(".warning-modal-comp").append(`
                    <div class="warning-modal">
                        <p>Zəhmət olmasa bütün boşluqları doldurun!</p>
                    </div>
                `)
            } else {
                const token = await axios
                .post(`${window.development}/api/login`, formData)
                .then(res => res.data)
                if(token.user) {
                    $('.warning-modal-comp').css('display', 'none');
                    Cookies.set('user', token.user, { expires: 365 } );
                    window.location.href = "/";
                } else {
                    if(token.alert) {
                        $(".warning-modal-comp").append(`
                            <div class="warning-modal">
                                <p>${token.alert.msg}</p>
                            </div>
                        `)
                    }
                }
            }
        });
    }
});