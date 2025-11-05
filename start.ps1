Write-Host "🚀 Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command",
    ". .venv/Scripts/Activate.ps1; cd backend/models; uvicorn main:app --reload"

Write-Host "🚀 Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command",
    "cd rag-client; npm run dev"
