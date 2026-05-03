"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const comparisonRows = [
  { feature: "Best for", threading: "I/O-bound tasks", multiprocessing: "CPU-bound tasks", asyncio: "I/O-bound (high concurrency)" },
  { feature: "Parallelism", threading: "Concurrent (GIL limits)", multiprocessing: "True parallel", asyncio: "Cooperative concurrency" },
  { feature: "Memory", threading: "Shared memory", multiprocessing: "Separate memory", asyncio: "Shared (single thread)" },
  { feature: "Overhead", threading: "Low", multiprocessing: "High (process spawn)", asyncio: "Very low" },
  { feature: "Complexity", threading: "Medium", multiprocessing: "Medium-High", asyncio: "Medium (async/await)" },
  { feature: "GIL affected?", threading: "Yes", multiprocessing: "No", asyncio: "Yes (but 1 thread)" },
  { feature: "Use case example", threading: "File downloads, DB calls", multiprocessing: "Image processing, ML", asyncio: "Web servers, chat apps" },
];

export default function ThreadsPage() {
  return (
    <PageLayout title="Threads & Concurrency"
      subtitle="Master threading, multiprocessing, and asyncio — know when to use each and why the GIL matters."
    >
      {/* What is a Thread */}
      <Section title="What is a Thread?">
        <Explain>
          A thread is the smallest unit of execution within a process. Think of your Python program as a restaurant kitchen. A single-threaded program has one chef doing everything — chopping, cooking, plating — one step at a time. A multi-threaded program has multiple chefs (threads) working simultaneously inside the same kitchen (process), sharing the same fridge and utensils (memory).
        </Explain>
        <Callout type="info">
          All threads in a process share the same memory space. This makes sharing data easy, but also introduces race conditions when multiple threads write to the same variable at the same time.
        </Callout>
        <CodeBlock
          filename="thread_basic.py"
          code={`import threading
import time

def chef(name, dish, seconds):
    print(f"{name} starts cooking {dish}...")
    time.sleep(seconds)   # simulate cooking time
    print(f"{name} finished {dish}!")

# Without threading — sequential (slow)
# chef("Alice", "pasta", 3)
# chef("Bob", "salad", 2)

# With threading — concurrent (fast)
t1 = threading.Thread(target=chef, args=("Alice", "pasta", 3))
t2 = threading.Thread(target=chef, args=("Bob",   "salad", 2))

t1.start()   # Alice starts
t2.start()   # Bob starts immediately (doesn't wait for Alice)

t1.join()    # main thread waits for t1
t2.join()    # main thread waits for t2

print("All dishes ready — dinner is served!")
# Total time ≈ 3 seconds, not 5`}
        />
      </Section>

      {/* threading module */}
      <Section title="threading Module — Thread, start(), join(), daemon">
        <Explain>
          Python's built-in <code className="fg">threading</code> module provides the <code className="fg">Thread</code> class. You can create threads by passing a target function, start them with <code className="fg">.start()</code>, and wait for them to finish with <code className="fg">.join()</code>. Daemon threads automatically die when the main thread exits.
        </Explain>
        <CodeBlock
          filename="threading_module.py"
          code={`import threading
import time

# --- Basic Thread ---
def worker(thread_id):
    print(f"Thread {thread_id}: starting")
    time.sleep(1)
    print(f"Thread {thread_id}: done")

threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()   # block main thread until each worker finishes

print("All workers finished")

# --- Subclassing Thread ---
class MyThread(threading.Thread):
    def __init__(self, name):
        super().__init__()
        self.name = name

    def run(self):   # override run(), NOT start()
        print(f"{self.name} is running")
        time.sleep(0.5)

t = MyThread("CustomThread")
t.start()
t.join()

# --- Daemon Threads ---
def background_task():
    while True:
        print("Background: heartbeat")
        time.sleep(1)

d = threading.Thread(target=background_task, daemon=True)
# daemon=True: this thread dies automatically when main exits
d.start()

time.sleep(2.5)
print("Main thread done — daemon will be killed automatically")`}
        />
        <Callout type="warning">
          Never call <code>.run()</code> directly — that runs the function in the current thread. Always call <code>.start()</code> to spin up a new thread.
        </Callout>
      </Section>

      {/* Race Conditions */}
      <Section title="Race Conditions — The Broken Counter">
        <Explain>
          A race condition happens when two or more threads read and write a shared variable concurrently, and the final result depends on the exact order (the "race") in which they execute. The result is non-deterministic and usually wrong.
        </Explain>
        <CodeBlock
          filename="race_condition.py"
          code={`import threading

counter = 0   # shared mutable state

def increment():
    global counter
    for _ in range(100_000):
        # This is NOT atomic — it's actually 3 steps:
        # 1. READ  counter
        # 2. ADD   1
        # 3. WRITE counter
        # Another thread can interrupt between any of these steps!
        counter += 1

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

t1.start()
t2.start()

t1.join()
t2.join()

print(f"Expected: 200000")
print(f"Got:      {counter}")
# Output varies — you might see 143782, 167341, etc.
# The result is WRONG and changes every run`}
        />
        <Callout type="warning">
          Race conditions are silent bugs — your program does not crash, it just produces wrong answers. They are especially tricky because they may not appear in testing (timing-dependent).
        </Callout>
      </Section>

      {/* Lock */}
      <Section title="Lock (threading.Lock) — Fix the Race Condition">
        <Explain>
          A <code className="fg">Lock</code> is a synchronization primitive. Only one thread can hold a lock at a time. Any other thread that tries to acquire it will block until the lock is released. This ensures the read-add-write sequence is atomic.
        </Explain>
        <CodeBlock
          filename="lock_example.py"
          code={`import threading

counter = 0
lock = threading.Lock()   # one lock, shared by all threads

def safe_increment():
    global counter
    for _ in range(100_000):
        lock.acquire()     # block until we own the lock
        try:
            counter += 1   # only one thread executes this at a time
        finally:
            lock.release() # ALWAYS release, even on exception

# Better: use 'with' statement (auto acquire + release)
def safe_increment_v2():
    global counter
    for _ in range(100_000):
        with lock:          # acquire on entry, release on exit
            counter += 1

t1 = threading.Thread(target=safe_increment_v2)
t2 = threading.Thread(target=safe_increment_v2)

t1.start()
t2.start()

t1.join()
t2.join()

print(f"Expected: 200000")
print(f"Got:      {counter}")   # Always 200000 — correct!`}
        />
      </Section>

      {/* RLock */}
      <Section title="RLock — Reentrant Lock">
        <Explain>
          A regular <code className="fg">Lock</code> will deadlock if the same thread tries to acquire it twice. An <code className="fg">RLock</code> (Reentrant Lock) allows the same thread to acquire it multiple times, as long as it releases it the same number of times.
        </Explain>
        <CodeBlock
          filename="rlock_example.py"
          code={`import threading

rlock = threading.RLock()

def outer():
    with rlock:
        print("outer: acquired rlock")
        inner()   # calls inner, which also acquires rlock
        print("outer: releasing rlock")

def inner():
    with rlock:
        # A regular Lock would DEADLOCK here — same thread, already locked
        # RLock allows it because it tracks the owning thread + count
        print("inner: acquired rlock (same thread, no deadlock)")

t = threading.Thread(target=outer)
t.start()
t.join()

# Use RLock when:
# - A function that holds a lock needs to call another function that also locks
# - You are building recursive algorithms with locking`}
        />
      </Section>

      {/* Semaphore */}
      <Section title="Semaphore — Limit Concurrent Access">
        <Explain>
          A <code className="fg">Semaphore</code> is like a Lock with a counter. Instead of allowing only 1 thread, it allows up to N threads simultaneously. Perfect for limiting concurrent access to a resource pool (e.g., max 3 database connections at once).
        </Explain>
        <CodeBlock
          filename="semaphore_example.py"
          code={`import threading
import time
import random

# Only 3 threads may access the "database" at once
db_semaphore = threading.Semaphore(3)

def query_database(thread_id):
    print(f"Thread {thread_id}: waiting for DB connection...")
    with db_semaphore:   # blocks if 3 threads are already inside
        print(f"Thread {thread_id}: CONNECTED — running query")
        time.sleep(random.uniform(0.5, 1.5))   # simulate query time
        print(f"Thread {thread_id}: query done, releasing connection")

threads = [threading.Thread(target=query_database, args=(i,)) for i in range(8)]

for t in threads:
    t.start()

for t in threads:
    t.join()

print("All queries complete")`}
        />
      </Section>

      {/* Event */}
      <Section title="Event — Thread Signaling">
        <Explain>
          A <code className="fg">threading.Event</code> lets one thread signal other threads that something has happened. Threads can wait for an event with <code className="fg">.wait()</code>, and another thread sets it with <code className="fg">.set()</code>. Call <code className="fg">.clear()</code> to reset it.
        </Explain>
        <CodeBlock
          filename="event_example.py"
          code={`import threading
import time

data_ready = threading.Event()

def producer():
    print("Producer: preparing data...")
    time.sleep(2)
    print("Producer: data is ready!")
    data_ready.set()   # signal all waiting threads

def consumer(name):
    print(f"{name}: waiting for data...")
    data_ready.wait()  # blocks until .set() is called
    print(f"{name}: got the signal — processing data!")

# One producer, multiple consumers
p = threading.Thread(target=producer)
c1 = threading.Thread(target=consumer, args=("Consumer-A",))
c2 = threading.Thread(target=consumer, args=("Consumer-B",))

c1.start()
c2.start()
p.start()

p.join(); c1.join(); c2.join()

# Event methods:
# event.set()        -> set to True, wake all waiters
# event.clear()      -> reset to False
# event.is_set()     -> check current state
# event.wait(timeout=5) -> wait up to 5 seconds`}
        />
      </Section>

      {/* Queue */}
      <Section title="Queue (queue.Queue) — Thread-Safe Data Sharing">
        <Explain>
          <code className="fg">queue.Queue</code> is the safest way to pass data between threads. It handles all locking internally. Producers put items in; consumers get items out. It is a first-in, first-out (FIFO) structure by default.
        </Explain>
        <CodeBlock
          filename="queue_example.py"
          code={`import threading
import queue
import time
import random

task_queue = queue.Queue(maxsize=10)   # buffer up to 10 items

def producer(q, num_tasks):
    for i in range(num_tasks):
        item = f"task-{i}"
        q.put(item)                    # blocks if queue is full
        print(f"Producer: enqueued {item}")
        time.sleep(0.1)
    # Signal consumers that we're done
    for _ in range(3):                 # 3 consumers
        q.put(None)                    # poison pill pattern

def consumer(q, worker_id):
    while True:
        item = q.get()                 # blocks until an item is available
        if item is None:               # poison pill — time to stop
            print(f"Worker-{worker_id}: shutting down")
            q.task_done()
            break
        print(f"Worker-{worker_id}: processing {item}")
        time.sleep(random.uniform(0.1, 0.4))
        q.task_done()                  # signal that item is processed

workers = [threading.Thread(target=consumer, args=(task_queue, i)) for i in range(3)]
p = threading.Thread(target=producer, args=(task_queue, 9))

for w in workers:
    w.start()
p.start()

p.join()
task_queue.join()   # block until all task_done() calls match put() calls
for w in workers:
    w.join()

print("All tasks processed!")`}
        />
        <Callout type="tip">
          Use <code>queue.LifoQueue</code> for a stack (LIFO) or <code>queue.PriorityQueue</code> for priority-based processing. All variants are thread-safe.
        </Callout>
      </Section>

      {/* ThreadPoolExecutor */}
      <Section title="ThreadPoolExecutor — Simpler Thread Pools">
        <Explain>
          <code className="fg">concurrent.futures.ThreadPoolExecutor</code> is a high-level API that manages a pool of worker threads for you. You submit tasks and get back <code className="fg">Future</code> objects representing pending results — no manual thread management needed.
        </Explain>
        <CodeBlock
          filename="thread_pool_executor.py"
          code={`from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import urllib.request

def download(url):
    """Simulate downloading a URL."""
    time.sleep(0.5)  # simulate network latency
    return f"Downloaded: {url}"

urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3",
    "https://example.com/page4",
    "https://example.com/page5",
]

# --- submit() + as_completed() ---
with ThreadPoolExecutor(max_workers=3) as executor:
    # Submit all tasks — returns Future objects immediately
    futures = {executor.submit(download, url): url for url in urls}

    for future in as_completed(futures):
        url = futures[future]
        try:
            result = future.result()   # get the return value (blocks if not done)
            print(result)
        except Exception as e:
            print(f"Error downloading {url}: {e}")

# --- map() — simpler for uniform tasks ---
with ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(download, urls))
    # executor.map maintains original order; as_completed does not

for r in results:
    print(r)

print("All downloads complete")`}
        />
      </Section>

      {/* GIL */}
      <Section title="The GIL — Global Interpreter Lock">
        <Explain>
          The GIL (Global Interpreter Lock) is a mutex inside CPython (the standard Python interpreter) that allows only one thread to execute Python bytecode at a time. Even if you have 8 CPU cores and 8 threads, only one thread runs Python code at any given moment. The GIL is released during I/O operations (file reads, network calls, sleep), which is why threading still helps for I/O-bound tasks.
        </Explain>
        <Callout type="warning">
          The GIL is a property of CPython specifically. Jython and PyPy-STM do not have a GIL. In CPython 3.13+, there is an experimental "free-threaded" build (--disable-gil) but it is not the default.
        </Callout>
        <CodeBlock
          filename="gil_demonstration.py"
          code={`import threading
import time

# ---- CPU-BOUND: threads do NOT help (GIL is the bottleneck) ----
def count_up(n):
    """Pure Python computation — GIL is held almost continuously."""
    x = 0
    for _ in range(n):
        x += 1
    return x

N = 50_000_000

# Single-threaded
start = time.perf_counter()
count_up(N)
single = time.perf_counter() - start

# Two threads (each does N/2 — same total work)
start = time.perf_counter()
t1 = threading.Thread(target=count_up, args=(N // 2,))
t2 = threading.Thread(target=count_up, args=(N // 2,))
t1.start(); t2.start()
t1.join();  t2.join()
threaded = time.perf_counter() - start

print(f"CPU-bound single:  {single:.2f}s")
print(f"CPU-bound threaded:{threaded:.2f}s")
# Threaded is roughly the SAME or SLOWER — GIL prevents true parallelism

# ---- I/O-BOUND: threads DO help (GIL released during sleep/IO) ----
def io_task(name):
    """Simulates a network call — GIL is released during time.sleep."""
    time.sleep(1)   # GIL is released here — other threads can run!

# Sequential I/O
start = time.perf_counter()
for i in range(5):
    io_task(i)
sequential_io = time.perf_counter() - start

# Threaded I/O
start = time.perf_counter()
threads = [threading.Thread(target=io_task, args=(i,)) for i in range(5)]
for t in threads: t.start()
for t in threads: t.join()
threaded_io = time.perf_counter() - start

print(f"I/O sequential: {sequential_io:.2f}s")
print(f"I/O threaded:   {threaded_io:.2f}s")
# Threaded is ~5x faster! All 5 sleeps happen concurrently`}
        />
      </Section>

      {/* multiprocessing */}
      <Section title="multiprocessing — Bypass the GIL for CPU-Bound Tasks">
        <Explain>
          The <code className="fg">multiprocessing</code> module creates separate OS processes, each with its own Python interpreter and memory space. There is no shared GIL, so you get true parallelism across CPU cores — perfect for CPU-intensive work like number crunching, image processing, or ML preprocessing.
        </Explain>
        <CodeBlock
          filename="multiprocessing_example.py"
          code={`import multiprocessing
import time

def cpu_heavy(n):
    """CPU-bound task — benefits from multiprocessing, not threading."""
    return sum(i * i for i in range(n))

# --- Process: like Thread but in a separate process ---
def worker(name, result_queue):
    result = cpu_heavy(10_000_000)
    result_queue.put((name, result))

if __name__ == "__main__":   # REQUIRED on Windows/macOS — guards the entry point
    # --- Basic Process ---
    q = multiprocessing.Queue()
    p1 = multiprocessing.Process(target=worker, args=("P1", q))
    p2 = multiprocessing.Process(target=worker, args=("P2", q))

    p1.start(); p2.start()
    p1.join();  p2.join()

    while not q.empty():
        name, result = q.get()
        print(f"{name} result: {result}")

    # --- Pool: the easy way ---
    numbers = [5_000_000, 8_000_000, 3_000_000, 6_000_000]

    with multiprocessing.Pool(processes=4) as pool:
        # map() distributes work across processes and collects results in order
        results = pool.map(cpu_heavy, numbers)

    for num, res in zip(numbers, results):
        print(f"cpu_heavy({num:,}) = {res:,}")

    # --- Pool.starmap() for multiple arguments ---
    def add(a, b):
        return a + b

    pairs = [(1, 2), (3, 4), (5, 6)]
    with multiprocessing.Pool() as pool:
        sums = pool.starmap(add, pairs)
    print(f"Sums: {sums}")   # [3, 7, 11]`}
        />
        <Callout type="warning">
          Always guard multiprocessing code with <code>if __name__ == "__main__":</code> on macOS and Windows. Without it, spawning new processes re-imports the module and causes infinite recursion.
        </Callout>
      </Section>

      {/* asyncio */}
      <Section title="asyncio — Cooperative Concurrency with async/await">
        <Explain>
          <code className="fg">asyncio</code> is Python's built-in library for writing asynchronous code using a single thread and a single event loop. Instead of blocking, <code className="fg">await</code> yields control back to the event loop so other coroutines can run. It is not about parallelism — it is about never sitting idle while waiting for I/O.
        </Explain>
        <CodeBlock
          filename="asyncio_basics.py"
          code={`import asyncio
import time

# A coroutine — defined with 'async def', called with 'await'
async def fetch_data(name, delay):
    print(f"{name}: starting fetch...")
    await asyncio.sleep(delay)   # yields to event loop — does NOT block
    print(f"{name}: done after {delay}s")
    return f"data from {name}"

# Run coroutines sequentially (not the goal, but shows await)
async def sequential():
    start = time.perf_counter()
    r1 = await fetch_data("API-1", 1)
    r2 = await fetch_data("API-2", 1)
    print(f"Sequential: {time.perf_counter() - start:.2f}s")

# Run coroutines concurrently with asyncio.gather()
async def concurrent():
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch_data("API-1", 1),
        fetch_data("API-2", 1),
        fetch_data("API-3", 1),
    )
    print(f"Concurrent: {time.perf_counter() - start:.2f}s")
    print(f"Results: {results}")

# asyncio.create_task() — schedule without waiting immediately
async def with_tasks():
    task1 = asyncio.create_task(fetch_data("background-1", 2))
    task2 = asyncio.create_task(fetch_data("background-2", 1))

    print("Tasks created — doing other work...")
    await asyncio.sleep(0.1)   # give tasks a chance to start
    print("Waiting for tasks to finish...")

    r1 = await task1   # wait for task1
    r2 = await task2   # wait for task2 (probably already done)
    print(f"Got: {r1}, {r2}")

# Entry point — asyncio.run() creates the event loop
asyncio.run(sequential())
asyncio.run(concurrent())
asyncio.run(with_tasks())`}
        />
        <Callout type="info">
          asyncio uses cooperative concurrency — a coroutine runs until it hits an <code>await</code>, then yields control. Threads use preemptive concurrency — the OS can interrupt a thread at any time. asyncio is single-threaded and avoids race conditions entirely, but all your code must be async-aware.
        </Callout>
      </Section>

      {/* Comparison Table */}
      <Section title="When to Use What — Comparison Table">
        <Explain>
          Choosing the right tool for concurrency is one of the most important decisions in Python. Here is a clear comparison to guide you.
        </Explain>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-xl border border-default my-6"
        >
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-(--fg-subtle) font-semibold">Feature</th>
                <th className="px-4 py-3 text-left font-semibold">threading</th>
                <th className="px-4 py-3 text-left font-semibold">multiprocessing</th>
                <th className="px-4 py-3 text-left font-semibold">asyncio</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{ background: i % 2 === 0 ? "rgba(26,26,46,0.6)" : "rgba(22,33,62,0.4)" }}
                >
                  <td className="px-4 py-3 text-(--fg-subtle) font-medium">{row.feature}</td>
                  <td className="px-4 py-3 text-gray-200">{row.threading}</td>
                  <td className="px-4 py-3 text-gray-200">{row.multiprocessing}</td>
                  <td className="px-4 py-3 text-gray-200">{row.asyncio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <Callout type="tip">
          Quick heuristic: waiting on network/files → asyncio or threading. Crunching numbers on all CPU cores → multiprocessing. Simple scripts with a bit of I/O → threading with ThreadPoolExecutor is usually the easiest to write correctly.
        </Callout>
      </Section>
    </PageLayout>
  );
}
