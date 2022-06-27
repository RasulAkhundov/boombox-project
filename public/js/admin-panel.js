$(document).ready(async function() {

    if(!Cookies.get('user')) {
        window.location.href = "/"
    }

    let tokenMe = Cookies.get('user');

    let userData = parseJwt(tokenMe);

    let userMe = await axios.get(`${window.development}/api/user/${userData.usr._id}`).then(res => res.data.userInfo);

    if(userMe.admin === false) {
        window.location.href = "/"
    }

    let authorId = userMe._id;
    let userName = userMe.username;
    let userImage = userMe.image;
    let userBio = userMe.bio;

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

    //Create NEWS Post
    $("#create-news-btn").click(async function() {
        // allData.image = $("#image").val();
        allData.mainContentName = $("#news-category").val();
        allData.newsHeader = $("#news-header-input").val();
        allData.newsDescription = $("#news-description").val();
        allData.newsIframe = $("#news-iframe").val();
        allData.hashtag1 = $("#hashtag-1").val();
        allData.hashtag2 = $("#hashtag-2").val();
        allData.authorId = authorId;
        allData.authorImage = userImage;
        allData.authorName = userName;
        allData.authorBio = userBio;

        if(allData.newsHeader === "" ||
        allData.mainContentName === "" ||
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
            // if($("#news-iframe").val()) {
            //     allData.newsIframe = $("#news-iframe").val();
            // }
            let allNews = await axios
            .post(`${window.development}/api/post-all-news`, allData)
            .then(res => {
                window.location.reload();
                return res.data;
            });
        }
    })

    /// GET ADMIN POST RIGHT NOW ///
    ///////////////////////////////
    let allNews = await axios
    .get(`${window.development}/api/get-all-news`)
    .then(res => res.data.allNews);
    
    allNews.map(a => {
        $(".news_row").append(`
            <div class="col-12 col-sm-6 col-lg-4 mb-3 mb-sm-0 p-0 p-sm-3 news-box" data-id="${a._id}" data-news-image="${a.image}" data-news-header="${a.newsHeader}" data-news-description="${a.newsDescription}" data-news-hashtag1="${a.hashtag1}" data-news-hashtag2="${a.hashtag2}">
                <button type="button" id="edit-news">Edit</button>
                <button type="button" id="delete-news">Sil</button>
                <div class="col-12 p-0 news-img-box" style="background: #1D1E29">
                    <div class="news-img" data-id="${a._id}" alt="" style="border-radius: 5px 5px 0 0; background-image: url('${a.image}');">
                    <div class="news-emoji">
                        <div class="emoji-1 emoji-box">
                            <img src="/emotion-img/${a.hashtag1.toLowerCase()}.svg" class="emoji-1-img" alt="">
                        </div>
                        <div class="emoji-2 emoji-box">
                            <img src="/emotion-img/${a.hashtag2.toLowerCase()}.svg" class="emoji-2-img" alt="">
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
                        <h5 class="news-header-text" id="news-header" data-id="${a._id}">${a.newsHeader}</h5>
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

    //ALLDATA AND TECHNO DATA IMAGE UPLOAD
    $("#image").on('change', function(e) {
        const image = $(this)[0].files[0];

        if(image.size > 10000000) {
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
    let viewsData = {};
    //News header text link
    $(document).on('click', '.news-img, #news-header', async function() {
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

    ///NEWS HASHTAG 1 LINK GIVING
    $(document).on('click', '#hashtag-1-admin', function() {
        let hashtag1 = $(this).text();
        window.location.href = `/category?h=${hashtag1}`;
    });
    ///NEWS HASHTAG 2 LINK GIVING
    $(document).on('click', '#hashtag-2-admin', function() {
        let hashtag2 = $(this).text();
        window.location.href = `/category?h=${hashtag2}`;
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
        .delete(`${window.development}/api/delete-news/${Deleted_News_Info.id}/filename/${Deleted_News_Info.image.slice(23)}`)
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

    ///NEWS UPDATE///
    ///MOdal Opening//
    $(document).on('click', "#edit-news", function() {
        let id = $(this).parent().data('id');
        let newsHeader = $(this).parent().data('news-header');
        let newsImage = $(this).parent().data('news-image');
        let newsDescription = $(this).parent().data('news-description');
        let hashtag1 = $(this).parent().data('news-hashtag1');
        let hashtag2 = $(this).parent().data('news-hashtag2');
        console.log(newsDescription)

        $(".news-update-modal").attr('data-news-id', id);
        $(".news-update-hashtag .hashtag-1").val(hashtag1);
        $(".news-update-hashtag .hashtag-2").val(hashtag2);
        $(".news-update-img").attr('src', newsImage);
        $(".news-update-header").val(newsHeader);
        $(".news-update-description").val(newsDescription);
        $(".news-update-modal-cover").css("display", "flex");
    });
    ///MOdal Closing//
    $("#close-edit-modal").on('click', () => {
        $(".news-update-modal-cover").css("display", "none");
    });
    
    let editData = {};
    $("#edit-edit-modal").click(async function() {
        let id = $(".news-update-modal").attr('data-news-id');
        editData.newsHeader = $(".news-update-header").val();
        editData.newsDescription = $(".news-update-description").val();
        editData.hashtag1 = $(".news-update-hashtag .hashtag-1").val();
        editData.hashtag2 = $(".news-update-hashtag .hashtag-2").val();

        await axios
        .put(`${window.development}/api/edit-news/${id}`, editData)
        window.location.reload();
    });

    /// SEARCH POST WITH INPUT //////
    ////////////////////////////////
    $("#search").keyup(function() {
        let val = $(this).val().toLowerCase();

        $(".news-header h5").each(function() {
            let text = $(this).text().toLowerCase();
            
            if(text.indexOf(val) === -1) {
                console.log("var")
                $(this).parent().parent().parent().parent().fadeOut();
            } else {
                console.log("yox")
                $(this).parent().parent().parent().parent().fadeIn();
            }
        })
    })
});