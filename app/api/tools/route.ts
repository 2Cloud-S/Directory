import { NextResponse } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { createTool } from '@/lib/firestore'

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await getAuth().verifyIdToken(token)
    const { uid } = decodedToken

    const userData = await getUser(uid)
    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const toolData = await request.json()
    const newTool = await createTool(toolData)

    return NextResponse.json(newTool, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}