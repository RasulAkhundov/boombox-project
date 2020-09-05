$(document).ready(function(e) {

    $(window).keydown(function(e) {
        let searchVal = $("#header-search").val().toLowerCase();
        if(e.keyCode === 13 && searchVal !== "") {
            window.location.href = `/search?q=${searchVal}`;
        }
    })

    $("#header-search-btn").click(() => {

        let searchVal = $("#header-search").val().toLowerCase();

        if(searchVal !== "") {
            window.location.href = `/search?q=${searchVal}`;
        }        
    });

});
