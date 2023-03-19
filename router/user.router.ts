import express from 'express'
import { getAllUsers } from '../controllers/users'
import { isAuth, isOwner } from '../src/middlewares'

export default (router: express.Router) => {
	router.get('/users', isAuth, getAllUsers)
	router.get('/users/:id', isAuth, isOwner, getAllUsers)
}
