from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "ELECTROHACK FastAPI is working!",
        "status": "success"
    }

@app.get("/hello/{name}")
def hello(name: str):
    return {
        "message": f"Hello, {name}!"
    }