const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

router.get('/posts', auth, async (req, res) => {

    const posts= await Post.find({approved:false}).sort({date: 1});

    res.json(posts);

});

router.get('/users', auth, async (req,res) => {

    const users = await User.find({approved:false}).sort({date: 1});
    const profiles = await Profile.find({user: {$in: users}}).populate('user',['name','branch','year','email']);
    res.json(profiles);

});

router.get('/approve/post/:id', auth, async (req, res) => {

    const post = await Post.findOne({_id:req.params.id});

    post.approved = true;

    await post.save();

    res.json(post);
});

router.get('/approve/user/:id', auth, async (req, res) => {

    const user = await User.findOne({_id:req.params.id});

    user.approved = true;

    await user.save();

    res.json(user);
});

router.get('/reject/user/:id', auth, async (req, res) => {

    const profile = await Profile.findOne({_id: req.params.id});

    await Profile.findOneAndRemove({_id: profile._id})
    await User.findOneAndRemove({_id: profile.user._id})

    res.json(profile);
});

router.delete('/user/:id', auth, async (req, res) => {

    const profile = await Profile.findOne({_id: req.params.id})

    if(profile){
        await Profile.findOneAndRemove({_id: profile._id})
    }

    await User.findOneAndRemove({_id: profile.user});

})

router.post('/po/eligible', auth, async (req, res) => {

    const {dept, year, pointer, backlogs, companyName} = req.body;
    let users = []
    
    if(year!="" && dept!=""){
        users = await User.find({branch:dept, year:year})
    }
    else if(dept!=""){
        users = await User.find({branch:dept});
    }else if(year!=""){
        users = await User.find({year:year})
    }else{
        users = await User.find();
    }
    
    const eligibile = await Profile.find({ user: {$in: users}, "status.0.cgpa": {$gte: pointer}, "status.0.backlogs":{$lte: backlogs}}).populate('user',['name','branch','year','email']);
    res.json(eligibile);
})
module.exports = router;