import os
import json
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from google import genai

# -------------------------
# Load Environment Variables
# -------------------------
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found!")

client = genai.Client(api_key=GOOGLE_API_KEY)

MODEL_NAME = "gemini-2.5-flash-lite"

session_context = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Request Models
# -------------------------

class QuizRequest(BaseModel):
    topic: str
    difficulty: str


class ExplanationRequest(BaseModel):
    question: str
    answer: str


class ScoreRequest(BaseModel):
    user_answers: list


class StudyHelpRequest(BaseModel):
    message: str


# -------------------------
# Helper
# -------------------------

def generate_text(prompt: str) -> str:
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    return response.text


# -------------------------
# Generate Quiz
# -------------------------

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):

    prompt = f"""
Generate exactly 10 multiple choice questions on "{request.topic}" at "{request.difficulty}" difficulty.

Return ONLY valid JSON.

Format:

{{
  "questions":[
    {{
      "id":"1",
      "question":"Question",
      "options":[
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer":"Option A",
      "explanation":"Explanation"
    }}
  ]
}}

Do not include markdown.
Do not include ```json.
Return only JSON.
"""

    try:

        text = generate_text(prompt)

        clean = (
            text.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(clean)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# Summary Insights
# -------------------------

@app.post("/summary-insights")
async def summary_insights(request: StudyHelpRequest):

    prompt = f"""
You are a quiz evaluator.

Student performance:

{request.message}

Briefly mention:

- strengths
- weaknesses
- improvement tips

Keep response short.
"""

    try:

        return {
            "help": generate_text(prompt).strip()
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# Study Help
# -------------------------

@app.post("/study-help")
async def study_help(request: StudyHelpRequest):

    prompt = f"""
Student asks:

{request.message}

Give a concise explanation.

No markdown.
"""

    try:

        return {
            "help": generate_text(prompt).strip()
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# AI Tutor
# -------------------------

@app.post("/ai-tutor")
async def ai_tutor(request: StudyHelpRequest):

    prompt = f"""
Student input:

{request.message}

Create a concise study plan with:

- strengths
- weaknesses
- priority topics
- study strategy

No markdown.
"""

    try:

        return {
            "help": generate_text(prompt).strip()
        }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# Run
# -------------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)