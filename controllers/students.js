const fs = require('fs');
const data = require('../data.json')
const { graduation, age, date } = require('../utils')
const Intl = require ('intl');
 

exports.index = function (req, res) {
    return res.render("students/index", {students: data.students})
 }

exports.show = function(req, res) {

    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })
        if (!foundStudent) return res.send("Student not found!")

        const student = {
            ...foundStudent,
            birth: age(foundStudent.birth),
            schooling: graduation(foundStudent.schooling),
            services: foundStudent.services.split(","),
            created_at: new Intl.DateTimeFormat("pt-BR").format(foundStudent.created_at)
        }

        return res.render("students/show", {student})
    }

exports.create = function (req, res) {
    return res.render("students/create")
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
        const id = Number(data.students.length + 1)
    
        data.students.push({
            id,
            avatar_url,
            name,
            birth,
            schooling,
            format,
            services
            
        })
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) { 
                return res.send("Write file error!")
            }
    
                return res.redirect("/students")
        })
    }

exports.edit = function (req, res) {

    const { id } = req.params

    const foundStudent = data.students.find(function(student) {
        return student.id == id
    })
        if (!foundStudent) return res.send("Student not found!")

        const student = {
            ...foundStudent,
            birth: date(foundStudent.birth)
        }

        return res.render("students/edit", {student})
 
}

 
exports.put = function (req, res) {
    const { id } = req.body 
    let index = 0

    const update = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
        index = foundIndex
        return true
        }
    })

        if (!update) return res.send("Student not found!")


        const student = {
            ...update,
            ...req.body, 
            id: Number(req.body.id) 
        }
        
        
        data.students[index] = student



        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) return res.send('Write file error!')

            return res.redirect(`/students/${id}`)
        })
    }

exports.delete = function (req, res) {
    
    const { id } = req.body

    const deleted = data.students.filter(function(student) {
        return student.id != id
    })

    data.students = deleted

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write file error!')
    })
        return res.redirect(`/students`)
}
