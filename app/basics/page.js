"use client";

import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";
export default function BasicsPage() {
  return (
    <PageLayout title="Python Basics"
      subtitle="The essential building blocks every Python developer needs to master before moving on to advanced topics."
    >
      {/* Variables & Data Types */}
      <Section title="Variables & Data Types">
        <Explain>
          Python is dynamically typed — you don't need to declare a variable's type. Python infers
          it at runtime. The built-in types you'll use constantly are int, float, str, bool, and None.
        </Explain>
        <CodeBlock
          filename="variables.py"
          code={`# Integer
age = 25
year = 2026

# Float
price = 19.99
pi = 3.14159

# String
name = "Python"
greeting = 'Hello, World!'

# Boolean
is_active = True
is_deleted = False

# None (represents the absence of a value)
result = None

# Check the type of any variable
print(type(age))       # <class 'int'>
print(type(price))     # <class 'float'>
print(type(name))      # <class 'str'>
print(type(is_active)) # <class 'bool'>
print(type(result))    # <class 'NoneType'>

# Multiple assignment
x, y, z = 1, 2, 3
a = b = c = 0`}
        />
        <Callout type="info">
          Python variable names are case-sensitive: <code>name</code> and <code>Name</code> are two different variables.
          Use snake_case for variable names (PEP 8 convention).
        </Callout>
      </Section>

      {/* Operators */}
      <Section title="Operators">
        <Explain>
          Python supports arithmetic, comparison, logical, assignment, and identity operators.
          Understanding operator precedence saves hours of debugging.
        </Explain>
        <SubSection title="Arithmetic Operators">
          <CodeBlock
            code={`a, b = 10, 3

print(a + b)   # 13  — addition
print(a - b)   # 7   — subtraction
print(a * b)   # 30  — multiplication
print(a / b)   # 3.333... — true division (always float)
print(a // b)  # 3   — floor division (integer result)
print(a % b)   # 1   — modulo (remainder)
print(a ** b)  # 1000 — exponentiation (10^3)`}
          />
        </SubSection>
        <SubSection title="Comparison & Logical Operators">
          <CodeBlock
            code={`x, y = 5, 10

# Comparison — returns True or False
print(x == y)   # False
print(x != y)   # True
print(x < y)    # True
print(x >= y)   # False

# Logical — combine boolean expressions
print(x < y and x > 0)   # True  — both must be True
print(x > y or x > 0)    # True  — at least one must be True
print(not x > y)          # True  — inverts the result

# Identity operators
a = [1, 2, 3]
b = a            # same object
c = [1, 2, 3]   # different object, same value

print(a is b)    # True  — same object in memory
print(a is c)    # False — different objects
print(a == c)    # True  — same value`}
          />
        </SubSection>
      </Section>

      {/* Strings */}
      <Section title="Strings">
        <Explain>
          Strings in Python are immutable sequences of characters. Python 3.6+ introduced
          f-strings, the most readable and efficient way to format strings.
        </Explain>
        <SubSection title="F-strings (formatted string literals)">
          <CodeBlock
            code={`name = "Alice"
age = 30
score = 98.5

# f-string — embed expressions directly
greeting = f"Hello, {name}! You are {age} years old."
print(greeting)  # Hello, Alice! You are 30 years old.

# Expressions inside f-strings
print(f"Next year you'll be {age + 1}")
print(f"Score: {score:.2f}")      # 98.50 — format to 2 decimal places
print(f"Upper: {name.upper()}")   # ALICE — call methods inside
print(f"Is adult: {age >= 18}")   # Is adult: True`}
          />
        </SubSection>
        <SubSection title="Indexing & Slicing">
          <CodeBlock
            code={`text = "Python"

# Indexing (0-based, negative counts from end)
print(text[0])    # P
print(text[-1])   # n
print(text[2])    # t

# Slicing [start:stop:step]
print(text[0:3])  # Pyt  — chars 0, 1, 2
print(text[2:])   # thon — from index 2 to end
print(text[:4])   # Pyth — from start to index 3
print(text[::2])  # Pto  — every 2nd character
print(text[::-1]) # nohtyP — reversed string`}
          />
        </SubSection>
        <Callout type="info">
          Strings are immutable — you can't do <code>text[0] = "J"</code>. You must create a new string instead.
        </Callout>
      </Section>

      {/* Collections */}
      <Section title="Lists, Tuples, Sets & Dictionaries">
        <SubSection title="Lists — ordered, mutable">
          <CodeBlock
            code={`fruits = ["apple", "banana", "cherry"]

# Access
print(fruits[0])       # apple
print(fruits[-1])      # cherry

# Modify
fruits.append("mango")        # add to end
fruits.insert(1, "blueberry") # insert at index 1
fruits.remove("banana")       # remove by value
popped = fruits.pop()         # remove and return last item

print(fruits)  # ['apple', 'blueberry', 'cherry']

# Useful operations
print(len(fruits))            # 3
print("apple" in fruits)      # True
print(sorted(fruits))         # alphabetically sorted (new list)`}
          />
        </SubSection>
        <SubSection title="Tuples — ordered, immutable">
          <CodeBlock
            code={`# Tuples are like lists but cannot be changed after creation
coordinates = (40.7128, -74.0060)
rgb = (255, 128, 0)

print(coordinates[0])  # 40.7128

# Tuple unpacking — very Pythonic!
lat, lon = coordinates
print(f"Latitude: {lat}, Longitude: {lon}")

# Useful for returning multiple values from functions
def get_dimensions():
    return 1920, 1080  # returns a tuple

width, height = get_dimensions()
print(f"{width}x{height}")`}
          />
        </SubSection>
        <SubSection title="Sets — unordered, unique values">
          <CodeBlock
            code={`# Sets store only unique values
tags = {"python", "web", "backend", "python"}  # duplicate removed
print(tags)  # {'python', 'web', 'backend'}

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)  # {1, 2, 3, 4, 5, 6} — union
print(a & b)  # {3, 4}             — intersection
print(a - b)  # {1, 2}             — difference
print(a ^ b)  # {1, 2, 5, 6}       — symmetric difference

# Fast membership test
print(3 in a)  # True`}
          />
        </SubSection>
        <SubSection title="Dictionaries — key-value pairs">
          <CodeBlock
            code={`user = {
    "name": "Alice",
    "age": 30,
    "is_admin": True,
    "scores": [95, 87, 92],
}

# Access values
print(user["name"])           # Alice
print(user.get("email"))      # None (no KeyError)
print(user.get("email", "N/A"))  # N/A (default)

# Modify
user["email"] = "alice@example.com"  # add new key
user["age"] = 31                      # update existing key

# Iterate
for key, value in user.items():
    print(f"{key}: {value}")

# Dict comprehension
squares = {n: n**2 for n in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`}
          />
        </SubSection>
      </Section>

      {/* Conditionals */}
      <Section title="If / Elif / Else">
        <Explain>
          Python uses indentation (4 spaces) instead of braces to define code blocks.
          The if/elif/else structure lets you make decisions in your code.
        </Explain>
        <CodeBlock
          code={`score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score}, Grade: {grade}")  # Score: 85, Grade: B

# Ternary (one-liner conditional)
status = "pass" if score >= 60 else "fail"
print(status)  # pass

# Truthy / Falsy values
# Falsy: 0, "", [], {}, set(), None, False
# Truthy: everything else
name = ""
if not name:
    print("Name cannot be empty!")`}
        />
      </Section>

      {/* Loops */}
      <Section title="For Loops, While Loops & range()">
        <SubSection title="For loops">
          <CodeBlock
            code={`# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# enumerate() gives index + value
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# range(start, stop, step)
for i in range(0, 10, 2):   # 0, 2, 4, 6, 8
    print(i)

# Iterate over a dictionary
user = {"name": "Bob", "age": 25}
for key, value in user.items():
    print(f"{key} = {value}")`}
          />
        </SubSection>
        <SubSection title="While loops">
          <CodeBlock
            code={`# While runs as long as condition is True
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# break — exit the loop immediately
for n in range(10):
    if n == 5:
        break
    print(n)  # prints 0, 1, 2, 3, 4

# continue — skip current iteration
for n in range(10):
    if n % 2 == 0:
        continue  # skip even numbers
    print(n)  # prints 1, 3, 5, 7, 9

# for...else — else runs if loop completed without break
for n in range(5):
    if n == 10:
        break
else:
    print("Loop completed without break!")`}
          />
        </SubSection>
      </Section>

      {/* List Comprehensions */}
      <Section title="List Comprehensions">
        <Explain>
          List comprehensions are a concise, Pythonic way to create lists from iterables.
          They replace many for-loop patterns with a single readable line.
        </Explain>
        <CodeBlock
          code={`# Basic: [expression for item in iterable]
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# With condition: [expression for item in iterable if condition]
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transform strings
words = ["hello", "world", "python"]
upper_words = [w.upper() for w in words]
print(upper_words)  # ['HELLO', 'WORLD', 'PYTHON']

# Nested list comprehension (flatten a 2D list)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Dictionary comprehension
scores = {"Alice": 95, "Bob": 72, "Charlie": 88}
passed = {name: score for name, score in scores.items() if score >= 80}
print(passed)  # {'Alice': 95, 'Charlie': 88}

# Set comprehension
unique_lengths = {len(word) for word in words}
print(unique_lengths)  # {5, 6}`}
        />
        <Callout type="tip">
          List comprehensions are faster than equivalent for-loops because they&apos;re optimized at the C level in CPython.
          But keep them readable — if it needs more than one condition, use a regular loop.
        </Callout>
      </Section>
    </PageLayout>
  );
}
