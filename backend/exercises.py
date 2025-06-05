import sympy as sp
import random

x = sp.symbols('x')

def construct_function(expression_type, degree_num=2, degree_den=1):
    """Generates different types of functions for limit calculations that always have integer limits."""
    
    if expression_type == "polynomial":
        # Ensure integer coefficients
        return sum(random.randint(-5, 5) * (x ** (degree_num - i)) for i in range(degree_num + 1))

    elif expression_type == "fraction":
        while True:
            numerator = sum(random.randint(-5, 5) * (x ** (degree_num - i)) for i in range(degree_num + 1))
            denominator = sum(random.randint(1, 5) * (x ** (degree_den - i)) for i in range(degree_den + 1))

            # Ensure denominator highest-degree term is nonzero
            if denominator == 0 or denominator.as_coefficients_dict().get(x ** degree_den, 0) == 0:
                denominator += x ** degree_den
            
            fraction = numerator / denominator
            limit_value = sp.limit(fraction, x, sp.oo)

            # Ensure the limit is a clean integer
            if limit_value.is_real and limit_value.is_integer:
                return fraction

    elif expression_type == "sqrt":
        base_poly = construct_function("polynomial", degree_num)
        return sp.sqrt(base_poly**2 + 1)  # Always positive

    elif expression_type == "log":
        base_poly = construct_function("polynomial", degree_num)
        return sp.log(base_poly**2 + 1) # Ensures argument > 0

    elif expression_type == "exp":
        return sp.exp(construct_function("polynomial", degree_num))

    else:
        raise ValueError("Invalid function type")

def calculate_limit(expression_type, x_value, degree_num=2, degree_den=1):
    """Calculates the limit of a function and ensures an integer result."""
    while True:
        expr = construct_function(expression_type, degree_num, degree_den)
        limit_value = sp.limit(expr, x, x_value)

        # Convert to integer if possible
        if limit_value.is_real and limit_value.is_integer:
            return sp.latex(expr), int(limit_value)  # Ensure integer return

def generate_multiple_choice(correct_answer):
    """Creates 4 multiple-choice options with 1 correct integer and 3 incorrect integers."""
    choices = [correct_answer]
    while len(choices) < 4:
        incorrect_answer = correct_answer + random.choice([-3, -2, -1, 1, 2, 3])
        if incorrect_answer not in choices:
            choices.append(incorrect_answer)

    random.shuffle(choices)
    return [str(choice) for choice in choices]

# ---- TESTING ----
# expression_type = "fraction"  # Function type
# x_value = sp.oo  # Limit at infinity
# degree_num = 2  # Degree of numerator
# degree_den = 1  # Degree of denominator

# # Calculate the limit
# expr, limit_value = calculate_limit(expression_type, x_value, degree_num, degree_den)
# print(f"Expression: {expr}")
# print(f"Limit at x = {x_value}: {limit_value}")

# # Generate multiple-choice options
# choices = generate_multiple_choice(limit_value)
# print("Multiple choice options:", choices)
