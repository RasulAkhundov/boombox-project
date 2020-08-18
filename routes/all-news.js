const express = require("express");
const AllNews = require("../models/all-news");
const sharp = require("sharp");
const flash = require('connect-flash');
const { db } = require("../models/all-news");
const fs = require("fs");

const router = express.Router();

router.post("/post-all-news", (req, res) => {
    const { mainContentName, image, newsHeader, newsDescription, hashtag1, hashtag2, authorImage, authorName, date } = req.body;

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
            hashtag1,
            hashtag2,
            authorImage,
            authorName,
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
            req.flash('newsSuccessMsg', 'Xeber ugurla yaradildi!');
            console.log(req.flash() + "err");
        } else {
            console.log(req.flash() + "errorsuz");
            req.flash('news-error-msg', 'Xeber yaradilarken xeta bas verdi!');
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

//GET FULL NEWS
router.get("/news/:id", (req, res) => {
    AllNews.findById(req.params.id)
    .then(fullNews => {
        if(!fullNews) {
            console.log("error from full news api")
        } else {
            res.status(200).json({ fullNews });
        }
    })
    .catch(err => console.log("error from full news api"));
});

///ALL NEWS GET FUNCTION
router.get("/all-news", (req, res) => {
    AllNews.find()
    .sort({ date: -1 })
    .then(allNews => {
        if(!allNews) {
            console.log("error from get all news length")
        } else {
            res.status(200).json({ allNews });
        }
    })
});
router.get("/get-all-news", (req, res) => {
    AllNews.find()
    .sort({ date: -1 })
    .limit(5)
    .then(allNews => {
        if(!allNews) {
            console.log("error from get all news")
        } else {
            res.status(200).json({ allNews });
        }
    })
});

///TECHNO NEWS GET FUNCTION
router.get("/get-techno-news", (req, res) => {
    AllNews.find({ mainContentName: 'techno' })
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
    AllNews.find({ mainContentName: 'game' })
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
    AllNews.find({ mainContentName: 'trend' })
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
    AllNews.findByIdAndDelete({ _id: id }, err => {
        if(err) {
            console.log("error from deleted news")
        } else {
            res.status(200).json({ deleted: true });
        }
    });
});

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
router.get('/category-:hashtag1', (req, res) => {

    let order = req.query.order;

    if(order === "most-viewed") {
        AllNews.find({
            $or: [
                { hashtag1: req.params.hashtag1 },
                { hashtag2: req.params.hashtag1 }
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
    } else if(order === "new") {
        AllNews.find({
            $or: [
                { hashtag1: req.params.hashtag1 },
                { hashtag2: req.params.hashtag1 }
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
    } else if(order === "old") {
        AllNews.find({
            $or: [
                { hashtag1: req.params.hashtag1 },
                { hashtag2: req.params.hashtag1 }
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
    } else if(order === "featured") {
        AllNews.find({
            $or: [
                { hashtag1: req.params.hashtag1 },
                { hashtag2: req.params.hashtag1 }
            ]
        })
        .sort({ pageViews: -1 })
        .limit(3)
        .then(categoryOrder => {
            if(!categoryOrder) {
                console.log("error from category hashtag");
            } else {
                res.status(200).json({ categoryOrder });
            }
        })
    }
});

////////////////////////////////
////// NEWS PAGINATION ////////
//////////////////////////////
router.get('/news', (req, res) => {
    let page = req.query.page;
    let limit = 5;

    AllNews.find()
    .limit(page * limit)
    .sort({ date: -1 })
    .then(newsPagination => {
        if(!newsPagination) {
            console.log("error from news pagination");
        } else {
            res.status(200).json({ newsPagination });
        }
    })
})
 
module.exports = router;