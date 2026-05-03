"use client";

import PageLayout from "../components/PageLayout";
import Section, { Explain, Exercise, Callout } from "../components/Section";
import PythonRunner from "../components/PythonRunnerLazy";

/**
 * /practice — every topic from the curriculum with a live editor seeded with
 * starter code and an exercise to extend. Pyodide loads once and is shared by
 * every runner on the page.
 */
export default function PracticePage() {
  return (
    <PageLayout
      title="Practice"
      subtitle="Write and run real Python in your browser. Each topic ships with seeded code and a prompt — extend it, break it, and run it."
    >
      <Callout type="info">
        The first <strong>Run</strong> downloads the Python runtime (~10 MB,
        cached after). Every editor on this page shares the same runtime, so
        subsequent runs are instant.
      </Callout>

      {/* ─────────────────────────────────  1 · Foundations */}
      <Section title="1 · Python Foundations">
        <Explain>
          Variables, strings, sequences, dicts, and functions — the syntax you
          touch in every Python file you ever write.
        </Explain>

        <Exercise title="Basics — types, control flow, comprehensions">
          <p>
            Print the squares of even numbers from 0 to 19 using a list
            comprehension. Then count, using a single dict comprehension, how many
            of those squares are divisible by 4.
          </p>
        </Exercise>
        <PythonRunner
          title="basics.py"
          rows={11}
          initialCode={`# 1. Squares of even numbers from 0..19
evens = [n * n for n in range(20) if n % 2 == 0]
print("squares:", evens)

# 2. How many of those are divisible by 4?
# Your turn — replace the next line with a dict comprehension
# whose keys are the squares and whose values are True/False.
divisibility = {}
print("divisible by 4:", sum(divisibility.values()))
`}
        />

        <Exercise title="Strings — split, format, slice">
          <p>
            Given a sentence, return the longest word and its length using one
            f-string. Then reverse the sentence word-by-word.
          </p>
        </Exercise>
        <PythonRunner
          title="strings.py"
          rows={9}
          initialCode={`sentence = "the quick brown fox jumps over the lazy dog"

# Find the longest word
longest = max(sentence.split(), key=len)
print(f"Longest word: {longest!r} ({len(longest)} letters)")

# Reverse the sentence word-by-word — your turn
reversed_sentence = ""
print("Reversed:", reversed_sentence)
`}
        />

        <Exercise title="Lists, tuples & sets — pick the right container">
          <p>
            Deduplicate a list while preserving original order. Then build the set
            of items that appear more than once.
          </p>
        </Exercise>
        <PythonRunner
          title="containers.py"
          rows={11}
          initialCode={`items = ["a", "b", "a", "c", "b", "d", "a"]

# Deduplicate, preserving first-seen order
seen = set()
unique = []
for x in items:
    if x not in seen:
        seen.add(x)
        unique.append(x)
print("unique:", unique)

# Build the set of duplicates — your turn
duplicates = set()
print("duplicates:", duplicates)
`}
        />

        <Exercise title="Dicts — group, count, invert">
          <p>
            Group words by their first letter into a dict of lists. Then build a
            <code>Counter</code>-like dict mapping each letter to how many words
            start with it.
          </p>
        </Exercise>
        <PythonRunner
          title="dicts.py"
          rows={13}
          initialCode={`words = ["apple", "ant", "bee", "banana", "cat", "carrot", "ant"]

# Group words by their first letter
groups = {}
for w in words:
    groups.setdefault(w[0], []).append(w)
print("groups:", groups)

# Counter-like: how many words start with each letter?
counts = {}
# your turn
print("counts:", counts)
`}
        />

        <Exercise title="Functions — defaults, closures, *args/**kwargs">
          <p>
            Write a <code>make_multiplier(factor)</code> closure that returns a
            function multiplying its argument by <code>factor</code>. Then write a
            <code>describe(**fields)</code> that returns a one-line string of all
            keyword arguments sorted alphabetically.
          </p>
        </Exercise>
        <PythonRunner
          title="functions.py"
          rows={13}
          initialCode={`def make_multiplier(factor):
    # return a function that multiplies its input by 'factor'
    pass

triple = make_multiplier(3)
print(triple(7))  # expected: 21

def describe(**fields):
    # return e.g.  "color=red, name=ball, size=12"
    pass

print(describe(name="ball", color="red", size=12))
`}
        />
      </Section>

      {/* ─────────────────────────────────  2 · Standard Library */}
      <Section title="2 · Standard Library">
        <Explain>
          Built-ins, <code>collections</code>, <code>json</code>,{" "}
          <code>pathlib</code>, and exceptions — everything Python ships with that
          you should reach for before <code>pip install</code>.
        </Explain>

        <Exercise title="Built-ins — zip, enumerate, sorted, any/all">
          <p>
            Pair two lists into a list of <code>(rank, name)</code> tuples using{" "}
            <code>zip</code> and <code>enumerate</code>. Then verify with{" "}
            <code>all(...)</code> that every score is positive.
          </p>
        </Exercise>
        <PythonRunner
          title="builtins.py"
          rows={11}
          initialCode={`names = ["Ana", "Bo", "Cy"]
scores = [88, 72, 95]

ranked = sorted(zip(names, scores), key=lambda p: -p[1])
for i, (name, score) in enumerate(ranked, start=1):
    print(f"{i}. {name} — {score}")

# Use all() to check every score is positive — your turn
print("all positive?", None)
`}
        />

        <Exercise title="Collections — Counter, defaultdict, deque">
          <p>
            Count word frequencies with <code>Counter</code>; group people by city
            using <code>defaultdict(list)</code>; build a fixed-size sliding window
            with <code>deque(maxlen=...)</code>.
          </p>
        </Exercise>
        <PythonRunner
          title="collections_lib.py"
          rows={16}
          initialCode={`from collections import Counter, defaultdict, deque

text = "the quick brown fox jumps over the lazy dog the cat"
print(Counter(text.split()).most_common(3))

people = [("Ana", "NYC"), ("Bo", "LA"), ("Cy", "NYC"), ("Di", "LA")]
by_city = defaultdict(list)
for name, city in people:
    by_city[city].append(name)
print(dict(by_city))

# Sliding window of last 3 numbers — your turn
window = deque(maxlen=3)
for n in range(1, 8):
    window.append(n)
    print(list(window))
`}
        />

        <Exercise title="JSON & dataclasses — round-trip a payload">
          <p>
            Convert a <code>@dataclass</code> instance to JSON, then parse it back
            into a fresh instance. This is the bread-and-butter of every web API.
          </p>
        </Exercise>
        <PythonRunner
          title="json_dataclass.py"
          rows={14}
          initialCode={`import json
from dataclasses import dataclass, asdict

@dataclass
class User:
    id: int
    name: str
    is_active: bool = True

u = User(1, "Ana")
payload = json.dumps(asdict(u))
print("encoded:", payload)

# Decode back into a User instance — your turn
data = json.loads(payload)
restored = User(**data)
print("restored:", restored)
print("equal?", restored == u)
`}
        />

        <Exercise title="Errors — try/except/else/finally + custom exception">
          <p>
            Define a custom <code>InsufficientFunds</code> exception that carries
            the requested amount and the available balance. Raise it from a{" "}
            <code>withdraw</code> function and catch it in a friendly handler.
          </p>
        </Exercise>
        <PythonRunner
          title="errors.py"
          rows={16}
          initialCode={`class InsufficientFunds(Exception):
    def __init__(self, requested, available):
        super().__init__(f"requested {requested}, only {available} available")
        self.requested = requested
        self.available = available

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(amount, balance)
    return balance - amount

try:
    withdraw(50, 200)
except InsufficientFunds as e:
    print("nope:", e, f"(short by {e.requested - e.available})")
`}
        />
      </Section>

      {/* ─────────────────────────────────  3 · OOP */}
      <Section title="3 · OOP Mastery">
        <Explain>
          Classes are the spine of Django. These exercises walk you from a tiny
          class up through dunders, properties, inheritance with{" "}
          <code>super()</code>, and dataclasses.
        </Explain>

        <Exercise title="Classes — __init__, methods, @property">
          <p>
            Build a <code>Rectangle</code> with width/height, an <code>area</code>{" "}
            computed property, and a <code>resize(factor)</code> method.
          </p>
        </Exercise>
        <PythonRunner
          title="rectangle.py"
          rows={16}
          initialCode={`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

    def resize(self, factor):
        # multiply both width and height — your turn
        pass

    def __repr__(self):
        return f"Rectangle({self.width}x{self.height})"

r = Rectangle(3, 4)
print(r, "area:", r.area)
r.resize(2)
print(r, "area:", r.area)   # expected: Rectangle(6x8) area: 48
`}
        />

        <Exercise title="Dunder methods — make objects feel native">
          <p>
            Implement <code>Money</code> with <code>__repr__</code>,{" "}
            <code>__eq__</code>, <code>__hash__</code>, and <code>__add__</code>{" "}
            (only when currencies match).
          </p>
        </Exercise>
        <PythonRunner
          title="money.py"
          rows={20}
          initialCode={`class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount}, {self.currency!r})"

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return (self.amount, self.currency) == (other.amount, other.currency)

    def __hash__(self):
        return hash((self.amount, self.currency))

    def __add__(self, other):
        # Reject mixed currencies, return a new Money — your turn
        pass

print(Money(10, "USD") + Money(5, "USD"))     # expected: Money(15, 'USD')
print({Money(1, "USD"), Money(1, "USD")})     # one element only
`}
        />

        <Exercise title="Inheritance & super() — extend, don't duplicate">
          <p>
            Subclass <code>Animal</code> twice (<code>Dog</code>,{" "}
            <code>Puppy</code>). Each level&apos;s <code>describe()</code> should
            extend the parent&apos;s output via <code>super()</code>.
          </p>
        </Exercise>
        <PythonRunner
          title="inheritance.py"
          rows={22}
          initialCode={`class Animal:
    def __init__(self, name):
        self.name = name
    def describe(self):
        return f"{self.name} is an animal"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)
        self.breed = breed
    def describe(self):
        return super().describe() + f", a {self.breed} dog"

class Puppy(Dog):
    def __init__(self, name, breed, age_months):
        # call super().__init__ correctly — your turn
        pass
    def describe(self):
        # extend Dog's describe with the age_months info — your turn
        return ""

print(Puppy("Rex", "Lab", 4).describe())
# expected: Rex is an animal, a Lab dog, 4 months old
`}
        />

        <Exercise title="Dataclasses — boilerplate-free value objects">
          <p>
            Convert a tedious manual class into a frozen, ordered dataclass and
            verify sorting + hashing work.
          </p>
        </Exercise>
        <PythonRunner
          title="dataclasses_demo.py"
          rows={14}
          initialCode={`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int
    patch: int = 0

versions = [Version(1, 2), Version(2, 0), Version(1, 10), Version(1, 2)]
print(sorted(versions))
print(set(versions))   # frozen → hashable → set works
`}
        />

        <Exercise title="Decorators — wrap a function with logging + timing">
          <p>
            Write a <code>log_calls</code> decorator that prints the call args and
            return value, plus the elapsed milliseconds.
          </p>
        </Exercise>
        <PythonRunner
          title="decorator.py"
          rows={20}
          initialCode={`from functools import wraps
from time import perf_counter

def log_calls(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # capture start time, call fn, capture end, print, return result
        # your turn
        return fn(*args, **kwargs)
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def slow():
    s = 0
    for i in range(200_000):
        s += i
    return s

add(2, 3)
slow()
`}
        />
      </Section>

      {/* ─────────────────────────────────  4 · Concurrency */}
      <Section title="4 · Concurrency">
        <Explain>
          Pyodide doesn&apos;t expose true OS threads, but the conceptual exercises
          below run fine — they highlight the <em>shape</em> of concurrent code
          you&apos;ll port to real CPython.
        </Explain>

        <Exercise title="async/await — sleep concurrently, not sequentially">
          <p>
            Two awaits running concurrently with <code>asyncio.gather</code> should
            finish in the time of the longest one — not the sum.
          </p>
        </Exercise>
        <PythonRunner
          title="async_demo.py"
          rows={18}
          initialCode={`import asyncio
from time import perf_counter

async def fake_request(name, ms):
    await asyncio.sleep(ms / 1000)
    return f"{name} done"

async def main():
    t0 = perf_counter()
    a, b = await asyncio.gather(
        fake_request("A", 200),
        fake_request("B", 300),
    )
    print(a, "|", b)
    print(f"elapsed: {(perf_counter() - t0) * 1000:.0f} ms (≈ 300, not 500)")

await main()
`}
        />
      </Section>

      {/* ─────────────────────────────────  5 · Django-Ready */}
      <Section title="5 · Django-Ready">
        <Explain>
          Patterns you&apos;ll see in every Django project: descriptor-style class
          attributes, request/response shapes, and middleware-style decorators.
        </Explain>

        <Exercise title="A toy ORM — descriptor-backed fields">
          <p>
            Django&apos;s model fields are descriptors. Build a tiny{" "}
            <code>Field</code> descriptor that validates type on assignment, then
            use it in a <code>User</code> model.
          </p>
        </Exercise>
        <PythonRunner
          title="toy_orm.py"
          rows={22}
          initialCode={`class Field:
    def __init__(self, type_):
        self.type_ = type_
    def __set_name__(self, owner, name):
        self.name = name
    def __get__(self, instance, owner):
        return instance.__dict__.get(self.name)
    def __set__(self, instance, value):
        if not isinstance(value, self.type_):
            raise TypeError(f"{self.name} expects {self.type_.__name__}")
        instance.__dict__[self.name] = value

class User:
    id   = Field(int)
    name = Field(str)
    def __init__(self, id, name):
        self.id, self.name = id, name

u = User(1, "Ana")
print(u.id, u.name)

# Try assigning the wrong type — your turn
# u.id = "not-an-int"   # should raise TypeError
`}
        />

        <Exercise title="A toy view — request in, response out">
          <p>
            A Django view is a callable that takes a request dict and returns a
            response dict. Build a class-based view that dispatches on{" "}
            <code>request[&quot;method&quot;]</code>.
          </p>
        </Exercise>
        <PythonRunner
          title="toy_view.py"
          rows={22}
          initialCode={`class View:
    def __call__(self, request):
        method = request.get("method", "GET").lower()
        handler = getattr(self, method, None)
        if not handler:
            return {"status": 405, "body": "method not allowed"}
        return handler(request)

class UsersView(View):
    def get(self, request):
        return {"status": 200, "body": [{"id": 1, "name": "Ana"}]}
    def post(self, request):
        return {"status": 201, "body": {"created": request.get("payload")}}

view = UsersView()
print(view({"method": "GET"}))
print(view({"method": "POST", "payload": {"name": "Bo"}}))
print(view({"method": "DELETE"}))
`}
        />

        <Exercise title="Middleware — a chain of decorators">
          <p>
            Stack two middleware decorators around a view: one that logs, one that
            adds an <code>X-Request-Id</code> header. The order matters.
          </p>
        </Exercise>
        <PythonRunner
          title="middleware.py"
          rows={26}
          initialCode={`from functools import wraps
from uuid import uuid4

def log(view):
    @wraps(view)
    def wrapper(request):
        print(f"-> {request['method']} {request['path']}")
        response = view(request)
        print(f"<- {response['status']}")
        return response
    return wrapper

def with_request_id(view):
    @wraps(view)
    def wrapper(request):
        request.setdefault("headers", {})["X-Request-Id"] = uuid4().hex[:8]
        return view(request)
    return wrapper

@log
@with_request_id
def hello(request):
    rid = request["headers"]["X-Request-Id"]
    return {"status": 200, "body": f"hello, request {rid}"}

print(hello({"method": "GET", "path": "/hello"}))
`}
        />
      </Section>

      <Callout type="tip">
        Stuck? Each exercise has a corresponding tutorial page in the sidebar with
        a worked solution and a step-by-step animated trace.
      </Callout>
    </PageLayout>
  );
}
