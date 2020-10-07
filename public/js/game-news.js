$(document).ready(async function() {

    if(window.location.pathname === "/game") {
        localStorage.removeItem('newsID');
    }

    //GETTING TECHNO NEWS
    let newsLimit = 10;
    let game = await axios
    .get(`${window.development}/api/get-game-news?limit=${newsLimit}`)
    .then(res => res.data.allNews);

    //GETTING ALL NEWS LENGTH
    let allNews = await axios.get(`${window.development}/api/get-game-news`).then(res => res.data.allNews);

    //DISPLAY NONE SEE MORE BUTTON
    if(allNews.length <= newsLimit ) {
        $("#load-more-btn").css("display", "none");
    }

    game.map((g, i) => {
        return newsReturn(g, i);
    });

    $("#load-more-btn").click(function() {
        newsLimit += 10;
        $(".load-more-btn-img").css("display", "flex");

        setTimeout(async function() {
            $(".news-box").remove();
            $(".load-more-btn-img").css("display", "none");

            ///DISPLAY NONE LOAD MORE BUTTON
            if(newsLimit >= allNews.length) {
                $("#load-more-btn").css("display", "none");
            }
            
            await axios.get(`${window.development}/api/get-game-news?limit=${newsLimit}`).then(res =>{
                res.data.allNews.map((g, i) => {
                    return newsReturn(g, i);
                })
            })
        }, 3000)
    })

    function newsReturn(g, i) {
        $(".news-wrapper").append(`
            <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box">
            <div class="col-12 col-sm-6 p-0 news-img-box" style="background: #1D1E29">
                <img src="${g.image}" data-id="${g._id}" alt="" style="border-radius: 5px 0 0 5px;">
                <h2 class="number">${i += 1}</h2>
                <div class="news-view-count d-flex align-items-center">
                    <i class="far fa-eye"></i>
                    <span>${g.pageViews}</span>
                </div>
            </div>
                <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                    <div class="hashtag">
                        <a id="hashtag-1">${g.hashtag1}</a>
                        <a id="hashtag-2">${g.hashtag2}</a>
                    </div>
                    <div class="news-header">
                        <h5 id="news-header" data-id="${g._id}" data-header-text="${g.newsHeader}" data-description-text="${g.newsDescription}" data-name="${g.authorName}" data-author-image="${g.authorImage}" data-news-image="${g.image}" data-hashtag1="${g.hashtag1}" data-hashtag2="${g.hashtag2}" data-news-date="${g.date}">${g.newsHeader}</h5>
                    </div>
                    <div class="news-author d-flex">
                        <div class="author-avatar">
                            <img src="${g.authorImage}" alt="">
                        </div>
                        By
                        <div class="author-name">
                            <a href="#">${g.authorName}</a>
                        </div>
                        <div class="news-date">
                            <span>${moment(`${g.date}`).locale('az').fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    //RIGHT TREND APPEND

    let rightTrend = await axios
    .get(`${window.development}/api/right-trend`)
    .then(res => res.data.rightTrend);
    
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

    //News header text link
    let viewsData = {};
    $(document).on('click', '.news-box img, #news-header', async function() {
        let id = $(this).data('id');
        pageViewsCounter(id);
    });
    //right trend link
    $(document).on('click', '#right-news', async function() {
        let id = $(this).data('id');
        pageViewsCounter(id);
    });

    ////PAGE VIEWS COUNT REAL TIME
    async function pageViewsCounter(id) {
        await axios.get(`${window.development}/api/news/${id}`).then(res => {
            viewsData.pageViews = res.data.fullNews.pageViews + 1;

            async function updateViews() {
                await axios.put(`${window.development}/api/update-page-views/${id}`, viewsData)
                window.location.href = `/news/${id}`;
            }
            updateViews();
        })
    }

    ///NEWS HASHTAG 1 LINK GIVING
    $(document).on('click', '#hashtag-1', function() {
        let hashtag1 = $(this).text();
        window.location.href = `/category?h=${hashtag1}`;
    });
    ///NEWS HASHTAG 2 LINK GIVING
    $(document).on('click', '#hashtag-2', function() {
        let hashtag2 = $(this).text();
        window.location.href = `/category?h=${hashtag2}`;
    })

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