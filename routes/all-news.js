const express = require("express");
const AllNews = require("../models/all-news");
const sharp = require("sharp");
const flash = require('connect-flash');
const { db } = require("../models/all-news");
const fs = require("fs");

const router = express.Router();

router.post("/post-all-news", (req, res) => {
    const { mainContentName, image, newsHeader, newsDescription, newsIframe, hashtag1, hashtag2, authorId, authorImage, authorName, authorBio, date } = req.body;

    let parts = image.split(";");
    let mimType = parts[0].split(":")[1];
    let imageData = parts[1].split(",")[1];
    const img = new Buffer.from(imageData, "base64");

    let ext = mimType.includes('jpeg')
    ? mimType.slice('6', '10')
    : mimType.slice('6', '9');

    const imageName = `allNewsImage-${Date.now()}`;

    sharp(img)
    .toFile(process.cwd() + `/public/upload/all-news-image/${imageName}.${ext}`)
    .then(data => {
        let allNews = new AllNews({
            mainContentName,
            image: `/upload/all-news-image/${imageName}.${ext}`,
            newsHeader,
            newsDescription,
            newsIframe,
            hashtag1,
            hashtag2,
            authorId,
            authorImage,
            authorName,
            authorBio,
            date,
        });
        allNews
        .save()
        .then(a => {
            res.status(200).json({
                allNews: a
            });
        })
    })
    .catch(err => {
        if(err) {
            console.log("err");
        } else {
            console.log("errorsuz");
        }
    })
});

//POST COMMENT
router.post('/do-comment', (req, res) => {
    const { id, commentName, commentImage, commentText, commentDate } = req.body;
    
    AllNews.findOneAndUpdate(
    { _id: id },
    { $push: { comments: { commentName: commentName, commentImage: commentImage, commentText: commentText, commentDate: commentDate } } },
    (err, fullNews) => {
        if(err) {
            console.log("error from post comment");
        } else {
            res.status(200).json({ fullNews });
        }
    });
});

//POST LIKE
router.post('/do-like', (req, res) => {
    const { id, user } = req.body;

    AllNews.findByIdAndUpdate(
        { _id: id },
        { $push: { like: { user: user } } },
        (err, like) => {
            if(err) {
                console.log("error from do like")
            } else {
                res.status(200).json({ like });
            }
        }
    )
})

//POST DISLIKE
router.post('/do-dislike', (req, res) => {
    const { id, user } = req.body;

    AllNews.findByIdAndUpdate(
        { _id: id },
        { $push: { dislike: { user: user } } },
        (err, dislike) => {
            if(err) {
                console.log("error from do dislike")
            } else {
                res.status(200).json({ dislike });
            }
        }
    )
})

//GET FULL NEWS
router.get("/news/:id", (req, res) => {
    AllNews.findById(req.params.id)
    .then(fullNews => {
        if(!fullNews) {
            res.send({ error: 'have an error' });
        } else {
            res.status(200).json({ fullNews });
        }
    })
    .catch(err => console.log("error from full news api"));
});

///ALL NEWS GET FUNCTION
router.get("/get-all-news", (req, res) => {

    let l = parseInt(req.query.limit);

    AllNews.find()
    .sort({ _id: -1 })
    .limit(l)
    .then(allNews => {
        if(!allNews) {
            console.log("error from get all news length")
        } else {
            res.status(200).json({ allNews });
        }
    })
});

///TECHNO NEWS GET FUNCTION
router.get("/get-techno-news", (req, res) => {

    let l = parseInt(req.query.limit);

    AllNews.find({ mainContentName: 'techno' })
    .limit(l)
    .sort({ _id: -1})
    .then(allNews => {
        if(!allNews) {
            console.log("error from techno news api")
        } else {
            res.status(200).json({ allNews });
        }
    })
});

///GAME NEWS GET FUNCTION
router.get("/get-game-news", (req, res) => {

    let l = parseInt(req.query.limit);

    AllNews.find({ mainContentName: 'game' })
    .limit(l)
    .sort({ _id: -1})
    .then(allNews => {
        if(!allNews) {
            console.log("error from game news api")
        } else {
            res.status(200).json({ allNews });
        }
    })
});

///TREND NEWS GET FUNCTION
router.get("/get-trend-news", (req, res) => {

    let l = parseInt(req.query.limit);

    AllNews.find({ mainContentName: 'trend' })
    .limit(l)
    .sort({ _id: -1})
    .then(allNews => {
        if(!allNews) {
            console.log("error from trend news api")
        } else {
            res.status(200).json({ allNews });
        }
    })
});

//RIGHT TREND NEWS GETTING
router.get("/right-trend", (req, res) => {
    AllNews.find()
    .sort({ pageViews: -1 })
    .limit(5)
    .then(rightTrend => {
        if(!rightTrend) {
            console.log("error from right trend")
        } else {
            res.status(200).json({ rightTrend });
        }
    })
})

///GETTING PREVIOUS DATA OF ONE NEWS
router.get('/previous/:id', (req, res) => {
    AllNews.find({ _id: { $lt: req.params.id }})
    .sort({ _id: -1 })
    .limit(1)
    .then(previousPost => {
        if(!previousPost) {
            console.log('error from previous post')
        } else {
            res.status(200).json({ previousPost });
        }
    })
    .catch(err => console.log('error from previous post'));
})

