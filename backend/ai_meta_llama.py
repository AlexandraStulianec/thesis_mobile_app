import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize Hugging Face router client
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.getenv("HF_TOKEN")  # make sure to set this in your environment
)

def generate_explanation(question, expression, user_answer, correct_answer, x_value):
     #correct_answer_str = str(correct_answer)
    user_answer_str = str(user_answer).strip()

    # Make student answer canonical for clarity in model prompt
    user_answer_display = user_answer_str
    # Normalize common variants
    if user_answer_str.lower() in ("inf", "Inf"):
        user_answer_display = "inf"
    if user_answer_str.lower() in ("-inf", "-Inf"):
        user_answer_display = "-inf"


    prompt = f"""
    You are a concise math tutor. The student attempted a limit problem. Produce a clear answer in up to 10 sentences.

    State whether the expression at the limit point is:
     - a finite limit (give numeric/symbolic result),
    - diverging to +∞ or −∞ (state clearly 'diverges to +∞' or 'diverges to −∞'),
    - or an indeterminate form (state which indeterminate form: e.g. 0/0, ∞/∞, 0·∞, ∞−∞, 0^0, 1^∞, ∞^0).

    If the expression is indeterminate, state the standard technique used to resolve it (dominant-term comparison, factoring highest powers, substitution, etc.), give the essential steps succinctly, and then the final result.

    Problem: {question}
    Expression: {expression}
    Limit point: x → {x_value}
    Student's answer: {user_answer_display}
    Correct answer: {correct_answer}

    Explain why the student's answer is incorrect if it is, identify the form (finite / infinite / indeterminate), describe the method used concisely, and give the final result. Use plain text (no LaTeX). Keep the response short and precise.
    Do not use L'Hospital's Rule or Taylor Expansion.
    """

    completion = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3-70B-Instruct:featherless-ai",
        messages=[
            {
                "role": "user", 
                "content": prompt
             }
        ],
        temperature=0.0,
        max_tokens=300,
    )

    # Keep same return type for frontend
    return completion.choices[0].message.content.strip()
