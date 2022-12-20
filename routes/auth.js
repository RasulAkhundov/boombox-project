const express = require("express");
const { check, validationResult } = require('express-validator');
const User = require("../models/user-model");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const router = express.Router();

const filterFile = function(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Wrong file type");
      error.code = "LIMIT_FILE_SIZES";
      return cb(error, false);
    }
  
    cb(null, true);
};

let maxSize = 10000000;
  
const upload = multer({
    dest: "public/upload/user-avatar/",
    filterFile,
    limits: {
        fileSize: maxSize
    }
});

router.post(
    "/register",
    [
        check("username", 'istifadəçi adınız minimum 3 işarədən ibarət olmalıdır!').isLength({ min: 3, max: 20 }),
        check("email", 'Zəhmət olmasa etibarlı bir e-poçt daxil edin!').isEmail(),
        check("password", 'Şifrəniz minimum 6 işarədən ibarət olmalıdır!').isLength({ min: 6, max: 255 })
    ],
    (req, res) => {
        const { username, email, password } = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            
            const alert = errors.array();
            if(alert.length > 0) {
                res.send({ alert: alert });
            }

        } else {
            const user = new User({
                email,
                username
            });
            user.setPassword(password);
            user
            .save()
            .then(newUser => {
                res.status(200).json({ user: newUser.generateJWT() });
            })
            .catch(err => {
                res.json({ error: err })
            });
        }
    }
);

router.post("/login", async (req, res) => {
    const { username, email, password } = req.body;

    await User.findOne({ email }).then(user => {
        if(user) {
            if(user.checkPassword(password)) {
                res.json({ user: user.generateJWT() });
            } else {
                res.send({ alert: { msg: 'Şifrə uyğun deyil!' } })
            }
        } else {
            res.send({ alert: { msg: 'e-poçt tapIlmadı!' } })
        }
    });
});

//user get
router.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
    .then(userInfo => {
        if(!userInfo) {
            console.log("error from getting user ME")
        } else {
            res.status(200).json({ userInfo });
        }
    })
})

router.put('/settings/profile-update/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { file } = req;
    const { username, bio } = req.body;

    if(file) {
        const { image } = await saveImageAndReturnUrl(file);

        user = User.findOneAndUpdate(
            { _id: id },
            { image, username, bio },
            { new: true },
            (err, usr) => {
                if(err) {
                    res.send({ settingsAlert: 'Fayl çox böyükdur!' })
                } else {
                    res.status(200).json({ user: jwt.sign({ usr }, '123456') })
                }
            }
        )
        
    } else {

        user = User.findOneAndUpdate(
            { _id: id },
            { username, bio },
            { new: true },
            (err, usr) => {
                if(err) {
                    res.send({ settingsAlert: 'Fayl çox böyükdur!' })
                } else {
                    res.status(200).json({ user: jwt.sign({ usr }, '123456') })
                }
            }
        )

    }
})

module.exports = router;

function saveImageAndReturnUrl(file, ipServer) {
    const original = `/upload/user-avatar/original/${Date.now()}_${file.originalname}`;
    const mobile = `/upload/user-avatar/mobile/${Date.now()}_${file.originalname}`;
    return new Promise(async (resolve, reject) => {
        try {
            await sharp(file.path).toFile("public" + original);
            await sharp(file.path)
            .resize(300)
            .toFile("public" + mobile);
            fs.unlink(file.path, () => {
            // save in mongo after cleaning uploads folder
            const payload = {
                image: original,
                imageXs: mobile
            };
            resolve(payload);
            });
        } catch (err) {
            if(err) {
                console.log("error")
            }
        }
    });
}