import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany()
		return res.status(200).json(users)
	} catch (error) {
		return res.sendStatus(400)
	}
}

export const getUserBySessionToken = async (sessionToken: string) => {
	return await prisma.user.findFirstOrThrow({
		where: {
			authentication: {
				sessionToken,
			},
		},
	})
}
