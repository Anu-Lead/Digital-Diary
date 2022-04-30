const express = require('express');
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Memory = require('../models/Memory')

// Show Add Page
// @route GET / /memories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('memories/add')
})

// @desc Process Add Form
// @route POST / /memories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Memory.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
    res.render('error/500')
    }
})

// Show All Memories
// @route GET / /memories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const memories = await Memory.find({status: "public"})
        .populate("user")
        .sort({ createdAt: 'desc' })
        .lean()

         res.render('memories/index', {
             memories,
         })
    } catch {
        console.log(err)
        res.render('error/500')
    }
})

// Show Single Memory
// @route GET / /memories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let memory = await Memory.findById(req.params.id)
            .populate('user')
            .lean()

        if (!memory) {
            return res.render('error/404')
        }        
        res.render('memories/show', {
            memory,
        })
    } catch (err) {
        console.error(err)
         res.render('error/404')
        }
    }) 

// Show Edit Page
// @route GET / /memories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const memory = await Memory.findOne({
            _id: req.params.id
        }).lean()
    
        if(!memory) {
            return res.render("error/404")
        }
    
        if(memory.user != req.user.id) {
            res.redirect("/memories")
        } else {
            res.render("memories/edit", {
                memory,
            })
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// Show Update Memory
// @route PUT / /memories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let memory = await Memory.findById(req.params.id).lean()

        if (!memory) {
            return res.render('error/404')
        }
    
        if (memory.user != req.user.id) {
            res.redirect('/memories')
        } else { 
            memory = await Memory.findOneAndUpdate({ _id: req.params.id }, req.body, {
                    new: true,
                    runValidators: true
            })
            res.redirect('/dashboard')
            }
    } catch (error) {
        console.error(err) 
        return res.render('error/500')
}
    let memory = await Memory.findById(req.params.id).lean()

    if (!memory) {
        return res.render('error/404')
    }

    if (memory.user != req.user.id) {
        res.redirect('/memories')
    } else { 
        memory = await Memory.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
        })
        res.redirect('/dashboard')
        }
    })

// Delete Memory
// @route DELETE / /memories/delete
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Memory.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err) 
        return res.render('error/500')
    }
})

// @desc User Memories
// @route GET / /memories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const memories = await Memory.find({
            user: req.params.userId,
                status: 'public'
        })
        .populate("user")
        .lean()

        res.render('memories/index', {
            memories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router