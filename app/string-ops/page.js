"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function TheoryCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border p-5 my-4"
    >
      <div className="flex gap-3 items-start">
        <span className="text-xl flex-shrink-0"></span>
        <div className="text-(--fg) leading-relaxed text-sm">{children}</div>
      </div>
    </motion.div>
  );
}

function ExerciseBox({ title, problem, hints, solutionCode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border p-6 my-6"

    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg"></span>
        <h4 className="font-semibold text-(--fg) text-base">{title}</h4>
      </div>
      <p className="text-(--fg-muted) text-sm mb-3 leading-relaxed">{problem}</p>
      {hints && hints.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-(--fg-subtle) font-semibold mb-2 uppercase tracking-wider">Hints</p>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-1"
          >
            {hints.map((h, i) => (
              <motion.li key={i} variants={itemVariants} className="text-(--fg-muted) text-sm flex gap-2">
                <span className="text-(--fg-subtle)">•</span>
                {h}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
      <p className="text-xs text-(--fg-subtle) font-semibold mb-2 uppercase tracking-wider">Solution</p>
      <CodeBlock code={solutionCode} filename="solution.py" />
    </motion.div>
  );
}

const methodGroups = [
  {
    category: "Case",
    methods: [".upper()", ".lower()", ".title()", ".capitalize()", ".swapcase()"],
  },
  {
    category: "Search",
    methods: [".find()", ".index()", ".count()", ".startswith()", ".endswith()", "in keyword"],
  },
  {
    category: "Clean",
    methods: [".strip()", ".lstrip()", ".rstrip()", ".replace()"],
  },
  {
    category: "Split/Join",
    methods: [".split()", ".rsplit()", ".splitlines()", ".join()"],
  },
  {
    category: "Check",
    methods: [".isalpha()", ".isdigit()", ".isalnum()", ".isspace()", ".isupper()", ".islower()"],
  },
  {
    category: "Pad/Align",
    methods: [".center()", ".ljust()", ".rjust()", ".zfill()"],
  },
];

export default function StringOpsPage() {
  return (
    <PageLayout title="String Operations"
      subtitle="Everything about Python strings — methods, f-strings, regex, and more."
    >
      {/* What is a string */}
      <Section title="What is a String?">
        <TheoryCard>
          A <strong>string</strong> is an immutable sequence of Unicode characters. Every character is a Unicode code point — Python 3 strings are full Unicode by default, so emoji, Arabic, Chinese, all work natively.
          <br /><br />
          Strings are <strong>objects</strong> in Python — they have dozens of built-in methods. Because strings are immutable, every method returns a new string rather than modifying the original. You can create strings with single quotes <code>'hello'</code>, double quotes <code>"hello"</code>, or triple quotes <code>"""multi-line"""</code> for multi-line text.
        </TheoryCard>
        <CodeBlock
          filename="string_basics.py"
          code={`# ── Creating strings ────────────────────────────────────────
s1 = 'single quotes'
s2 = "double quotes"
s3 = """triple quotes
span multiple
lines"""
s4 = '''also triple quotes'''

# ── Strings are immutable ────────────────────────────────────
s = "hello"
# s[0] = "H"   # TypeError: 'str' object does not support item assignment
s = "H" + s[1:]   # must create a new string
print(s)           # Hello

# ── Every string is a sequence ───────────────────────────────
print(len("hello"))          # 5
print(type("hello"))         # <class 'str'>
print("hello"[0])            # h
print("hello" in "hello!")   # True

# ── Unicode works naturally ──────────────────────────────────
greeting = "مرحبا"    # Arabic
emoji = "Python "
print(len(emoji))     # 8 — emoji counts as 1 char
print(ord("A"))       # 65 — Unicode code point
print(chr(65))        # A`}
        />
      </Section>

      {/* Indexing & Slicing */}
      <Section title="String Indexing & Slicing">
        <TheoryCard>
          Strings behave like arrays of characters. Positive indices count from the left (starting at 0), negative indices count from the right (starting at -1). Slicing follows the pattern <code>s[start:stop:step]</code> — start is inclusive, stop is exclusive.
          <br /><br />
          The step parameter controls direction and stride. <code>s[::-1]</code> reverses a string — a classic Python trick.
        </TheoryCard>
        <CodeBlock
          filename="slicing.py"
          code={`s = "Python Rocks"
#    P y t h o n   R o c k  s
#    0 1 2 3 4 5 6 7 8 9 10 11   (positive indices)
#  -12 ...              -2 -1    (negative indices)

# ── Single character access ──────────────────────────────────
print(s[0])    # P
print(s[-1])   # s
print(s[7])    # R

# ── Slicing [start:stop] ─────────────────────────────────────
print(s[0:6])    # Python   (stop is exclusive)
print(s[7:])     # Rocks    (to end)
print(s[:6])     # Python   (from start)
print(s[-5:])    # Rocks    (last 5 chars)
print(s[:-6])    # Python   (all except last 6)

# ── Slicing with step [start:stop:step] ──────────────────────
print(s[::2])    # Pto ok   (every 2nd char)
print(s[::-1])   # skcoR nohtyP  (reversed!)
print(s[6::-1])  # nohtyP   (first 7 chars reversed)

# ── Checking bounds — slicing never raises IndexError ────────
print(s[0:1000])   # Python Rocks — just clips silently`}
        />
      </Section>

      {/* String Methods */}
      <Section title="String Methods — The Complete Toolkit">
        <TheoryCard>
          Python strings come with over 40 built-in methods. They are grouped here by purpose. Remember: all string methods return a new string — the original is never changed.
        </TheoryCard>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4"
        >
          {methodGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={itemVariants}
              className="rounded-xl border p-4"
            >
              <h4 className="font-bold text-sm mb-2">
                {group.category}
              </h4>
              <ul className="space-y-0.5">
                {group.methods.map((m) => (
                  <li key={m} className="text-xs font-mono text-(--fg-subtle)">
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <CodeBlock
          filename="string_methods.py"
          code={`s = "  Hello, Python World!  "

# ── Case methods ─────────────────────────────────────────────
print("hello".upper())          # HELLO
print("HELLO".lower())          # hello
print("hello world".title())    # Hello World
print("hello world".capitalize()) # Hello world
print("Hello World".swapcase()) # hELLO wORLD

# ── Search methods ───────────────────────────────────────────
s = "banana"
print(s.find("an"))       # 1   — index of first occurrence, -1 if not found
print(s.index("an"))      # 1   — like find but raises ValueError if not found
print(s.count("an"))      # 2
print(s.startswith("ban"))  # True
print(s.endswith("na"))     # True
print("an" in s)            # True  — most Pythonic way

# ── Clean methods ─────────────────────────────────────────────
messy = "   hello world   "
print(messy.strip())      # "hello world"
print(messy.lstrip())     # "hello world   "
print(messy.rstrip())     # "   hello world"
print("aababaab".strip("ab"))   # "" — strips chars, not a prefix

print("hello world".replace("world", "Python"))  # hello Python
print("aababc".replace("a", "X", 2))             # XXbab c — limit replacements

# ── Split / Join ──────────────────────────────────────────────
words = "apple,banana,cherry".split(",")
print(words)    # ['apple', 'banana', 'cherry']

print("hello\\nworld".splitlines())   # ['hello', 'world']
print(", ".join(["a", "b", "c"]))    # "a, b, c"

# ── Check methods ─────────────────────────────────────────────
print("hello".isalpha())    # True
print("123".isdigit())      # True
print("abc123".isalnum())   # True
print("   ".isspace())      # True

# ── Pad / Align ──────────────────────────────────────────────
print("hi".center(10))        # "    hi    "
print("hi".ljust(10, "-"))    # "hi--------"
print("hi".rjust(10, "."))    # "........hi"
print("42".zfill(5))          # "00042"`}
        />
      </Section>

      {/* f-strings */}
      <Section title="f-strings — Modern String Formatting">
        <TheoryCard>
          <strong>f-strings</strong> (formatted string literals, Python 3.6+) are the modern, fastest, and most readable way to embed values in strings. Prefix a string with <code>f</code> and wrap any Python expression in curly braces <code>{"{}"}</code>.
          <br /><br />
          Format spec syntax inside f-strings: <code>:.2f</code> for 2 decimal places, <code>:,</code> for thousands separator, <code>{":>10"}</code> for right-align in 10 chars, <code>:b</code> for binary. Python 3.12 added nested f-strings inside format specs.
        </TheoryCard>
        <CodeBlock
          filename="fstrings.py"
          code={`name = "Alice"
score = 98.654
price = 1234567.89

# ── Basic embedding ──────────────────────────────────────────
print(f"Hello, {name}!")              # Hello, Alice!
print(f"Score: {score}")              # Score: 98.654
print(f"2 + 2 = {2 + 2}")            # 2 + 2 = 4
print(f"Upper: {name.upper()}")       # Upper: ALICE

# ── Format specifications ─────────────────────────────────────
print(f"{score:.2f}")                 # 98.65    (2 decimal places)
print(f"{score:.0f}")                 # 99       (rounded, no decimals)
print(f"{price:,.2f}")               # 1,234,567.89  (comma separator)
print(f"{price:e}")                  # 1.234568e+06  (scientific)

# ── Width and alignment ───────────────────────────────────────
print(f"{'left':<10}|")              # left      |
print(f"{'right':>10}|")             # "     right|"
print(f"{'center':^10}|")            # "  center  |"
print(f"{42:0>5}")                   # 00042  (zero-padded)

# ── Self-documenting with = (Python 3.8+) ────────────────────
x = 42
print(f"{x=}")                       # x=42  — great for debugging

# ── Multi-line f-strings ─────────────────────────────────────
report = (
    f"Name:  {name}\\n"
    f"Score: {score:.1f}\\n"
    f"Grade: {'A' if score >= 90 else 'B'}"
)
print(report)

# ── Nested expressions ────────────────────────────────────────
items = ["apple", "banana", "cherry"]
print(f"Items: {', '.join(items)}")  # Items: apple, banana, cherry
print(f"Count: {len(items)}")`}
        />
      </Section>

      {/* .format() and % */}
      <Section title="String Formatting — .format() and %">
        <TheoryCard>
          Before f-strings there were two other formatting approaches. The <code>.format()</code> method (Python 3.0+) uses placeholders with positional and keyword arguments. The old <code>%</code> operator (like C's printf) is still seen in legacy code.
          <br /><br />
          For new code, always prefer f-strings. But you will encounter both in the wild, so it is worth knowing them.
        </TheoryCard>
        <CodeBlock
          filename="formatting.py"
          code={`# ── .format() method ─────────────────────────────────────────
# Positional
print("Hello, {}! You scored {}.".format("Alice", 95))

# Named
print("Hello, {name}! Score: {score:.2f}".format(name="Bob", score=87.5))

# Index
print("{0} + {0} = {1}".format(3, 6))   # 3 + 3 = 6

# ── Template strings (for user-supplied input — safer) ────────
from string import Template
t = Template("Hello, $name! You have $count messages.")
print(t.substitute(name="Carol", count=5))

# ── Old % formatting (legacy — avoid in new code) ─────────────
name = "Dave"
score = 91.5
print("Hello, %s! Score: %.1f" % (name, score))  # Hello, Dave! Score: 91.5
print("Integer: %d, Hex: %x" % (255, 255))       # Integer: 255, Hex: ff
print("Padded: %10s" % "hi")                      # "        hi"`}
        />
      </Section>

      {/* Concatenation and Multiplication */}
      <Section title="String Concatenation & Multiplication">
        <TheoryCard>
          The <code>+</code> operator concatenates strings, but it creates a new string each time — doing this in a loop with many strings is O(n²). For joining many strings, always use <code>str.join()</code> which is O(n).
          <br /><br />
          The <code>*</code> operator repeats a string — useful for creating separators, padding, or simple patterns.
        </TheoryCard>
        <CodeBlock
          filename="concat.py"
          code={`# ── Concatenation ───────────────────────────────────────────
s = "Hello" + ", " + "World" + "!"
print(s)   # Hello, World!

# ── DON'T do this in loops (O(n^2)) ─────────────────────────
# BAD:
result = ""
for word in ["a", "b", "c", "d"]:
    result += word   # creates a new string each iteration

# GOOD: use join (O(n))
result = "".join(["a", "b", "c", "d"])
print(result)   # abcd

words = ["Python", "is", "awesome"]
print(" ".join(words))    # Python is awesome
print("-".join(words))    # Python-is-awesome

# ── String multiplication ─────────────────────────────────────
print("ha" * 3)            # hahaha
print("=" * 40)            # ========================================
print("-" * 20 + "TITLE" + "-" * 20)

# ── In-place += (CPython optimizes this in simple cases) ─────
greeting = "Hello"
greeting += " World"
print(greeting)   # Hello World`}
        />
      </Section>

      {/* Raw strings */}
      <Section title="Raw Strings & Byte Strings">
        <TheoryCard>
          A <strong>raw string</strong> (prefix <code>r</code>) treats backslashes as literal characters — no escape sequences are processed. This is essential for regex patterns and Windows file paths.
          <br /><br />
          A <strong>byte string</strong> (prefix <code>b</code>) represents raw bytes (integers 0–255), not Unicode characters. You must encode text strings to bytes for network I/O, file I/O in binary mode, and cryptography.
        </TheoryCard>
        <CodeBlock
          filename="raw_bytes.py"
          code={`# ── Raw strings ─────────────────────────────────────────────
# Without r: backslash is escape char
print("C:\\\\Users\\\\Alice")    # C:\Users\Alice (need double backslash)
print("line1\\nline2")         # two lines

# With r: backslash is literal
print(r"C:\\Users\\Alice")     # C:\Users\Alice (no doubling needed)
print(r"line1\\nline2")        # line1\\nline2 (no newline!)

# Essential for regex patterns
import re
phone = "Call 555-123-4567 now"
match = re.search(r"\\d{3}-\\d{3}-\\d{4}", phone)   # raw string pattern
print(match.group())   # 555-123-4567

# ── Byte strings ─────────────────────────────────────────────
b = b"hello"
print(type(b))        # <class 'bytes'>
print(b[0])           # 104  — an integer, not a char!
print(len(b))         # 5

# ── Encoding: str → bytes ────────────────────────────────────
text = "hello"
encoded = text.encode("utf-8")    # b'hello'
encoded_utf16 = text.encode("utf-16")

# ── Decoding: bytes → str ────────────────────────────────────
decoded = encoded.decode("utf-8")   # "hello"
print(decoded)

# Emoji encoding
emoji = ""
print(emoji.encode("utf-8"))    # b'\\xf0\\x9f\\x90\\x8d'  (4 bytes for emoji)`}
        />
      </Section>

      {/* Regex */}
      <Section title="Regular Expressions — Pattern Matching">
        <TheoryCard>
          The <code>re</code> module brings the full power of regular expressions to Python strings. A regex is a pattern that describes a set of strings — use it to search, validate, extract, or replace text based on structure rather than exact values.
          <br /><br />
          Key functions: <code>re.search(pattern, string)</code> finds first match anywhere. <code>re.match()</code> only matches at the start. <code>re.findall()</code> returns all matches as a list. <code>re.sub()</code> replaces matches. Always use raw strings for patterns.
        </TheoryCard>
        <CodeBlock
          filename="regex.py"
          code={`import re

# ── Pattern syntax quick reference ───────────────────────────
# .   — any char except newline
# \\d  — digit (0-9)         \\D — non-digit
# \\w  — word char [a-zA-Z0-9_]  \\W — non-word
# \\s  — whitespace          \\S — non-whitespace
# ^   — start of string     $  — end of string
# *   — 0 or more           +  — 1 or more   ? — 0 or 1
# {n} — exactly n           {n,m} — n to m times
# []  — character class     | — or    () — group

# ── re.search() ──────────────────────────────────────────────
text = "My email is alice@example.com and bob@test.org"
m = re.search(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", text)
if m:
    print(m.group())    # alice@example.com

# ── re.findall() ─────────────────────────────────────────────
emails = re.findall(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", text)
print(emails)   # ['alice@example.com', 'bob@test.org']

# ── re.match() — only at start ───────────────────────────────
print(re.match(r"\\d+", "42 is the answer"))   # match object
print(re.match(r"\\d+", "no digits here"))      # None

# ── re.sub() — search and replace ────────────────────────────
clean = re.sub(r"[^a-zA-Z\\s]", "", "Hello, World! 123")
print(clean)    # Hello World

redacted = re.sub(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+", "[REDACTED]", text)
print(redacted)   # My email is [REDACTED] and [REDACTED]

# ── Compiled patterns — reuse for performance ─────────────────
phone_re = re.compile(r"\\b\\d{3}[-.]\\d{3}[-.]\\d{4}\\b")
for line in ["Call 555-123-4567", "Fax 800.555.1234", "No phone here"]:
    m = phone_re.search(line)
    print(m.group() if m else "No match")`}
        />

        <ExerciseBox
          title="Practice: Palindrome Checker"
          problem="Write a function that checks if a string is a palindrome. Ignore spaces, punctuation, and case."
          hints={[
            "Use re.sub(r'[^a-z0-9]', '', s.lower()) to clean the string",
            "Compare cleaned string to its reverse: cleaned == cleaned[::-1]",
          ]}
          solutionCode={`import re

def is_palindrome(s):
    cleaned = re.sub(r"[^a-z0-9]", "", s.lower())
    return cleaned == cleaned[::-1]

tests = [
    "A man, a plan, a canal: Panama",
    "race a car",
    "Was it a car or a cat I saw?",
    "hello",
]

for t in tests:
    result = "PALINDROME" if is_palindrome(t) else "not a palindrome"
    print(f"{t!r} -> {result}")`}
        />

        <ExerciseBox
          title="Practice: Email Validator"
          problem="Write a function that validates whether a string is a valid email address using regex. Test it against a list of valid and invalid examples."
          hints={[
            "Pattern: one or more word chars/dots/plus/hyphen, then @, then domain, then .tld",
            "Use re.fullmatch() to ensure the whole string matches, not just part of it",
            "Add a minimum TLD length check: \\.[a-z]{2,}$",
          ]}
          solutionCode={`import re

EMAIL_RE = re.compile(r"^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$", re.IGNORECASE)

def is_valid_email(email):
    return bool(EMAIL_RE.fullmatch(email.strip()))

tests = [
    "alice@example.com",      # valid
    "bob.smith+tag@mail.org", # valid
    "no-at-sign",             # invalid
    "@missinglocal.com",      # invalid
    "missing@tld.",           # invalid
    "USER@EXAMPLE.COM",       # valid (case-insensitive)
]

for email in tests:
    status = "VALID" if is_valid_email(email) else "INVALID"
    print(f"{email:<30} -> {status}")`}
        />

        <ExerciseBox
          title="Practice: Caesar Cipher"
          problem="Implement a Caesar cipher: shift each letter by a given number of positions in the alphabet. Non-letters stay unchanged. Support both encryption and decryption."
          hints={[
            "Use ord() to get the ASCII code and chr() to convert back",
            "Wrap around with % 26 after shifting",
            "Handle uppercase and lowercase separately",
            "Decryption is just encryption with a negative shift",
          ]}
          solutionCode={`def caesar_cipher(text, shift):
    result = []
    for ch in text:
        if ch.isalpha():
            base = ord("A") if ch.isupper() else ord("a")
            shifted = (ord(ch) - base + shift) % 26 + base
            result.append(chr(shifted))
        else:
            result.append(ch)
    return "".join(result)

msg = "Hello, World!"
encrypted = caesar_cipher(msg, 13)     # ROT13
decrypted = caesar_cipher(encrypted, -13)

print(f"Original:  {msg}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")`}
        />
      </Section>
    </PageLayout>
  );
}
