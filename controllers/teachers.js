const fs = require('fs');
const data = require('../data.json')
const { graduation, age, date } = require('../utils')
const Intl = require ('intl');
 

exports.index = function (req, res) {
    return res.render("teachers/index", {teachers: data.teachers})
 }

exports.show = function(req, res) {

    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })
        if (!foundTeacher) return res.send("Teacher not found!")

        const teacher = {
            ...foundTeacher,
            birth: age(foundTeacher.birth),
            schooling: graduation(foundTeacher.schooling),
            services: foundTeacher.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at)
        }

        return res.render("teachers/show", {teacher})
    }

exports.create = function (req, res) {
    return res.render("teachers/create")
 }

exports.post = function(req, res) {
    
        const keys = Object.keys(req.body)
    
        for (let key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields!")
            }
        }
    
        let { avatar_url, name, birth, schooling, format, services } = req.body
    
        birth = Date.parse(birth)
        const created_at = Date.now()
        const id = Number(data.teachers.length + 1)
    
        data.teachers.push({
            id,
            avatar_url,
            name,
            birth,
            schooling,
            format,
            services,
            created_at
        })
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) { 
                return res.send("Write file error!")
            }
    
                return res.redirect("/teachers")
        })
    }

exports.edit = function (req, res) {

    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })
        if (!foundTeacher) return res.send("Teacher not found!")

        const teacher = {
            ...foundTeacher,
            birth: date(foundTeacher.birth)
        }

        return res.render("teachers/edit", {teacher})
 
}

//PUT 
exports.put = function (req, res) {
    const { id } = req.body 
    let index = 0

    const update = data.teachers.find(function(teacher, foundIndex) {
        if (id == teacher.id) {
        index = foundIndex
        return true
        }
    })

        if (!update) return res.send("Teacher not found!")


        const teacher = {
            ...update,
            ...req.body, 
            id: Number(req.body.id) 
        }
        
        
        data.teachers[index] = teacher



        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) return res.send('Write file error!')

            return res.redirect(`/teachers/${id}`)
        })
    }

exports.delete = function (req, res) {
    
    const { id } = req.body

    const deleted = data.teachers.filter(function(teacher) {
        return teacher.id != id
    })

    data.teachers = deleted

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write file error!')
    })
        return res.redirect(`/teachers`)
}
