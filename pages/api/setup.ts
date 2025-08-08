import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { query } from '../../lib/db'
import dotenv from 'dotenv'
dotenv.config()

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(process.env.ALLOW_SETUP !== 'true') return res.status(403).json({error:'Setup disabled'})
  try {
    const { email, password, name } = req.body || { email: 'admin@panel.pl', password: 'Admin123!', name: 'Administrator' }
    const hash = await bcrypt.hash(password, 10)
    // create admin if not exists
    await query('INSERT INTO users (email, password_hash, role, name) SELECT $1,$2,$3,$4 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email=$1)', [email, hash, 'admin', name])
    // create sources
    await query("INSERT INTO sources (name) SELECT 'Get-e' WHERE NOT EXISTS (SELECT 1 FROM sources WHERE name='Get-e')")
    await query("INSERT INTO sources (name) SELECT 'ElifeLimo' WHERE NOT EXISTS (SELECT 1 FROM sources WHERE name='ElifeLimo')")
    await query("INSERT INTO sources (name) SELECT 'Gr8way' WHERE NOT EXISTS (SELECT 1 FROM sources WHERE name='Gr8way')")
    res.json({ok:true, admin:{email}})
  } catch(err:any){
    res.status(500).json({error: err.message})
  }
}
