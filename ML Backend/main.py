# filepath: c:\Users\Abhijeet Lahase\Downloads\Resume Analysis\ML Backend\main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from model import extract_skills_from_text
from PyPDF2 import PdfReader
import io

app = FastAPI()

@app.post("/extract-skills")
async def extract_skills(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_stream = io.BytesIO(content)
        reader = PdfReader(pdf_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        skills = extract_skills_from_text(text)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))