"use client";

import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";

export default function DecoratorsPage() {
  return (
    <PageLayout title="Decorators"
      subtitle="Decorators modify or enhance functions and methods without changing their source code. They are Python's most elegant feature."
    >
      {/* What is a decorator */}
      <Section title="What is a Decorator?">
        <Explain>
          Think of a decorator like wrapping a gift. The gift (your function) remains the same
          inside — but the wrapping adds something extra around it. A decorator takes a function,
          wraps it in another function that adds behavior, and returns the wrapper.
        </Explain>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 py-6 my-4 rounded-xl border border-default"

        >
          <div className="text-center">
            <div className="text-4xl mb-2"></div>
            <div className="text-sm text-(--fg-subtle)">Original Function</div>
          </div>
          <div className="text-3xl fg">→</div>
          <div className="text-center">
            <div className="text-4xl mb-2"></div>
            <div className="text-sm text-(--fg-subtle)">Decorator Applied</div>
          </div>
          <div className="text-3xl fg">→</div>
          <div className="text-center">
            <div className="text-4xl mb-2"></div>
            <div className="text-sm text-(--fg-subtle)">Enhanced Function</div>
          </div>
        </motion.div>

        <CodeBlock
          filename="decorator_basics.py"
          code={`# A simple decorator — manually, step by step
def shout(func):
    """Makes the function's output uppercase."""
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)  # call the original function
        return result.upper()           # modify the output
    return wrapper

def greet(name):
    return f"hello, {name}!"

# Apply the decorator manually
greet = shout(greet)
print(greet("Alice"))  # HELLO, ALICE!

# --- The @ syntax does the same thing, cleaner ---
@shout
def farewell(name):
    return f"goodbye, {name}!"

print(farewell("Bob"))  # GOODBYE, BOB!`}
        />
        <Callout type="info">
          <code>@shout</code> above the function definition is exactly equivalent to writing
          <code>farewell = shout(farewell)</code> after the definition.
        </Callout>
      </Section>

      {/* functools.wraps */}
      <Section title="functools.wraps — Preserve Function Identity">
        <Explain>
          Without <code>functools.wraps</code>, your wrapper function loses the original
          function's name and docstring. Always use it in production decorators.
        </Explain>
        <CodeBlock
          code={`import functools

def debug(func):
    @functools.wraps(func)  # preserves __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result!r}")
        return result
    return wrapper

@debug
def add(a, b):
    """Add two numbers."""
    return a + b

result = add(3, 4)
# Calling add with args=(3, 4), kwargs={}
# add returned 7

print(add.__name__)  # add        (preserved by @functools.wraps)
print(add.__doc__)   # Add two numbers.`}
        />
      </Section>

      {/* Decorator with arguments */}
      <Section title="Decorators with Arguments">
        <Explain>
          To pass arguments to a decorator, you need an extra layer of nesting:
          a decorator factory that returns the actual decorator.
        </Explain>
        <CodeBlock
          code={`import functools

def repeat(times):
    """Decorator factory — returns a decorator that repeats the function."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            results = []
            for _ in range(times):
                result = func(*args, **kwargs)
                results.append(result)
            return results
        return wrapper
    return decorator

@repeat(3)
def say(message):
    print(message)
    return message

outputs = say("Hello!")
# Hello!
# Hello!
# Hello!
print(outputs)  # ['Hello!', 'Hello!', 'Hello!']`}
        />
      </Section>

      {/* @staticmethod and @classmethod */}
      <Section title="@staticmethod and @classmethod">
        <SubSection title="@staticmethod">
          <Explain>
            A static method doesn't receive <code>self</code> or <code>cls</code>. It's a
            regular function that lives inside a class for organizational purposes.
          </Explain>
          <CodeBlock
            code={`class MathUtils:
    @staticmethod
    def add(a, b):
        return a + b

    @staticmethod
    def is_even(n):
        return n % 2 == 0

# Call without creating an instance
print(MathUtils.add(3, 5))   # 8
print(MathUtils.is_even(4))  # True`}
          />
        </SubSection>
        <SubSection title="@classmethod">
          <Explain>
            A class method receives <code>cls</code> (the class itself) instead of <code>self</code>.
            Use it for alternative constructors or factory methods.
          </Explain>
          <CodeBlock
            code={`class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

    @classmethod
    def from_string(cls, date_string):
        """Alternative constructor — parse 'YYYY-MM-DD' string."""
        year, month, day = map(int, date_string.split("-"))
        return cls(year, month, day)  # cls is Date

    @classmethod
    def today(cls):
        """Create a Date representing today."""
        import datetime
        now = datetime.date.today()
        return cls(now.year, now.month, now.day)


d1 = Date(2026, 4, 20)
d2 = Date.from_string("2026-12-25")  # use classmethod
d3 = Date.today()

print(d1)  # 2026-04-20
print(d2)  # 2026-12-25
print(d3)  # today's date`}
          />
        </SubSection>
      </Section>

      {/* Practical Examples */}
      <Section title="Practical Decorators">
        <SubSection title="Timing Decorator">
          <CodeBlock
            code={`import functools
import time

def timer(func):
    """Measure and print how long a function takes to run."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_sum(n):
    """Sum 0 to n with a simulated delay."""
    time.sleep(0.1)  # simulate work
    return sum(range(n + 1))

result = slow_sum(1000)
# slow_sum took 0.1012s
print(result)  # 500500`}
          />
        </SubSection>
        <SubSection title="Login Required Style Decorator">
          <CodeBlock
            code={`import functools

# Simulate a session
current_user = {"name": "Alice", "is_authenticated": True}

def login_required(func):
    """Redirect to login if user is not authenticated."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.get("is_authenticated"):
            print("Access denied. Please log in.")
            return None
        return func(*args, **kwargs)
    return wrapper

def admin_required(func):
    """Check admin role before proceeding."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.get("is_admin"):
            print("Access denied. Admin privileges required.")
            return None
        return func(*args, **kwargs)
    return wrapper

@login_required
def dashboard():
    return f"Welcome to your dashboard, {current_user['name']}!"

@login_required
@admin_required
def admin_panel():
    return "Admin panel — super secret!"

print(dashboard())  # Welcome to your dashboard, Alice!
print(admin_panel())  # Access denied. Admin privileges required.

# This is exactly how Django's @login_required decorator works!`}
          />
        </SubSection>
        <SubSection title="Caching Decorator (Memoization)">
          <CodeBlock
            code={`import functools

def memoize(func):
    """Cache function results to avoid redundant computation."""
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
            print(f"Computing {func.__name__}{args}...")
        else:
            print(f"Cache hit for {func.__name__}{args}!")
        return cache[args]
    return wrapper

@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(5))
# Computing fibonacci(5)...
# Computing fibonacci(4)...
# Computing fibonacci(3)...
# Computing fibonacci(2)...
# Computing fibonacci(1)...
# Computing fibonacci(0)...
# Cache hit for fibonacci(1)!  (already computed)
# Cache hit for fibonacci(2)!
# Cache hit for fibonacci(3)!
# 5

# Python has this built-in!
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`}
          />
        </SubSection>
        <Callout type="tip">
          Python's built-in <code>@functools.lru_cache</code> and <code>@functools.cache</code> (Python 3.9+)
          provide production-ready memoization. Always prefer these over rolling your own cache.
        </Callout>
      </Section>
    </PageLayout>
  );
}
