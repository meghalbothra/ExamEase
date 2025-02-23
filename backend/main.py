import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Google Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],  # Ensures POST is allowed
    allow_headers=["*"],
)

# Request Models
class QuizRequest(BaseModel):
    topic: str
    difficulty: str

class ExplanationRequest(BaseModel):
    question: str
    answer: str

class ScoreRequest(BaseModel):
    user_answers: list

# 1️⃣ Generate Quiz
@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    print("📩 Received Request:", request.dict())  # ✅ Debugging

    prompt = (
        f"Generate 10 multiple-choice questions for {request.topic} at {request.difficulty} difficulty. "
        "Provide the response in **raw JSON format** (no markdown, no extra text) with the following structure:\n"
        "{\n"
        '  "questions": [\n'
        '    {\n'
        '      "id": "unique_question_id",\n'
        '      "question": "The actual question text?",\n'
        '      "options": ["option1", "option2", "option3", "option4"],\n'
        '      "correctAnswer": "Correct option text",\n'
        '      "explanation": "Brief explanation of the correct answer."\n'
        '    },\n'
        "    ... (repeat for 10 questions) ...\n"
        "  ]\n"
        "}"
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        print("📜 Generated Response:", response.text)  # ✅ Debugging

        # ✅ Remove Markdown formatting (if present)
        clean_json = response.text.strip().replace("```json", "").replace("```", "").strip()

        # ✅ Parse the JSON response
        quiz_data = json.loads(clean_json)

        return quiz_data  # ✅ Return structured JSON
    except json.JSONDecodeError as json_err:
        print("❌ JSON Parsing Error:", str(json_err))  # ✅ Debugging
        raise HTTPException(status_code=500, detail="Invalid JSON format from AI response.")
    except Exception as e:
        print("❌ Error:", str(e))  # ✅ Debugging
        raise HTTPException(status_code=500, detail=str(e))


# 2️⃣ Get AI Explanation
@app.post("/get-explanation")
async def get_explanation(request: ExplanationRequest):
    prompt = f"Explain the following question and answer in simple terms:\n\nQuestion: {request.question}\nAnswer: {request.answer}"

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return {"explanation": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3️⃣ Evaluate Performance
@app.post("/evaluate-score")
async def evaluate_score(request: ScoreRequest):
    prompt = f"Evaluate the user's performance based on their answers:\n{request.user_answers}\nProvide a score and feedback."

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return {"feedback": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the API with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
