$(document).ready(async function() {

    if(!localStorage.getItem('user')) {
        window.location.href = "/"
    }
    if(window.location.pathname === "/admin-panel") {
        localStorage.removeItem('order');
        localStorage.removeItem('category');
        localStorage.removeItem('newsID');
    }

    //GETTING ALL NEWS
    let allNews = await axios
    .get(`${window.development}/api/get-all-news`)
    .then(res => res.data.allNews);

    allNews.map(a => {
        $("#news-wrapper").append(`
            <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box" data-id="${a._id}" data-news-image="${a.image}">
                <i class="fas fa-times" id="delete-news"></i>
                <div class="col-12 col-sm-6 p-0 news-img-box" style="background: #1D1E29">
                    <img src="${a.image}" data-id="${a._id}" alt="" style="border-radius: 5px 0 0 5px;" class="news-img">
                    <div class="news-emoji">
                        <div class="emoji-1 emoji-box">
                            <img src="/emotion-img/${a.hashtag1}.svg" class="emoji-1-img" alt="">
                        </div>
                        <div class="emoji-2 emoji-box">
                            <img src="/emotion-img/${a.hashtag2}.svg" class="emoji-2-img" alt="">
                        </div>
                    </div>
                    <div class="news-view-count">
                        <i class="far fa-eye"></i>
                        <span>${a.pageViews}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                    <div class="hashtag">
                        <a href="#">${a.hashtag1}</a>
                        <a href="#">${a.hashtag2}</a>
                    </div>
                    <div class="news-header">
                        <h5 id="news-header" data-id="${a._id}" data-header-text="${a.newsHeader}" data-description-text="${a.newsDescription}" data-name="${a.authorName}" data-author-image="${a.authorImage}" data-news-image="${a.image}" data-hashtag1="${a.hashtag1}" data-hashtag2="${a.hashtag2}" data-news-date="${a.date}">${a.newsHeader}</h5>
                    </div>
                    <div class="news-author d-flex">
                        <div class="author-avatar">
                            <img src="${a.authorImage}" alt="">
                        </div>
                        By
                        <div class="author-name">
                            <a href="#">${a.authorName}</a>
                        </div>
                        <div class="news-date">
                            <span>${moment(`${a.date}`).fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `)
    });

    //MAIN TREND APPENDING
    let mainTrend1 = allNews[allNews.length - 1];
    let mainTrend2 = allNews[allNews.length - 2];
    let mainTrend3 = allNews[allNews.length - 3];
    let mainTrend4 = allNews[allNews.length - 4];
    let mainTrend5 = allNews[allNews.length - 5];

    if(allNews.length >= 5) {
        //First trend
        $('.trend-1 .emoji-1-img').attr('src', `/emotion-img/${mainTrend1.hashtag1}.svg`);
        $('.trend-1 .emoji-2-img').attr('src', `/emotion-img/${mainTrend1.hashtag2}.svg`);
        $(".trend-1").attr('data-id', `${mainTrend1._id}`);
        $(".trend-1").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend1.image})`);
        $("#trend-1-header").text(mainTrend1.newsHeader);
        $("#trend-1-author").text(mainTrend1.authorName);
        $("#trend-1-views").text(mainTrend1.pageViews);
        //Second trend
        $('.trend-2 .emoji-1-img').attr('src', `/emotion-img/${mainTrend2.hashtag1}.svg`);
        $('.trend-2 .emoji-2-img').attr('src', `/emotion-img/${mainTrend2.hashtag2}.svg`);
        $(".trend-2").attr('data-id', `${mainTrend2._id}`);
        $(".trend-2").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend2.image})`);
        $("#trend-2-header").text(mainTrend2.newsHeader);
        $("#trend-2-author").text(mainTrend2.authorName);
        $("#trend-2-views").text(mainTrend2.pageViews);
        //Third trend
        $('.trend-3 .emoji-1-img').attr('src', `/emotion-img/${mainTrend3.hashtag1}.svg`);
        $('.trend-3 .emoji-2-img').attr('src', `/emotion-img/${mainTrend3.hashtag2}.svg`);
        $(".trend-3").attr('data-id', `${mainTrend3._id}`);
        $(".trend-3").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend3.image})`);
        $("#trend-3-header").text(mainTrend3.newsHeader);
        $("#trend-3-author").text(mainTrend3.authorName);
        $("#trend-3-views").text(mainTrend3.pageViews);
        //Fourt trend
        $('.trend-4 .emoji-1-img').attr('src', `/emotion-img/${mainTrend4.hashtag1}.svg`);
        $('.trend-4 .emoji-2-img').attr('src', `/emotion-img/${mainTrend4.hashtag2}.svg`);
        $(".trend-4").attr('data-id', `${mainTrend4._id}`);
        $(".trend-4").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend4.image})`);
        $("#trend-4-header").text(mainTrend4.newsHeader);
        $("#trend-4-author").text(mainTrend4.authorName);
        $("#trend-4-views").text(mainTrend4.pageViews);
        //Fifth trend
        $('.trend-5 .emoji-1-img').attr('src', `/emotion-img/${mainTrend5.hashtag1}.svg`);
        $('.trend-5 .emoji-2-img').attr('src', `/emotion-img/${mainTrend5.hashtag2}.svg`);
        $(".trend-5").attr('data-id', `${mainTrend5._id}`);
        $(".trend-5").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend5.image})`);
        $("#trend-5-header").text(mainTrend5.newsHeader);
        $("#trend-5-author").text(mainTrend5.authorName);
        $("#trend-5-views").text(mainTrend5.pageViews);
    }

    //RIGHT TREND APPEND
    let rightTrend = await axios
    .get(`${window.development}/api/right-trend`)
    .then(res => res.data.rightTrend);
    console.log(rightTrend);
    
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

    //local storage info
    let tokenMe = localStorage.getItem('user');
    let userData = parseJwt(tokenMe);
    let user = userData.usr;
    let userName = user.username;
    let userImage = user.image;
    let userBio = user.bio;

    let userProfileToggle = false;
    //user profile image gives
    $("#user-profile").css('background-image', `url(${userImage})`)
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

    //CREATE NEWS BUTTON ACTIVE CHANGES
    $(".create-side-header button").click(function() {
        $(".create-side-header button").removeClass('active');
        $(this).addClass('active');
    });
    $(".create-header-techno-button").click(function() {
        $("#techno-news-btn").css("display", "flex");
        $("#game-news-btn, #trend-news-btn").css("display", "none");
    });
    $(".create-header-game-button").click(function() {
        $("#game-news-btn").css("display", "flex");
        $("#techno-news-btn, #trend-news-btn").css("display", "none");
    });
    $(".create-header-trend-button").click(function() {
        $("#trend-news-btn").css("display", "flex");
        $("#game-news-btn, #techno-news-btn").css("display", "none");
    });

    //modal closing
    let errorModal = $('.error-modal');
    let successModal = $('.success-modal');
    $(".modal-close").on('click', function() {
        $('.error-modal, .success-modal').css('display', 'none');
    });

    //POSTING NEWS TO APi
    let allData = {};

    //Techno NEWS Post
    $("#techno-news-btn").click(async function() {
        // allData.image = $("#image").val();
        allData.mainContentName = "techno";
        allData.newsHeader = $("#news-header-input").val();
        allData.newsDescription = $("#news-description").val();
        allData.hashtag1 = $("#hashtag-1").val();
        allData.hashtag2 = $("#hashtag-2").val();
        allData.authorImage = userImage;
        allData.authorName = userName;
        allData.authorBio = userBio;

        if(allData.newsHeader === "" ||
        allData.newsDescription === "" ||
        allData.hashtag1 === "" ||
        allData.hashtag2 === "" ||
        $("#image").val() === "") {
            $('.error-modal').css('display', 'flex');
            if(errorModal) {
                setTimeout(function() {
                    $('.error-modal').css('display', 'none');
                }, 3000);
            }
        } else {
            let allNews = await axios
            .post(`${window.development}/api/post-all-news`, allData)
            .then(res => {
                $('.success-modal').css('display', 'flex');
                if(successModal) {
                    setTimeout(function() {
                        $('.success-modal').css('display', 'none');
                    }, 3000);
                }
                $("#news-wrapper").append(`
                    <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <i class="fas fa-times" id="delete-news"></i>
                        <div class="col-12 col-sm-6 p-0" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" alt="" style="border-radius: 5px 0 0 5px;" class="news-img">
                        </div>
                        <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                            <div class="hashtag">
                                <a href="#">${res.data.allNews.hashtag1}</a>
                                <a href="#">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-author d-flex">
                                <div class="author-avatar">
                                    <img src="${res.data.allNews.authorImage}" alt="">
                                </div>
                                By
                                <div class="author-name">
                                    <a href="#">${res.data.allNews.authorName}</a>
                                </div>
                                <div class="news-date">
                                    <span>${moment(res.data.allNews.date).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            });
        }
    })

    //GAME NEWS POST
    $("#game-news-btn").click(async function() {
        allData.mainContentName = "game";
        // allData.image = $("#image").val();
        allData.newsHeader = $("#news-header-input").val();
        allData.newsDescription = $("#news-description").val();
        allData.hashtag1 = $("#hashtag-1").val();
        allData.hashtag2 = $("#hashtag-2").val();
        allData.authorImage = userImage;
        allData.authorName = userName;
        allData.authorBio = userBio;

        if(allData.newsHeader === "" ||
        allData.newsDescription === "" ||
        allData.hashtag1 === "" ||
        allData.hashtag2 === "" ||
        $("#image").val() === "") {
            $('.error-modal').css('display', 'flex');
            if(errorModal) {
                setTimeout(function() {
                    $('.error-modal').css('display', 'none');
                }, 3000);
            }
        } else {
            let allNews = await axios
            .post(`${window.development}/api/post-all-news`, allData)
            .then(res => {
                $('.success-modal').css('display', 'flex');
                if(successModal) {
                    setTimeout(function() {
                        $('.success-modal').css('display', 'none');
                    }, 3000);
                }
                $("#news-wrapper").append(`
                    <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <i class="fas fa-times" id="delete-news"></i>
                        <div class="col-12 col-sm-6 p-0" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" alt="" style="border-radius: 5px 0 0 5px;" class="news-img">
                        </div>
                        <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                            <div class="hashtag">
                                <a href="#">${res.data.allNews.hashtag1}</a>
                                <a href="#">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-author d-flex">
                                <div class="author-avatar">
                                    <img src="${res.data.allNews.authorImage}" alt="">
                                </div>
                                By
                                <div class="author-name">
                                    <a href="#">${res.data.allNews.authorName}</a>
                                </div>
                                <div class="news-date">
                                    <span>${moment(res.data.allNews.date).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            });
        }
    });

    //TREND NEWS POST
    $("#trend-news-btn").click(async function() {
        allData.mainContentName = "trend";
        // allData.image = $("#image").val();
        allData.newsHeader = $("#news-header-input").val();
        allData.newsDescription = $("#news-description").val();
        allData.hashtag1 = $("#hashtag-1").val();
        allData.hashtag2 = $("#hashtag-2").val();
        allData.authorImage = userImage;
        allData.authorName = userName;
        allData.authorBio = userBio;

        if(allData.newsHeader === "" ||
        allData.newsDescription === "" ||
        allData.hashtag1 === "" ||
        allData.hashtag2 === "" ||
        $("#image").val() === "") {
            $('.error-modal').css('display', 'flex');
            if(errorModal) {
                setTimeout(function() {
                    $('.error-modal').css('display', 'none');
                }, 3000);
            }
        } else {
            let allNews = await axios
            .post(`${window.development}/api/post-all-news`, allData)
            .then(res => {
                $('.success-modal').css('display', 'flex');
                if(successModal) {
                    setTimeout(function() {
                        $('.success-modal').css('display', 'none');
                    }, 3000);
                }
                $("#news-wrapper").append(`
                    <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <i class="fas fa-times" id="delete-news"></i>
                        <div class="col-12 col-sm-6 p-0" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" alt="" style="border-radius: 5px 0 0 5px;" class="news-img">
                        </div>
                        <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29; border-radius: 0 5px 5px 0;">
                            <div class="hashtag">
                                <a href="#">${res.data.allNews.hashtag1}</a>
                                <a href="#">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-author d-flex">
                                <div class="author-avatar">
                                    <img src="${res.data.allNews.authorImage}" alt="">
                                </div>
                                By
                                <div class="author-name">
                                    <a href="#">${res.data.allNews.authorName}</a>
                                </div>
                                <div class="news-date">
                                    <span>${moment(res.data.allNews.date).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            });
        }
    });

    //ALLDATA AND TECHNO DATA IMAGE UPLOAD
    $("#image").on('change', function(e) {
        const image = $(this)[0].files[0];

        if(image.size > 1200000) {
            console.log("Size is to large");
            $(this).val("");
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = async () => {
                if(!!reader.result) {
                    allData.image = reader.result;
                } else {
                    console.log(Error("Failed converting to base64"));
                }
            }
        }
    });

    //Main trend link
    let formData = {}
    $(".trend").click(async function() {
        let id = $(this).data('id');
        localStorage.setItem('newsID', id);

        formData.pageViews = allNews.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;

    });
    //News header text link
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

        formData.pageViews = right.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;
    });


    ///DELETING NEWS POST
    $(document).on('click', '#delete-news', function() {
        $(".delete-news-modal-cover").css("display", "flex");

        let Deleted_News_Info = {
            id: $(this).parent().data('id'),
            image: $(this).parent().data('news-image')
        }

        localStorage.setItem('deleted-news-info', JSON.stringify(Deleted_News_Info));
    });
    $("#delete-news-no").click(function() {
        $(".delete-news-modal-cover").css("display", "none");
        localStorage.removeItem('deleted-news-info');
    });
    $("#delete-news-yes").click(async function() {
        let Deleted_News_Info = JSON.parse(localStorage.getItem('deleted-news-info'));

        let deleteNews = await axios
        .delete(`${window.development}/api/delete-news/${Deleted_News_Info.id}`)
        .then(res => {
            $('.success-modal').css('display', 'flex');
            $('.success-modal p').text('Xeber ugurla silindi !');
            $(".delete-news-modal-cover").css("display", "none");
            if(successModal) {
                setTimeout(function() {
                    $('.success-modal').css('display', 'none');
                }, 3000);
            }
            $(this)
            .parent()
            .remove();
            localStorage.removeItem('deleted-news-info');
            window.location.reload();
        })
    });
});