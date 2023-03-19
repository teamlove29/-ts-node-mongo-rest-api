import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import { random, authentication } from '../src/helpers/index'

const prisma = new PrismaClient()

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400)
		}
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
			select: {
				id: true,
				authentication: true,
			},
		})

		if (user?.authentication?.salt) {
			const expectedHash = authentication(
				user.authentication.salt,
				password,
			)

			if (user.authentication.password != expectedHash) {
				return res.sendStatus(403)
			}
			const salt = random()

			const updated = await prisma.auth.update({
				where: {
					id: user.authentication.id,
				},
				data: {
					sessionToken: authentication(salt, user.id),
				},
			})

			res.cookie('ANTONIO-AUTH', updated.sessionToken, {
				domain: 'localhost',
				path: '/',
			})

			return res.status(200).json(updated).end()
		}
	} catch (error) {
		return res.sendStatus(400)
	}
}

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body

		// Validate input
		if (!email || !username || !password) {
			return res.status(400)
		}

		// Check if a user with the same email address already exists
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (existingUser) {
			return res.sendStatus(400)
		}

		const salt = random() as string
		const auth = await prisma.auth.create({
			data: {
				salt,
				password: authentication(salt, password),
			},
		})

		// Create a user record and link it to the authentication record
		const user = await prisma.user.create({
			data: {
				email,
				username,
				authId: auth.id,
			},
		})

		return res.status(200).json(user).end()
	} catch (error) {
		return res.sendStatus(400)
	}
}
