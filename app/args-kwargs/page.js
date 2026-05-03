"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
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

const orderSteps = [
  { label: "Positional args", example: "a, b", },
  { label: "*args", example: "*args", },
  { label: "Keyword-only args", example: "*, key=val", },
  { label: "**kwargs", example: "**kwargs", },
];

export default function ArgsKwargsPage() {
  return (
    <PageLayout title="*args & **kwargs"
      subtitle="Variable arguments, unpacking patterns, and the full parameter order rule."
    >
      {/* Positional Arguments */}
      <Section title="Positional Arguments">
        <TheoryCard>
          The simplest form of function argument: values matched to parameters <strong>by position</strong>. The first value goes to the first parameter, the second to the second, and so on. The number of arguments must exactly match the number of parameters (unless defaults are provided).
        </TheoryCard>
        <CodeBlock
          filename="positional.py"
          code={`def greet(first_name, last_name):
    print(f"Hello, {first_name} {last_name}!")

greet("Alice", "Smith")    # Hello, Alice Smith!
greet("Bob", "Jones")      # Hello, Bob Jones!

# Order matters — positional means POSITION
greet("Smith", "Alice")    # Hello, Smith Alice!  — wrong order!

# Too few args → TypeError
# greet("Alice")            # TypeError: greet() missing 1 required positional argument`}
        />
      </Section>

      {/* Default Arguments */}
      <Section title="Default Arguments — Fallback Values">
        <TheoryCard>
          A parameter with a default value is optional when calling the function. If the caller doesn't provide it, the default is used. Default arguments must come <strong>after</strong> non-default arguments in the parameter list.
          <br /><br />
          <strong>Mutable default argument trap:</strong> Never use a mutable object (list, dict, set) as a default value. The default is evaluated once at function definition time — all calls share the same object. Use <code>None</code> as the default and create a new object inside the function.
        </TheoryCard>
        <CodeBlock
          filename="defaults.py"
          code={`def connect(host, port=8080, secure=False):
    scheme = "https" if secure else "http"
    print(f"Connecting to {scheme}://{host}:{port}")

connect("example.com")               # http://example.com:8080
connect("example.com", 443)          # http://example.com:443
connect("example.com", 443, True)    # https://example.com:443
connect("example.com", secure=True)  # https://example.com:8080  — named arg

# ── The Mutable Default Trap ─────────────────────────────────
def buggy_append(item, lst=[]):   # DON'T DO THIS!
    lst.append(item)
    return lst

print(buggy_append(1))   # [1]      — OK
print(buggy_append(2))   # [1, 2]  — Bug! Remembers previous call!
print(buggy_append(3))   # [1, 2, 3]  — Still accumulating!

# ── The correct pattern: use None ────────────────────────────
def safe_append(item, lst=None):
    if lst is None:
        lst = []          # create a new list for each call
    lst.append(item)
    return lst

print(safe_append(1))   # [1]
print(safe_append(2))   # [2]   — fresh list each time!
print(safe_append(3))   # [3]`}
        />
      </Section>

      {/* *args */}
      <Section title="*args — Variable Positional Arguments">
        <TheoryCard>
          <code>*args</code> lets a function accept any number of positional arguments. The <code>*</code> is the unpacking operator — it packs all extra positional arguments into a <strong>tuple</strong> named <code>args</code>.
          <br /><br />
          The name <code>args</code> is just a convention — you can use any valid name after <code>*</code>. Think of <code>*args</code> like a bag: you throw as many positional items in as you want, and the function collects them all into one tuple.
          <br /><br />
          The <strong>same</strong> <code>*</code> operator works in reverse when calling: prefix a list or tuple with <code>*</code> to unpack it into separate positional arguments.
        </TheoryCard>
        <CodeBlock
          filename="args.py"
          code={`# ── Basic *args ───────────────────────────────────────────────
def total(*numbers):
    print(type(numbers))    # <class 'tuple'>  — it's ALWAYS a tuple
    print(numbers)
    return sum(numbers)

print(total(1, 2, 3))         # 6
print(total(10, 20, 30, 40))  # 100
print(total())                # 0  — zero args is fine too

# ── Iterating *args ───────────────────────────────────────────
def describe(*items):
    for i, item in enumerate(items, 1):
        print(f"  {i}. {item}")

describe("apple", "banana", "cherry")

# ── Mixing regular params with *args ─────────────────────────
# Regular params BEFORE *args
def log(level, *messages):
    for msg in messages:
        print(f"[{level.upper()}] {msg}")

log("info", "Server started", "Listening on port 8080")
log("error", "Connection refused")

# ── Unpacking with * when CALLING ─────────────────────────────
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
print(add(*nums))    # 6  — same as add(1, 2, 3)

coords = (10, 20, 30)
print(add(*coords))  # 60

# ── Combine unpacking ──────────────────────────────────────────
first = [1, 2]
second = [3, 4]
combined = [*first, *second, 5]   # [1, 2, 3, 4, 5]
print(combined)

# ── The * convention is just that — a convention ──────────────
def my_func(*values):   # 'values' instead of 'args'
    return list(values)

print(my_func(1, 2, 3))   # [1, 2, 3]`}
        />
      </Section>

      {/* **kwargs */}
      <Section title="**kwargs — Variable Keyword Arguments">
        <TheoryCard>
          <code>**kwargs</code> lets a function accept any number of keyword arguments. The <code>**</code> operator packs all extra keyword arguments into a <strong>dict</strong> named <code>kwargs</code>.
          <br /><br />
          Think of <code>**kwargs</code> as a labeled box: each named argument gets its own labeled slot in the dict. Just like <code>*args</code>, the name <code>kwargs</code> is just convention — any name after <code>**</code> works.
          <br /><br />
          The same <code>**</code> operator unpacks a dict into keyword arguments when calling a function.
        </TheoryCard>
        <CodeBlock
          filename="kwargs.py"
          code={`# ── Basic **kwargs ───────────────────────────────────────────
def display(**info):
    print(type(info))    # <class 'dict'>  — it's ALWAYS a dict
    for key, value in info.items():
        print(f"  {key}: {value}")

display(name="Alice", age=30, city="London")
display(title="Mr", country="UK")

# ── Building flexible functions with **kwargs ─────────────────
def create_tag(tag, content, **attributes):
    attrs = " ".join(f'{k}="{v}"' for k, v in attributes.items())
    opening = f"<{tag} {attrs}>" if attrs else f"<{tag}>"
    return f"{opening}{content}</{tag}>"

print(create_tag("p", "Hello World"))
# <p>Hello World</p>

print(create_tag("a", "Click me", href="/home", class_="btn", target="_blank"))
# <a href="/home" class_="btn" target="_blank">Click me</a>

# ── Unpacking dict with ** when CALLING ───────────────────────
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

person = {"name": "Bob", "greeting": "Hi"}
greet(**person)    # Hi, Bob!  — same as greet(name="Bob", greeting="Hi")

# ── Merging dicts with ** ─────────────────────────────────────
defaults = {"color": "blue", "size": "medium"}
overrides = {"color": "red", "weight": "bold"}
merged = {**defaults, **overrides}   # later keys win
print(merged)   # {'color': 'red', 'size': 'medium', 'weight': 'bold'}

# ── Checking what was passed ──────────────────────────────────
def flexible(**options):
    if "debug" in options:
        print(f"Debug mode: {options['debug']}")
    return options.get("timeout", 30)   # default 30 if not provided

flexible(debug=True, timeout=60, retry=3)`}
        />
      </Section>

      {/* Keyword-only args */}
      <Section title="Keyword-Only Arguments">
        <TheoryCard>
          Arguments defined <strong>after</strong> a bare <code>*</code> in the parameter list can only be passed by name — never by position. This is useful when you want to force callers to be explicit about which argument they are providing, reducing bugs from positional mistakes.
          <br /><br />
          Syntax: <code>def f(a, b, *, keyword_only):</code> — the bare <code>*</code> acts as a separator. Arguments after it are keyword-only. They can still have default values.
        </TheoryCard>
        <CodeBlock
          filename="keyword_only.py"
          code={`# ── Keyword-only with bare * separator ───────────────────────
def send_email(recipient, subject, *, cc=None, bcc=None, priority="normal"):
    print(f"To: {recipient}")
    print(f"Subject: {subject}")
    print(f"CC: {cc}, BCC: {bcc}, Priority: {priority}")

# cc, bcc, priority MUST be passed by name
send_email("alice@example.com", "Hello", cc="bob@example.com")
send_email("alice@example.com", "Urgent!", priority="high", bcc="boss@example.com")

# This would raise TypeError:
# send_email("alice@example.com", "Hello", None, None, "low")
# TypeError: send_email() takes 2 positional arguments but 5 were given

# ── Keyword-only after *args ──────────────────────────────────
def process(*items, separator=", ", reverse=False):
    lst = list(items)
    if reverse:
        lst.reverse()
    return separator.join(str(x) for x in lst)

print(process(1, 2, 3, 4))                   # 1, 2, 3, 4
print(process(1, 2, 3, separator=" | "))      # 1 | 2 | 3
print(process(1, 2, 3, reverse=True))         # 3, 2, 1

# ── Required keyword-only (no default) ───────────────────────
def create_user(name, *, email, role):   # email and role REQUIRED by name
    return {"name": name, "email": email, "role": role}

user = create_user("Alice", email="alice@example.com", role="admin")
print(user)`}
        />
      </Section>

      {/* Positional-only args */}
      <Section title="Positional-Only Arguments (Python 3.8+)">
        <TheoryCard>
          Arguments defined <strong>before</strong> a <code>/</code> in the parameter list can only be passed by position — never by name. This is how many built-in functions work (e.g., <code>len(obj)</code> — you can't do <code>len(obj=mylist)</code>).
          <br /><br />
          Syntax: <code>def f(pos_only, /, normal, *, kw_only):</code> — everything before <code>/</code> is positional-only, everything after <code>*</code> is keyword-only, and the middle can be either.
        </TheoryCard>
        <CodeBlock
          filename="positional_only.py"
          code={`# ── Positional-only with / ────────────────────────────────────
def distance(x1, y1, x2, y2, /):    # all positional-only
    return ((x2-x1)**2 + (y2-y1)**2) ** 0.5

print(distance(0, 0, 3, 4))   # 5.0

# This raises TypeError:
# distance(x1=0, y1=0, x2=3, y2=4)

# ── Combining all three zones ─────────────────────────────────
def full_example(pos_only, /, normal, *, kw_only):
    print(f"pos_only={pos_only}, normal={normal}, kw_only={kw_only}")

# pos_only: position only
# normal:   either way
# kw_only:  keyword only

full_example(1, 2, kw_only=3)         # all by position and keyword
full_example(1, normal=2, kw_only=3)  # normal passed by name

# ── Practical use: avoid naming conflicts ─────────────────────
def create(**kwargs):
    print(kwargs)

# Problem: what if a kwarg key collides with a param name?
def make(name, /, **kwargs):    # 'name' is positional-only
    kwargs["name"] = name       # no conflict — name is not a kwarg key
    return kwargs

print(make("Alice", age=30, city="London"))
# {'age': 30, 'city': 'London', 'name': 'Alice'}`}
        />
      </Section>

      {/* Full order rule */}
      <Section title="Full Parameter Order Rule">
        <TheoryCard>
          Python enforces a strict order for function parameters. Mixing them in the wrong order raises a <code>SyntaxError</code>. The rule to memorize: positional-only, then regular, then *args, then keyword-only, then **kwargs.
        </TheoryCard>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="my-6"
        >
          <div className="flex flex-wrap items-center gap-2 justify-center my-6">
            {orderSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <div
                  className="px-4 py-3 rounded-xl border text-center min-w-[120px]"
                >
                  <div className="text-xs text-(--fg-muted) mb-1">{step.label}</div>
                  <code className="text-sm font-bold">
                    {step.example}
                  </code>
                </div>
                {i < orderSteps.length - 1 && (
                  <span className="text-(--fg-subtle) text-xl font-bold">→</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <CodeBlock
          filename="parameter_order.py"
          code={`# Full signature with all parameter types
def full_signature(
    pos_only,           # positional-only
    /,                  # <-- / marker
    regular,            # can be positional or keyword
    *args,              # variable positional
    kw_only="default",  # keyword-only (after *)
    **kwargs            # variable keyword
):
    print(f"pos_only  = {pos_only}")
    print(f"regular   = {regular}")
    print(f"args      = {args}")
    print(f"kw_only   = {kw_only}")
    print(f"kwargs    = {kwargs}")

full_signature(
    1,                  # pos_only (must be positional)
    2,                  # regular
    3, 4, 5,            # go into *args
    kw_only="yes",      # keyword-only
    extra="data",       # goes into **kwargs
    more=True,
)
# pos_only  = 1
# regular   = 2
# args      = (3, 4, 5)
# kw_only   = yes
# kwargs    = {'extra': 'data', 'more': True}

# ── Common real-world signature ───────────────────────────────
def api_call(method, url, *path_segments, timeout=30, **headers):
    full_url = url + "/" + "/".join(path_segments)
    print(f"{method} {full_url} (timeout={timeout})")
    print(f"Headers: {headers}")

api_call("GET", "https://api.example.com", "users", "42",
         timeout=10, Authorization="Bearer token123")`}
        />
      </Section>

      {/* Passing args/kwargs between functions */}
      <Section title="Forwarding args & kwargs — Decorator Pattern">
        <TheoryCard>
          One of the most powerful uses of <code>*args</code> and <code>**kwargs</code> is <strong>forwarding</strong> them to another function. This is the foundation of Python's decorator pattern — a wrapper function captures all arguments and passes them through unchanged.
        </TheoryCard>
        <CodeBlock
          filename="forwarding.py"
          code={`# ── Simple forwarding ────────────────────────────────────────
def inner(a, b, c):
    print(f"inner called with a={a}, b={b}, c={c}")

def outer(*args, **kwargs):
    print("outer: preprocessing...")
    inner(*args, **kwargs)    # forward everything
    print("outer: postprocessing...")

outer(1, 2, 3)
outer(1, c=3, b=2)   # works — forwarding preserves keyword args

# ── Decorator pattern ────────────────────────────────────────
import functools
import time

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)   # forward all args!
        elapsed = time.time() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b, delay=0.1):
    time.sleep(delay)
    return a + b

print(slow_add(1, 2))          # 3 (plus timing output)
print(slow_add(1, 2, delay=0)) # 3 (faster)

# ── Partial application ────────────────────────────────────────
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube   = partial(power, exponent=3)

print(square(5))   # 25
print(cube(3))     # 27`}
        />
      </Section>

      {/* Practice Exercises */}
      <Section title="Practice Exercises">
        <ExerciseBox
          title="Practice: Flexible Logger Function"
          problem="Write a logger function that accepts any number of messages and keyword options: level (default 'INFO'), timestamp (default True), separator (default ' | '). It should format and print all messages with the level prefix."
          hints={[
            "Use *messages for variable positional args",
            "Use *, level='INFO', timestamp=True, separator=' | ' for keyword-only args",
            "import datetime to add timestamps",
          ]}
          solutionCode={`import datetime

def log(*messages, level="INFO", timestamp=True, separator=" | "):
    parts = list(messages)
    if timestamp:
        ts = datetime.datetime.now().strftime("%H:%M:%S")
        parts.insert(0, ts)
    formatted = separator.join(str(p) for p in parts)
    print(f"[{level}] {formatted}")

log("Server started")
log("User login", "alice@example.com", level="INFO")
log("Payment failed", "order_id=123", level="ERROR", timestamp=False)
log("DB slow", "query took 2.1s", level="WARN", separator=" >> ")`}
        />

        <ExerciseBox
          title="Practice: Mini print() Clone"
          problem="Implement a my_print() function that mimics Python's built-in print(): accepts any number of positional args, plus keyword-only sep (default ' '), end (default newline), and file (default None meaning stdout)."
          hints={[
            "Signature: def my_print(*objects, sep=' ', end='\\n', file=None):",
            "Convert each object to string with str()",
            "Join with sep, then write to file or sys.stdout",
          ]}
          solutionCode={`import sys

def my_print(*objects, sep=" ", end="\\n", file=None):
    output = sep.join(str(obj) for obj in objects)
    stream = file if file is not None else sys.stdout
    stream.write(output + end)

my_print("Hello", "World")             # Hello World
my_print(1, 2, 3, sep=", ")            # 1, 2, 3
my_print("No newline", end="")         # Hello World (no newline)
my_print("a", "b", "c", sep="-")       # a-b-c

# Verify it handles mixed types
my_print("Count:", 42, "Score:", 3.14)  # Count: 42 Score: 3.14`}
        />

        <ExerciseBox
          title="Practice: Config Builder with **kwargs"
          problem="Write a function build_config() that accepts a required 'app_name', optional known settings (host, port, debug), and any additional unknown kwargs stored under an 'extra' key. Return a complete config dict."
          hints={[
            "def build_config(app_name, *, host='localhost', port=8000, debug=False, **extra):",
            "Assemble a dict with all the named params plus extra={'remaining': kwargs}",
            "Use ** to merge dicts if needed",
          ]}
          solutionCode={`def build_config(app_name, *, host="localhost", port=8000, debug=False, **extra):
    config = {
        "app_name": app_name,
        "host": host,
        "port": port,
        "debug": debug,
        "extra": extra,
    }
    return config

cfg = build_config(
    "MyApp",
    port=9000,
    debug=True,
    db_url="sqlite:///db.sqlite3",
    secret_key="abc123",
    allowed_hosts=["localhost", "127.0.0.1"],
)

for k, v in cfg.items():
    print(f"  {k}: {v}")`}
        />
      </Section>
    </PageLayout>
  );
}
