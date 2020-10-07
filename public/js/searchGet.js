$(document).ready(async function(){

    let href = new URL(window.location.href);
    let searchText = href.searchParams.get('q');
    let searchPage = href.searchParams.get('page');

    $(".search-text h2").text(`Axtarış nəticələri: ${searchText}`)

    let searchResult = await axios.get(`${window.development}/api/search?q=${searchText}&page=${searchPage}`).then(res => res.data.searchPagination);

    if(searchResult.length === 0) {
        $(".not-found-msg h2").text('Heç nə tapılmadı :(');
    } else {
        searchResult.map(s => {
            $(".news-col-cover").append(`
                <div class="col-12 p-0 mb-4 d-flex">
                    <div class="search-news-img" style="background-image: url(${s.image});" data-id="${s._id}">
                        <div class="news-emoji">
                            <div class="emoji-1 emoji-box">
                                <img src="/emotion-img/${s.hashtag1.toLowerCase()}.svg" class="emoji-1-img" alt="">
                            </div>
                            <div class="emoji-2 emoji-box">
                                <img src="/emotion-img/${s.hashtag2.toLowerCase()}.svg" class="emoji-2-img" alt="">
                            </div>
                        </div>
                        <div class="news-view-count d-flex align-items-center">
                            <i class="far fa-eye"></i>
                            <span>${s.pageViews}</span>
                        </div>
                    </div>
                    <div class="news-info px-3 px-sm-4" style="padding-top: 10px; padding-bottom: 10px;">
                        <div class="hashtag">
                            <a href="#" id="hashtag-1">${s.hashtag1}</a>
                            <a href="#" id="hashtag-2">${s.hashtag2}</a>
                        </div>
                        <div class="news-header">
                            <h5 id="news-header" data-id="${s._id}">${s.newsHeader}</h5>
                        </div>
                        <div class="news-description">
                            <span id="news-description">${s.newsDescription.slice(0, 100)}...</span>
                        </div>
                        <div class="news-author d-flex">
                            <div class="author-avatar">
                                <img src="${s.authorImage}" alt="">
                            </div>
                            By
                            <div class="author-name">
                                <a href="#">${s.authorName}</a>
                            </div>
                            <div class="news-date">
                                <span>${moment(`${s.date}`).locale('az').fromNow()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `)
        })
    }

    //GETTING SEARCH LENGTH RESULTS
    let searchLength = await axios.get(`${window.development}/api/search-length?q=${searchText}`).then(res => res.data.searchLength);

    ///PAGINATION LINK NUMBER
    let pageCount = Math.ceil(searchLength.length / 5);

    ///Checking page have pagination box or not;
    if(pageCount > 1) {
        $(".pagination-box").css("display", "flex");
    }
    if(searchPage > pageCount) {
        $(".pagination-box").css("display", "none");
    }
    ///checking previous btn disable
    if(searchPage > 1) {
        $(".previous-btn").removeClass('disable');
    }
    ///checking next btn disable
    if(searchPage == pageCount) {
        $(".next-btn").addClass('disable');
    }

    ///GIVING HREF TO PAGINATION BUTTONS
    $(".previous-btn-a").attr('href', `/search?q=${searchText}&page=${searchPage - 1}`);
    $(".next-btn-a").attr('href', `/search?q=${searchText}&page=${(Number(searchPage) + 1)}`);
    $(".first-number-a").attr('href', `/search?q=${searchText}&page=${searchPage - 1}`);
    $(".first-pagination-number").text(`${searchPage - 1}`);
    if(searchPage) {
        $(".second-pagination-number").text(`${searchPage}`);
        $(".third-pagination-number").text(`${Number(searchPage) + 1}`);
        $(".third-number-a").attr('href', `/search?q=${searchText}&page=${(Number(searchPage) + 1)}`);
    } else {
        $(".first-pagination-number").addClass('disable');
        $(".second-pagination-number").addClass('disable');
        $(".third-pagination-number").addClass('disable');
        $(".second-pagination-number").text(`1`);
        $(".third-pagination-number").text(`2`);
        $(".third-number-a").attr('href', `/search?q=${searchText}&page=2`);
        $(".next-btn-a").attr('href', `/search?q=${searchText}&page=2`);
    }
    if(searchPage - 1 == 0) {
        $(".first-pagination-number").addClass('disable');
        $(".second-pagination-number").addClass('disable');
        $(".third-pagination-number").addClass('disable');
    }
    if(Number(searchPage) + 1 > pageCount) {
        $(".third-pagination-number").addClass('disable');
    }

    let viewsData = {};
    //News header text link
    $(document).on('click', '.search-news-img, #news-header', async function() {
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