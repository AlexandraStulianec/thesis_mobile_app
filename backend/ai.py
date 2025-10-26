import openai
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY

def generate_explanation(question, expression, user_answer, correct_answer, x_value):
    """Generates a tutoring explanation using OpenAI's GPT model for a math problem."""

    # Construct structured prompt with problem details
    prompt = f"""
    You are a helpful math tutor. A student attempted the following limit problem but made a mistake. You accurately provide the answer in maximum 10 sentences, to the provided user responses. Provide precise and concise answer.

    Problem: {question}
    Expression: {expression}
    Value at which limit is computed: x = {x_value}
    Student's Answer: {user_answer}
    Correct Answer: {correct_answer}

    Give a clear explanation of why the student's answer is incorrect and provide an detailed explanation of the correct solution, considering the expression but without the latex form and the x-value.
    """

    # Call OpenAI API with configured parameters
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
             "role": "user", 
             "content": prompt
            }
        ],
        temperature=0.0, # Rational response
        max_tokens=300  # Limit response length
    )

    # Extract and return the generated text content
    return response.choices[0].message.content

