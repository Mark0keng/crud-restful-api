const Router = require('express').Router();
const fs = require('fs');
const { request } = require('https');
const path = require('path')
const dbPath = path.join(__dirname, "../db.json")

const getAllUser = async(req, res) => {
    try {
        const data = fs.readFileSync(dbPath);
        const jsonData = JSON.parse(data)

        return res.status(200).json({data: jsonData})
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async(req, res) => {
    try {
        const data = fs.readFileSync(dbPath)
        const jsonData = JSON.parse(data)
        const targetId = req.params.id

        const response = jsonData?.user?.filter((user) => {
            return user.id === Number(targetId)
        })
        if (response.length === 0) return res.status(404).json({message: "User not found!"})

        return res.status(200).json({data: response})
    } catch (error) {
        console.log(error);
    }
}

const createUser = async(req, res) => {
    try {
        const data = fs.readFileSync(dbPath);
        const jsonData = JSON.parse(data)

        const isExist = jsonData?.user?.filter((user) => {
            console.log(user.email);
            return user.email === req.body.email
        })

        console.log(isExist);
        
        if (isExist.length === 0) return res.status(404).json({message: "Email already used!"})

        const id = jsonData.user.length;
        jsonData.user.push({
            id,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        fs.writeFileSync(dbPath, JSON.stringify(jsonData));
    
        return res.status(200).json({message: "Create user success!", data: jsonData})
    } catch (error) {
        console.log(error);
    }
}

const updateUser = async(req, res) => {
    try {
        const data = fs.readFileSync(dbPath);
        const jsonData = JSON.parse(data)
        const targetId = req.params.id

        const userData = jsonData?.user?.map((user) => {
            if(user.id === Number(targetId)) {
                return {
                    id: user.id,
                    username: req.body.username ? req.body.username : user.username,
                    email: req.body.email ? req.body.email : user.email,
                    password: req.body.password ? req.body.password : user.password,
                }
            }

            return user;
        })

        fs.writeFileSync(dbPath, JSON.stringify({user: userData}));
    
        return res.status(200).json({message: "Update user success!", data: userData})
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = async(req, res) => {
    try {
        const data = fs.readFileSync(dbPath);
        const jsonData = JSON.parse(data)
        const targetId = req.params.id

        const userData = jsonData?.user?.filter((user) => {
            return user.id !== Number(targetId)
        })

        fs.writeFileSync(dbPath, JSON.stringify({user: userData}));
    
        return res.status(200).json({message: "Delete user success!", data: userData})
    } catch (error) {
        console.log(error);
    }
}

Router.post('/create', createUser)
Router.put('/update/:id', updateUser)
Router.delete('/delete/:id', deleteUser)
Router.get('/', getAllUser)
Router.get('/:id', getUserById)

module.exports = Router;