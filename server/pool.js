import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})

const pool = new pg.Pool({
    host:process.env.db_host,
    user:process.env.db_user,
    port:process.env.db_port,
    password:process.env.db_password,
    database:process.env.db_database
})


pool.connect()
.then(()=> console.log("Connected to database")
)
.catch((err)=>console.log(`${err} Not able to connect with databse`)
)

export  {pool};