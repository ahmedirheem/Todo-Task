const { json } = require('express');
const express = require('express')
const router = express.Router()
const Task = require('../models/tasks.js')

router.get('/', (req, res)=>{
    Task.find().countDocuments({}, function(err, count){
        // console.log(count);
        let maxPages = Math.ceil(count/5)
    });

    let page = req.query.page || 0
    if(page < 0) {
        page =0
    }
    let tasksPerPage = 5

    Task.find()
    .skip(page * tasksPerPage)
    .limit(tasksPerPage)
    .exec((err, tasks)=>{
        if(err){
            res.json({message: err.message})
        }else{
            res.render("index", {
                title: "Home Page",
                tasks: tasks,
                page: page,
            })
        }
    })
})

router.post('/add', (req, res)=>{
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        done: false
    })
    task.save(res.redirect("/"))
});
router.get('/completed',(req,res)=>{
    Task.find({done:true}).exec((err,tasks)=>{
        if(err){
            res.json({message:err.message});
        }
        else{
            res.render("index", {
                title: "Home Page",
                tasks: tasks,
                page:1
            })
        }
    })
})
router.get('/uncompleted',(req,res)=>{
    Task.find({done:false}).exec((err,tasks)=>{
        if(err){
            res.json({message:err.message});
        }
        else{
            res.render("index", {
                title: "Home Page",
                tasks: tasks,
                page:1
            })
        }
    })
})
router.get('/searchFilter/:title',async(req,res)=>{
    let title=req.params.title;
    let regexp = new RegExp("^"+title);
       await Task.find({title:regexp}).exec((err,tasks)=>{
            if(err){
                res.json({message:err.message});
            }
            else{
                res.render("index",{
                    title:"Home Page",
                    tasks:tasks,
                    page:1
                });
            }
        })
});
router.get('/add', (req, res)=>{
    res.render("add_user", {title: 'ToDoTask - Add Task'})
})

router.get('/update/:id', (req, res)=>{
    let id = req.params.id

    Task.findById(id, (err, task)=>{
        if(err){
            res.redirect('/')
        }else{
            if(task == null){
                res.redirect('/')
            }else{
                res.render('update_user', {
                    title: 'Update Task',
                    task: task
                })
            }
        }
    })
});


router.post('/update/:id', (req, res)=>{
    let id = req.params.id

    Task.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        done: false
    }, (err, result)=>{
        if(err){
            res.json({message: err.message})
        }else{
            res.redirect('/')
        }
    })
})
router.get('/completedCheck/:id', async (req, res)=>{
    let id = req.params.id;
    let task=await Task.findById(id);
    if(task.done){
        await task.updateOne({done:false});
        await task.save();
        console.log(task.done+"happen in if");
    }
    else{
        await task.updateOne({done:true});
        await task.save();
        console.log(task.done+"happen in else");
    }
    res.json({sucess:true});
    // Task.findByIdAndUpdate(id, {
    //     title: req.body.title,
    //     description: req.body.description,
    //     date: req.body.date,
    //     done: false
    // }, (err, result)=>{
    //     if(err){
    //         res.json({message: err.message})
    //     }else{
    //         res.redirect('/')
    //     }
    // })
})
router.get('/delete/:id', (req, res)=>{
    let id = req.params.id

    Task.findByIdAndRemove(id, (err, result)=>{
        if(err){
            res.json({message: err.message})
        }else{
            res.redirect('/')
        }
    })
})

module.exports = router