import express, { Request, Response, NextFunction } from 'express'
import { get, merge } from 'lodash'
import { getUserBySessionToken } from '../../controllers/users'

export const isAuth = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const sessionToken = req.cookies['ANTONIO-AUTH']

		if (!sessionToken) {
			return res.sendStatus(403)
		}

		const existingUser = await getUserBySessionToken(sessionToken)

		if (!existingUser) {
			return res.sendStatus(403)
		}

		merge(req, { identity: existingUser })

		return next()
	} catch (error) {
		return res.sendStatus(400)
	}
}

export const isOwner = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id } = req.params
		const currentUserId = get(req, 'identity.id')

		console.log('currentUserId', get(req, 'identity.id'))

		if (!currentUserId) {
			return res.sendStatus(400)
		}

		if (currentUserId !== id) {
			return res.sendStatus(403)
		}

		next()
	} catch (error) {
		console.log(error)
		return res.sendStatus(400)
	}
}
