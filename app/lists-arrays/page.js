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

const comparisonRows = [
  { feature: "Mutable", list: "Yes — can change items", tuple: "No — immutable" },
  { feature: "Syntax", list: "[1, 2, 3]", tuple: "(1, 2, 3)" },
  { feature: "Memory", list: "More (dynamic resizing)", tuple: "Less (fixed)" },
  { feature: "Speed", list: "Slightly slower", tuple: "Slightly faster" },
  { feature: "Hashable", list: "No — cannot be dict key", tuple: "Yes (if elements are hashable)" },
  { feature: "Use case", list: "Dynamic collections", tuple: "Fixed records, dict keys" },
];

export default function ListsArraysPage() {
  return (
    <PageLayout title="Lists, Tuples & Arrays"
      subtitle="Deep dive into Python sequences, sets, and typed arrays."
    >
      {/* Lists */}
      <Section title="Lists — The Swiss Army Knife">
        <TheoryCard>
          A <strong>list</strong> is Python's most versatile container: ordered, mutable, and heterogeneous — you can store any mix of types. Lists are dynamic; they grow and shrink automatically.
          <br /><br />
          Internally, a Python list is an array of pointers (references) to objects, not the objects themselves. This means lists can hold any object regardless of size, but the references take up memory even for an empty list.
        </TheoryCard>
        <CodeBlock
          filename="list_creation.py"
          code={`# ── Creating lists ───────────────────────────────────────────
empty = []
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True, None, [1, 2]]   # heterogeneous!
from_range = list(range(10))     # [0, 1, 2, ..., 9]
from_string = list("hello")      # ['h', 'e', 'l', 'l', 'o']

# ── Indexing & slicing (same rules as strings) ────────────────
nums = [10, 20, 30, 40, 50]
print(nums[0])     # 10
print(nums[-1])    # 50
print(nums[1:4])   # [20, 30, 40]
print(nums[::-1])  # [50, 40, 30, 20, 10]

# ── Modifying items ───────────────────────────────────────────
nums[0] = 99       # direct assignment
nums[1:3] = [200, 300]   # slice assignment
print(nums)        # [99, 200, 300, 40, 50]`}
        />
        <CodeBlock
          filename="list_methods.py"
          code={`fruits = ["apple", "banana", "cherry"]

# ── Adding items ─────────────────────────────────────────────
fruits.append("date")          # add to end:    O(1)
fruits.extend(["elderberry", "fig"])   # add multiple
fruits.insert(1, "avocado")   # insert at index: O(n)
print(fruits)

# ── Removing items ────────────────────────────────────────────
fruits.remove("banana")        # remove by value (first occurrence)
popped = fruits.pop()          # remove & return last:  O(1)
popped_at = fruits.pop(1)      # remove & return at index: O(n)
fruits.clear()                 # remove all

fruits = ["cherry", "apple", "banana", "apple"]
print(fruits.count("apple"))   # 2
print(fruits.index("banana"))  # 2 (first occurrence)

# ── Sorting ──────────────────────────────────────────────────
fruits.sort()                  # in-place, ascending
fruits.sort(reverse=True)      # in-place, descending
fruits.sort(key=len)           # sort by string length
fruits.sort(key=lambda x: x[-1])   # sort by last char

# sorted() returns a NEW list — doesn't modify original
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_nums = sorted(numbers)
print(sorted_nums)   # [1, 1, 2, 3, 4, 5, 6, 9]
print(numbers)       # original unchanged

fruits.reverse()     # in-place reverse
copy = fruits.copy() # shallow copy`}
        />
        <CodeBlock
          filename="list_comprehensions.py"
          code={`# ── Basic list comprehension ─────────────────────────────────
squares = [x**2 for x in range(10)]
print(squares)   # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# ── With condition (filter) ───────────────────────────────────
evens = [x for x in range(20) if x % 2 == 0]
print(evens)   # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# ── Transformation + filter ───────────────────────────────────
words = ["hello", "world", "python", "is", "fun"]
long_upper = [w.upper() for w in words if len(w) > 3]
print(long_upper)   # ['HELLO', 'WORLD', 'PYTHON']

# ── Nested comprehension ──────────────────────────────────────
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [cell for row in matrix for cell in row]
print(flat)   # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# ── enumerate() — index + value ───────────────────────────────
for i, fruit in enumerate(["apple", "banana", "cherry"], start=1):
    print(f"{i}. {fruit}")

# ── zip() — iterate multiple lists together ──────────────────
names = ["Alice", "Bob", "Carol"]
scores = [92, 78, 85]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# ── map() and filter() ────────────────────────────────────────
doubled = list(map(lambda x: x * 2, [1, 2, 3, 4]))
odds    = list(filter(lambda x: x % 2 != 0, range(10)))
print(doubled)   # [2, 4, 6, 8]
print(odds)      # [1, 3, 5, 7, 9]

# ── Unpacking ─────────────────────────────────────────────────
a, b, c = [1, 2, 3]                  # exact match
first, *rest = [1, 2, 3, 4, 5]       # first=1, rest=[2,3,4,5]
*init, last = [1, 2, 3, 4, 5]        # init=[1,2,3,4], last=5
head, *middle, tail = [1, 2, 3, 4]   # head=1, middle=[2,3], tail=4`}
        />
      </Section>

      {/* 2D Lists */}
      <Section title="2D Lists — Nested Lists & Matrices">
        <TheoryCard>
          A 2D list (list of lists) represents a matrix or grid. Each element of the outer list is itself a list. Access elements with <code>matrix[row][col]</code>. Be careful when creating 2D lists — using <code>[[0]*3]*3</code> creates three references to the same inner list, not three independent lists.
        </TheoryCard>
        <CodeBlock
          filename="2d_lists.py"
          code={`# ── Creating a 2D list ───────────────────────────────────────
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

# ── Accessing elements ────────────────────────────────────────
print(matrix[0][0])   # 1 — top-left
print(matrix[1][2])   # 6 — row 1, col 2
print(matrix[2][1])   # 8

# ── The wrong way to create a 2D list ────────────────────────
wrong = [[0] * 3] * 3   # THREE REFERENCES to SAME inner list!
wrong[0][0] = 99
print(wrong)   # [[99, 0, 0], [99, 0, 0], [99, 0, 0]]  — all rows changed!

# ── The right way ─────────────────────────────────────────────
correct = [[0] * 3 for _ in range(3)]   # each row is a NEW list
correct[0][0] = 99
print(correct)   # [[99, 0, 0], [0, 0, 0], [0, 0, 0]]  — only first row

# ── Iterating a matrix ────────────────────────────────────────
for row in matrix:
    for val in row:
        print(val, end=" ")
    print()

# ── Transposing with list comprehension ───────────────────────
transposed = [[matrix[row][col] for row in range(3)] for col in range(3)]

# ── Flattening ───────────────────────────────────────────────
flat = [cell for row in matrix for cell in row]
print(flat)   # [1, 2, 3, 4, 5, 6, 7, 8, 9]`}
        />
      </Section>

      {/* Tuples */}
      <Section title="Tuples — Immutable Sequences">
        <TheoryCard>
          A <strong>tuple</strong> is an immutable sequence. Once created, you cannot add, remove, or change its elements. This immutability is a feature — it signals that this data should not change, makes tuples hashable (usable as dict keys or set elements), and makes them slightly more memory-efficient than lists.
          <br /><br />
          A single-element tuple requires a trailing comma: <code>(1,)</code> — without the comma, <code>(1)</code> is just the integer 1 in parentheses.
        </TheoryCard>
        <CodeBlock
          filename="tuples.py"
          code={`# ── Creating tuples ─────────────────────────────────────────
empty = ()
single = (1,)          # trailing comma is REQUIRED for single element
point = (3, 4)
coords = (10, 20, 30)
no_parens = 1, 2, 3    # parentheses are optional!

# ── Indexing (same as list) ───────────────────────────────────
print(point[0])    # 3
print(point[-1])   # 4

# ── Immutable — cannot modify ─────────────────────────────────
try:
    point[0] = 99
except TypeError as e:
    print(e)   # 'tuple' object does not support item assignment

# ── Tuple unpacking ───────────────────────────────────────────
x, y = point
print(x, y)   # 3 4

# Swap without temp variable
a, b = 10, 20
a, b = b, a
print(a, b)   # 20 10

# ── Tuples as dict keys ───────────────────────────────────────
locations = {(40.7128, -74.0060): "New York", (51.5074, -0.1278): "London"}

# ── Named tuple (see collections page for more) ───────────────
from collections import namedtuple
Color = namedtuple("Color", ["r", "g", "b"])
red = Color(255, 0, 0)
print(red.r, red.g, red.b)   # 255 0 0`}
        />
      </Section>

      {/* List vs Tuple comparison */}
      <Section title="List vs Tuple — Side-by-Side Comparison">
        <Explain>
          Choosing between list and tuple comes down to one question: should this data change? If yes, use a list. If no, use a tuple.
        </Explain>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-x-auto my-4"
        >
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-3 text-left text-(--fg-subtle) font-semibold border-b border-default">Feature</th>
                <th className="p-3 text-left font-semibold border-b border-default">
                  List [ ]
                </th>
                <th className="p-3 text-left font-semibold border-b border-default">
                  Tuple ( )
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  variants={itemVariants}
                  className="border-b border-[#1a1a2e]"
                  style={{ background: i % 2 === 0 ? "rgba(26,26,46,0.5)" : "transparent" }}
                >
                  <td className="p-3 text-(--fg-subtle) font-medium">{row.feature}</td>
                  <td className="p-3 text-(--fg-muted)">{row.list}</td>
                  <td className="p-3 text-(--fg-muted)">{row.tuple}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <Callout type="tip">
          A useful rule: use tuples for data that is structurally fixed (coordinates, RGB colors, database rows), use lists for collections that will be modified (shopping carts, task queues, search results).
        </Callout>
      </Section>

      {/* Sets */}
      <Section title="Sets — Unique Elements & Fast Lookup">
        <TheoryCard>
          A <strong>set</strong> is an unordered collection of unique elements. The killer feature: membership testing (<code>x in s</code>) is O(1) — instant, no matter how large the set — because sets use a hash table internally.
          <br /><br />
          Sets support all the mathematical set operations: union (<code>|</code>), intersection (<code>&</code>), difference (<code>-</code>), and symmetric difference (<code>^</code>). Use <code>set()</code> to create from an iterable, or <code>{"{}"}</code> for a literal (but <code>{"{}"}</code> alone creates an empty dict — use <code>set()</code> for empty set).
        </TheoryCard>
        <CodeBlock
          filename="sets.py"
          code={`# ── Creating sets ────────────────────────────────────────────
s = {1, 2, 3, 4, 5}
from_list = set([1, 2, 2, 3, 3, 3])   # duplicates removed
print(from_list)   # {1, 2, 3}

empty_set = set()   # NOT {} — that creates an empty dict!

# ── O(1) membership test ─────────────────────────────────────
big_set = set(range(1_000_000))
print(999_999 in big_set)   # True — instant!

# ── Set methods ───────────────────────────────────────────────
s = {1, 2, 3}
s.add(4)           # add single element
s.update([5, 6])   # add multiple elements
s.remove(1)        # remove — raises KeyError if not found
s.discard(99)      # remove — NO error if not found
popped = s.pop()   # remove and return an arbitrary element

# ── Set operations ────────────────────────────────────────────
a = {1, 2, 3, 4, 5}
b = {4, 5, 6, 7, 8}

print(a | b)   # union:                {1, 2, 3, 4, 5, 6, 7, 8}
print(a & b)   # intersection:         {4, 5}
print(a - b)   # difference (in a, not b): {1, 2, 3}
print(b - a)   # difference (in b, not a): {6, 7, 8}
print(a ^ b)   # symmetric difference: {1, 2, 3, 6, 7, 8}

# ── Subset / superset checks ─────────────────────────────────
print({1, 2} <= {1, 2, 3})   # True — is subset?
print({1, 2, 3} >= {1, 2})   # True — is superset?
print({1, 2}.isdisjoint({3, 4}))  # True — no common elements?

# ── Frozen set (immutable, hashable) ─────────────────────────
fs = frozenset([1, 2, 3])
# fs.add(4)  # AttributeError — frozen!
d = {fs: "value"}   # can be used as dict key`}
        />

        <ExerciseBox
          title="Practice: Remove Duplicates Preserving Order"
          problem="Given a list with duplicates, remove duplicates while preserving the original order. (A plain set() doesn't preserve order.)"
          hints={[
            "Iterate the list, add each item to a set to track seen items",
            "Only add to result if the item hasn't been seen yet",
            "This is O(n) time and O(n) space",
          ]}
          solutionCode={`def remove_duplicates_ordered(lst):
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

data = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
print(remove_duplicates_ordered(data))
# [3, 1, 4, 5, 9, 2, 6]`}
        />
      </Section>

      {/* array module */}
      <Section title="array Module — Typed Arrays">
        <TheoryCard>
          Python's <code>array</code> module provides typed arrays — unlike lists that can hold any Python object, array elements must all be the same C-level type (like integer or float). This makes them significantly more memory-efficient for large collections of numbers.
          <br /><br />
          Type codes: <code>'i'</code> = signed int, <code>'f'</code> = float, <code>'d'</code> = double, <code>'b'</code> = signed char. When to use: when you need memory efficiency for a large homogeneous numeric dataset but don't want to install NumPy.
        </TheoryCard>
        <CodeBlock
          filename="array_module.py"
          code={`import array
import sys

# ── Creating a typed array ────────────────────────────────────
# 'i' = signed int (typically 4 bytes each)
int_array = array.array('i', [1, 2, 3, 4, 5])
print(int_array)          # array('i', [1, 2, 3, 4, 5])
print(int_array[0])       # 1  — same indexing as list
print(int_array.typecode) # 'i'

# ── Memory comparison ─────────────────────────────────────────
py_list = list(range(10_000))
typed_array = array.array('i', range(10_000))

print(f"List size:  {sys.getsizeof(py_list):,} bytes")
print(f"Array size: {sys.getsizeof(typed_array):,} bytes")
# Array is MUCH smaller because it stores raw C integers

# ── Float array ───────────────────────────────────────────────
floats = array.array('d', [1.1, 2.2, 3.3, 4.4])  # 'd' = double
floats.append(5.5)
print(floats)

# ── Type enforcement ──────────────────────────────────────────
try:
    int_array.append(3.14)   # Can't add a float to int array
except TypeError as e:
    print(e)

# ── Slicing returns a new array ───────────────────────────────
slice_arr = int_array[1:4]
print(slice_arr)   # array('i', [2, 3, 4])

# ── When to use: large homogeneous numeric data, no NumPy ────
# For heavy computation, prefer NumPy (see below)`}
        />
      </Section>

      {/* NumPy mention */}
      <Section title="NumPy Arrays — For Heavy Number Crunching">
        <TheoryCard>
          <strong>NumPy</strong> is the foundation of Python's scientific computing ecosystem. NumPy arrays are stored as contiguous blocks of memory (like C arrays), support element-wise operations without Python loops, and have a massive ecosystem (SciPy, Pandas, TensorFlow all build on NumPy).
          <br /><br />
          NumPy is not in the standard library — install it with <code>pip install numpy</code>. If you are working with matrices, linear algebra, image data, or any large numerical dataset, NumPy is the right choice.
        </TheoryCard>
        <CodeBlock
          filename="numpy_intro.py"
          code={`# pip install numpy
import numpy as np

# ── Creating arrays ──────────────────────────────────────────
a = np.array([1, 2, 3, 4, 5])
zeros = np.zeros((3, 4))          # 3x4 matrix of zeros
ones = np.ones((2, 3))            # 2x3 matrix of ones
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)  # 5 evenly spaced points

# ── Element-wise operations (no loop needed!) ─────────────────
a = np.array([1, 2, 3, 4, 5])
print(a * 2)         # [2, 4, 6, 8, 10]   — vectorized!
print(a ** 2)        # [1, 4, 9, 16, 25]
print(a + a)         # [2, 4, 6, 8, 10]

# ── 2D arrays (matrices) ──────────────────────────────────────
matrix = np.array([[1, 2], [3, 4], [5, 6]])
print(matrix.shape)  # (3, 2) — 3 rows, 2 cols
print(matrix.T)      # transpose — (2, 3)

# ── Useful operations ─────────────────────────────────────────
print(a.sum(), a.mean(), a.max(), a.min(), a.std())
print(np.dot(np.array([1,2,3]), np.array([4,5,6])))  # dot product = 32

# ── Boolean indexing ──────────────────────────────────────────
a = np.array([10, 20, 30, 40, 50])
print(a[a > 25])   # [30 40 50]   — filter without a loop!`}
        />
        <Callout type="info">
          For everyday Python (web dev, scripts, APIs), the built-in list is fine. Use NumPy when you are doing math-heavy work: machine learning data prep, signal processing, scientific simulation, or image manipulation.
        </Callout>
      </Section>

      {/* Practice Exercises */}
      <Section title="Practice Exercises">
        <ExerciseBox
          title="Practice: Flatten a 2D List"
          problem="Write a function that flattens a 2D list (list of lists) into a single flat list — without using any imports."
          hints={[
            "A list comprehension with two for clauses does this in one line",
            "Alternatively, use a loop: for row in matrix: for item in row: result.append(item)",
          ]}
          solutionCode={`def flatten(matrix):
    return [item for row in matrix for item in row]

grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(flatten(grid))   # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Bonus: handle variable-length rows
jagged = [[1, 2], [3, 4, 5], [6]]
print(flatten(jagged))  # [1, 2, 3, 4, 5, 6]`}
        />

        <ExerciseBox
          title="Practice: Find Intersection of Two Lists"
          problem="Given two lists, find all elements that appear in both lists. Return the result without duplicates and in sorted order."
          hints={[
            "Convert both lists to sets and use the & operator",
            "sorted() on a set gives a sorted list",
            "This approach is O(n + m) — much better than a nested loop",
          ]}
          solutionCode={`def intersection(a, b):
    return sorted(set(a) & set(b))

list1 = [1, 2, 3, 4, 5, 5, 6]
list2 = [4, 5, 6, 7, 8, 5]
print(intersection(list1, list2))   # [4, 5, 6]

# What about preserving order from list1?
def intersection_ordered(a, b):
    b_set = set(b)
    seen = set()
    result = []
    for item in a:
        if item in b_set and item not in seen:
            result.append(item)
            seen.add(item)
    return result

print(intersection_ordered(list1, list2))  # [4, 5, 6]`}
        />

        <ExerciseBox
          title="Practice: Rotate a List by K Steps"
          problem="Given a list and an integer k, rotate the list to the right by k positions. For example, rotating [1,2,3,4,5] by 2 gives [4,5,1,2,3]."
          hints={[
            "Use slicing: result = lst[-k:] + lst[:-k]",
            "Handle k > len(lst) with k = k % len(lst)",
            "An empty list or k=0 should return the list unchanged",
          ]}
          solutionCode={`def rotate_right(lst, k):
    if not lst:
        return lst
    k = k % len(lst)   # handle k > len
    return lst[-k:] + lst[:-k]

nums = [1, 2, 3, 4, 5]
print(rotate_right(nums, 2))   # [4, 5, 1, 2, 3]
print(rotate_right(nums, 0))   # [1, 2, 3, 4, 5]
print(rotate_right(nums, 7))   # [4, 5, 1, 2, 3]  (7 % 5 = 2)

# Left rotate (just use negative k or flip the slices)
def rotate_left(lst, k):
    if not lst:
        return lst
    k = k % len(lst)
    return lst[k:] + lst[:k]

print(rotate_left(nums, 2))   # [3, 4, 5, 1, 2]`}
        />
      </Section>
    </PageLayout>
  );
}
