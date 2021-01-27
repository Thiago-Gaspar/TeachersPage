const fs = require('fs');
const data = require('./data.json')
const { graduation, age, date } = require('./utils')
const Intl = require ('intl');
 

exports.show = function(req, res) {

    const { id } = req.params

    const findTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })
        if (!findTeacher) return res.send("Teacher not found!")

        const teacher = {
            ...findTeacher,
            birth: age(findTeacher.birth),
            schooling: graduation(findTeacher.schooling),
            services: findTeacher.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-BR").format(findTeacher.created_at)
        }

        return res.render("teachers/show", {teacher})
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

    const findTeacher = data.teachers.find(function(teacher) {
        return teacher.id == id
    })
        if (!findTeacher) return res.send("Teacher not found!")

        const teacher = {
            ...findTeacher,
            birth: date(findTeacher.birth)
        }

        return res.render("teachers/edit", {teacher})
 
}