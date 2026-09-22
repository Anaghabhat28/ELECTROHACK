import psycopg

try:
    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="postgres",
        user="postgres",
        password=input("Enter your PostgreSQL password: ")
    )

    print("✅ PostgreSQL connection successful!")

    conn.close()

except Exception as e:
    print("❌ Connection failed:")
    print(e)