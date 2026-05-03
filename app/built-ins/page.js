"use client";

import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";

const methodChipStyles = {
    };

function MethodBadge({ children }) {
  return (
    <code
      className="inline-block px-2 py-0.5 rounded text-xs font-mono mr-1 mb-1"
      style={methodChipStyles}
    >
      {children}
    </code>
  );
}

export default function BuiltInsPage() {
  return (
    <PageLayout title="Built-in Methods"
      subtitle="Python's extensive standard library means you rarely need third-party packages for common tasks. Know these cold."
    >
      {/* String Methods */}
      <Section title="String Methods">
        <Explain>
          Strings have dozens of useful methods. Since strings are immutable, every method
          returns a new string — it never modifies the original.
        </Explain>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-1 my-3 p-4 rounded-xl border border-default"

        >
          {[".upper()", ".lower()", ".title()", ".strip()", ".lstrip()", ".rstrip()",
            ".split()", ".join()", ".replace()", ".find()", ".startswith()", ".endswith()",
            ".format()", ".count()", ".encode()", ".zfill()", ".center()", ".isdigit()"].map(m => (
            <MethodBadge key={m}>{m}</MethodBadge>
          ))}
        </motion.div>

        <CodeBlock
          filename="string_methods.py"
          code={`text = "  Hello, Python World!  "

# Case
print(text.strip().upper())      # HELLO, PYTHON WORLD!
print(text.strip().lower())      # hello, python world!
print("hello world".title())     # Hello World
print("Hello World".swapcase())  # hELLO wORLD

# Strip whitespace
print(text.strip())    # "Hello, Python World!"
print(text.lstrip())   # "Hello, Python World!  "
print(text.rstrip())   # "  Hello, Python World!"

# Split and Join
words = "apple,banana,cherry".split(",")
print(words)             # ['apple', 'banana', 'cherry']

sentence = " ".join(words)
print(sentence)          # apple banana cherry

csv_line = ",".join(["Alice", "30", "NYC"])
print(csv_line)          # Alice,30,NYC

# Search and Replace
s = "Python is great. Python is fun."
print(s.replace("Python", "JavaScript"))
# JavaScript is great. JavaScript is fun.

print(s.find("great"))   # 10 (index of 'great')
print(s.count("Python")) # 2

# Check content
print("42".isdigit())         # True
print("Hello".isalpha())      # True
print("hello".startswith("hel"))  # True
print("world.py".endswith(".py")) # True

# Padding and alignment
print("42".zfill(5))          # 00042
print("center".center(20, "-")) # -------center-------`}
        />
      </Section>

      {/* List Methods */}
      <Section title="List Methods">
        <Explain>
          Lists are Python's workhorse data structure. Their methods modify the list in-place
          (returning None), except for a few that return new values.
        </Explain>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-1 my-3 p-4 rounded-xl border border-default"

        >
          {[".append()", ".extend()", ".insert()", ".remove()", ".pop()", ".sort()",
            ".reverse()", ".index()", ".count()", ".copy()", ".clear()"].map(m => (
            <MethodBadge key={m}>{m}</MethodBadge>
          ))}
        </motion.div>

        <CodeBlock
          filename="list_methods.py"
          code={`fruits = ["apple", "banana", "cherry"]

# Add items
fruits.append("mango")           # add to end: ['apple', 'banana', 'cherry', 'mango']
fruits.extend(["kiwi", "peach"]) # add multiple: [..., 'kiwi', 'peach']
fruits.insert(1, "blueberry")    # insert at index 1

print(fruits)
# ['apple', 'blueberry', 'banana', 'cherry', 'mango', 'kiwi', 'peach']

# Remove items
fruits.remove("banana")          # remove first occurrence by value
popped = fruits.pop()            # remove & return last item → 'peach'
popped_i = fruits.pop(0)         # remove & return item at index 0 → 'apple'

# Sort and reverse (in-place)
nums = [3, 1, 4, 1, 5, 9, 2, 6]
nums.sort()                      # [1, 1, 2, 3, 4, 5, 6, 9]
nums.sort(reverse=True)          # [9, 6, 5, 4, 3, 2, 1, 1]
nums.reverse()                   # reverses in-place

# Get info
print(nums.index(5))    # first index where value is 5
print(nums.count(1))    # how many times 1 appears

# sorted() returns a NEW list (original unchanged)
original = [3, 1, 2]
new_sorted = sorted(original)
print(original)   # [3, 1, 2]    — unchanged
print(new_sorted) # [1, 2, 3]    — new list`}
        />
      </Section>

      {/* Dict Methods */}
      <Section title="Dictionary Methods">
        <Explain>
          Dictionaries are Python's hash maps. Since Python 3.7+, they maintain insertion order.
          Their methods make data manipulation clean and expressive.
        </Explain>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-1 my-3 p-4 rounded-xl border border-default"

        >
          {[".keys()", ".values()", ".items()", ".get()", ".update()", ".pop()",
            ".setdefault()", ".copy()", ".clear()", "dict()"].map(m => (
            <MethodBadge key={m}>{m}</MethodBadge>
          ))}
        </motion.div>

        <CodeBlock
          filename="dict_methods.py"
          code={`user = {"name": "Alice", "age": 30, "city": "NYC"}

# Access keys, values, items
print(list(user.keys()))    # ['name', 'age', 'city']
print(list(user.values()))  # ['Alice', 30, 'NYC']
print(list(user.items()))   # [('name', 'Alice'), ('age', 30), ('city', 'NYC')]

# Safe access with .get()
print(user.get("name"))           # Alice
print(user.get("email"))          # None (no KeyError!)
print(user.get("email", "N/A"))   # N/A (custom default)

# Update — merge another dict in
user.update({"age": 31, "country": "USA"})
print(user)  # {'name': 'Alice', 'age': 31, 'city': 'NYC', 'country': 'USA'}

# Remove a key
removed = user.pop("city")  # removes and returns the value
print(removed)  # NYC

# setdefault — only set if key doesn't exist
user.setdefault("role", "viewer")
print(user["role"])  # viewer

user.setdefault("role", "admin")  # won't overwrite
print(user["role"])  # viewer  (unchanged)

# Merge dicts (Python 3.9+)
defaults = {"debug": False, "timeout": 30}
overrides = {"debug": True}
config = defaults | overrides   # {debug: True, timeout: 30}

# Destructure a dict
name, age = user["name"], user["age"]`}
        />
      </Section>

      {/* Built-in Functions */}
      <Section title="Essential Built-in Functions">
        <SubSection title="Iteration helpers">
          <CodeBlock
            code={`# len() — length of any sequence
print(len("hello"))       # 5
print(len([1, 2, 3]))     # 3
print(len({"a": 1}))      # 1

# range() — generate a sequence of numbers
list(range(5))            # [0, 1, 2, 3, 4]
list(range(2, 10))        # [2, 3, 4, 5, 6, 7, 8, 9]
list(range(0, 20, 5))     # [0, 5, 10, 15]
list(range(10, 0, -1))    # [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

# enumerate() — get index + value
fruits = ["apple", "banana", "cherry"]
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
# 0: apple  1: banana  2: cherry

for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")  # 1. apple  2. banana  3. cherry

# zip() — pair up iterables
names = ["Alice", "Bob", "Charlie"]
scores = [92, 85, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
# Alice: 92  Bob: 85  Charlie: 78

# Create a dict from two lists
grade_dict = dict(zip(names, scores))
print(grade_dict)  # {'Alice': 92, 'Bob': 85, 'Charlie': 78}`}
          />
        </SubSection>
        <SubSection title="Aggregation functions">
          <CodeBlock
            code={`numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]

print(sum(numbers))           # 36
print(min(numbers))           # 1
print(max(numbers))           # 9
print(sorted(numbers))        # [1, 1, 2, 3, 4, 5, 5, 6, 9]
print(list(reversed(numbers)))# [5, 6, 2, 9, 5, 1, 4, 1, 3]

# any() and all()
flags = [True, False, True, True]
print(any(flags))  # True  — at least one is True
print(all(flags))  # False — not all are True

# With a condition
nums = [2, 4, 6, 8]
print(all(n % 2 == 0 for n in nums))  # True — all even
print(any(n > 5 for n in nums))       # True — at least one > 5

# abs(), round(), pow()
print(abs(-42))       # 42
print(round(3.14159, 2))  # 3.14
print(pow(2, 10))     # 1024  (same as 2**10)`}
          />
        </SubSection>
        <SubSection title="Type functions">
          <CodeBlock
            code={`# type() — get the type of a value
print(type(42))          # <class 'int'>
print(type("hello"))     # <class 'str'>
print(type([1, 2, 3]))   # <class 'list'>

# isinstance() — check type (preferred over type())
print(isinstance(42, int))         # True
print(isinstance(42, (int, float)))# True — check against tuple of types
print(isinstance("hi", str))       # True

# Type conversion
print(int("42"))          # 42
print(float("3.14"))      # 3.14
print(str(100))           # '100'
print(bool(0))            # False
print(bool("hello"))      # True
print(list("abc"))        # ['a', 'b', 'c']
print(tuple([1, 2, 3]))   # (1, 2, 3)
print(set([1, 1, 2, 2]))  # {1, 2}

# id() — memory address (object identity)
a = [1, 2, 3]
b = a         # same object
c = a.copy()  # different object, same value
print(id(a) == id(b))  # True
print(id(a) == id(c))  # False`}
          />
        </SubSection>
        <Callout type="tip">
          Python has 68 built-in functions. The ones above cover 90% of daily use.
          Run <code>dir(__builtins__)</code> in the REPL to see them all.
        </Callout>
      </Section>
    </PageLayout>
  );
}
