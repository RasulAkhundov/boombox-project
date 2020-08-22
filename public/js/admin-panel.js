$(document).ready(async function() {

    if(!localStorage.getItem('user')) {
        window.location.href = "/"
    }
    if(window.location.pathname === "/admin-panel") {
        localStorage.removeItem('order');
        localStorage.removeItem('category');
        localStorage.removeItem('newsID');
    }

    /// GETTING ALL NEWS ///
    let allNews = await axios.get(`${window.development}/api/get-all-news`).then(res => res.data.allNews);

    //local storage info
    let tokenMe = localStorage.getItem('user');
    let userData = parseJwt(tokenMe);

    let userMe = await axios.get(`${window.development}/api/user/${userData.usr._id}`).then(res => res.data.userInfo);

    let userName = userMe.username;
    let userImage = userMe.image;
    let userBio = userMe.bio;

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
                $("#image").val("");
                $("#news-header-input").val("");
                $("#news-description").val("");
                $("#hashtag-1").val("");
                $("#hashtag-2").val("");
                $(".news_row").append(`
                    <div class="col-12 col-sm-6 col-lg-4 mb-3 mb-sm-0 p-0 p-sm-3 news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <button type="button" id="edit-news">Edit</button>
                        <button type="button" id="delete-news">Sil</button>
                        <div class="col-12 p-0 news-img-box" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" data-id="${res.data.allNews._id}" alt="" style="border-radius: 5px 5px 0 0;" class="news-img">
                            <div class="news-emoji">
                                <div class="emoji-1 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag1}.svg" class="emoji-1-img" alt="">
                                </div>
                                <div class="emoji-2 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag2}.svg" class="emoji-2-img" alt="">
                                </div>
                            </div>
                            <div class="news-view-count">
                                <i class="far fa-eye"></i>
                                <span>${res.data.allNews.pageViews}</span>
                            </div>
                        </div>
                        <div class="col-12 py-3 px-4" style="background: #1D1E29; border-radius: 0 0 5px 5px;">
                            <div class="hashtag">
                                <a href="#" id="hashtag-1-admin">${res.data.allNews.hashtag1}</a>
                                <a href="#" id="hashtag-2-admin">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header" data-id="${res.data.allNews._id}">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-description">
                                <span id="news-description">${res.data.allNews.newsDescription}</span>
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
                                    <span>${moment(`${res.data.allNews.date}`).locale('az').fromNow()}</span>
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
                $("#image").val("");
                $("#news-header-input").val("");
                $("#news-description").val("");
                $("#hashtag-1").val("");
                $("#hashtag-2").val("");
                $(".news_row").append(`
                    <div class="col-12 col-sm-6 col-lg-4 mb-3 mb-sm-0 p-0 p-sm-3 news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <button type="button" id="edit-news">Edit</button>
                        <button type="button" id="delete-news">Sil</button>
                        <div class="col-12 p-0 news-img-box" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" data-id="${res.data.allNews._id}" alt="" style="border-radius: 5px 5px 0 0;" class="news-img">
                            <div class="news-emoji">
                                <div class="emoji-1 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag1}.svg" class="emoji-1-img" alt="">
                                </div>
                                <div class="emoji-2 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag2}.svg" class="emoji-2-img" alt="">
                                </div>
                            </div>
                            <div class="news-view-count">
                                <i class="far fa-eye"></i>
                                <span>${res.data.allNews.pageViews}</span>
                            </div>
                        </div>
                        <div class="col-12 py-3 px-4" style="background: #1D1E29; border-radius: 0 0 5px 5px;">
                            <div class="hashtag">
                                <a href="#" id="hashtag-1-admin">${res.data.allNews.hashtag1}</a>
                                <a href="#" id="hashtag-2-admin">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header" data-id="${res.data.allNews._id}">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-description">
                                <span id="news-description">${res.data.allNews.newsDescription}</span>
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
                                    <span>${moment(`${res.data.allNews.date}`).locale('az').fromNow()}</span>
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
                $("#image").val("");
                $("#news-header-input").val("");
                $("#news-description").val("");
                $("#hashtag-1").val("");
                $("#hashtag-2").val("");
                $(".news_row").append(`
                    <div class="col-12 col-sm-6 col-lg-4 mb-3 mb-sm-0 p-0 p-sm-3 news-box" data-id="${res.data.allNews._id}" data-news-image="${res.data.allNews.image}">
                        <button type="button" id="edit-news">Edit</button>
                        <button type="button" id="delete-news">Sil</button>
                        <div class="col-12 p-0 news-img-box" style="background: #1D1E29">
                            <img src="${res.data.allNews.image}" data-id="${res.data.allNews._id}" alt="" style="border-radius: 5px 5px 0 0;" class="news-img">
                            <div class="news-emoji">
                                <div class="emoji-1 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag1}.svg" class="emoji-1-img" alt="">
                                </div>
                                <div class="emoji-2 emoji-box">
                                    <img src="/emotion-img/${res.data.allNews.hashtag2}.svg" class="emoji-2-img" alt="">
                                </div>
                            </div>
                            <div class="news-view-count">
                                <i class="far fa-eye"></i>
                                <span>${res.data.allNews.pageViews}</span>
                            </div>
                        </div>
                        <div class="col-12 py-3 px-4" style="background: #1D1E29; border-radius: 0 0 5px 5px;">
                            <div class="hashtag">
                                <a href="#" id="hashtag-1-admin">${res.data.allNews.hashtag1}</a>
                                <a href="#" id="hashtag-2-admin">${res.data.allNews.hashtag2}</a>
                            </div>
                            <div class="news-header">
                                <h5 id="news-header" data-id="${res.data.allNews._id}">${res.data.allNews.newsHeader}</h5>
                            </div>
                            <div class="news-description">
                                <span id="news-description">${res.data.allNews.newsDescription}</span>
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
                                    <span>${moment(`${res.data.allNews.date}`).locale('az').fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            });
        }
    });

    /// GET ADMIN POST RIGHT NOW ///
    ///////////////////////////////
    await axios.get(`${window.development}/api/get-all-news`).then(res => {
        res.data.allNews.map(a => {
            $(".news_row").append(`
                <div class="col-12 col-sm-6 col-lg-4 mb-3 mb-sm-0 p-0 p-sm-3 news-box" data-id="${a._id}" data-news-image="${a.image}">
                    <button type="button" id="edit-news">Edit</button>
                    <button type="button" id="delete-news">Sil</button>
                    <div class="col-12 p-0 news-img-box" style="background: #1D1E29">
                        <div class="news-img" data-id="${a._id}" alt="" style="border-radius: 5px 5px 0 0; background-image: url('${a.image}');">
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
                    <div class="col-12 py-3 px-4" style="background: #1D1E29; border-radius: 0 0 5px 5px;">
                        <div class="hashtag">
                            <a href="#" id="hashtag-1-admin">${a.hashtag1}</a>
                            <a href="#" id="hashtag-2-admin">${a.hashtag2}</a>
                        </div>
                        <div class="news-header">
                            <h5 id="news-header" data-id="${a._id}">${a.newsHeader}</h5>
                        </div>
                        <div class="news-description">
                            <span id="news-description">${a.newsDescription}</span>
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
                                <span>${moment(`${a.date}`).locale('az').fromNow()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        })
    })

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

        formData.pageViews = rightTrend.filter(a => a._id === id)[0].pageViews + 1;
    
        await axios
        .put(`${window.development}/api/update-page-views/${id}`, formData)
        window.location.href = `/news/${id}`;
    });

    ///SECTION LINK///
    $(".sections-li").click(function() {
        let sectionVal = {
            name: $(this).text()
        }
        localStorage.setItem('category', JSON.stringify(sectionVal));
    });

    ///NEWS HASHTAG 1 LINK GIVING
    $(document).on('click', '#hashtag-1-admin', function() {
        let hashtag1 = $(this).text().toLowerCase();
        window.location.href = `/category-${hashtag1}`;
        let hashtag1Val = {
            name: $(this).text()
        }
        localStorage.setItem('category', JSON.stringify(hashtag1Val));
    });
    ///NEWS HASHTAG 2 LINK GIVING
    $(document).on('click', '#hashtag-2-admin', function() {
        let hashtag2 = $(this).text().toLowerCase();
        window.location.href = `/category-${hashtag2}`;
        let hashtag2Val = {
            name: $(this).text()
        }
        localStorage.setItem('category', JSON.stringify(hashtag2Val));
    })


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

    /// SEARCH POST WITH INPUT //////
    ////////////////////////////////
    $("#admin_news_search").keyup(() => {
        let searchItem = $(this).val().toLowerCase();

        $("#news-header").each(function() {
            let lineStr = $(this).text().toLowerCase();
            if(lineStr.indexOf(searchItem) === -1) {
                console.log("asdasd")
                $(this).hide();
            } else {
                console.log("werfwefwe")
                $(this).show();
            }
        })
    })
});