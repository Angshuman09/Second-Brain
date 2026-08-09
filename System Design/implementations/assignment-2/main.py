import time
import redis
import mysql.connector


redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

mysql_conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="angshuhere",
    database="cache_test"
)

cursor = mysql_conn.cursor()

start = time.perf_counter()

for _ in range(1000):
    redis_client.get("user:1")

redis_time = time.perf_counter() - start


start = time.perf_counter()

for _ in range(1000):
    cursor.execute(
        "SELECT name FROM users WHERE id = 1"
    )
    cursor.fetchone()

mysql_time = time.perf_counter() - start


print(f"Redis: {redis_time:.6f} seconds")
print(f"MySQL: {mysql_time:.6f} seconds")

print(
    f"MySQL is {mysql_time / redis_time:.2f}x slower"
)