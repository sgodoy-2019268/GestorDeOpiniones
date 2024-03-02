'use strict'

import  jwt  from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let { uid } = jwt.verify(authorization, secretKey)
        let user = await User.findOne({_id: uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid autorization'})
    }
}

export const isAdmin = async(req, res, next)=>{
    try{
        let { user } = req
        if(!user || user.role !== 'ADMIN') return res.status(403).send({message: `You dont have access | username: ${user.username}`})
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized role'})
    }
}