"use client";

import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";

export default function FunctionsPage() {
  return (
    <PageLayout title="Functions"
      subtitle="Functions are reusable blocks of code. Mastering them is the gateway to clean, maintainable Python."
    >
      {/* Defining Functions */}
      <Section title="Defining Functions">
        <Explain>
          Functions are defined with the <code>def</code> keyword, followed by a name, parentheses for
          parameters, and a colon. The body is indented. Use docstrings to document what the function does.
        </Explain>
        <CodeBlock
          filename="functions_basics.py"
          code={`def greet(name):
    """Return a greeting message for the given name."""
    return f"Hello, {name}!"

# Call the function
message = greet("Alice")
print(message)  # Hello, Alice!

# Functions without return return None implicitly
def say_hello():
    print("Hello!")

result = say_hello()  # prints "Hello!"
print(result)         # None`}
        />
      </Section>

      {/* Parameters */}
      <Section title="Parameters, Default Values, *args, **kwargs">
        <SubSection title="Default parameter values">
          <Explain>
            Parameters can have default values, making them optional when calling the function.
            Always put parameters with defaults after parameters without defaults.
          </Explain>
          <CodeBlock
            code={`def create_user(name, role="viewer", active=True):
    return {
        "name": name,
        "role": role,
        "active": active,
    }

# Various ways to call it
print(create_user("Alice"))
# {'name': 'Alice', 'role': 'viewer', 'active': True}

print(create_user("Bob", role="admin"))
# {'name': 'Bob', 'role': 'admin', 'active': True}

print(create_user("Charlie", "moderator", False))
# {'name': 'Charlie', 'role': 'moderator', 'active': False}`}
          />
        </SubSection>
        <SubSection title="*args — variable positional arguments">
          <Explain>
            <code>*args</code> collects extra positional arguments into a tuple. Use it when you
            don't know in advance how many arguments will be passed.
          </Explain>
          <CodeBlock
            code={`def total(*numbers):
    """Sum any number of values."""
    return sum(numbers)

print(total(1, 2, 3))          # 6
print(total(10, 20, 30, 40))   # 100
print(total())                  # 0

def log(level, *messages):
    for msg in messages:
        print(f"[{level.upper()}] {msg}")

log("info", "Server started", "Port 8000 open")
# [INFO] Server started
# [INFO] Port 8000 open`}
          />
        </SubSection>
        <SubSection title="**kwargs — variable keyword arguments">
          <Explain>
            <code>**kwargs</code> collects extra keyword arguments into a dictionary. This pattern
            is heavily used in Django and Flask for flexible APIs.
          </Explain>
          <CodeBlock
            code={`def display_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

display_info(name="Alice", age=30, city="NYC")
# name: Alice
# age: 30
# city: NYC

# Combine all parameter types
def full_example(required, default="world", *args, **kwargs):
    print(f"required: {required}")
    print(f"default: {default}")
    print(f"args: {args}")
    print(f"kwargs: {kwargs}")

full_example("hello", "there", 1, 2, 3, color="blue", size=10)
# required: hello
# default: there
# args: (1, 2, 3)
# kwargs: {'color': 'blue', 'size': 10}`}
          />
        </SubSection>
        <Callout type="info">
          The order must always be: positional params → *args → keyword-only params → **kwargs
        </Callout>
      </Section>

      {/* Return Values */}
      <Section title="Return Values">
        <Explain>
          Functions can return any Python object, including multiple values (as a tuple).
          Use clear, descriptive return values to make functions easy to use.
        </Explain>
        <CodeBlock
          code={`def divide(a, b):
    """Divide a by b, returning (result, error)."""
    if b == 0:
        return None, "Cannot divide by zero"
    return a / b, None

result, error = divide(10, 2)
print(result)  # 5.0
print(error)   # None

result, error = divide(10, 0)
print(result)  # None
print(error)   # Cannot divide by zero

# Early return for guard clauses
def process_age(age):
    if not isinstance(age, int):
        return "Age must be an integer"
    if age < 0:
        return "Age cannot be negative"
    if age > 150:
        return "Age seems unrealistic"
    return f"Valid age: {age}"`}
        />
      </Section>

      {/* Lambda */}
      <Section title="Lambda Functions">
        <Explain>
          Lambda functions are anonymous (nameless) single-expression functions. They are useful
          for short operations passed as arguments to other functions like <code>sort()</code>,
          <code>map()</code>, and <code>filter()</code>.
        </Explain>
        <CodeBlock
          code={`# Syntax: lambda parameters: expression
square = lambda x: x ** 2
print(square(5))  # 25

add = lambda a, b: a + b
print(add(3, 4))  # 7

# Real-world use: sorting by a custom key
students = [
    {"name": "Alice", "grade": 92},
    {"name": "Bob", "grade": 85},
    {"name": "Charlie", "grade": 97},
]

# Sort by grade (descending)
sorted_students = sorted(students, key=lambda s: s["grade"], reverse=True)
for s in sorted_students:
    print(f"{s['name']}: {s['grade']}")
# Charlie: 97
# Alice: 92
# Bob: 85

# Lambda with conditional
clamp = lambda x, lo, hi: lo if x < lo else (hi if x > hi else x)
print(clamp(5, 1, 10))   # 5
print(clamp(-5, 1, 10))  # 1
print(clamp(15, 1, 10))  # 10`}
        />
      </Section>

      {/* Scope */}
      <Section title="Scope — Local vs Global">
        <Explain>
          Python uses the LEGB rule for variable lookup: Local → Enclosing → Global → Built-in.
          Variables defined inside a function are local; they can't be accessed outside.
        </Explain>
        <CodeBlock
          code={`# Global variable
count = 0

def increment():
    global count   # declare we want the global one
    count += 1
    print(f"Inside: {count}")

increment()  # Inside: 1
increment()  # Inside: 2
print(count) # 2

# Without 'global' you'd get an UnboundLocalError
def bad_increment():
    # count += 1  # ERROR: count referenced before assignment
    local_count = 10  # this is fine — it's a new local variable
    print(local_count)

# Avoid global where possible — prefer returning values
def better_increment(n):
    return n + 1

count = better_increment(count)
print(count)  # 3`}
        />
      </Section>

      {/* Nested Functions */}
      <Section title="Nested Functions & Closures">
        <Explain>
          Functions can be defined inside other functions. The inner function has access to the
          outer function's variables — this is called a closure. Closures are the foundation of decorators.
        </Explain>
        <CodeBlock
          code={`def make_multiplier(factor):
    """Returns a function that multiplies by factor."""
    def multiply(number):
        return number * factor  # 'factor' is captured from outer scope
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))   # 10
print(triple(5))   # 15

# The closure 'remembers' the value of factor
print(double.__closure__[0].cell_contents)  # 2

# Practical example: make a counter
def make_counter(start=0):
    count = [start]  # use list to allow mutation in closure
    def counter():
        count[0] += 1
        return count[0]
    return counter

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3`}
        />
      </Section>

      {/* Higher-order Functions */}
      <Section title="Higher-Order Functions: map, filter, reduce">
        <Explain>
          A higher-order function takes a function as an argument or returns one.
          Python's <code>map()</code>, <code>filter()</code>, and <code>functools.reduce()</code>
          are classic examples — though list comprehensions are often preferred for readability.
        </Explain>
        <CodeBlock
          code={`from functools import reduce

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map() — apply a function to every item
squared = list(map(lambda x: x**2, numbers))
print(squared)
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# filter() — keep items where function returns True
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# reduce() — collapse list to a single value
total = reduce(lambda acc, x: acc + x, numbers)
print(total)  # 55  (1+2+3+...+10)

product = reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5])
print(product)  # 120  (5!)

# Equivalent with comprehensions (more Pythonic)
squared_comp = [x**2 for x in numbers]
evens_comp = [x for x in numbers if x % 2 == 0]
total_builtin = sum(numbers)  # use sum() instead of reduce`}
        />
        <Callout type="tip">
          In Python, prefer list comprehensions over <code>map()</code>/<code>filter()</code> for readability.
          Use <code>map()</code> when working with large iterables where lazy evaluation matters.
        </Callout>
      </Section>
    </PageLayout>
  );
}