///GETTING NEXT DATA OF ONE NEWS
router.get('/next/:id', (req, res) => {
    AllNews.find({ _id: { $gt: req.params.id }})
    .sort({ _id: 1 })
    .limit(1)
    .then(nextPost => {
        if(!nextPost) {
            console.log('error from next post')
        } else {
            res.status(200).json({ nextPost });
        }
    })
    .catch(err => console.log('error from next post'));
})

//NEWS DELETE
router.delete("/delete-news/:id", (req, res) => {
    const { id } = req.params;
    const { image } = req.body;
    console.log(image);
    AllNews.findByIdAndDelete({ _id: id }, err => {
        if(err) {
            console.log("error from deleted news")
        } else {
            res.status(200).json({ deleted: true });
        }
    });
});

//EDIT NEWS
router.put("/edit-news/:id", (req, res) => {
    const { id } = req.params;
    const { newsHeader, newsDescription, hashtag1, hashtag2 } = req.body;

    AllNews.findOneAndUpdate(
        { _id: id },
        { $set: { newsHeader, newsDescription, hashtag1, hashtag2 } },
        { new: true },
        ( err, data ) => {
            if(err) {
                console.log("error from editing news api")
            } else {
                res.status(200).json({ updated: true });
            }
        }
    )
})

//UPDATING PAGE VIEWS
router.put("/update-page-views/:id", (req, res) => {
    const { pageViews } = req.body;
    const { id } = req.params;

    AllNews.findOneAndUpdate(
        { _id: id },
        { $set: { pageViews } },
        { new: true },
        (err, data) => {
            if(err) {
                console.log('error from editing page views')
            } else {
                res.status(200).json({ updated: true });
            }
        }
    )
});

/// MORE FROM HASHTAG /////
router.get('/more-from/:hashtag1', (req, res) => {
    AllNews.find({
        $or: [
            { hashtag1: req.params.hashtag1 },
            { hashtag2: req.params.hashtag1 }
        ]
    })
    .limit(3)
    .then(moreFrom => {
        if(!moreFrom) {
            console.log("error from more From");
        } else {
            res.status(200).json({ moreFrom });
        }
    })
})

///CATEGORY FILTERING 
router.get('/category', (req, res) => {

    let order = req.query.order;
    let h = req.query.h;

    if(order) {
        if(order === "en-cox-baxilan") {
            AllNews.find({
                $or: [
                    { hashtag1: h },
                    { hashtag2: h }
                ]
            })
            .sort({ pageViews: -1 })
            .then(categoryOrder => {
                if(!categoryOrder) {
                    console.log("error from category hashtag");
                } else {
                    res.status(200).json({ categoryOrder });
                }
            })
        } else if(order === "en-yeni") {
            AllNews.find({
                $or: [
                    { hashtag1: h },
                    { hashtag2: h }
                ]
            })
            .sort({ _id: -1 })
            .then(categoryOrder => {
                if(!categoryOrder) {
                    console.log("error from category hashtag");
                } else {
                    res.status(200).json({ categoryOrder });
                }
            })
        } else if(order === "en-kohne") {
            AllNews.find({
                $or: [
                    { hashtag1: h },
                    { hashtag2: h }
                ]
            })
            .sort({ _id: 1 })
            .then(categoryOrder => {
                if(!categoryOrder) {
                    console.log("error from category hashtag");
                } else {
                    res.status(200).json({ categoryOrder });
                }
            })
        } else if(order === "xususi") {
            AllNews.find({
                $or: [
                    { hashtag1: h },
                    { hashtag2: h }
                ]
            })
            .sort({ pageViews: -1 })
            .limit(10)
            .then(categoryOrder => {
                if(!categoryOrder) {
                    console.log("error from category hashtag");
                } else {
                    res.status(200).json({ categoryOrder });
                }
            })
        }
    } else {
        AllNews.find({
            $or: [
                { hashtag1: h },
                { hashtag2: h }
            ]
        })
        .sort({ _id: -1 })
        .then(categoryOrder => {
            if(!categoryOrder) {
                console.log("error from category hashtag");
            } else {
                res.status(200).json({ categoryOrder });
            }
        })
    }
});

///////////////////////////////
///////////SEARCH/////////////
/////////////////////////////
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", (req, res) => {
    ////////////////////////////////
    ////// SEARCH PAGINATION //////
    //////////////////////////////
    if(req.query.page) {
        let page = req.query.page;
        let postPerPage = 5;
        const regex = new RegExp(escapeRegex(req.query.q), 'ig');

        AllNews.find({ "newsHeader": regex })
        .sort({ _id: -1 })
        .skip((postPerPage * page) - postPerPage)
        .limit(postPerPage)
        .then(searchPagination => {
            if(!searchPagination) {
                console.log("error from search Pagination");
            } else {
                res.status(200).json({ searchPagination });
            }
        })
    } else {
        const regex = new RegExp(escapeRegex(req.query.q), 'ig');
        AllNews.find({ "newsHeader": regex })
        .sort({ _id: -1 })
        .limit(5)
        .then(searchPagination => {
            if(!searchPagination) {
                console.log("error from news search")
            } else {
                res.status(200).json({ searchPagination });
            }
        })
    }
});
//Getting Search News Length
router.get('/search-length', (req, res) => {
    const regex = new RegExp(escapeRegex(req.query.q), 'ig');
    AllNews.find({ "newsHeader": regex })
    .sort({ _id: -1 })
    .then(searchLength => {
        if(!searchLength) {
            console.log("error from news search")
        } else {
            res.status(200).json({ searchLength });
        }
    })
})
 
module.exports = router;