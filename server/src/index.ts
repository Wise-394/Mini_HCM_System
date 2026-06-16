import express from 'express'
import type { Request, Response } from 'express'
const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running ' })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
