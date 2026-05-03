"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
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
        <div className="text-(--fg-muted) leading-relaxed text-sm">{children}</div>
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
      style={{
                }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg"></span>
        <h4 className="font-bold text-(--fg-subtle) text-base">{title}</h4>
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
              <motion.li key={i} variants={itemVariants} className="text-(--fg-subtle) text-sm flex gap-2">
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

export default function CollectionsLibPage() {
  return (
    <PageLayout title="Collections Library"
      subtitle="Python's specialized container datatypes — beyond lists and dicts."
    >
      {/* What is collections */}
      <Section title="What is the collections module?">
        <TheoryCard>
          Python's built-in <strong>collections</strong> module provides specialized container datatypes that go beyond the everyday list, dict, and tuple. Think of it as a toolbox of smarter containers — each one designed to solve a specific problem more elegantly and efficiently than a plain dict or list.
          <br /><br />
          You import what you need: <code>from collections import Counter, defaultdict, OrderedDict, deque, namedtuple, ChainMap</code>. No pip install needed — it is part of the standard library.
        </TheoryCard>
        <CodeBlock
          filename="collections_import.py"
          code={`from collections import (
    Counter,       # count hashable objects
    defaultdict,   # dict with automatic default values
    OrderedDict,   # dict that remembers insertion order
    deque,         # double-ended queue
    namedtuple,    # tuple with named fields
    ChainMap,      # group multiple dicts into one view
)
import heapq      # heap queue / priority queue (separate module)

# Each one solves a problem that would otherwise require verbose workarounds
print("All imported successfully!")`}
        />
      </Section>

      {/* Counter */}
      <Section title="Counter — Counting Made Simple">
        <TheoryCard>
          A <strong>Counter</strong> is like a tally sheet. You hand it any sequence and it automatically counts how many times each element appears. The result is a dict-like object where keys are elements and values are counts.
          <br /><br />
          Most useful methods: <code>most_common(n)</code> returns the n most frequent elements. You can add and subtract Counters with <code>+</code> and <code>-</code>. <code>elements()</code> returns all elements repeated by their count.
        </TheoryCard>
        <CodeBlock
          filename="counter.py"
          code={`from collections import Counter

# ── Creating a Counter ───────────────────────────────────────
c = Counter("abracadabra")
print(c)
# Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})

# From a list
scores = Counter([90, 85, 90, 72, 85, 90])
print(scores)
# Counter({90: 3, 85: 2, 72: 1})

# ── most_common() ───────────────────────────────────────────
words = "the cat sat on the mat the cat ate a rat".split()
wc = Counter(words)
print(wc.most_common(3))
# [('the', 3), ('cat', 2), ('sat', 1)]

# ── Arithmetic ──────────────────────────────────────────────
c1 = Counter(a=3, b=1)
c2 = Counter(a=1, b=2)

print(c1 + c2)   # Counter({'a': 4, 'b': 3})
print(c1 - c2)   # Counter({'a': 2})   — drops zero/negative

# ── elements() — expand back out ────────────────────────────
c = Counter(red=3, blue=1)
print(list(c.elements()))   # ['red', 'red', 'red', 'blue']

# ── Accessing missing keys ───────────────────────────────────
c = Counter("hello")
print(c["h"])   # 1
print(c["z"])   # 0  — never raises KeyError, returns 0`}
        />
        <ExerciseBox
          title="Practice: Word Frequency Counter"
          problem="Given the sentence below, find the 5 most common words (ignore punctuation and case). Print each word and its count."
          hints={[
            "Use .lower() and .replace() or re.sub() to strip punctuation",
            "Split on whitespace, pass the list to Counter",
            "Call .most_common(5) on the counter",
          ]}
          solutionCode={`from collections import Counter
import re

sentence = "To be or not to be that is the question whether tis nobler to be"

# Clean and split
words = re.sub(r"[^a-z ]", "", sentence.lower()).split()
freq = Counter(words)

print("Top 5 words:")
for word, count in freq.most_common(5):
    print(f"  {word!r}: {count}")`}
        />
      </Section>

      {/* defaultdict */}
      <Section title="defaultdict — Never See KeyError Again">
        <TheoryCard>
          A <strong>defaultdict</strong> is just like a regular dict, but when you access a key that doesn't exist yet, instead of raising a KeyError it automatically creates a default value using the factory function you provide.
          <br /><br />
          Common factories: <code>int</code> (defaults to 0), <code>list</code> (defaults to []), <code>set</code> (defaults to set()), <code>str</code> (defaults to ""). Use cases: grouping, counting, building adjacency lists for graphs.
        </TheoryCard>
        <CodeBlock
          filename="defaultdict.py"
          code={`from collections import defaultdict

# ── Regular dict problem ─────────────────────────────────────
d = {}
# d["missing"]   # KeyError!

# ── defaultdict with int factory ─────────────────────────────
counts = defaultdict(int)
for char in "mississippi":
    counts[char] += 1   # no KeyError — missing key starts at 0

print(dict(counts))
# {'m': 1, 'i': 4, 's': 4, 'p': 2}

# ── defaultdict with list factory ────────────────────────────
groups = defaultdict(list)
students = [("math", "Alice"), ("science", "Bob"), ("math", "Charlie"),
            ("science", "Diana"), ("history", "Eve")]

for subject, name in students:
    groups[subject].append(name)   # auto-creates [] for new subjects

print(dict(groups))
# {'math': ['Alice', 'Charlie'], 'science': ['Bob', 'Diana'], 'history': ['Eve']}

# ── defaultdict with set factory ─────────────────────────────
# Adjacency list for a graph
graph = defaultdict(set)
edges = [(1, 2), (1, 3), (2, 4), (3, 4)]

for src, dst in edges:
    graph[src].add(dst)
    graph[dst].add(src)   # undirected

print(dict(graph))
# {1: {2, 3}, 2: {1, 4}, 3: {1, 4}, 4: {2, 3}}

# ── Custom factory ───────────────────────────────────────────
dd = defaultdict(lambda: "N/A")
dd["name"] = "Alice"
print(dd["name"])    # Alice
print(dd["age"])     # N/A  — custom default`}
        />
        <ExerciseBox
          title="Practice: Group Words by First Letter"
          problem="Given a list of words, use a defaultdict to group them by their first letter. Print each letter with its group of words sorted alphabetically."
          hints={[
            "Use defaultdict(list) as your container",
            "Iterate words, use word[0].upper() as the key",
            "Sort the final groups before printing",
          ]}
          solutionCode={`from collections import defaultdict

words = ["apple", "avocado", "banana", "blueberry", "cherry",
         "apricot", "blackberry", "cranberry", "almond"]

groups = defaultdict(list)
for word in words:
    groups[word[0].upper()].append(word)

for letter in sorted(groups):
    print(f"  {letter}: {sorted(groups[letter])}")`}
        />
      </Section>

      {/* OrderedDict */}
      <Section title="OrderedDict — Order as a First-Class Feature">
        <TheoryCard>
          An <strong>OrderedDict</strong> remembers the order in which keys were inserted. While regular dicts in Python 3.7+ also maintain insertion order, OrderedDict provides extra operations: <code>move_to_end(key)</code> moves a key to the front or back, and <code>popitem(last=True)</code> removes and returns the last (or first) item.
          <br /><br />
          These extra operations make OrderedDict ideal for implementing LRU (Least Recently Used) caches — a common interview problem.
        </TheoryCard>
        <CodeBlock
          filename="ordered_dict.py"
          code={`from collections import OrderedDict

# ── Basic usage ──────────────────────────────────────────────
od = OrderedDict()
od["first"] = 1
od["second"] = 2
od["third"] = 3
print(list(od.keys()))   # ['first', 'second', 'third']

# ── move_to_end() ────────────────────────────────────────────
od.move_to_end("first")           # move to the END
print(list(od.keys()))            # ['second', 'third', 'first']

od.move_to_end("first", last=False)  # move to the FRONT
print(list(od.keys()))            # ['first', 'second', 'third']

# ── popitem() ────────────────────────────────────────────────
item = od.popitem(last=True)      # LIFO — remove last
print(item)                       # ('third', 3)

item = od.popitem(last=False)     # FIFO — remove first
print(item)                       # ('first', 1)

# ── Equality check respects order (unlike regular dict) ──────
od1 = OrderedDict([("a", 1), ("b", 2)])
od2 = OrderedDict([("b", 2), ("a", 1)])
print(od1 == od2)   # False — same keys/values, different order`}
        />
        <ExerciseBox
          title="Practice: LRU Cache Concept"
          problem="Implement a simple LRU (Least Recently Used) cache with a capacity of 3 using OrderedDict. When the cache is full and a new key is inserted, evict the least recently used item."
          hints={[
            "Use move_to_end() when a key is accessed to mark it as most recent",
            "Use popitem(last=False) to evict the least recently used item",
            "Check if key exists before deciding to evict",
          ]}
          solutionCode={`from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

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
            self.cache.popitem(last=False)  # evict least recently used

lru = LRUCache(3)
lru.put("a", 1)
lru.put("b", 2)
lru.put("c", 3)
print(list(lru.cache.keys()))  # ['a', 'b', 'c']

lru.get("a")                   # access 'a' — moves to end
lru.put("d", 4)                # evicts 'b' (least recently used)
print(list(lru.cache.keys()))  # ['c', 'a', 'd']`}
        />
      </Section>

      {/* deque */}
      <Section title="deque — Double-Ended Queue">
        <TheoryCard>
          A <strong>deque</strong> (pronounced "deck") is a double-ended queue — you can efficiently append and pop from both the left and right ends in O(1) time. With a regular Python list, <code>list.insert(0, x)</code> and <code>list.pop(0)</code> are O(n) because every element must shift.
          <br /><br />
          Key operations: <code>appendleft()</code>, <code>popleft()</code>, <code>rotate(n)</code> (rotate right by n, or left if n is negative). The <code>maxlen</code> parameter auto-discards old items — perfect for sliding windows.
        </TheoryCard>
        <CodeBlock
          filename="deque.py"
          code={`from collections import deque

# ── Basic operations ─────────────────────────────────────────
dq = deque([1, 2, 3])
dq.append(4)          # add to right
dq.appendleft(0)      # add to left — O(1)!
print(dq)             # deque([0, 1, 2, 3, 4])

dq.pop()              # remove from right
dq.popleft()          # remove from left — O(1)!
print(dq)             # deque([1, 2, 3])

# ── rotate() ─────────────────────────────────────────────────
dq = deque([1, 2, 3, 4, 5])
dq.rotate(2)          # rotate right by 2
print(dq)             # deque([4, 5, 1, 2, 3])

dq.rotate(-2)         # rotate left by 2 — back to original
print(dq)             # deque([1, 2, 3, 4, 5])

# ── maxlen — fixed-size sliding window ───────────────────────
recent = deque(maxlen=3)   # only keeps last 3 items
for val in [10, 20, 30, 40, 50]:
    recent.append(val)
    print(list(recent))
# [10]
# [10, 20]
# [10, 20, 30]
# [20, 30, 40]   ← 10 auto-discarded
# [30, 40, 50]   ← 20 auto-discarded

# ── Using deque as a queue (FIFO) ────────────────────────────
queue = deque()
queue.append("task1")
queue.append("task2")
queue.append("task3")

while queue:
    print(f"Processing: {queue.popleft()}")`}
        />
        <ExerciseBox
          title="Practice: Sliding Window Maximum"
          problem="Given a list of numbers and a window size k, return the maximum value in each sliding window of size k."
          hints={[
            "Use a deque with maxlen=k to hold the current window",
            "After filling the window, compute max(window) for each step",
            "Append new number and let maxlen auto-discard the oldest",
          ]}
          solutionCode={`from collections import deque

def sliding_window_max(nums, k):
    window = deque(maxlen=k)
    results = []
    for i, num in enumerate(nums):
        window.append(num)
        if i >= k - 1:    # window is full
            results.append(max(window))
    return results

nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
k = 3
print(sliding_window_max(nums, k))
# [4, 4, 5, 9, 9, 9, 6, 6]`}
        />
      </Section>

      {/* namedtuple */}
      <Section title="namedtuple — Readable Tuples with Named Fields">
        <TheoryCard>
          A <strong>namedtuple</strong> is a tuple subclass with named fields. It is just as memory-efficient as a regular tuple (no __dict__ overhead) but you access elements by name rather than index — making code self-documenting.
          <br /><br />
          Special helpers: <code>._make(iterable)</code> creates an instance from any iterable. <code>._asdict()</code> returns a dict. <code>._replace(**kwargs)</code> returns a new instance with selected fields changed (since tuples are immutable).
        </TheoryCard>
        <CodeBlock
          filename="namedtuple.py"
          code={`from collections import namedtuple

# ── Defining a namedtuple ────────────────────────────────────
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)

print(p.x, p.y)       # 3 4  — by name
print(p[0], p[1])     # 3 4  — still a tuple, index works too
print(p)              # Point(x=3, y=4)  — nice repr

# ── ._make() — create from iterable ─────────────────────────
coords = [10, 20]
p2 = Point._make(coords)
print(p2)             # Point(x=10, y=20)

# ── ._asdict() — convert to dict ────────────────────────────
print(p._asdict())    # {'x': 3, 'y': 4}

# ── ._replace() — immutable update ──────────────────────────
p3 = p._replace(x=99)
print(p3)             # Point(x=99, y=4)
print(p)              # Point(x=3, y=4)  — original unchanged

# ── More complex example: Student record ─────────────────────
Student = namedtuple("Student", ["name", "grade", "gpa"])

students = [
    Student("Alice", "A", 3.9),
    Student("Bob",   "B", 3.1),
    Student("Charlie","A", 3.7),
]

# Sort by GPA descending
top = sorted(students, key=lambda s: s.gpa, reverse=True)
for s in top:
    print(f"{s.name}: {s.gpa}")`}
        />
        <ExerciseBox
          title="Practice: Model a Point and a Student"
          problem="Define a Point3D namedtuple and compute the distance from the origin. Then define a Student namedtuple and find the student with the highest GPA."
          hints={[
            "Point3D needs x, y, z fields",
            "Distance formula: sqrt(x^2 + y^2 + z^2)",
            "Use max(students, key=lambda s: s.gpa)",
          ]}
          solutionCode={`from collections import namedtuple
import math

# Point3D
Point3D = namedtuple("Point3D", ["x", "y", "z"])

p = Point3D(1, 2, 2)
distance = math.sqrt(p.x**2 + p.y**2 + p.z**2)
print(f"Distance from origin: {distance}")  # 3.0

# Student
Student = namedtuple("Student", ["name", "major", "gpa"])

students = [
    Student("Alice", "CS", 3.95),
    Student("Bob", "Math", 3.70),
    Student("Carol", "CS", 3.88),
]

best = max(students, key=lambda s: s.gpa)
print(f"Top student: {best.name} ({best.gpa})")`}
        />
      </Section>

      {/* ChainMap */}
      <Section title="ChainMap — Layered Configuration">
        <TheoryCard>
          A <strong>ChainMap</strong> groups multiple dictionaries into a single view. Lookups search through the maps in order, returning the first match found. Only the first map is writable — updates and deletions affect only the first dict.
          <br /><br />
          Perfect use case: layered configuration where user settings override default settings, and environment variables override everything. No need to manually merge dicts.
        </TheoryCard>
        <CodeBlock
          filename="chainmap.py"
          code={`from collections import ChainMap

# ── Basic usage ──────────────────────────────────────────────
defaults = {"theme": "dark", "language": "en", "debug": False, "timeout": 30}
user_prefs = {"theme": "light", "language": "fr"}
env_vars   = {"debug": True}

# Priority: env_vars > user_prefs > defaults
config = ChainMap(env_vars, user_prefs, defaults)

print(config["theme"])     # 'light'     — from user_prefs
print(config["debug"])     # True        — from env_vars
print(config["timeout"])   # 30          — from defaults
print(config["language"])  # 'fr'        — from user_prefs

# ── Updates only affect the FIRST map ────────────────────────
config["new_key"] = "new_value"
print(env_vars)   # {'debug': True, 'new_key': 'new_value'}
print(user_prefs) # unchanged

# ── .maps — access all underlying dicts ──────────────────────
for m in config.maps:
    print(m)

# ── .new_child() — add a new layer on top ────────────────────
session_overrides = {"theme": "auto"}
session_config = config.new_child(session_overrides)
print(session_config["theme"])   # 'auto'  — session wins
print(config["theme"])           # 'light' — original unchanged

# ── .parents — view without the first map ────────────────────
print(config.parents["theme"])   # 'light' — skips env_vars`}
        />
        <ExerciseBox
          title="Practice: Layer Default + User Config"
          problem="Create a configuration system with three layers: defaults, a user config, and command-line args. Merge them with ChainMap so higher layers override lower ones. Print the resolved value for each key."
          hints={[
            "Order in ChainMap: cli_args, user_config, defaults",
            "Use dict comprehension or direct dict literals for each layer",
            "Iterate config.keys() to print all resolved values",
          ]}
          solutionCode={`from collections import ChainMap

defaults = {
    "host": "localhost",
    "port": 8000,
    "debug": False,
    "workers": 1,
}

user_config = {
    "port": 9000,
    "debug": True,
}

cli_args = {
    "workers": 4,
}

config = ChainMap(cli_args, user_config, defaults)

print("Resolved configuration:")
for key in sorted(set(config.keys())):
    value = config[key]
    # find which layer provided this value
    for i, m in enumerate(config.maps):
        if key in m:
            source = ["cli_args", "user_config", "defaults"][i]
            break
    print(f"  {key} = {value!r}  (from {source})")`}
        />
      </Section>

      {/* heapq */}
      <Section title="heapq — Priority Queue">
        <TheoryCard>
          <strong>heapq</strong> implements a min-heap — a binary tree where every parent is smaller than its children. The smallest element is always at index 0. Python's heapq module operates on regular lists and provides O(log n) push/pop operations.
          <br /><br />
          Key functions: <code>heappush(heap, item)</code>, <code>heappop(heap)</code> always removes the smallest. <code>nlargest(n, iterable)</code> and <code>nsmallest(n, iterable)</code> are efficient shortcuts. To simulate a max-heap, negate your values.
        </TheoryCard>
        <CodeBlock
          filename="heapq.py"
          code={`import heapq

# ── Min-heap basics ──────────────────────────────────────────
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
heapq.heappush(heap, 2)

print(heap)              # [1, 2, 3, 5] — always sorted structurally
print(heapq.heappop(heap))   # 1 — smallest
print(heapq.heappop(heap))   # 2

# ── heapify — convert existing list ──────────────────────────
data = [10, 5, 8, 1, 7, 3]
heapq.heapify(data)   # O(n) in-place conversion
print(data)           # [1, 5, 3, 10, 7, 8]
print(data[0])        # 1 — smallest always at index 0

# ── nlargest / nsmallest ─────────────────────────────────────
scores = [45, 92, 78, 88, 55, 99, 61, 74]
print(heapq.nlargest(3, scores))    # [99, 92, 88]
print(heapq.nsmallest(3, scores))   # [45, 55, 61]

# ── Max-heap trick: negate values ────────────────────────────
max_heap = []
for val in [5, 1, 8, 3]:
    heapq.heappush(max_heap, -val)   # store negated

print(-heapq.heappop(max_heap))   # 8 — largest first

# ── Priority queue with (priority, item) tuples ──────────────
tasks = []
heapq.heappush(tasks, (3, "low priority task"))
heapq.heappush(tasks, (1, "urgent task"))
heapq.heappush(tasks, (2, "normal task"))

while tasks:
    priority, name = heapq.heappop(tasks)
    print(f"[P{priority}] {name}")`}
        />
        <ExerciseBox
          title="Practice: Find Top 3 Scores"
          problem="Given a list of student (name, score) tuples, find the top 3 students by score using heapq. Then find the 3 lowest scores."
          hints={[
            "Use heapq.nlargest with a key function",
            "key=lambda x: x[1] extracts the score for comparison",
            "heapq.nsmallest works the same way",
          ]}
          solutionCode={`import heapq

students = [
    ("Alice", 88),
    ("Bob", 95),
    ("Charlie", 72),
    ("Diana", 91),
    ("Eve", 65),
    ("Frank", 83),
    ("Grace", 97),
]

top3 = heapq.nlargest(3, students, key=lambda s: s[1])
print("Top 3 students:")
for name, score in top3:
    print(f"  {name}: {score}")

bottom3 = heapq.nsmallest(3, students, key=lambda s: s[1])
print("Bottom 3 students:")
for name, score in bottom3:
    print(f"  {name}: {score}")`}
        />
      </Section>
    </PageLayout>
  );
}
