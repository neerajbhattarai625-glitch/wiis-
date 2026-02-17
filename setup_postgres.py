import asyncio
import asyncpg
import os

# Default Config
DB_USER = "user"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "waste_management"

async def setup_db():
    print(f"Connecting to PostgreSQL as {DB_USER}...")
    try:
        # Connect to 'postgres' db to create new db
        conn = await asyncpg.connect(
            user=DB_USER, 
            password=DB_PASSWORD, 
            host=DB_HOST, 
            port=DB_PORT, 
            database='postgres'
        )
        
        # Check if db exists
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", 
            DB_NAME
        )
        
        if not exists:
            print(f"Database '{DB_NAME}' not found. Creating...")
            await conn.execute(f'CREATE DATABASE "{DB_NAME}"')
            print(f"Database '{DB_NAME}' created successfully!")
        else:
            print(f"Database '{DB_NAME}' already exists.")
            
        await conn.close()
        return True
        
    except Exception as e:
        print(f"Error setting up database: {e}")
        print("Please ensure PostgreSQL is running and credentials are correct.")
        return False

if __name__ == "__main__":
    asyncio.run(setup_db())
