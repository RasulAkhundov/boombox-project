$(document).ready(async function() {

    if(window.location.pathname === "/trend") {
        localStorage.removeItem('order');
        localStorage.removeItem('category');
        localStorage.removeItem('newsID');
    }

    //GETTING TECHNO NEWS
    let trend = await axios
    .get(`${window.development}/api/get-trend-news`)
    .then(res => res.data.allNews);

    trend.map((t, i) => {
        $("#news-wrapper").append(`
            <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box">
            <div class="col-12 col-sm-6 p-0 news-img-box" style="background: #1D1E29">
                <img src="${t.image}" data-id="${t._id}" alt="" style="border-radius: 5px 0 0 5px;">
                <h2 class="number">${i += 1}</h2>
            </div>
                <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                    <div class="hashtag">
                        <a href="#">${t.hashtag1}</a>
                        <a href="#">${t.hashtag2}</a>
                    </div>
                    <div class="news-header">
                        <h5 id="news-header" data-id="${t._id}">${t.newsHeader}</h5>
                    </div>
                    <div class="news-author d-flex">
                        <div class="author-avatar">
                            <img src="${t.authorImage}" alt="">
                        </div>
                        By
                        <div class="author-name">
                            <a href="#">${t.authorName}</a>
                        </div>
                        <div class="news-date">
                            <span>${moment(`${t.date}`).fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `)
    });

    //RIGHT TREND APPEND
    let rightTrend = await axios
    .get(`${window.development}/api/right-trend`)
    .then(res => res.data.rightTrend);
    console.log(rightTrend);
    
    rightTrend.map((r, i) => {
        $(".right-trend").append(`
            <div class="col-12 p-0 d-flex flex-column mb-3" id="right-news" data-id="${r._id}">
                <div class="img" style="background-image: url(${r.image});">
                    <h2 class="number">${i + 1}</h2>
                </div>
                <span>${r.newsHeader}</span>
            </div>
        `)
    })

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

    //ALL NEWS APPEND
    let allNews = await axios
    .get(`${window.development}/api/get-all-news`)
    .then(res => res.data.allNews);

    //News header text link
    let formData = {};
    $(document).on('click', '.news-box img, #news-header', async function() {
        let id = $(this).data('id');
        localStorage.setItem('newsID', id);

        formData.pageViews = allNews.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;
    });
    //right trend link
    $(document).on('click', '#right-news', async function() {
        let id = $(this).data('id');
        localStorage.setItem('newsID', id);

        formData.pageViews = rightTrend.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;
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