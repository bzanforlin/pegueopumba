import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent / "app"))

from app.main import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
