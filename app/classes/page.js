"use client";

import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, {
  SubSection,
  Explain,
  Callout,
  Exercise,
  RealWorld,
} from "../components/Section";
import Tabs from "../components/Tabs";
import StepRunner from "../components/StepRunner";
import PythonRunner from "../components/PythonRunnerLazy";

export default function ClassesPage() {
  return (
    <PageLayout
      title="Classes & OOP"
      subtitle="Everything Python lets you do with classes — from __init__ to dataclasses to dunder methods — with animated traces, real-world cases, and a live runner."
    >
      {/* 1. Fundamentals */}
      <Section title="1. Class fundamentals — blueprint and instance">
        <Explain>
          A class is a blueprint. Calling the class (<code>User(...)</code>) creates an
          instance. <code>__init__</code> runs once per instance, setting up the
          attributes that belong to <em>that</em> object. <code>self</code> is the
          instance itself — Python passes it implicitly.
        </Explain>

        <CodeBlock
          filename="user.py"
          code={`class User:
    def __init__(self, name, email):
        self.name = name           # instance attribute
        self.email = email
        self.is_active = True

    def deactivate(self):
        self.is_active = False

alice = User("Alice", "alice@example.com")
bob   = User("Bob",   "bob@example.com")
bob.deactivate()
print(alice.is_active, bob.is_active)  # True False`}
        />

        <SubSection title="Watch __init__ run, step by step">
          <StepRunner
            code={`class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.is_active = True

alice = User("Alice", "a@x.com")
bob   = User("Bob",   "b@x.com")
bob.is_active = False`}
            steps={[
              { line: 1, state: {}, note: "Class body is parsed; the class object exists." },
              { line: 7, state: {}, note: "Calling User(...) allocates a new instance and dispatches to __init__." },
              { line: 3, state: { self: "<User>", name: "Alice", email: "a@x.com" }, note: "self is the freshly allocated object." },
              { line: 4, state: { self: { name: "Alice" } } },
              { line: 5, state: { self: { name: "Alice", email: "a@x.com" } } },
              { line: 7, state: { alice: { name: "Alice", email: "a@x.com", is_active: true } }, note: "Construction returns; the binding `alice` now refers to the instance." },
              { line: 8, state: { alice: { is_active: true }, bob: { name: "Bob", email: "b@x.com", is_active: true } } },
              { line: 9, state: { alice: { is_active: true }, bob: { is_active: false } }, note: "Each instance has its OWN attributes — mutating bob does not touch alice." },
            ]}
          />
        </SubSection>

        <Callout type="tip">
          <code>self</code> is just a convention — but every Python developer expects it.
          Don&apos;t rename it.
        </Callout>

        <Exercise title="Track how many users have been created">
          <p>
            Add an <code>instances_created</code> class attribute to <code>User</code> that
            increments inside <code>__init__</code>. After creating three users, calling{" "}
            <code>User.instances_created</code> should return <code>3</code>. Why does this
            need to be a class attribute and not an instance attribute?
          </p>
        </Exercise>
      </Section>

      {/* 2. Instance vs class attrs */}
      <Section title="2. Instance vs class attributes — shared vs per-object">
        <Explain>
          Attributes defined on the class body are <strong>shared</strong> across all
          instances. Attributes assigned to <code>self.x</code> live on the individual
          instance. A common bug: mutating a class-level mutable (like a list) shares
          state across every instance.
        </Explain>

        <Tabs
          items={[
            {
              label: "Class attribute (shared)",
              content: (
                <CodeBlock
                  filename="counter.py"
                  code={`class Counter:
    total = 0   # class attribute — one value shared across instances

    def __init__(self):
        Counter.total += 1

a, b, c = Counter(), Counter(), Counter()
print(Counter.total)              # 3
print(a.total, b.total, c.total)  # 3 3 3 — all read the class attr`}
                />
              ),
            },
            {
              label: "Instance attribute",
              content: (
                <CodeBlock
                  filename="counter_per_instance.py"
                  code={`class Counter:
    def __init__(self):
        self.value = 0
    def tick(self):
        self.value += 1

a, b = Counter(), Counter()
a.tick(); a.tick(); b.tick()
print(a.value, b.value)   # 2 1 — independent state`}
                />
              ),
            },
            {
              label: "The mutable-class-attr trap",
              content: (
                <>
                  <CodeBlock
                    filename="trap.py"
                    code={`class Cart:
    items = []         # shared list across every Cart!
    def add(self, x):
        self.items.append(x)

a, b = Cart(), Cart()
a.add("apple")
print(b.items)         # ['apple'] — surprise!`}
                  />
                  <CodeBlock
                    filename="fix.py"
                    code={`class Cart:
    def __init__(self):
        self.items = []     # each instance gets its own list
    def add(self, x):
        self.items.append(x)`}
                  />
                </>
              ),
            },
          ]}
        />

        <Exercise title="Reproduce the mutable-default trap, then fix it">
          <p>
            Build a <code>Document</code> class with a class-level{" "}
            <code>tags = []</code>. Create two documents and add a tag to the first.
            Confirm the second one inherits the tag. Now move <code>tags</code> into
            <code>__init__</code> as <code>self.tags = []</code> and confirm
            independence. Explain in one sentence why this happens.
          </p>
        </Exercise>
      </Section>

      {/* 3. Method types */}
      <Section title="3. Three kinds of methods — instance, class, static">
        <Explain>
          Instance methods take <code>self</code>. Class methods take <code>cls</code>{" "}
          and operate on the class itself — perfect for alternative constructors. Static
          methods take neither — they are utility functions namespaced under the class.
        </Explain>

        <CodeBlock
          filename="three_methods.py"
          code={`from datetime import date

class Person:
    def __init__(self, name, birth_year):
        self.name = name
        self.birth_year = birth_year

    def greet(self):                       # instance method
        return f"Hi, I'm {self.name}"

    @classmethod
    def from_age(cls, name, age):          # alternative constructor
        return cls(name, date.today().year - age)

    @staticmethod
    def is_adult(age):                     # utility
        return age >= 18

p = Person.from_age("Ana", 31)
print(p.greet())            # Hi, I'm Ana
print(Person.is_adult(20))  # True`}
        />

        <RealWorld
          title="Alternative constructors in real codebases"
          scenario="HTTP libraries expose Response.from_bytes() / from_json(). ORMs expose Model.from_dict(payload). The pattern is always: a @classmethod returning cls(...) — works correctly for subclasses, unlike a hardcoded constructor name."
        >
          <CodeBlock
            filename="response.py"
            code={`class Response:
    def __init__(self, status, body):
        self.status = status
        self.body = body

    @classmethod
    def from_json(cls, status, payload):
        import json
        return cls(status, json.dumps(payload))

class CachedResponse(Response):
    pass

r = CachedResponse.from_json(200, {"ok": True})
print(type(r).__name__)   # CachedResponse — because cls was CachedResponse`}
          />
        </RealWorld>

        <Exercise title="Add a from_birth_year() and is_minor() to Person">
          <p>
            Add <code>Person.from_birth_year(name, year)</code> as a{" "}
            <code>@classmethod</code> alternative constructor, and{" "}
            <code>Person.is_minor(age)</code> as a <code>@staticmethod</code>{" "}
            mirroring <code>is_adult</code>. Verify that{" "}
            <code>Person.from_birth_year("Sam", 2010).greet()</code> works without
            calling <code>__init__</code> directly.
          </p>
        </Exercise>
      </Section>

      {/* 4. Properties */}
      <Section title="4. @property — computed attributes that look like fields">
        <Explain>
          Properties expose a method as if it were an attribute. Useful for derived
          values, validation, or upgrading a public attribute to a computed one without
          breaking callers.
        </Explain>

        <CodeBlock
          filename="temperature.py"
          code={`class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32

t = Temperature(25)
print(t.celsius, t.fahrenheit)   # 25 77.0
t.celsius = 100
print(t.fahrenheit)              # 212.0`}
        />

        <Callout type="tip">
          Reach for <code>@property</code> when a value should look like an attribute
          but needs validation, computation, or read-only semantics. If you find
          yourself writing <code>get_x()</code> / <code>set_x()</code>, that&apos;s your
          cue.
        </Callout>

        <Exercise title="Add a kelvin property and a deleter">
          <p>
            Extend <code>Temperature</code> with a <code>kelvin</code> property
            (read/write — setting it should update <code>_celsius</code>). Then add a{" "}
            <code>@celsius.deleter</code> that resets <code>_celsius</code> to{" "}
            <code>0.0</code>. Verify <code>del t.celsius</code> works and{" "}
            <code>t.fahrenheit</code> updates accordingly.
          </p>
        </Exercise>
      </Section>

      {/* 5. Encapsulation */}
      <Section title="5. Encapsulation — _single, __double, name mangling">
        <Explain>
          Python has no truly private attributes. Conventions instead: a single leading
          underscore (<code>_x</code>) signals &quot;internal&quot;. A double leading
          underscore (<code>__x</code>) triggers <em>name mangling</em> — the attribute
          is rewritten to <code>_ClassName__x</code> to avoid accidental override in
          subclasses.
        </Explain>

        <CodeBlock
          filename="encapsulation.py"
          code={`class Account:
    def __init__(self, balance):
        self._balance = balance     # convention: internal
        self.__pin = "0000"         # name-mangled to _Account__pin

a = Account(100)
print(a._balance)              # 100  — works, but signals "off-limits"
# print(a.__pin)               # AttributeError
print(a._Account__pin)         # "0000" — mangled name still exposes it
print(vars(a))                 # {'_balance': 100, '_Account__pin': '0000'}`}
        />

        <Callout type="info">
          Name-mangling is for avoiding subclass <em>collisions</em>, not for security.
          Use <code>_x</code> for &quot;internal&quot; and only reach for{" "}
          <code>__x</code> when you have a real subclass-collision risk.
        </Callout>

        <Exercise title="Hide the PIN behind a verify() method">
          <p>
            Refactor <code>Account</code> so the only way to check a PIN is via{" "}
            <code>account.verify(pin)</code> returning a bool. Use <code>__pin</code>{" "}
            (double-underscore). Then create a <code>SubAccount(Account)</code> with
            its own <code>__pin</code> attribute and confirm both PINs coexist on the
            same instance thanks to name mangling.
          </p>
        </Exercise>
      </Section>

      {/* 6. Inheritance + super */}
      <Section title="6. Inheritance and super() — extending behavior, not duplicating it">
        <Explain>
          A subclass inherits everything from its parent. Override a method by
          redefining it; call back into the parent with <code>super()</code>. Unlike
          languages where <code>super</code> is a keyword, Python&apos;s{" "}
          <code>super()</code> walks the <strong>MRO</strong> (Method Resolution Order),
          which is what makes cooperative multiple inheritance possible.
        </Explain>

        <CodeBlock
          filename="inheritance.py"
          code={`class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)     # delegate name setup to Animal
        self.breed = breed
    def speak(self):
        return "Woof!"

class Puppy(Dog):
    def speak(self):
        return super().speak() + " (but tiny)"   # extend, don't replace

print(Puppy("Rex", "Lab").speak())   # Woof! (but tiny)`}
        />

        <SubSection title="Trace super() up the chain">
          <StepRunner
            code={`class Animal:
    def speak(self):
        return "generic"

class Dog(Animal):
    def speak(self):
        return "woof"

class Puppy(Dog):
    def speak(self):
        return super().speak() + "!"

print(Puppy().speak())`}
            steps={[
              { line: 13, state: {}, note: "Bottom of the file: Puppy() instance is created, then .speak() is called." },
              { line: 11, state: {}, note: "Puppy.speak runs first because Puppy is the actual class." },
              { line: 11, state: { "super()": "→ Dog.speak" }, note: "super() looks one step up the MRO: Puppy → Dog." },
              { line: 7, state: {}, note: "Dog.speak returns 'woof'." },
              { line: 11, state: { result: '"woof!"' }, output: "woof!", note: "Puppy.speak combines its parent's value with '!'." },
            ]}
          />
        </SubSection>

        <RealWorld
          title="A web view inheriting from a base view"
          scenario="Frameworks like Django are built on this pattern — a generic base class implements the boring HTTP plumbing, and your view subclass overrides only what it needs."
        >
          <CodeBlock
            filename="views.py"
            code={`class View:
    def dispatch(self, request):
        return self.handle(request)
    def handle(self, request):
        raise NotImplementedError

class JsonView(View):
    def dispatch(self, request):
        response = super().dispatch(request)
        return {"Content-Type": "application/json", "body": response}

class UsersView(JsonView):
    def handle(self, request):
        return [{"id": 1, "name": "Ana"}]

print(UsersView().dispatch({"path": "/users"}))`}
          />
        </RealWorld>

        <Exercise title="Build a 3-level inheritance chain with super()">
          <p>
            Define <code>Vehicle → Car → ElectricCar</code>. Each level&apos;s{" "}
            <code>__init__</code> should accept its own extra parameter and call{" "}
            <code>super().__init__(...)</code>. Each level should override a{" "}
            <code>describe()</code> method and extend the parent&apos;s description
            via <code>super().describe()</code>. Print the final string for{" "}
            <code>ElectricCar(...)</code>.
          </p>
        </Exercise>
      </Section>

      {/* 7. Dunder methods */}
      <Section title="7. Dunder methods — making your class feel native">
        <Explain>
          Dunder (&quot;double-underscore&quot;) methods are how Python operators and
          built-ins talk to your objects. Implement <code>__str__</code> for{" "}
          <code>print()</code>, <code>__eq__</code> for <code>==</code>,{" "}
          <code>__len__</code> for <code>len()</code>, <code>__iter__</code> for{" "}
          <code>for ... in ...</code>, and so on.
        </Explain>

        <Tabs
          items={[
            {
              label: "__str__ vs __repr__",
              content: (
                <CodeBlock
                  filename="repr_vs_str.py"
                  code={`class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency
    def __repr__(self):
        return f"Money({self.amount!r}, {self.currency!r})"
    def __str__(self):
        return f"{self.amount:.2f} {self.currency}"

m = Money(19.5, "USD")
print(m)        # 19.50 USD          (uses __str__)
print(repr(m))  # Money(19.5, 'USD') (uses __repr__)
[m]             # __repr__ is used inside collections too`}
                />
              ),
            },
            {
              label: "__eq__ + __hash__",
              content: (
                <CodeBlock
                  filename="equality.py"
                  code={`class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)
    def __hash__(self):
        # MUST be consistent with __eq__: equal objects → equal hash.
        return hash((self.x, self.y))

print(Point(1, 2) == Point(1, 2))     # True
print({Point(1, 2), Point(1, 2)})     # {Point(1, 2)} — deduped`}
                />
              ),
            },
            {
              label: "Container protocol",
              content: (
                <CodeBlock
                  filename="container.py"
                  code={`class Deck:
    def __init__(self):
        self.cards = list(range(1, 53))
    def __len__(self):         return len(self.cards)
    def __getitem__(self, i):  return self.cards[i]
    def __iter__(self):        return iter(self.cards)
    def __contains__(self, x): return x in self.cards

d = Deck()
print(len(d))            # 52
print(d[0], d[-1])       # 1 52
print(7 in d)            # True
print(sum(d))            # 1378  — works because __iter__ exists`}
                />
              ),
            },
            {
              label: "Callable + context manager",
              content: (
                <CodeBlock
                  filename="callable_ctx.py"
                  code={`class Multiplier:
    def __init__(self, factor): self.factor = factor
    def __call__(self, x):      return x * self.factor

double = Multiplier(2)
print(double(10))   # 20 — instances are callable when __call__ is defined

class Timer:
    def __enter__(self):
        from time import perf_counter
        self.t0 = perf_counter()
        return self
    def __exit__(self, *exc):
        from time import perf_counter
        self.elapsed = perf_counter() - self.t0

with Timer() as t:
    sum(range(1_000_000))
print(t.elapsed)`}
                />
              ),
            },
          ]}
        />

        <Exercise title="Implement Money + arithmetic">
          <p>
            Add <code>__add__</code> and <code>__sub__</code> to the{" "}
            <code>Money</code> class — return a new <code>Money</code> with the
            summed amount, but <strong>only</strong> if the currencies match;
            otherwise raise <code>ValueError</code>. Add <code>__lt__</code> so a
            list of <code>Money</code> instances can be sorted by amount when
            currencies match.
          </p>
        </Exercise>
      </Section>

      {/* 8. ABCs */}
      <Section title="8. Abstract Base Classes — contracts you can enforce">
        <Explain>
          An ABC defines an interface: methods subclasses <strong>must</strong>{" "}
          implement. Trying to instantiate a subclass that hasn&apos;t implemented every{" "}
          <code>@abstractmethod</code> raises <code>TypeError</code> — you find the bug
          at construction time, not when production hits the missing method.
        </Explain>

        <CodeBlock
          filename="abc_example.py"
          code={`from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount): ...
    @abstractmethod
    def refund(self, txn_id): ...

class StripeProcessor(PaymentProcessor):
    def charge(self, amount): return f"Stripe charged {amount}"
    def refund(self, txn_id): return f"Stripe refunded {txn_id}"

class BrokenProcessor(PaymentProcessor):
    def charge(self, amount): return "ok"
    # forgot refund — instantiation fails immediately

StripeProcessor().charge(10)
# BrokenProcessor()
#  → TypeError: Can't instantiate abstract class BrokenProcessor
#    with abstract method refund`}
        />

        <Exercise title="Add void() and write a PayPalProcessor">
          <p>
            Extend <code>PaymentProcessor</code> with an abstract{" "}
            <code>void(txn_id)</code> method, then write{" "}
            <code>PayPalProcessor</code> implementing all three. Confirm that{" "}
            <code>StripeProcessor</code> can no longer be instantiated until you add{" "}
            <code>void</code> to it too. What is the purpose of having ABCs raise at
            construction time rather than at first call?
          </p>
        </Exercise>
      </Section>

      {/* 9. Dataclasses */}
      <Section title="9. @dataclass — boilerplate elimination">
        <Explain>
          For classes that are mostly &quot;a bag of typed fields&quot;,{" "}
          <code>@dataclass</code> generates <code>__init__</code>,{" "}
          <code>__repr__</code>, and <code>__eq__</code> from annotations.
        </Explain>

        <Tabs
          items={[
            {
              label: "Plain class",
              content: (
                <CodeBlock
                  filename="plain.py"
                  code={`class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"
    def __eq__(self, other):
        return isinstance(other, Point) and (self.x, self.y) == (other.x, other.y)`}
                />
              ),
            },
            {
              label: "@dataclass equivalent",
              content: (
                <CodeBlock
                  filename="dataclass.py"
                  code={`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
# __init__, __repr__, and __eq__ are generated for you.

p = Point(1, 2)
print(p)                # Point(x=1, y=2)
print(p == Point(1, 2)) # True`}
                />
              ),
            },
            {
              label: "Frozen + ordered + slots",
              content: (
                <CodeBlock
                  filename="dataclass_advanced.py"
                  code={`from dataclasses import dataclass

@dataclass(frozen=True, order=True, slots=True)
class Version:
    major: int
    minor: int
    patch: int = 0

# frozen=True → instances are immutable (hashable, dict-key-safe)
# order=True  → comparison operators auto-generated (sorting!)
# slots=True  → faster attribute access, lower memory (Python 3.10+)

print(sorted([Version(1, 2), Version(1, 1), Version(2, 0)]))
# [Version(1, 1, 0), Version(1, 2, 0), Version(2, 0, 0)]`}
                />
              ),
            },
            {
              label: "field() for mutable defaults",
              content: (
                <CodeBlock
                  filename="field_default.py"
                  code={`from dataclasses import dataclass, field

@dataclass
class Cart:
    items: list = field(default_factory=list)   # NOT items: list = []

c = Cart()
c.items.append("apple")
print(Cart().items)   # [] — fresh list, no shared state`}
                />
              ),
            },
          ]}
        />

        <Exercise title="Convert User into a dataclass with sorting">
          <p>
            Take the <code>User</code> class from section 1 and rewrite it as a{" "}
            <code>@dataclass</code> with fields <code>name: str</code>,{" "}
            <code>email: str</code>, <code>is_active: bool = True</code>. Add{" "}
            <code>order=True</code> so that <code>sorted(users)</code> orders by
            name, then email. Why does <code>order=True</code> require all preceding
            fields to be comparable?
          </p>
        </Exercise>
      </Section>

      {/* 10. Slots */}
      <Section title="10. __slots__ — opting out of __dict__ for speed and memory">
        <Explain>
          By default every instance carries a <code>__dict__</code> for arbitrary
          attributes. <code>__slots__</code> declares a fixed set of attributes —
          Python skips the dict, which makes attribute access faster and instances
          significantly smaller. Trade-off: you can no longer add ad-hoc attributes.
        </Explain>

        <CodeBlock
          filename="slots.py"
          code={`class WithoutSlots:
    def __init__(self, x, y):
        self.x, self.y = x, y

class WithSlots:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x, self.y = x, y

a = WithoutSlots(1, 2); a.z = 99    # ok
b = WithSlots(1, 2)
# b.z = 99   →   AttributeError: 'WithSlots' object has no attribute 'z'`}
        />

        <Callout type="info">
          Use <code>__slots__</code> when you have many short-lived instances of the
          same shape (data records, geometric points, tokens). Skip it for general
          domain objects — the flexibility of <code>__dict__</code> usually wins.
        </Callout>

        <Exercise title="Pick the right tool: dataclass(slots=True) vs plain class">
          <p>
            For each of the following, decide whether <code>__slots__</code> (or{" "}
            <code>@dataclass(slots=True)</code>) is worth it. Defend each pick in
            one sentence.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>A <code>Logger</code> class — one global instance.</li>
            <li>A <code>Pixel(r, g, b)</code> used millions of times in image processing.</li>
            <li>A <code>UserSession</code> where plugins sometimes attach extra fields.</li>
            <li>A <code>GeoPoint(lat, lon)</code> stored in a 1M-row collection.</li>
          </ul>
        </Exercise>
      </Section>

      {/* 11. Repository pattern */}
      <Section title="11. Real-world pattern: the Repository">
        <RealWorld
          title="Hiding storage behind a stable interface"
          scenario="A Repository wraps the database (or file, or HTTP API) so the rest of your code never imports the database driver directly. You can swap the implementation without touching callers."
        >
          <CodeBlock
            filename="repository.py"
            code={`from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str

class UserRepository(ABC):
    @abstractmethod
    def get(self, user_id: int) -> User | None: ...
    @abstractmethod
    def save(self, user: User) -> None: ...

class InMemoryUserRepository(UserRepository):
    def __init__(self):
        self._store: dict[int, User] = {}
    def get(self, user_id):
        return self._store.get(user_id)
    def save(self, user):
        self._store[user.id] = user

class PostgresUserRepository(UserRepository):
    def __init__(self, conn):
        self.conn = conn
    def get(self, user_id):
        row = self.conn.execute(
            "SELECT id, name FROM users WHERE id=%s", (user_id,)
        ).fetchone()
        return User(*row) if row else None
    def save(self, user):
        self.conn.execute(
            "INSERT INTO users(id, name) VALUES(%s, %s) "
            "ON CONFLICT(id) DO UPDATE SET name=excluded.name",
            (user.id, user.name),
        )

# Test code uses InMemory; production uses Postgres. Same interface either way.`}
          />
        </RealWorld>

        <Exercise title="Add delete() to both repositories without changing callers">
          <p>
            Add an abstract <code>delete(user_id)</code> method to{" "}
            <code>UserRepository</code>. Implement it in both{" "}
            <code>InMemoryUserRepository</code> (pop from dict) and{" "}
            <code>PostgresUserRepository</code> (DELETE query). Verify code that
            takes a <code>UserRepository: UserRepository</code> parameter never
            needs to know which implementation it&apos;s holding — that&apos;s the
            point of the pattern.
          </p>
        </Exercise>
      </Section>

      {/* 12. Practice */}
      <Section title="12. Practice — run Python in your browser">
        <Explain>
          The runner below executes real Python via Pyodide (loaded once, cached
          afterwards). Edit the code and click <strong>Run</strong>.
        </Explain>

        <PythonRunner
          title="Try: build a small class"
          rows={14}
          initialCode={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def __repr__(self):
        return f"BankAccount({self.owner!r}, balance={self._balance})"

a = BankAccount("Ana", 100)
a.deposit(50)
print(a)
print("Balance:", a.balance)
`}
        />

        <Exercise title="Add a withdraw() method">
          <p>
            Extend <code>BankAccount</code> with a <code>withdraw(amount)</code>{" "}
            method. Reject zero, negative, and over-balance amounts with{" "}
            <code>ValueError</code>. Make sure <code>repr(a)</code> still reflects
            the current balance after a successful withdraw.
          </p>
        </Exercise>

        <Exercise title="Make BankAccount comparable and hashable">
          <p>
            Two accounts should be equal when they have the same <code>owner</code>{" "}
            and <code>balance</code>. Implement <code>__eq__</code> and{" "}
            <code>__hash__</code> so a <code>set</code> of accounts deduplicates
            correctly.
          </p>
        </Exercise>

        <Exercise title="Re-implement BankAccount as a frozen dataclass">
          <p>
            Convert the class above to a <code>@dataclass(frozen=True)</code>. Why
            can <code>deposit</code> no longer mutate state — and what would you
            return instead? (Hint: <code>dataclasses.replace</code>.)
          </p>
        </Exercise>
      </Section>

      <Callout type="tip">
        Want the deeper material — MRO walks, descriptors, metaclasses, protocols
        and ABC vs Protocol? Continue to{" "}
        <a href="/oop-deep" className="underline">OOP Deep Dive</a>.
      </Callout>
    </PageLayout>
  );
}
