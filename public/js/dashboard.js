$(document).ready(async function() {

    /////////////////////////
    //// NEWS PAGINATION ///
    ///////////////////////
    let newsLimit = 10;
    let getAllNews = await axios
    .get(`${window.development}/api/get-all-news?limit=${newsLimit}`)
    .then(res => res.data.allNews);

    //GETTING ALL NEWS LENGTH
    let allNews = await axios.get(`${window.development}/api/get-all-news`).then(res => res.data.allNews);

    //DISPLAY NONE SEE MORE BUTTON
    if(allNews.length <= newsLimit ) {
        $("#load-more-btn").css("display", "none");
    }

    getAllNews.map(a => {
        return newsReturn(a);
    });

    ///SEE MORE NEWS FUNCTION
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
            
            await axios.get(`${window.development}/api/get-all-news?limit=${newsLimit}`).then(res =>{
                res.data.allNews.map(a => {
                    return newsReturn(a);
                })
            })
        }, 3000)
    });

    function newsReturn(a) {
        $("#news-wrapper").append(`
            <div class="col-12 mb-4 p-0 d-flex flex-column flex-sm-row news-box" style="background: #1D1E29;">
                <div class="col-12 col-sm-6 p-0 news-img-box" style="background: #1D1E29; height: 200px;">
                    <img src="${a.image}" data-id="${a._id}" alt="">
                    <div class="news-emoji">
                        <div class="emoji-1 emoji-box">
                            <img src="/emotion-img/${a.hashtag1.toLowerCase()}.svg" class="emoji-1-img" alt="">
                        </div>
                        <div class="emoji-2 emoji-box">
                            <img src="/emotion-img/${a.hashtag2.toLowerCase()}.svg" class="emoji-2-img" alt="">
                        </div>
                    </div>
                    <div class="news-view-count d-flex align-items-center">
                        <i class="far fa-eye"></i>
                        <span>${a.pageViews}</span>
                    </div>
                </div>
                <div class="col-12 col-sm-6 py-3 px-4" style="background: #1D1E29;">
                    <div class="hashtag">
                        <a href="#" id="hashtag-1">${a.hashtag1}</a>
                        <a href="#" id="hashtag-2">${a.hashtag2}</a>
                    </div>
                    <div class="news-header">
                        <h5 id="news-header" data-id="${a._id}">${a.newsHeader}</h5>
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
    });

    //MAIN TREND APPENDING
    let mainTrend1 = getAllNews[0];
    let mainTrend2 = getAllNews[1];
    let mainTrend3 = getAllNews[2];
    let mainTrend4 = getAllNews[3];
    let mainTrend5 = getAllNews[4];

    //First trend
    $('.trend-1 .emoji-1-img').attr('src', `/emotion-img/${mainTrend1.hashtag1.toLowerCase()}.svg`);
    $('.trend-1 .emoji-2-img').attr('src', `/emotion-img/${mainTrend1.hashtag2.toLowerCase()}.svg`);
    $(".trend-1").attr('data-id', `${mainTrend1._id}`);
    $(".trend-1").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend1.image})`);
    $("#trend-1-header").text(mainTrend1.newsHeader);
    $("#trend-1-author").text(mainTrend1.authorName);
    $("#trend-1-views").text(mainTrend1.pageViews);
    //Second trend
    $('.trend-2 .emoji-1-img').attr('src', `/emotion-img/${mainTrend2.hashtag1.toLowerCase()}.svg`);
    $('.trend-2 .emoji-2-img').attr('src', `/emotion-img/${mainTrend2.hashtag2.toLowerCase()}.svg`);
    $(".trend-2").attr('data-id', `${mainTrend2._id}`);
    $(".trend-2").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend2.image})`);
    $("#trend-2-header").text(mainTrend2.newsHeader);
    $("#trend-2-author").text(mainTrend2.authorName);
    $("#trend-2-views").text(mainTrend2.pageViews);
    //Third trend
    $('.trend-3 .emoji-1-img').attr('src', `/emotion-img/${mainTrend3.hashtag1.toLowerCase()}.svg`);
    $('.trend-3 .emoji-2-img').attr('src', `/emotion-img/${mainTrend3.hashtag2.toLowerCase()}.svg`);
    $(".trend-3").attr('data-id', `${mainTrend3._id}`);
    $(".trend-3").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend3.image})`);
    $("#trend-3-header").text(mainTrend3.newsHeader);
    $("#trend-3-author").text(mainTrend3.authorName);
    $("#trend-3-views").text(mainTrend3.pageViews);
    //Fourt trend
    $('.trend-4 .emoji-1-img').attr('src', `/emotion-img/${mainTrend4.hashtag1.toLowerCase()}.svg`);
    $('.trend-4 .emoji-2-img').attr('src', `/emotion-img/${mainTrend4.hashtag2.toLowerCase()}.svg`);
    $(".trend-4").attr('data-id', `${mainTrend4._id}`);
    $(".trend-4").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend4.image})`);
    $("#trend-4-header").text(mainTrend4.newsHeader);
    $("#trend-4-author").text(mainTrend4.authorName);
    $("#trend-4-views").text(mainTrend4.pageViews);
    //Fifth trend
    $('.trend-5 .emoji-1-img, .trend-1-5 .emoji-1-img').attr('src', `/emotion-img/${mainTrend5.hashtag1.toLowerCase()}.svg`);
    $('.trend-5 .emoji-2-img, .trend-1-5 .emoji-2-img').attr('src', `/emotion-img/${mainTrend5.hashtag2.toLowerCase()}.svg`);
    $(".trend-5, .trend-1-5").attr('data-id', `${mainTrend5._id}`);
    $(".trend-5, .trend-1-5").attr('style', `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${mainTrend5.image})`);
    $("#trend-5-header, #trend-1-5-header").text(mainTrend5.newsHeader);
    $("#trend-5-author, #trend-1-5-author").text(mainTrend5.authorName);
    $("#trend-5-views, #trend-1-5-views").text(mainTrend5.pageViews);

    //Main trend link
    let viewsData = {}
    $(".trend").click(async function() {
        let id = $(this).data('id');
        pageViewsCounter(id);
    });
    //News header text link
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