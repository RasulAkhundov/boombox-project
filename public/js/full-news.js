$(document).ready(async function() {

    //RIGHT TREND APPEND
    let rightTrend = await axios
    .get(`${window.development}/api/right-trend`)
    .then(res => res.data.rightTrend);
    
    rightTrend.map((r, i) => {
        $("#trending-news-wrapper").append(`
            <div class="col-12 col-sm-6 col-lg-12 p-0 d-flex flex-column mb-3" id="right-news" data-id="${r._id}">
                <div class="img" style="background-image: url(${r.image});">
                    <h2 class="number">${i + 1}</h2>
                </div>
                <span>${r.newsHeader}</span>
            </div>
        `)
    })

    //right trend link
    let viewsData = {};
    $(document).on('click', '#right-news', async function() {
        let id = $(this).data('id');

        await axios.get(`${window.development}/api/news/${id}`).then(res => {
            viewsData.pageViews = res.data.fullNews.pageViews + 1;

            async function updateViews() {
                await axios.put(`${window.development}/api/update-page-views/${id}`, viewsData)
                window.location.href = `/news/${id}`;
            }
            updateViews();
        })
    });

    ////////GETTING FULL NEWS FROM DATA BASE////////
    let newsID = window.location.pathname.split("/")[2];
    let fullNews = await axios
    .get(`${window.development}/api/news/${newsID}`)
    .then(res => {
        if(res.data.error) {
            window.location.href = "/";
        }
        return res.data.fullNews;
    });


    ///GETTING NEWS VIEWS FROM RES JSON on REAL TIME
    await axios.get(`${window.development}/api/news/${newsID}`).then(res => {
        //news view count
        $("#news-view-count").text(`${res.data.fullNews.pageViews}`);
    });

    ///GETTING USER INFORMATION
    let authorInfo = await axios.get(`${window.development}/api/user/${fullNews.authorId}`).then(res => res.data.userInfo);

    $("#about-author-bio").text(`${authorInfo.bio}`);
    $('.emoji-1-img').attr('src', `/emotion-img/${fullNews.hashtag1}.svg`);
    $('.emoji-2-img').attr('src', `/emotion-img/${fullNews.hashtag2}.svg`);
    $("#hashtag-1").text(`${fullNews.hashtag1}`);
    $("#hashtag-2").text(`${fullNews.hashtag2}`);
    $("#news-header-text, title").text(`${fullNews.newsHeader}`);
    $(".news-description").append(`
        ${marked(fullNews.newsDescription)}
    `);
    $("#author-image, #about-author-image").attr('src', `${authorInfo.image}`);
    $("#news-image").attr('src', `${fullNews.image}`);
    $("#author-name, #about-author-name").text(`${authorInfo.username}`);
    $("#news-name-location").text(`${fullNews.newsHeader}`);
    $("#news-adding-time").text(`${moment(fullNews.date).locale('az').fromNow()}`);
    $("#like-btn span").text(fullNews.like.length);
    $("#dislike-btn span").text(fullNews.dislike.length);

    //YOUTUBE IFRAME APPEND
    if(fullNews.newsIframe) {
        $(".news-iframe").append(`
            ${fullNews.newsIframe}
        `)
    }

    //////GETTING COMMENT///////
    $("#comment-count, #news-authour-comment-count").text(`${fullNews.comments.length} Serh:`);
    $("#news-authour-comment-count").text(`${fullNews.comments.length}`);
    fullNews.comments.map(c => {
        $(".comments-complation").prepend(`
            <div class="user-comment">
                <img id="comment-avatar" src="${c.commentImage}" alt="">
                <div class="comment-body">
                    <div class="comment-name">
                        <a href="#" id="comment-name">${c.commentName}</a>
                        <p id="comment-time">${moment(c.commentDate).locale('az').fromNow()}</p>
                    </div>
                    <div class="comment-description">
                        <p id="comment-description">${c.commentText}</p>
                    </div>
                </div>
            </div>
        `)
    });

    ///image full screen
    let newsImages = $("#news-wrapper img");
    $("#news-wrapper img").on('click', function() {
        if(!document.fullscreenElement) {
            newsImages.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    })

    ///modal functions
    let infoModal = $('.error-modal');
    
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

        ////////////////////
        ///SEND COMMENT/////
        ////////////////////
        $('.write-comment').css('display', 'flex');
        $('.comment-without-login').css('display', 'none');
        let commentData = {};
        $("#send-comment").click(async function() {
            commentData.id = fullNews._id;
            commentData.commentName = userName;
            commentData.commentImage = userImage;
            commentData.commentText = $("#comment-text").val();

            let comment = await axios
            .post(`${window.development}/api/do-comment`, commentData)
            .then(res => {
                $(".comment-append-loading").css("display", "flex");
                $("#comment-text").val("");

                ///COMMENT APPEND
                setTimeout(function() {
                    $(".comment-append-loading").css("display", "none");
                    $(".comments-complation").prepend(`
                        <div class="user-comment">
                            <img id="comment-avatar" src="${commentData.commentImage}" alt="">
                            <div class="comment-body">
                                <div class="comment-name">
                                    <a href="#" id="comment-name">${commentData.commentName}</a>
                                    <p id="comment-time">${moment(commentData.commentDate).locale('az').fromNow()}</p>
                                </div>
                                <div class="comment-description">
                                    <p id="comment-description">${commentData.commentText}</p>
                                </div>
                            </div>
                        </div>
                    `)
                }, 2000)
            });
        });

        ////////////////////////
        //////DO LIKE//////////
        //////////////////////
        let likeData = {};
        $("#like-btn").click(async function() {
            likeData.id = fullNews._id;
            likeData.user = userMe._id;

            let doLike = await axios
            .post(`${window.development}/api/do-like`, likeData)
            .then(res => {
                $(this).css("background", "green");
                $("#like-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#dislike-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#like-btn i").css('color', "#efefef");
                $("#like-btn span").css('color', "#efefef");
                $("#like-btn span").text(fullNews.like.length + 1);
            });
        });
        ////////////////////////
        //////DO DISLIKE//////////
        //////////////////////
        console.log(fullNews)
        let dislikeData = {};
        $("#dislike-btn").click(async function() {
            dislikeData.id = fullNews._id;
            dislikeData.user = userMe._id;

            let doDislike = await axios
            .post(`${window.development}/api/do-dislike`, dislikeData)
            .then(res => {
                $(this).css("background", "red");
                $("#like-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#dislike-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#dislike-btn i").css('color', "#efefef");
                $("#dislike-btn span").css('color', "#efefef");
                $("#dislike-btn span").text(fullNews.dislike.length + 1);
            });
        })

        ////CHECK USER DO LIKE
        let mapLike = fullNews.like.map(like => {
            if(like.user == userMe._id) {
                $("#like-btn").css("background", 'green');
                $("#like-btn i").css('color', "#efefef");
                $("#like-btn span").css('color', "#efefef");
                $("#like-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#dislike-btn").css("cursor", 'not-allowed')[0].disabled = true;
            }
        });
        ////CHECK USER DO DISLIKE
        let mapDislike = fullNews.dislike.map(dislike => {
            if(dislike.user == userMe._id) {
                $("#dislike-btn").css('background', 'red');
                $("#dislike-btn i").css('color', "#efefef");
                $("#dislike-btn span").css('color', "#efefef");
                $("#like-btn").css("cursor", 'not-allowed')[0].disabled = true;
                $("#dislike-btn").css("cursor", 'not-allowed')[0].disabled = true;
            }
        });
    } else {
        $("#like-btn, #dislike-btn").click(function() {
            window.location.href = "/login"
        })
        $("#dash-login-btn").css("display", "flex");
        $('.write-comment').css('display', 'none');
        $('.comment-without-login').css('display', 'flex');
    }

    //modal closing
    $(".modal-close").on('click', function() {
        $('.error-modal, .success-modal').css('display', 'none');
    });


    ////////////////////////////////////
    ////SHOW NEXT AND PREVIOUS POST////
    //////////////////////////////////

    let formData = {};

    //ALL NEWS APPEND
    let allNews = await axios
    .get(`${window.development}/api/get-all-news`)
    .then(res => res.data.allNews);

    ///PREVIOUS
    let previousPost = await axios
    .get(`${window.development}/api/previous/${newsID}`)
    .then(res => res.data.previousPost);

    $("#previous-btn, .previous_post_img, .previous_post_header").click(async function() {
        $('.previous_post_a').attr('href', `${previousPost[0]._id}`);
        $("#previous-btn-a").attr('href', `${previousPost[0]._id}`);
        localStorage.setItem('newsID', previousPost[0]._id);

        formData.pageViews = allNews.filter(a => a._id === previousPost[0]._id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${previousPost[0]._id}`, formData)
        window.location.href = `/news/${previousPost[0]._id}`;
    });

    if(previousPost.length === 0) {
        $("#previous-post").css('display', "none");
        $('#previous-btn').css('display', 'none');
    } else {
        $(".previous_post_img").css('background-image', `url('${previousPost[0].image}')`);
        $(".previous_post_header").text(`${previousPost[0].newsHeader}`);
        $(".previous_post_name").text(`${previousPost[0].authorName}`);
        $(".previous_post").css('display', "flex");
        $('#previous-btn').css('display', 'flex');
    }
    ///NEXT
    let nextPost = await axios
    .get(`${window.development}/api/next/${newsID}`)
    .then(res => res.data.nextPost);

    $("#next-btn, .next_post_img, .next_post_header").click(async function() {
        $('.next_post_a').attr('href', `${nextPost[0]._id}`);
        $("#next-btn-a").attr('href', `${nextPost[0]._id}`);
        localStorage.setItem('newsID', nextPost[0]._id);

        formData.pageViews = allNews.filter(a => a._id === nextPost[0]._id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${nextPost[0]._id}`, formData)
        window.location.href = `/news/${nextPost[0]._id}`;
    });

    if(nextPost.length === 0) {
        $("#next-post").css('display', "none");
        $('#next-btn').css('display', 'none');
    } else {
        $(".next_post_img").css('background-image', `url('${nextPost[0].image}')`);
        $(".next_post_header").text(`${nextPost[0].newsHeader}`);
        $(".next_post_name").text(`${nextPost[0].authorName}`);
        $(".next_post").css('display', "flex");
        $('#next-btn').css('display', 'flex');
    }
    //////////////////////////////////////////////////

    ///POST LIKE AND UNLIKE


    //// MORE FROM HASHTAG ////
    let moreFrom = await axios
    .get(`${window.development}/api/more-from/${fullNews.hashtag1}`)
    .then(res => res.data.moreFrom)

    $("#more-from-header").text(`DAHA ÇOX: ${fullNews.hashtag1.toUpperCase()}`);

    moreFrom.map(m => {
        $('.more-from-body').append(`
            <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row full-news-box" style="background: #1D1E29;">
                <div class="col-12 col-sm-6 p-0 full-news-img-box" style="background: #1D1E29; height: 200px;">
                    <img src="${m.image}" data-id="${m._id}" alt="" style="border-radius: 5px 0 0 5px;">
                    <div class="full-news-emoji">
                        <div class="emoji-1 emoji-box">
                            <img src="/emotion-img/${m.hashtag1}.svg" class="emoji-1-img" alt="">
                        </div>
                        <div class="emoji-2 emoji-box">
                            <img src="/emotion-img/${m.hashtag2}.svg" class="emoji-2-img" alt="">
                        </div>
                    </div>
                    <div class="full-news-view-count d-flex align-items-center">
                        <i class="far fa-eye"></i>
                        <span>${m.pageViews}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                    <div class="full-news-hashtag">
                        <a href="#">${m.hashtag1}</a>
                        <a href="#">${m.hashtag2}</a>
                    </div>
                    <div class="full-news-header">
                        <h5 id="full-news-header" data-id="${m._id}">${m.newsHeader}</h5>
                    </div>
                    <div class="full-news-description">
                        <span id="full-news-description">${m.newsDescription.slice(0, 72)}...</span>
                    </div>
                    <div class="full-news-author d-flex">
                        <div class="author-avatar">
                            <img src="${m.authorImage}" alt="">
                        </div>
                        By
                        <div class="author-name">
                            <a href="#">${m.authorName}</a>
                        </div>
                        <div class="full-news-date">
                            <span>${moment(`${m.date}`).locale('az').fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `)
    })
    $(document).on('click', '.full-news-box img, #full-news-header', async function() {
        let id = $(this).data('id');

        formData.pageViews = allNews.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;
    });

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
})