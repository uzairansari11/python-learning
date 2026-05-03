"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const methodRows = [
  { method: ".keys()", returns: "dict_keys view", desc: "All keys" },
  { method: ".values()", returns: "dict_values view", desc: "All values" },
  { method: ".items()", returns: "dict_items view", desc: "All (key, value) pairs" },
  { method: ".get(k, default)", returns: "value or default", desc: "Safe access — no KeyError" },
  { method: ".setdefault(k, v)", returns: "value", desc: "Insert if key missing, then return" },
  { method: ".update(other)", returns: "None", desc: "Merge another dict in-place" },
  { method: ".pop(k, default)", returns: "removed value", desc: "Remove and return value" },
  { method: ".popitem()", returns: "(key, value)", desc: "Remove and return last inserted pair" },
  { method: ".copy()", returns: "new dict", desc: "Shallow copy" },
  { method: ".clear()", returns: "None", desc: "Remove all items" },
];

export default function DictsObjectsPage() {
  return (
    <PageLayout title="Dicts & Objects"
      subtitle="Master Python dictionaries, the collections module, JSON serialization, and how objects are dicts under the hood."
    >
      {/* Dict Basics */}
      <Section title="Dict Basics — Creation, Access, Modification">
        <Explain>
          A dictionary is Python's built-in hash map — an unordered (insertion-ordered since Python 3.7+) collection of key-value pairs. Keys must be hashable (strings, numbers, tuples of hashables). Values can be anything.
        </Explain>
        <CodeBlock
          filename="dict_basics.py"
          code={`# ── Creation ────────────────────────────────────────────────
empty = {}
literal = {"name": "Alice", "age": 30, "active": True}
from_pairs = dict([("x", 1), ("y", 2)])
from_kwargs = dict(name="Bob", age=25)
from_keys = dict.fromkeys(["a", "b", "c"], 0)   # {'a': 0, 'b': 0, 'c': 0}

# ── Access ───────────────────────────────────────────────────
d = {"name": "Alice", "age": 30}

print(d["name"])          # "Alice"
# print(d["missing"])     # KeyError!

# Safe access:
print(d.get("age"))       # 30
print(d.get("email"))     # None (no error)
print(d.get("email", "n/a"))  # "n/a" (custom default)

# ── Modification ─────────────────────────────────────────────
d["email"] = "alice@example.com"   # insert new key
d["age"] = 31                      # update existing key
del d["email"]                     # remove key (KeyError if missing)
d.pop("age")                       # remove and return value

# ── Iteration ────────────────────────────────────────────────
user = {"name": "Alice", "role": "admin", "score": 100}

for key in user:              # iterates keys
    print(key)

for value in user.values():
    print(value)

for key, value in user.items():    # most common pattern
    print(f"{key}: {value}")

# ── Membership test ──────────────────────────────────────────
print("name" in user)     # True   — tests KEYS (O(1))
print("Alice" in user)    # False  — "Alice" is a value, not a key`}
        />
      </Section>

      {/* Dict Methods */}
      <Section title="Dict Methods Deep Dive">
        <Explain>
          Python dicts ship with a rich set of methods. The views returned by <code className="fg">.keys()</code>, <code className="fg">.values()</code>, and <code className="fg">.items()</code> are dynamic — they reflect changes to the dict in real time without copying data.
        </Explain>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-xl border border-default my-4"
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Method</th>
                <th className="px-4 py-3 text-left font-semibold text-(--fg-subtle)">Returns</th>
                <th className="px-4 py-3 text-left font-semibold text-(--fg-subtle)">Description</th>
              </tr>
            </thead>
            <tbody>
              {methodRows.map((row, i) => (
                <tr key={row.method} style={{ background: i % 2 === 0 ? "rgba(26,26,46,0.6)" : "rgba(22,33,62,0.4)" }}>
                  <td className="px-4 py-2.5 font-mono fg text-xs">{row.method}</td>
                  <td className="px-4 py-2.5 text-(--fg-subtle) text-xs">{row.returns}</td>
                  <td className="px-4 py-2.5 text-(--fg-muted) text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <CodeBlock
          filename="dict_methods.py"
          code={`d = {"a": 1, "b": 2, "c": 3}

# .setdefault() — insert if missing, always returns the value
d.setdefault("d", 99)   # inserts "d": 99
d.setdefault("a", 99)   # "a" exists — does NOT overwrite
print(d["d"])           # 99
print(d["a"])           # 1 — unchanged

# .update() — merge in place
d.update({"e": 5, "a": 100})   # "a" gets overwritten!
print(d["a"])                   # 100

# .pop() with default — safe removal
val = d.pop("z", "not found")   # no KeyError
print(val)                       # "not found"

# .popitem() — removes last inserted pair (LIFO since Python 3.7)
key, val = d.popitem()
print(f"Removed: {key}={val}")

# Views are live — reflect mutations immediately
keys_view = d.keys()
d["new_key"] = 42
print("new_key" in keys_view)   # True — view updated automatically`}
        />
      </Section>

      {/* Dict Comprehensions */}
      <Section title="Dict Comprehensions">
        <Explain>
          Dict comprehensions create dictionaries in a single expressive line — the dict equivalent of list comprehensions. They are fast and Pythonic.
        </Explain>
        <CodeBlock
          filename="dict_comprehensions.py"
          code={`# Basic form: {key_expr: value_expr for item in iterable}
squares = {n: n**2 for n in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# From a list of items
fruits = ["apple", "banana", "cherry"]
lengths = {fruit: len(fruit) for fruit in fruits}
# {'apple': 5, 'banana': 6, 'cherry': 6}

# With condition (filter)
even_squares = {n: n**2 for n in range(10) if n % 2 == 0}
# {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Swapping keys and values
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b', 3: 'c'}

# Transforming values
prices = {"apple": 1.2, "banana": 0.5, "cherry": 3.0}
discounted = {item: round(price * 0.9, 2) for item, price in prices.items()}
# {'apple': 1.08, 'banana': 0.45, 'cherry': 2.7}

# Nested comprehension — flatten a list of dicts
records = [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]
by_id = {r["id"]: r["name"] for r in records}
# {1: 'Alice', 2: 'Bob'}

# Conditional value expression (ternary)
scores = {"Alice": 85, "Bob": 42, "Carol": 91}
grades = {name: "pass" if score >= 50 else "fail" for name, score in scores.items()}
# {'Alice': 'pass', 'Bob': 'fail', 'Carol': 'pass'}`}
        />
      </Section>

      {/* Nested Dicts */}
      <Section title="Nested Dicts — Accessing and Modifying Deep Keys">
        <Explain>
          Dicts can be nested arbitrarily. Accessing deeply nested keys can be verbose; there are several patterns to make it cleaner and safer.
        </Explain>
        <CodeBlock
          filename="nested_dicts.py"
          code={`config = {
    "database": {
        "host": "localhost",
        "port": 5432,
        "credentials": {
            "user": "admin",
            "password": "secret",
        },
    },
    "cache": {
        "ttl": 300,
        "backend": "redis",
    },
}

# Access nested keys
host = config["database"]["host"]          # "localhost"
user = config["database"]["credentials"]["user"]   # "admin"

# Safe access with .get() — chained
ttl = config.get("cache", {}).get("ttl", 60)   # 300 (or default 60 if missing)

# Modify a deep key
config["database"]["port"] = 5433

# Add a new nested key
config["database"]["name"] = "myapp_db"

# Delete a nested key
del config["database"]["credentials"]["password"]

# --- Iterating nested structure ---
def flatten(d, prefix=""):
    """Flatten nested dict to dot-notation keys."""
    result = {}
    for key, val in d.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if isinstance(val, dict):
            result.update(flatten(val, full_key))
        else:
            result[full_key] = val
    return result

flat = flatten(config)
for k, v in flat.items():
    print(f"{k}: {v}")
# database.host: localhost
# database.port: 5433
# cache.ttl: 300
# ...`}
        />
      </Section>

      {/* collections */}
      <Section title="collections Module — defaultdict, OrderedDict, Counter, ChainMap">
        <SubSection title="defaultdict — Never Get a KeyError on Missing Keys">
          <Explain>
            <code className="fg">defaultdict</code> automatically creates a default value for missing keys using a factory function. Perfect for grouping or counting without checking if a key exists first.
          </Explain>
          <CodeBlock
            filename="defaultdict_example.py"
            code={`from collections import defaultdict

# Factory: list — groups items
groups = defaultdict(list)
words = [("a", "apple"), ("b", "banana"), ("a", "avocado"), ("b", "blueberry")]

for letter, word in words:
    groups[letter].append(word)   # no KeyError even if letter is new

print(dict(groups))
# {'a': ['apple', 'avocado'], 'b': ['banana', 'blueberry']}

# Factory: int — counting (default 0)
word_count = defaultdict(int)
text = "the quick brown fox jumps over the lazy fox"
for word in text.split():
    word_count[word] += 1   # first access creates key with value 0

print(dict(word_count))

# Factory: set — unique grouping
seen = defaultdict(set)
logs = [("user1", "login"), ("user2", "login"), ("user1", "click"), ("user1", "login")]
for user, action in logs:
    seen[user].add(action)   # sets automatically deduplicate

print(dict(seen))
# {'user1': {'login', 'click'}, 'user2': {'login'}}

# Custom factory with lambda
nested = defaultdict(lambda: defaultdict(int))   # 2D counter
nested["row1"]["col1"] += 1
nested["row1"]["col2"] += 5
print(nested["row1"]["col1"])   # 1`}
          />
        </SubSection>

        <SubSection title="OrderedDict — Insertion-Order Aware Dict">
          <Explain>
            Since Python 3.7, regular dicts preserve insertion order too. <code className="fg">OrderedDict</code> is still useful for its <code>.move_to_end()</code> method and when you need equality to consider order.
          </Explain>
          <CodeBlock
            filename="ordered_dict.py"
            code={`from collections import OrderedDict

od = OrderedDict()
od["first"]  = 1
od["second"] = 2
od["third"]  = 3

# Move a key to the beginning or end
od.move_to_end("first")          # moves "first" to the end
od.move_to_end("third", last=False)  # moves "third" to the beginning

print(list(od.keys()))   # ['third', 'second', 'first']

# OrderedDict equality considers ORDER; regular dict does not
from collections import OrderedDict
od1 = OrderedDict([("a", 1), ("b", 2)])
od2 = OrderedDict([("b", 2), ("a", 1)])
print(od1 == od2)         # False — different order
print(dict(od1) == dict(od2))  # True — regular dicts ignore order

# LRU cache implementation sketch
class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # evict least recently used`}
          />
        </SubSection>

        <SubSection title="Counter — Count Hashable Items">
          <Explain>
            <code className="fg">Counter</code> is a dict subclass for counting. It supports arithmetic operations between counters and has a handy <code>.most_common()</code> method.
          </Explain>
          <CodeBlock
            filename="counter_example.py"
            code={`from collections import Counter

# Count from an iterable
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
c = Counter(words)
print(c)             # Counter({'apple': 3, 'banana': 2, 'cherry': 1})
print(c["apple"])    # 3
print(c["missing"])  # 0 — no KeyError (defaults to 0)

# Count characters in a string
char_count = Counter("mississippi")
print(char_count)    # Counter({'s': 4, 'i': 4, 'p': 2, 'm': 1})

# Most common
print(c.most_common(2))    # [('apple', 3), ('banana', 2)]
print(c.most_common()[:-3:-1])   # 2 least common (reversed)

# Arithmetic
a = Counter({"x": 3, "y": 2, "z": 1})
b = Counter({"x": 1, "y": 4})

print(a + b)    # Counter({'y': 6, 'x': 4, 'z': 1})  — add counts
print(a - b)    # Counter({'x': 2, 'z': 1})           — subtract (drops <= 0)
print(a & b)    # Counter({'x': 1, 'y': 2})           — min of each
print(a | b)    # Counter({'y': 4, 'x': 3, 'z': 1})  — max of each

# Update and subtract
c.update(["banana", "cherry", "cherry"])
print(c)   # apple: 3, banana: 3, cherry: 3

c.subtract(["apple", "apple"])
print(c)   # apple: 1, banana: 3, cherry: 3

# Convert to/from regular dict
regular = dict(c)
back_to_counter = Counter(regular)`}
          />
        </SubSection>

        <SubSection title="ChainMap — Multiple Dicts as One View">
          <Explain>
            <code className="fg">ChainMap</code> groups multiple dicts together and searches them in order. Reads go through the chain; writes only affect the first dict. Ideal for layered configuration (defaults → user settings → CLI overrides).
          </Explain>
          <CodeBlock
            filename="chainmap_example.py"
            code={`from collections import ChainMap

defaults  = {"color": "blue",  "size": "medium", "debug": False}
user_cfg  = {"color": "green",                   "debug": True}
cli_args  = {"size": "large"}

# Priority: cli_args > user_cfg > defaults
config = ChainMap(cli_args, user_cfg, defaults)

print(config["color"])   # "green"  — from user_cfg (cli_args doesn't have it)
print(config["size"])    # "large"  — from cli_args (highest priority)
print(config["debug"])   # True     — from user_cfg

# Write always goes to the FIRST map
config["timeout"] = 30
print(cli_args)          # {"size": "large", "timeout": 30}
print(defaults)          # unchanged

# Access individual maps
print(config.maps)       # [cli_args, user_cfg, defaults]

# Create a new child scope (useful for scoped variable lookup)
child = config.new_child({"color": "red"})
print(child["color"])    # "red"  — child scope shadows parent
print(config["color"])   # "green" — parent unchanged`}
          />
        </SubSection>
      </Section>

      {/* Merging Dicts */}
      <Section title="Merging Dicts — All the Ways">
        <Explain>
          Python has evolved several ways to merge dicts. Know them all — you will encounter each in real codebases.
        </Explain>
        <CodeBlock
          filename="merging_dicts.py"
          code={`d1 = {"a": 1, "b": 2}
d2 = {"b": 99, "c": 3}   # "b" exists in both — d2 wins in all cases below

# ── Method 1: .update() — in-place, modifies d1 ─────────────
merged = dict(d1)   # copy first to avoid mutating d1
merged.update(d2)
print(merged)   # {'a': 1, 'b': 99, 'c': 3}

# ── Method 2: {**d1, **d2} — unpacking (Python 3.5+) ────────
merged = {**d1, **d2}   # creates a new dict, d1 not mutated
print(merged)   # {'a': 1, 'b': 99, 'c': 3}

# Extra keys and overrides in one shot:
merged = {**d1, **d2, "extra": 42, "b": 0}   # "b" gets overwritten to 0
print(merged)   # {'a': 1, 'b': 0, 'c': 3, 'extra': 42}

# ── Method 3: | operator (Python 3.9+) ──────────────────────
merged = d1 | d2       # new dict
print(merged)   # {'a': 1, 'b': 99, 'c': 3}
d1 |= d2               # in-place (like +=)
print(d1)       # {'a': 1, 'b': 99, 'c': 3}

# ── Chaining many dicts ──────────────────────────────────────
from functools import reduce
dicts = [{"a": 1}, {"b": 2}, {"c": 3}, {"a": 99}]
merged = reduce(lambda acc, d: acc | d, dicts)
print(merged)   # {'a': 99, 'b': 2, 'c': 3}

# ── Deep merge (custom function) ─────────────────────────────
def deep_merge(base, override):
    result = dict(base)
    for key, val in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(val, dict):
            result[key] = deep_merge(result[key], val)
        else:
            result[key] = val
    return result

a = {"db": {"host": "localhost", "port": 5432}}
b = {"db": {"port": 5433, "name": "mydb"}}
print(deep_merge(a, b))
# {'db': {'host': 'localhost', 'port': 5433, 'name': 'mydb'}}`}
        />
      </Section>

      {/* kwargs */}
      <Section title="Dict as Function kwargs — **kwargs Unpacking">
        <Explain>
          A dict can be unpacked directly into a function call with <code className="fg">**</code>. Each key becomes a keyword argument. This is the mechanism behind many flexible Python APIs.
        </Explain>
        <CodeBlock
          filename="kwargs_unpacking.py"
          code={`def create_user(name, email, role="viewer", active=True):
    return {"name": name, "email": email, "role": role, "active": active}

# Normal call
u1 = create_user("Alice", "alice@example.com", role="admin")

# Dict unpacking — keys must match parameter names exactly
params = {"name": "Bob", "email": "bob@example.com", "role": "editor"}
u2 = create_user(**params)   # same as create_user(name="Bob", email=..., role=...)
print(u2)

# Mix positional + unpacking
u3 = create_user("Carol", **{"email": "carol@example.com", "active": False})

# Collecting **kwargs in a function definition
def configure(**kwargs):
    """Accept any keyword arguments."""
    for key, value in kwargs.items():
        print(f"Setting {key} = {value}")

configure(debug=True, timeout=30, retries=3)

# --- Forwarding kwargs ---
def wrapper(**kwargs):
    # Modify then forward
    kwargs.setdefault("role", "viewer")
    return create_user(**kwargs)

u4 = wrapper(name="Dave", email="dave@example.com")
print(u4["role"])   # "viewer" — default was applied`}
        />
      </Section>

      {/* JSON */}
      <Section title="JSON ↔ Dict — Serialization">
        <Explain>
          JSON is the universal data interchange format. Python's <code className="fg">json</code> module converts between Python dicts/lists and JSON strings or files seamlessly.
        </Explain>
        <CodeBlock
          filename="json_dict.py"
          code={`import json

# ── Dict → JSON string ───────────────────────────────────────
data = {
    "name": "Alice",
    "age": 30,
    "scores": [95, 87, 92],
    "address": {"city": "London", "zip": "EC1A"}
}

json_str = json.dumps(data)              # compact
print(json_str)
# {"name": "Alice", "age": 30, ...}

pretty_str = json.dumps(data, indent=2, sort_keys=True)  # human-readable
print(pretty_str)

# ── JSON string → Dict ───────────────────────────────────────
raw = '{"name": "Bob", "active": true, "score": null}'
parsed = json.loads(raw)
print(parsed)        # {'name': 'Bob', 'active': True, 'score': None}
print(type(parsed))  # <class 'dict'>

# JSON null → None, true/false → True/False, arrays → lists

# ── File I/O ─────────────────────────────────────────────────
# Write dict to a JSON file
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read JSON file into a dict
with open("data.json", "r") as f:
    loaded = json.load(f)

print(loaded["address"]["city"])   # "London"

# ── Custom serialization ─────────────────────────────────────
import datetime

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super().default(obj)

event = {"title": "PyCon", "date": datetime.datetime(2025, 5, 1)}
print(json.dumps(event, cls=DateTimeEncoder))
# {"title": "PyCon", "date": "2025-05-01T00:00:00"}`}
        />
      </Section>

      {/* Objects as Dicts */}
      <Section title="Objects as Dicts — __dict__, vars(), getattr/setattr">
        <Explain>
          Under the hood, every regular Python object stores its instance attributes in a <code className="fg">__dict__</code> dictionary. Python's reflection functions let you read, write, and inspect attributes dynamically at runtime.
        </Explain>
        <CodeBlock
          filename="objects_as_dicts.py"
          code={`class Config:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.debug = False

cfg = Config("localhost", 8080)

# ── __dict__ — the raw attribute store ──────────────────────
print(cfg.__dict__)        # {'host': 'localhost', 'port': 8080, 'debug': False}

# Modify __dict__ directly (rarely needed — prefer setattr)
cfg.__dict__["timeout"] = 30
print(cfg.timeout)         # 30

# ── vars() — same as __dict__ but also works on modules ──────
print(vars(cfg))           # same as cfg.__dict__

# ── getattr / setattr / hasattr / delattr ───────────────────
attr_name = "port"         # determined at runtime

val = getattr(cfg, attr_name)          # like cfg.port
print(val)                             # 8080

val = getattr(cfg, "missing", 9999)    # safe: returns 9999 if not found
print(val)

setattr(cfg, "host", "production.db") # like cfg.host = "production.db"
print(cfg.host)                        # "production.db"

print(hasattr(cfg, "debug"))           # True
print(hasattr(cfg, "nonexistent"))     # False

delattr(cfg, "debug")                  # like del cfg.debug
print(hasattr(cfg, "debug"))           # False

# ── Practical: build object from dict ────────────────────────
raw = {"host": "db.example.com", "port": 5432, "name": "mydb"}
obj = Config.__new__(Config)           # create instance without __init__
for k, v in raw.items():
    setattr(obj, k, v)
print(obj.host, obj.port)             # db.example.com 5432

# ── Converting object to dict ────────────────────────────────
def to_dict(obj):
    return {k: v for k, v in vars(obj).items() if not k.startswith("_")}

cfg2 = Config("localhost", 3000)
print(to_dict(cfg2))   # {'host': 'localhost', 'port': 3000, 'debug': False}`}
        />
      </Section>

      {/* TypedDict */}
      <Section title="TypedDict — Typed Dict Structures">
        <Explain>
          <code className="fg">TypedDict</code> (Python 3.8+) lets you describe the expected shape of a dict with type annotations. It is purely for static analysis and documentation — it does not enforce types at runtime. Great for annotating JSON API responses or config shapes.
        </Explain>
        <CodeBlock
          filename="typed_dict_example.py"
          code={`from typing import TypedDict, Required, NotRequired

# ── Basic TypedDict ──────────────────────────────────────────
class Movie(TypedDict):
    title: str
    year: int
    rating: float

movie: Movie = {"title": "Inception", "year": 2010, "rating": 8.8}
# A type checker (mypy, pyright) will warn if keys are missing or wrong type

# ── Optional keys with NotRequired (Python 3.11+) ────────────
class User(TypedDict):
    name: str
    email: str
    age: NotRequired[int]   # optional — may be absent

u1: User = {"name": "Alice", "email": "alice@example.com"}          # valid
u2: User = {"name": "Bob",   "email": "bob@example.com", "age": 30} # also valid

# ── total=False: all keys optional ───────────────────────────
class PartialConfig(TypedDict, total=False):
    host: str
    port: int
    debug: bool

cfg: PartialConfig = {}          # valid — all optional
cfg: PartialConfig = {"host": "localhost"}  # also valid

# ── Inheritance ───────────────────────────────────────────────
class BaseEntity(TypedDict):
    id: int
    created_at: str

class Product(BaseEntity):      # inherits id and created_at
    name: str
    price: float

p: Product = {"id": 1, "created_at": "2025-01-01", "name": "Widget", "price": 9.99}

# ── At runtime TypedDict is just a plain dict ─────────────────
print(type(movie))       # <class 'dict'>
print(isinstance(movie, dict))  # True`}
        />
        <Callout type="info">
          TypedDict annotations are erased at runtime — Python will not raise an error if you put the wrong type in. Use mypy or pyright for static checking, or Pydantic if you need runtime validation.
        </Callout>
      </Section>

      {/* Comparing Dicts */}
      <Section title="Comparing Dicts — Equality, Shallow vs Deep Copy">
        <Explain>
          Dict equality compares all key-value pairs regardless of insertion order. Copying a dict with <code className="fg">.copy()</code> or <code className="fg">{"{**d}"}</code> creates a shallow copy — nested objects are still shared.
        </Explain>
        <CodeBlock
          filename="dict_copy_compare.py"
          code={`import copy

# ── Equality ─────────────────────────────────────────────────
d1 = {"a": 1, "b": 2}
d2 = {"b": 2, "a": 1}   # same keys/values, different order
print(d1 == d2)          # True — order does NOT matter for equality

d3 = {"a": 1, "b": 999}
print(d1 == d3)          # False

# ── Shallow Copy ─────────────────────────────────────────────
original = {"name": "Alice", "scores": [10, 20, 30]}

shallow1 = original.copy()
shallow2 = dict(original)
shallow3 = {**original}

# Top-level keys are independent
shallow1["name"] = "Bob"
print(original["name"])  # "Alice" — not affected

# BUT nested objects are shared!
shallow1["scores"].append(99)
print(original["scores"])  # [10, 20, 30, 99] — MUTATED! Same list object

# ── Deep Copy ─────────────────────────────────────────────────
original = {"name": "Alice", "scores": [10, 20, 30]}
deep = copy.deepcopy(original)   # recursively copies all nested objects

deep["scores"].append(99)
print(original["scores"])   # [10, 20, 30] — NOT affected, truly independent

# ── Identity vs Equality ─────────────────────────────────────
a = {"x": 1}
b = a             # SAME object (assignment, not copy)
b["x"] = 99
print(a["x"])    # 99 — a and b are the same dict!

c = a.copy()     # different object, same content
print(c is a)    # False
print(c == a)    # True`}
        />
      </Section>

      {/* Dict Performance */}
      <Section title="Dict Performance — O(1) Lookups & Hash Collisions">
        <Explain>
          Python dicts are hash tables. Lookups, insertions, and deletions are O(1) average case because Python computes a hash of the key and goes directly to the right memory slot. Understanding hashing helps you use dicts correctly and avoid performance pitfalls.
        </Explain>
        <CodeBlock
          filename="dict_performance.py"
          code={`import sys
import timeit

# ── O(1) lookup — speed does NOT depend on dict size ─────────
small_dict  = {i: i*2 for i in range(10)}
large_dict  = {i: i*2 for i in range(1_000_000)}

t_small = timeit.timeit(lambda: small_dict[5],  number=1_000_000)
t_large = timeit.timeit(lambda: large_dict[5],  number=1_000_000)

print(f"Lookup in 10-item dict:       {t_small:.4f}s")
print(f"Lookup in 1M-item dict:       {t_large:.4f}s")
# Both are roughly the same — that's O(1)

# ── Hashing ──────────────────────────────────────────────────
print(hash("hello"))     # some integer — same every run (within a session)
print(hash(42))          # 42  — ints hash to themselves
print(hash((1, 2, 3)))   # tuples are hashable
# print(hash([1, 2, 3])) # TypeError — lists are NOT hashable (mutable)

# Keys must be hashable — strings, numbers, tuples work; lists/dicts do not
valid_keys = {
    "string_key": 1,
    42: 2,
    (1, 2): 3,
    True: 4,    # True == 1 and hash(True) == hash(1) — they're the same key!
}

# ── Hash collision (simplified explanation) ───────────────────
# Python maps hash(key) → bucket index via: index = hash(key) % table_size
# Two different keys CAN produce the same index — a "collision"
# Python resolves collisions with open addressing (probing nearby slots)
# With a good hash function, collisions are rare → O(1) average
# Worst case (all keys collide): O(n) — essentially a linked list

# ── Memory layout ─────────────────────────────────────────────
d = {}
print(sys.getsizeof(d))     # ~232 bytes (empty dict has pre-allocated space)
for i in range(8):
    d[i] = i
print(sys.getsizeof(d))     # ~360 bytes — grew once (Python doubles when 2/3 full)

# ── Dict vs list lookup ──────────────────────────────────────
items_list = list(range(10_000))
items_dict = {i: True for i in range(10_000)}
target = 9999

t_list = timeit.timeit(lambda: target in items_list, number=10_000)
t_dict = timeit.timeit(lambda: target in items_dict, number=10_000)

print(f"List 'in' (O(n)): {t_list:.4f}s")
print(f"Dict 'in' (O(1)): {t_dict:.4f}s")
# Dict is dramatically faster for membership tests`}
        />
        <Callout type="tip">
          When you need fast membership testing on a large collection of unique items, prefer a <code>set</code> (O(1) like dict) over a <code>list</code> (O(n)). If you also need to store associated values, use a dict.
        </Callout>
      </Section>
    </PageLayout>
  );
}
