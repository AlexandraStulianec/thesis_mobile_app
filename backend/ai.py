import openai
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY

def generate_explanation(question, expression, user_answer, correct_answer, x_value):
    """Generates a tutoring explanation using OpenAI's GPT model for a math problem."""

    """
    Generate a short (<=10-sentence) explanation for a limit problem.
    The response should:
      - say if the form is determinate or an indeterminate form (specify which, e.g. 0/0, ∞/∞),
      - briefly outline the method used (factor highest power, compare dominant terms, L'Hôpital, substitution),
      - give the final answer and indicate whether the student's answer is correct,
      - be in plain text (no LaTeX).
    """
    
    #correct_answer_str = str(correct_answer)
    user_answer_str = str(user_answer).strip()

    # Make student answer canonical for clarity in model prompt
    user_answer_display = user_answer_str
    # Normalize common variants
    if user_answer_str.lower() in ("inf", "Inf"):
        user_answer_display = "inf"
    if user_answer_str.lower() in ("-inf", "-Inf"):
        user_answer_display = "-inf"


    # Construct structured prompt with problem details
    # prompt = f"""
    # You are a helpful math tutor. A student attempted the following limit problem but made a mistake. You accurately provide the answer in maximum 10 sentences, to the provided user responses. Provide precise and concise answer.

    # Problem: {question}
    # Expression: {expression}
    # Value at which limit is computed: x = {x_value}
    # Student's Answer: {user_answer}
    # Correct Answer: {correct_answer}

    # Give a clear explanation of why the student's answer is incorrect and provide an detailed explanation of the correct solution, considering the expression but without the latex form and the x-value.
    # """


    prompt = f"""
    You are a concise math tutor. The student attempted a limit problem. Produce a clear answer in up to 10 sentences.

    State whether the expression at the limit point is:
     - a finite limit (give numeric/symbolic result),
    - diverging to +∞ or −∞ (state clearly 'diverges to +∞' or 'diverges to −∞'),
    - or an indeterminate form (state which indeterminate form: e.g. 0/0, ∞/∞, 0·∞, ∞−∞, 0^0, 1^∞, ∞^0).

    If the expression is indeterminate, state the standard technique used to resolve it (dominant-term comparison, factoring highest powers, L'Hôpital's rule, series expansion, substitution, etc.), give the essential steps succinctly, and then the final result.

    Problem: {question}
    Expression: {expression}
    Limit point: x → {x_value}
    Student's answer: {user_answer_display}
    Correct answer: {correct_answer}

    Explain why the student's answer is incorrect if it is, identify the form (finite / infinite / indeterminate), describe the method used concisely, and give the final result. Use plain text (no LaTeX). Keep the response short and precise.
    Do not use L'Hospital's Rule or Taylor Expansion.
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
        temperature=0.0,
        max_tokens=300  # Limit response length
    )

    # Extract and return the generated text content
    return response.choices[0].message.content

