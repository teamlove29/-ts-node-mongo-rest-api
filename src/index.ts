import express, { Request, Response } from 'express'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

import router from '../router'
const prisma = new PrismaClient()

interface EnvVariables {
	DATABASE_URL: string
	SECRET_KEY: string
}

const app = express()
const env: EnvVariables = process.env as any

app.use(
	cors({
		credentials: true,
	}),
)

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(8080, () => {
	console.log('Server running on http://localhost:8080/')
})

app.use('/', router())
