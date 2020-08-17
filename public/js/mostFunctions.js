$(document).ready(async function() {

    if(!localStorage.getItem('category')) {
        window.location.href = '/'
    }

    //GETTING USER INFORMATION FROM LOCAL STORAGE
    let tokenMe = localStorage.getItem('user');
    if(tokenMe) {
        let userData = parseJwt(tokenMe);
        let user = userData.usr;
        let userName = user.username;
        let userImage = user.image;

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
    }

    ////NEWS FILTERING SELECT OPENING AND CLOSING
    let selectToggle = false;

    $(".category_select").click(function() {
        if(selectToggle === false) {
            $(".category_options").slideDown(300);
            $(".category_option_header").css("border-bottom", "2px solid #292c3b");
            selectToggle = true;
        } else {
            $(".category_options").slideUp(300);
            $(".category_option_header").css("border-bottom", "none");
            selectToggle = false;
        }
    });
    $(document).on('click', function(e) {
        if(!(($(e.target).closest(".category_options").length > 0 ) ||
        ($(e.target).closest(".category_select").length > 0 ))) {
            $(".category_options").slideUp(300);
            $(".category_option_header").css("border-bottom", "none");
            selectToggle = false;
        }
    });

    //CATEGORY HASHTAG FILTERING WITH SELECT
    $(".category_option").click(function() {
        let order = {
            name: $(this).data('order-name'),
            val: $(this).data('order-val')
        }

        localStorage.setItem('order', JSON.stringify(order));
    });

    ///CATEGORY LOCATION AND HEADER TEXT APPEND
    let sectionVal = JSON.parse(localStorage.getItem('category'));

    $("#category_location, #category_header_h2").text(`${sectionVal.name}`);

    $(".most-viewed").attr('href', `/category-${sectionVal.val.toLowerCase()}?order=most-viewed`);
    $(".new").attr('href', `/category-${sectionVal.val.toLowerCase()}?order=new`);
    $(".featured").attr('href', `/category-${sectionVal.val.toLowerCase()}?order=featured`);
    $(".old").attr('href', `/category-${sectionVal.val.toLowerCase()}?order=old`);

    ///APPENDING HASHTAG CATEGORY///
    

    if(localStorage.getItem('order')) {
        ///LOCALSTORAGE ORDER SELECT ACTIVE;
        let order = JSON.parse(localStorage.getItem('order'));
        if(!order.name) {
            $("#category_text").text('Ən yeni');
        } else {
            $("#category_text").text(order.name);
        }
        $(`.category_options ${order.name}`).css('background', '#292c3b');

        ///CATEGORY APPENDING FOR ORDER
        let categoryOrder = await axios
        .get(`${window.development}/api/category-${sectionVal.name}?order=${order.val}`)
        .then(res => res.data.categoryOrder)

        categoryOrder.map(c => {
            $("#category-news-row").append(`
                <div class="col-12 col-sm-6 col-lg-4 p-2 full-news-box-cover">
                    <div class="col-12 p-0 full-news-box" style="background: #1D1E29; border-radius: 5px;">
                        <div class="col-12 p-0 full-news-img-box" style="background: #1D1E29; height: 200px;">
                            <img src="${c.image}" data-id="${c._id}" alt="">
                            <div class="full-news-emoji">
                                <div class="emoji-1 emoji-box">
                                    <img src="/emotion-img/${c.hashtag1}.svg" class="emoji-1-img" alt="">
                                </div>
                                <div class="emoji-2 emoji-box">
                                    <img src="/emotion-img/${c.hashtag2}.svg" class="emoji-2-img" alt="">
                                </div>
                            </div>
                            <div class="full-news-view-count d-flex align-items-center">
                                <i class="far fa-eye"></i>
                                <span>${c.pageViews}</span>
                            </div>
                        </div>
                        <div class="col-12 py-3 px-4" style="background: #1D1E29;">
                            <div class="full-news-hashtag">
                                <a href="#">${c.hashtag1}</a>
                                <a href="#">${c.hashtag2}</a>
                            </div>
                            <div class="full-news-header">
                                <h5 id="full-news-header" data-id="${c._id}">${c.newsHeader}</h5>
                            </div>
                            <div class="full-news-description">
                                <span id="full-news-description">${c.newsDescription}</span>
                            </div>
                            <div class="full-news-author d-flex">
                                <div class="author-avatar">
                                    <img src="${c.authorImage}" alt="">
                                </div>
                                By
                                <div class="author-name">
                                    <a href="#">${c.authorName}</a>
                                </div>
                                <div class="full-news-date">
                                    <span>${moment(`${c.date}`).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        })
    } else {
        ///CATEGORY APPENDING FOR ORDER
        let categoryOrder = await axios
        .get(`${window.development}/api/category-${sectionVal.name}?order=new`)
        .then(res => res.data.categoryOrder)

        categoryOrder.map(c => {
            $("#category-news-row").append(`
                <div class="col-12 col-sm-6 col-lg-4 p-2 full-news-box-cover">
                    <div class="col-12 p-0 full-news-box" style="background: #1D1E29; border-radius: 5px;">
                        <div class="col-12 p-0 full-news-img-box" style="background: #1D1E29; height: 200px;">
                            <img src="${c.image}" data-id="${c._id}" alt="">
                            <div class="full-news-emoji">
                                <div class="emoji-1 emoji-box">
                                    <img src="/emotion-img/${c.hashtag1}.svg" class="emoji-1-img" alt="">
                                </div>
                                <div class="emoji-2 emoji-box">
                                    <img src="/emotion-img/${c.hashtag2}.svg" class="emoji-2-img" alt="">
                                </div>
                            </div>
                            <div class="full-news-view-count d-flex align-items-center">
                                <i class="far fa-eye"></i>
                                <span>${c.pageViews}</span>
                            </div>
                        </div>
                        <div class="col-12 py-3 px-4" style="background: #1D1E29;">
                            <div class="full-news-hashtag">
                                <a href="#">${c.hashtag1}</a>
                                <a href="#">${c.hashtag2}</a>
                            </div>
                            <div class="full-news-header">
                                <h5 id="full-news-header" data-id="${c._id}">${c.newsHeader}</h5>
                            </div>
                            <div class="full-news-description">
                                <span id="full-news-description">${c.newsDescription}</span>
                            </div>
                            <div class="full-news-author d-flex">
                                <div class="author-avatar">
                                    <img src="${c.authorImage}" alt="">
                                </div>
                                By
                                <div class="author-name">
                                    <a href="#">${c.authorName}</a>
                                </div>
                                <div class="full-news-date">
                                    <span>${moment(`${c.date}`).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        })
    }
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