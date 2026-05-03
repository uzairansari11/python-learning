"use client";

import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";

export default function FileHandlingPage() {
  return (
    <PageLayout title="File Handling"
      subtitle="Reading, writing, and managing files is essential for any real application. Python makes it clean and safe with context managers."
    >
      {/* open() and file modes */}
      <Section title="open() and File Modes">
        <Explain>
          The built-in <code>open()</code> function opens a file and returns a file object.
          The mode argument determines what you can do with the file.
        </Explain>
        <CodeBlock
          filename="file_modes.py"
          code={`# File modes:
# "r"  — read (default). File must exist.
# "w"  — write. Creates new or OVERWRITES existing file.
# "a"  — append. Creates new or adds to end of existing file.
# "x"  — exclusive create. Fails if file already exists.
# "r+"  — read and write.
# "b"  — binary mode (combine: "rb", "wb", "ab")

# Always use with statement (context manager)!
# It automatically closes the file, even if an error occurs.

# Write a file
with open("example.txt", "w") as f:
    f.write("Hello, World!\\n")
    f.write("Second line.\\n")

# Append to a file
with open("example.txt", "a") as f:
    f.write("Third line.\\n")

# Read the file
with open("example.txt", "r") as f:
    content = f.read()
    print(content)
# Hello, World!
# Second line.
# Third line.`}
        />
      </Section>

      {/* Context Manager */}
      <Section title="with Statement — Context Manager">
        <Explain>
          The <code>with</code> statement is Python's context manager protocol. It guarantees
          that resources are properly cleaned up (closed, released) even if an exception occurs
          inside the block. Never open files without it.
        </Explain>
        <CodeBlock
          code={`# WITHOUT with (bad — file may not close on error)
f = open("data.txt", "r")
content = f.read()  # if this raises an exception, f.close() is never called
f.close()

# WITH with (good — always closes the file)
with open("data.txt", "r") as f:
    content = f.read()
# File is guaranteed to be closed here

# Multiple context managers at once
with open("input.txt", "r") as infile, open("output.txt", "w") as outfile:
    for line in infile:
        outfile.write(line.upper())

# Custom context manager using class
class Timer:
    import time

    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False  # don't suppress exceptions

with Timer() as t:
    result = sum(range(1_000_000))`}
        />
        <Callout type="warning">
          Forgetting to close files can cause data corruption, memory leaks, and "too many open files"
          errors. Always use the <code>with</code> statement.
        </Callout>
      </Section>

      {/* Reading Methods */}
      <Section title="Reading Files: read(), readline(), readlines()">
        <CodeBlock
          code={`# First, create a sample file
with open("poem.txt", "w") as f:
    f.write("Roses are red,\\nViolets are blue,\\nPython is great,\\nAnd so are you!\\n")

# read() — entire file as one string
with open("poem.txt", "r") as f:
    content = f.read()
    print(repr(content))
    # 'Roses are red,\\nViolets are blue,\\n...'

# readline() — one line at a time (memory efficient for huge files)
with open("poem.txt", "r") as f:
    line1 = f.readline()  # 'Roses are red,\\n'
    line2 = f.readline()  # 'Violets are blue,\\n'
    print(line1.strip())  # Roses are red,

# readlines() — all lines as a list
with open("poem.txt", "r") as f:
    lines = f.readlines()
    print(lines)
    # ['Roses are red,\\n', 'Violets are blue,\\n', ...]

# Iterate directly (most memory-efficient for large files)
with open("poem.txt", "r") as f:
    for line_num, line in enumerate(f, start=1):
        print(f"{line_num}: {line.strip()}")
# 1: Roses are red,
# 2: Violets are blue,
# 3: Python is great,
# 4: And so are you!`}
        />
      </Section>

      {/* JSON */}
      <Section title="Working with JSON">
        <Explain>
          JSON is the universal data interchange format. Python's <code>json</code> module makes
          it trivial to serialize Python objects to JSON and deserialize JSON back to Python.
        </Explain>
        <CodeBlock
          code={`import json

# Python dict → JSON string → file
user = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "Django", "SQL"],
    "address": {
        "city": "New York",
        "country": "USA"
    },
    "active": True,
    "score": None,
}

# Write JSON to file
with open("user.json", "w") as f:
    json.dump(user, f, indent=2)
    # indent=2 makes it human-readable

# Read JSON from file
with open("user.json", "r") as f:
    loaded = json.load(f)

print(loaded["name"])    # Alice
print(loaded["skills"])  # ['Python', 'Django', 'SQL']
print(type(loaded))      # <class 'dict'>

# JSON string conversions (no file involved)
json_string = json.dumps(user, indent=2)  # dict → str
print(json_string[:50])

parsed = json.loads(json_string)  # str → dict
print(parsed["age"])  # 30

# JSON type mapping:
# Python  ↔  JSON
# dict    ↔  object {}
# list    ↔  array []
# str     ↔  string ""
# int/float ↔ number
# True/False ↔ true/false
# None    ↔  null`}
        />
      </Section>

      {/* os and pathlib */}
      <Section title="os and pathlib Basics">
        <SubSection title="os module">
          <CodeBlock
            code={`import os

# Current working directory
cwd = os.getcwd()
print(cwd)  # /Users/uzairansari/Desktop/python-fun

# List directory contents
files = os.listdir(".")
print(files)

# Join paths safely (works cross-platform)
path = os.path.join("data", "users", "alice.json")
print(path)  # data/users/alice.json

# Check if file/directory exists
print(os.path.exists("example.txt"))  # True or False
print(os.path.isfile("example.txt"))  # True
print(os.path.isdir("data"))          # True if it's a directory

# Create directory
os.makedirs("data/users", exist_ok=True)  # exist_ok prevents error if exists

# Get file size
size = os.path.getsize("example.txt")
print(f"File size: {size} bytes")

# Environment variables
home = os.environ.get("HOME", "/tmp")
debug = os.environ.get("DEBUG", "false")`}
          />
        </SubSection>
        <SubSection title="pathlib (modern, recommended)">
          <Explain>
            <code>pathlib.Path</code> is the modern, object-oriented way to work with file paths.
            It's cleaner than <code>os.path</code> and is preferred in modern Python code.
          </Explain>
          <CodeBlock
            code={`from pathlib import Path

# Create a Path object
base = Path(".")
data_dir = Path("data") / "users"   # / operator joins paths!

# Check existence
print(base.exists())      # True
print(data_dir.exists())  # depends on your system

# Create directories
data_dir.mkdir(parents=True, exist_ok=True)

# File operations
readme = Path("README.md")
if readme.exists():
    content = readme.read_text()    # read entire file
    print(content[:100])

# Write a file
config = Path("config.txt")
config.write_text("debug=true\\nport=8000\\n")

# Path properties
p = Path("/Users/alice/documents/report.pdf")
print(p.name)        # report.pdf
print(p.stem)        # report
print(p.suffix)      # .pdf
print(p.parent)      # /Users/alice/documents

# Find all Python files recursively
py_files = list(Path(".").glob("**/*.py"))
for f in py_files:
    print(f)`}
          />
        </SubSection>
      </Section>

      {/* CSV */}
      <Section title="CSV Files with csv Module">
        <Explain>
          CSV (Comma-Separated Values) is the most common format for tabular data.
          Python's built-in <code>csv</code> module handles edge cases like commas inside
          quoted fields and different delimiters.
        </Explain>
        <CodeBlock
          code={`import csv

# Write a CSV file
students = [
    {"name": "Alice", "grade": 92, "subject": "Math"},
    {"name": "Bob", "grade": 85, "subject": "Science"},
    {"name": "Charlie", "grade": 78, "subject": "English"},
]

with open("students.csv", "w", newline="") as f:
    fieldnames = ["name", "grade", "subject"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(students)

# Read a CSV file
with open("students.csv", "r", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']}: {row['grade']} in {row['subject']}")
# Alice: 92 in Math
# Bob: 85 in Science
# Charlie: 78 in English

# Read as plain lists (no header)
with open("students.csv", "r") as f:
    reader = csv.reader(f)
    next(reader)  # skip header row
    for row in reader:
        name, grade, subject = row
        print(f"{name} scored {grade}")`}
        />
        <Callout type="tip">
          For large CSV files or complex transformations, consider using <code>pandas</code> instead.
          But for simple reads and writes, the built-in <code>csv</code> module is perfect.
        </Callout>
      </Section>
    </PageLayout>
  );
}
