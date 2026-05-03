"use client";

import PageLayout from "../components/PageLayout";
import Section, { SubSection, Explain, Callout } from "../components/Section";
import CodeBlock from "../components/CodeBlock";
import { motion } from "framer-motion";

const pillars = [
  {
    name: "Encapsulation",
    icon: "",
    desc: "Bundle data (attributes) and behaviour (methods) together inside a class, and hide internal details from the outside world using _ and __ conventions.",
  },
  {
    name: "Abstraction",
    icon: "",
    desc: "Expose only what is necessary. Hide implementation complexity behind a simple interface. The user of a class should not need to know how it works internally.",
  },
  {
    name: "Inheritance",
    icon: "",
    desc: "A child class inherits attributes and methods from a parent class, enabling code reuse and hierarchical relationships between types.",
  },
  {
    name: "Polymorphism",
    icon: "",
    desc: "Different classes can be treated through the same interface. The same method name behaves differently depending on the object it is called on.",
  },
];

const solidPrinciples = [
  { letter: "S", name: "Single Responsibility", desc: "A class should have one reason to change — one job only." },
  { letter: "O", name: "Open/Closed", desc: "Open for extension, closed for modification. Add new behaviour without changing existing code." },
  { letter: "L", name: "Liskov Substitution", desc: "Subtypes must be substitutable for their base types without breaking the program." },
  { letter: "I", name: "Interface Segregation", desc: "Clients should not depend on interfaces they do not use. Prefer many small protocols over one large ABC." },
  { letter: "D", name: "Dependency Inversion", desc: "Depend on abstractions, not concrete classes. High-level modules should not depend on low-level modules." },
];

export default function OopDeepPage() {
  return (
    <PageLayout title="Deep OOP"
      subtitle="Abstract base classes, MRO, dunder methods, dataclasses, SOLID principles — the complete picture."
    >
      {/* 4 Pillars */}
      <Section title="The 4 Pillars of OOP">
        <Explain>
          Every object-oriented language is built on four foundational principles. Master these and everything else — ABCs, mixins, protocols — slots into place naturally.
        </Explain>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-5 rounded-xl border"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-lg mb-2">
                {p.name}
              </h3>
              <p className="text-(--fg-subtle) text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
        <CodeBlock
          filename="four_pillars.py"
          code={`# ── Encapsulation ──────────────────────────────────────────
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner          # public
        self._balance = balance     # protected (convention: don't touch from outside)
        self.__pin = 1234           # private (name-mangled to _BankAccount__pin)

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def get_balance(self):          # controlled read access
        return self._balance

# ── Abstraction ────────────────────────────────────────────
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...   # interface — HOW is hidden

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

# ── Inheritance ────────────────────────────────────────────
class Animal:
    def __init__(self, name): self.name = name
    def speak(self): return "..."

class Dog(Animal):
    def speak(self): return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self): return f"{self.name} says Meow!"

# ── Polymorphism ───────────────────────────────────────────
animals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")]

for animal in animals:
    print(animal.speak())   # same interface, different behaviour
# Rex says Woof! / Whiskers says Meow! / Buddy says Woof!`}
        />
      </Section>

      {/* Abstract Base Classes */}
      <Section title="Abstract Base Classes (ABC)">
        <Explain>
          ABCs enforce a contract: any class that inherits from your ABC must implement all abstract methods. Trying to instantiate a class with unimplemented abstract methods raises a <code className="fg">TypeError</code> at instantiation time — catching design bugs early.
        </Explain>
        <CodeBlock
          filename="abstract_base_class.py"
          code={`from abc import ABC, abstractmethod

class Serializable(ABC):
    @abstractmethod
    def to_dict(self) -> dict:
        """Subclasses must implement this."""
        ...

    @abstractmethod
    def to_json(self) -> str:
        """Subclasses must implement this."""
        ...

    def __repr__(self):
        return f"{self.__class__.__name__}({self.to_dict()})"

class User(Serializable):
    def __init__(self, name, email):
        self.name = name
        self.email = email

    def to_dict(self):
        return {"name": self.name, "email": self.email}

    def to_json(self):
        import json
        return json.dumps(self.to_dict())

# --- ABC as type check (without inheritance) ---
from abc import ABCMeta

class Drawable(ABC):
    @abstractmethod
    def draw(self): ...

# Register an existing class as "virtual subclass"
class LegacyWidget:
    def draw(self): print("drawing legacy widget")

Drawable.register(LegacyWidget)
print(isinstance(LegacyWidget(), Drawable))   # True — even without inheritance

# --- Trying to instantiate ABC directly ---
try:
    s = Serializable()
except TypeError as e:
    print(e)   # Can't instantiate abstract class Serializable...

u = User("Alice", "alice@example.com")
print(u.to_json())   # {"name": "Alice", "email": "alice@example.com"}`}
        />
      </Section>

      {/* Multiple Inheritance */}
      <Section title="Multiple Inheritance & the Diamond Problem">
        <Explain>
          Python supports inheriting from multiple parent classes. The classic problem is the diamond: if both parents define the same method, which one wins? Python resolves this with the MRO (Method Resolution Order) using the C3 linearisation algorithm.
        </Explain>
        <CodeBlock
          filename="multiple_inheritance.py"
          code={`# The Diamond Problem
#
#         Base
#        /    \
#    Left     Right
#        \    /
#        Child
#

class Base:
    def greet(self):
        return "Hello from Base"

class Left(Base):
    def greet(self):
        return "Hello from Left"

class Right(Base):
    def greet(self):
        return "Hello from Right"

class Child(Left, Right):   # Left listed first — takes priority
    pass

c = Child()
print(c.greet())            # "Hello from Left"
print(Child.__mro__)
# (<class 'Child'>, <class 'Left'>, <class 'Right'>, <class 'Base'>, <class 'object'>)

# --- Practical: Mixin pattern ---
class JsonMixin:
    """Mixin adds JSON capability to any class."""
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class LogMixin:
    """Mixin adds logging to any class."""
    def log(self, msg):
        print(f"[{self.__class__.__name__}] {msg}")

class Product(JsonMixin, LogMixin):
    def __init__(self, name, price):
        self.name = name
        self.price = price

p = Product("Widget", 9.99)
print(p.to_json())          # {"name": "Widget", "price": 9.99}
p.log("Item created")`}
        />
      </Section>

      {/* MRO */}
      <Section title="MRO — Method Resolution Order & super()">
        <Explain>
          The MRO defines the exact order Python searches for methods and attributes across the inheritance chain. <code className="fg">super()</code> always calls the next class in the MRO, not necessarily the direct parent — which makes it behave correctly even in complex multiple-inheritance hierarchies.
        </Explain>
        <CodeBlock
          filename="mro_super.py"
          code={`class A:
    def method(self):
        print("A.method")
        # No super() call — end of chain

class B(A):
    def method(self):
        print("B.method")
        super().method()   # calls A.method (next in MRO)

class C(A):
    def method(self):
        print("C.method")
        super().method()   # calls A.method (next in MRO)

class D(B, C):
    def method(self):
        print("D.method")
        super().method()   # calls B.method (next in D's MRO)

print(D.__mro__)
# D → B → C → A → object

d = D()
d.method()
# D.method
# B.method
# C.method   ← super() in B calls C, not A! This is the cooperative super() chain
# A.method

# --- Inspecting MRO ---
for cls in D.__mro__:
    print(cls.__name__)

# --- super() with __init__ ---
class Vehicle:
    def __init__(self, make):
        self.make = make
        print(f"Vehicle.__init__: {make}")

class Car(Vehicle):
    def __init__(self, make, model):
        super().__init__(make)   # pass make up the chain
        self.model = model
        print(f"Car.__init__: {model}")

class ElectricCar(Car):
    def __init__(self, make, model, battery_kwh):
        super().__init__(make, model)
        self.battery_kwh = battery_kwh
        print(f"ElectricCar.__init__: {battery_kwh}kWh")

ec = ElectricCar("Tesla", "Model 3", 75)
# Vehicle.__init__: Tesla
# Car.__init__: Model 3
# ElectricCar.__init__: 75kWh`}
        />
      </Section>

      {/* Dunder Methods */}
      <Section title="Dunder / Magic Methods">
        <Explain>
          Dunder methods (double underscore) are Python's hook system for making your objects behave like built-in types. Implement <code className="fg">__add__</code> and your objects support <code>+</code>. Implement <code className="fg">__iter__</code> and you can use <code>for x in obj</code>.
        </Explain>
        <CodeBlock
          filename="dunder_methods.py"
          code={`class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    # ── Representation ──────────────────────────────────────
    def __repr__(self):
        """Called by repr(), debugging, REPL"""
        return f"Vector({self.x}, {self.y})"

    def __str__(self):
        """Called by print() and str()"""
        return f"({self.x}, {self.y})"

    # ── Arithmetic ───────────────────────────────────────────
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):   # scalar * vector (reverse)
        return self.__mul__(scalar)

    # ── Comparison ───────────────────────────────────────────
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __lt__(self, other):
        return abs(self) < abs(other)   # compare magnitudes

    # ── Container-like ──────────────────────────────────────
    def __len__(self):
        return 2   # 2D vector always has 2 components

    def __abs__(self):
        return (self.x**2 + self.y**2) ** 0.5

    def __bool__(self):
        return self.x != 0 or self.y != 0

v1 = Vector(1, 2)
v2 = Vector(3, 4)

print(repr(v1))       # Vector(1, 2)
print(v1 + v2)        # (4, 6)
print(3 * v1)         # (3, 6)
print(abs(v2))        # 5.0
print(len(v1))        # 2
print(v1 == Vector(1, 2))   # True

# ── Iterator protocol ────────────────────────────────────────
class CountDown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):   # return an iterator object
        return self

    def __next__(self):   # return the next value
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in CountDown(5):
    print(n, end=" ")   # 5 4 3 2 1

# ── Context manager protocol ─────────────────────────────────
class ManagedFile:
    def __init__(self, path, mode="r"):
        self.path = path
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.path, self.mode)
        return self.file   # value bound to 'as' variable

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False   # False = don't suppress exceptions

# with ManagedFile("data.txt") as f:
#     content = f.read()

# ── Sequence protocol ─────────────────────────────────────────
class Playlist:
    def __init__(self, songs):
        self._songs = list(songs)

    def __len__(self):            return len(self._songs)
    def __getitem__(self, idx):   return self._songs[idx]
    def __setitem__(self, idx, v): self._songs[idx] = v
    def __contains__(self, song): return song in self._songs
    def __iter__(self):           return iter(self._songs)

pl = Playlist(["Song A", "Song B", "Song C"])
print("Song B" in pl)      # True  — uses __contains__
print(pl[1])               # Song B — uses __getitem__
for song in pl: print(song)   # uses __iter__`}
        />
      </Section>

      {/* Dataclasses */}
      <Section title="Dataclasses — @dataclass">
        <Explain>
          <code className="fg">@dataclass</code> (Python 3.7+) auto-generates <code>__init__</code>, <code>__repr__</code>, and <code>__eq__</code> from your annotated class variables. It dramatically reduces boilerplate for simple data-holding classes.
        </Explain>
        <CodeBlock
          filename="dataclasses_example.py"
          code={`from dataclasses import dataclass, field, KW_ONLY
import datetime

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)          # Point(x=1.0, y=2.0)
print(p1 == p2)    # True  — __eq__ compares all fields

# --- Default values and field() ---
@dataclass
class User:
    name: str
    email: str
    role: str = "viewer"
    tags: list = field(default_factory=list)   # mutable default — MUST use field()
    created_at: datetime.datetime = field(default_factory=datetime.datetime.now)

    def __post_init__(self):
        """Called after __init__ — use for validation or derived fields."""
        self.email = self.email.lower()
        if not self.email.endswith("@example.com"):
            pass   # could raise ValueError here

u = User("Alice", "Alice@Example.COM")
print(u)
# User(name='Alice', email='alice@example.com', role='viewer', tags=[], ...)

# --- frozen=True: immutable dataclass (hashable, usable as dict key) ---
@dataclass(frozen=True)
class Coordinate:
    lat: float
    lon: float

c = Coordinate(51.5, -0.12)
# c.lat = 99   # raises FrozenInstanceError

# frozen dataclasses are hashable
locations = {c: "London"}
print(locations[Coordinate(51.5, -0.12)])   # London

# --- order=True: generates __lt__, __le__, __gt__, __ge__ ---
@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

v1 = Version(1, 9, 0)
v2 = Version(2, 0, 0)
print(v1 < v2)   # True — compared field by field (major first)`}
        />
      </Section>

      {/* namedtuple */}
      <Section title="namedtuple — Lightweight Immutable Records">
        <Explain>
          <code className="fg">namedtuple</code> creates a tuple subclass with named fields. Elements are immutable, memory-efficient, and accessible by name or index. Ideal for simple data records that do not need methods.
        </Explain>
        <CodeBlock
          filename="namedtuple_example.py"
          code={`from collections import namedtuple

# Classic namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)     # 3 4
print(p[0], p[1])   # 3 4 — also accessible by index
print(p)            # Point(x=3, y=4)

# Unpacking works
x, y = p
print(x, y)   # 3 4

# Immutable — can't assign
try:
    p.x = 99
except AttributeError as e:
    print(e)   # can't set attribute

# _replace() returns a NEW namedtuple with updated fields
p2 = p._replace(x=10)
print(p2)   # Point(x=10, y=4)

# _asdict() → OrderedDict (Python 3.8+: regular dict)
print(p._asdict())   # {'x': 3, 'y': 4}

# --- typing.NamedTuple: class syntax with types and defaults ---
from typing import NamedTuple

class Employee(NamedTuple):
    name: str
    department: str
    salary: float = 50_000.0

    def annual_bonus(self) -> float:
        return self.salary * 0.1   # can add methods!

e = Employee("Bob", "Engineering", 80_000)
print(e.annual_bonus())   # 8000.0
print(e)                  # Employee(name='Bob', department='Engineering', salary=80000.0)`}
        />
      </Section>

      {/* __slots__ */}
      <Section title="__slots__ — Memory Optimisation">
        <Explain>
          By default, Python stores instance attributes in a <code className="fg">__dict__</code> dictionary, which is flexible but uses extra memory. Defining <code className="fg">__slots__</code> replaces that dictionary with a fixed-size array, reducing memory by 20–50% and speeding up attribute access.
        </Explain>
        <CodeBlock
          filename="slots_example.py"
          code={`import sys

# Without __slots__
class PointDict:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# With __slots__
class PointSlots:
    __slots__ = ("x", "y")   # declare allowed attributes

    def __init__(self, x, y):
        self.x = x
        self.y = y

pd = PointDict(1, 2)
ps = PointSlots(1, 2)

print(sys.getsizeof(pd.__dict__))   # ~232 bytes (dict overhead)
# __slots__ classes have no __dict__:
print(hasattr(ps, "__dict__"))      # False

# Can't add new attributes to slotted class
try:
    ps.z = 3
except AttributeError as e:
    print(e)   # 'PointSlots' object has no attribute 'z'

# Normal attribute access still works
ps.x = 99
print(ps.x, ps.y)   # 99 2

# --- Inheritance with __slots__ ---
class Base:
    __slots__ = ("x",)

class Child(Base):
    __slots__ = ("y",)   # only declare NEW slots
    # If Child doesn't define __slots__, it gets a __dict__ anyway

c = Child()
c.x = 1
c.y = 2`}
        />
        <Callout type="info">
          Use <code>__slots__</code> when you create many instances of a class (millions) and memory is a concern. For most everyday code, the default <code>__dict__</code> is fine.
        </Callout>
      </Section>

      {/* Class Decorators */}
      <Section title="Class Decorators — @staticmethod, @classmethod, @property">
        <Explain>
          Python provides three built-in descriptors for defining special kinds of methods. <code className="fg">@staticmethod</code> is a plain function namespaced inside a class. <code className="fg">@classmethod</code> receives the class as its first argument. <code className="fg">@property</code> makes a method look like an attribute.
        </Explain>
        <CodeBlock
          filename="class_decorators.py"
          code={`class Temperature:
    _instances_created = 0   # class-level counter

    def __init__(self, celsius):
        Temperature._instances_created += 1
        self._celsius = celsius   # private backing attribute

    # ── @property ────────────────────────────────────────────
    @property
    def celsius(self):
        """Getter — accessed as obj.celsius (no parentheses)."""
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        """Setter — called when you do obj.celsius = value."""
        if value < -273.15:
            raise ValueError("Temperature below absolute zero is impossible")
        self._celsius = value

    @celsius.deleter
    def celsius(self):
        """Deleter — called on del obj.celsius."""
        del self._celsius

    @property
    def fahrenheit(self):
        """Computed property — no setter needed (read-only)."""
        return self._celsius * 9 / 5 + 32

    # ── @classmethod ─────────────────────────────────────────
    @classmethod
    def from_fahrenheit(cls, f):
        """Alternative constructor — 'cls' is the class itself."""
        return cls((f - 32) * 5 / 9)

    @classmethod
    def instance_count(cls):
        return cls._instances_created

    # ── @staticmethod ─────────────────────────────────────────
    @staticmethod
    def is_valid_celsius(value):
        """Utility function — no self or cls — just a namespaced function."""
        return value >= -273.15

t1 = Temperature(100)
print(t1.celsius)      # 100  (property getter)
print(t1.fahrenheit)   # 212.0

t1.celsius = 0         # property setter
print(t1.celsius)      # 0

t2 = Temperature.from_fahrenheit(98.6)   # classmethod alternative constructor
print(round(t2.celsius, 1))             # 37.0

print(Temperature.instance_count())     # 2
print(Temperature.is_valid_celsius(-300))  # False`}
        />
      </Section>

      {/* Composition vs Inheritance */}
      <Section title="Composition vs Inheritance">
        <Explain>
          Inheritance models an "is-a" relationship. Composition models a "has-a" relationship. A general rule of thumb: prefer composition — it is more flexible, easier to test, and avoids the fragile base class problem. Use inheritance when the subclass truly "is a" specialised version of the parent.
        </Explain>
        <CodeBlock
          filename="composition_vs_inheritance.py"
          code={`# ── Inheritance (is-a) ───────────────────────────────────────
class Animal:
    def __init__(self, name): self.name = name
    def eat(self): print(f"{self.name} is eating")

class Dog(Animal):   # Dog IS AN Animal — inheritance is correct here
    def bark(self): print(f"{self.name}: Woof!")

# ── Problem with deep inheritance ────────────────────────────
# Imagine: Vehicle → Car → ElectricCar → SelfDrivingElectricCar
# Any change to Vehicle breaks everything downstream.

# ── Composition (has-a) ──────────────────────────────────────
class Engine:
    def __init__(self, hp): self.hp = hp
    def start(self): print(f"Engine ({self.hp}hp) started")

class GPSModule:
    def navigate(self, dest): print(f"Navigating to {dest}")

class Car:
    """Car HAS AN engine and optionally HAS A GPS — composition."""
    def __init__(self, make, hp):
        self.make = make
        self.engine = Engine(hp)      # composed object
        self.gps = GPSModule()        # composed object

    def drive(self):
        self.engine.start()
        print(f"{self.make} is moving")

    def go_to(self, destination):
        self.gps.navigate(destination)

c = Car("Toyota", 150)
c.drive()
c.go_to("Airport")

# To swap in a different engine, just replace the Engine instance.
# With inheritance you would have to restructure the entire hierarchy.

# ── Dependency injection (advanced composition) ───────────────
class Notifier:
    def send(self, msg): ...

class EmailNotifier(Notifier):
    def send(self, msg): print(f"Email: {msg}")

class SMSNotifier(Notifier):
    def send(self, msg): print(f"SMS: {msg}")

class OrderService:
    def __init__(self, notifier: Notifier):   # accepts any Notifier
        self.notifier = notifier

    def place_order(self, item):
        print(f"Order placed: {item}")
        self.notifier.send(f"Your order for {item} is confirmed!")

service = OrderService(EmailNotifier())
service.place_order("Python Book")
# Swap to SMS with zero code change to OrderService:
service2 = OrderService(SMSNotifier())
service2.place_order("Keyboard")`}
        />
      </Section>

      {/* SOLID */}
      <Section title="SOLID Principles in Python">
        <Explain>
          SOLID is a set of five design principles that make object-oriented code more maintainable, flexible, and scalable. They are guidelines, not strict rules — apply them with judgement.
        </Explain>
        <div className="grid grid-cols-1 gap-3 my-6">
          {solidPrinciples.map((p, i) => (
            <motion.div
              key={p.letter}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4 p-4 rounded-xl border"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              >
                {p.letter}
              </div>
              <div>
                <div className="font-semibold text-white mb-1">{p.name}</div>
                <div className="text-(--fg-subtle) text-sm">{p.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <CodeBlock
          filename="solid_examples.py"
          code={`from abc import ABC, abstractmethod

# ── S: Single Responsibility ─────────────────────────────────
# BAD: UserManager does too many things
class UserManagerBad:
    def create_user(self, data): ...
    def send_welcome_email(self, user): ...  # email concern!
    def save_to_database(self, user): ...    # DB concern!

# GOOD: separate responsibilities
class UserRepository:
    def save(self, user): ...

class EmailService:
    def send_welcome(self, user): ...

class UserService:
    def __init__(self, repo: UserRepository, mailer: EmailService):
        self.repo = repo
        self.mailer = mailer

    def create(self, data):
        # orchestrate — each collaborator does one thing
        user = User(data)
        self.repo.save(user)
        self.mailer.send_welcome(user)

# ── O: Open/Closed ───────────────────────────────────────────
class Discount(ABC):
    @abstractmethod
    def apply(self, price: float) -> float: ...

class NoDiscount(Discount):
    def apply(self, price): return price

class PercentDiscount(Discount):
    def __init__(self, pct): self.pct = pct
    def apply(self, price): return price * (1 - self.pct / 100)

class BuyOneGetOne(Discount):
    def apply(self, price): return price / 2

def checkout(price: float, discount: Discount) -> float:
    return discount.apply(price)   # open to new Discount types, closed to change

# Add a new discount type? Just add a new class — don't change checkout().

# ── L: Liskov Substitution ───────────────────────────────────
class Rectangle:
    def __init__(self, w, h): self.w, self.h = w, h
    def area(self): return self.w * self.h

class Square(Rectangle):
    def __init__(self, side): super().__init__(side, side)
    # Violates LSP if we allow setting w and h independently.
    # Better: Square should NOT inherit from Rectangle.

# ── I: Interface Segregation ─────────────────────────────────
class Printable(ABC):
    @abstractmethod
    def print(self): ...

class Scannable(ABC):
    @abstractmethod
    def scan(self): ...

# A simple printer only needs Printable — not forced to implement scan()
class SimplePrinter(Printable):
    def print(self): print("Printing...")

class AllInOne(Printable, Scannable):
    def print(self): print("Printing...")
    def scan(self):  print("Scanning...")

# ── D: Dependency Inversion ──────────────────────────────────
class Logger(ABC):
    @abstractmethod
    def log(self, msg: str): ...

class FileLogger(Logger):
    def log(self, msg): print(f"[FILE] {msg}")

class CloudLogger(Logger):
    def log(self, msg): print(f"[CLOUD] {msg}")

class PaymentProcessor:
    def __init__(self, logger: Logger):   # depend on abstraction, not FileLogger
        self.logger = logger

    def process(self, amount):
        self.logger.log(f"Processing $" + str(amount))

pp = PaymentProcessor(CloudLogger())
pp.process(99.99)`}
        />
      </Section>

      {/* super() in depth */}
      <Section title="super() In Depth">
        <Explain>
          <code className="fg">super()</code> is more than a shortcut to call the parent class — it is the mechanism that makes cooperative multiple inheritance work. It always returns a proxy for the <em>next class in the MRO</em>, not necessarily the direct parent. Calling <code className="fg">ParentClass.method(self)</code> hard-codes a single class and breaks the MRO chain.
        </Explain>
        <CodeBlock
          filename="super_in_depth.py"
          code={`# ── Single inheritance: the common case ─────────────────────
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

    def speak(self):
        return f"{self.name} says {self.sound}"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Woof")   # delegates to Animal.__init__
        self.breed = breed

    def info(self):
        return f"{super().speak()} — Breed: {self.breed}"   # delegate method too

d = Dog("Rex", "Labrador")
print(d.info())   # Rex says Woof — Breed: Labrador

# ── Why NOT hard-code the parent name ────────────────────────
class BadDog(Animal):
    def __init__(self, name, breed):
        Animal.__init__(self, name, "Woof")  # hard-coded — breaks with mixins
        self.breed = breed

# ── Cooperative super() in multiple inheritance ───────────────
class LogMixin:
    def __init__(self, *args, **kwargs):
        print(f"LogMixin.__init__ called")
        super().__init__(*args, **kwargs)   # passes args up the MRO!

class TimestampMixin:
    def __init__(self, *args, **kwargs):
        print(f"TimestampMixin.__init__ called")
        super().__init__(*args, **kwargs)

class Base:
    def __init__(self, name):
        print(f"Base.__init__ called with name={name}")
        self.name = name

class Document(LogMixin, TimestampMixin, Base):
    def __init__(self, name, content):
        super().__init__(name)   # triggers full MRO chain
        self.content = content

print(Document.__mro__)
doc = Document("Report", "...")
# LogMixin.__init__ called
# TimestampMixin.__init__ called
# Base.__init__ called with name=Report

# ── super() in non-__init__ methods ──────────────────────────
class Shape:
    def describe(self):
        return "I am a shape"

class ColoredShape(Shape):
    def __init__(self, color):
        self.color = color

    def describe(self):
        base = super().describe()   # call parent's describe()
        return f"{base} — colored {self.color}"`}
        />
      </Section>

      {/* Method Overriding vs Overloading */}
      <Section title="Method Overriding vs Overloading">
        <Explain>
          Python does NOT support traditional method overloading (same name, different signatures) the way Java or C++ does. Defining two methods with the same name simply replaces the first. Python's approach is more flexible: use default arguments, <code className="fg">*args</code>, or <code className="fg">functools.singledispatch</code> to achieve similar results.
        </Explain>
        <CodeBlock
          filename="overriding_overloading.py"
          code={`# ── Method Overriding — redefine parent method in child ───────
class Vehicle:
    def start(self):
        return "Vehicle starting with key"

class ElectricCar(Vehicle):
    def start(self):                  # OVERRIDES parent method
        return "Electric car starting silently"

class HybridCar(Vehicle):
    def start(self):
        base = super().start()        # call parent first, then add to it
        return f"{base} (hybrid mode engaged)"

for v in [Vehicle(), ElectricCar(), HybridCar()]:
    print(v.start())

# ── Python has NO overloading — last definition wins ─────────
class Calculator:
    def add(self, a, b):        # This is REPLACED...
        return a + b

    def add(self, a, b, c):    # ...by this one — only this exists!
        return a + b + c

calc = Calculator()
print(calc.add(1, 2, 3))    # 6
# calc.add(1, 2)             # TypeError — only 3-arg version exists

# ── Simulating overloading with default args ──────────────────
class SmartCalc:
    def add(self, a, b, c=None):
        if c is not None:
            return a + b + c
        return a + b

sc = SmartCalc()
print(sc.add(1, 2))      # 3
print(sc.add(1, 2, 3))   # 6

# ── Simulating overloading with *args ─────────────────────────
class FlexCalc:
    def add(self, *nums):
        return sum(nums)

    def multiply(self, *nums):
        result = 1
        for n in nums: result *= n
        return result

fc = FlexCalc()
print(fc.add(1, 2))           # 3
print(fc.add(1, 2, 3, 4))     # 10
print(fc.multiply(2, 3, 4))   # 24

# ── functools.singledispatch — true dispatch by type ──────────
from functools import singledispatch

@singledispatch
def process(arg):
    raise TypeError(f"Cannot process type {type(arg)}")

@process.register(int)
def _(arg):
    return f"Processing integer: {arg * 2}"

@process.register(str)
def _(arg):
    return f"Processing string: {arg.upper()}"

@process.register(list)
def _(arg):
    return f"Processing list with {len(arg)} items"

print(process(42))          # Processing integer: 84
print(process("hello"))     # Processing string: HELLO
print(process([1, 2, 3]))   # Processing list with 3 items`}
        />
      </Section>

      {/* Operator Overloading */}
      <Section title="Operator Overloading">
        <Explain>
          Python lets you define what operators (<code className="fg">+</code>, <code className="fg">-</code>, <code className="fg">*</code>, <code className="fg">==</code>, <code className="fg">&lt;</code>, <code className="fg">&gt;</code>, <code className="fg">[]</code>, and more) do for your custom classes using dunder methods. This makes your classes feel like natural Python objects.
        </Explain>
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(79,142,247,0.2)" }}>
                <th className="p-3 text-left fg">Operator</th>
                <th className="p-3 text-left fg">Dunder Method</th>
                <th className="p-3 text-left text-(--fg-subtle)">Reverse (r-form)</th>
              </tr>
            </thead>
            <tbody className="text-(--fg-muted)">
              {[
                ["+", "__add__", "__radd__"],
                ["-", "__sub__", "__rsub__"],
                ["*", "__mul__", "__rmul__"],
                ["/", "__truediv__", "__rtruediv__"],
                ["//", "__floordiv__", "__rfloordiv__"],
                ["%", "__mod__", "__rmod__"],
                ["**", "__pow__", "__rpow__"],
                ["==", "__eq__", "—"],
                ["<", "__lt__", "—"],
                ["<=", "__le__", "—"],
                ["[]", "__getitem__", "—"],
                ["len()", "__len__", "—"],
                ["str()", "__str__", "—"],
              ].map(([op, dunder, rev], i) => (
                <motion.tr
                  key={op}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{
                    background: i % 2 === 0 ? "rgba(26,26,46,0.5)" : "transparent",
                    borderBottom: "1px solid rgba(42,42,74,0.5)",
                  }}
                >
                  <td className="p-3 font-mono fg">{op}</td>
                  <td className="p-3 font-mono fg">{dunder}</td>
                  <td className="p-3 font-mono text-(--fg-subtle)">{rev}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock
          filename="operator_overloading.py"
          code={`from functools import total_ordering

# ── Vector class with full arithmetic ────────────────────────
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):         # Vector * number
        return Vector(self.x * scalar, self.y * scalar)

    def __rmul__(self, scalar):        # number * Vector
        return self.__mul__(scalar)

    def __neg__(self):                 # -vector (unary)
        return Vector(-self.x, -self.y)

    def __abs__(self):                 # abs(vector) = magnitude
        return (self.x**2 + self.y**2) ** 0.5

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

    def __bool__(self):
        return self.x != 0 or self.y != 0

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)     # Vector(4, 6)
print(3 * v1)      # Vector(3, 6)
print(abs(v2))     # 5.0

# ── Money class with comparison using @total_ordering ────────
@total_ordering   # auto-generates missing comparison methods from __eq__ + __lt__
class Money:
    def __init__(self, amount, currency="USD"):
        self.amount = amount
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount} {self.currency})"

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other):
        if self.currency != other.currency:
            raise ValueError("Cannot subtract different currencies")
        return Money(self.amount - other.amount, self.currency)

    def __eq__(self, other):
        return self.amount == other.amount and self.currency == other.currency

    def __lt__(self, other):
        if self.currency != other.currency:
            raise ValueError("Cannot compare different currencies")
        return self.amount < other.amount

m1 = Money(100, "USD")
m2 = Money(50, "USD")
print(m1 + m2)      # Money(150 USD)
print(m1 > m2)      # True  — __gt__ auto-generated by @total_ordering
print(m1 <= m2)     # False — __le__ auto-generated`}
        />
      </Section>

      {/* Abstract Classes deep dive */}
      <Section title="Abstract Classes — Deep Dive">
        <Explain>
          An abstract class is a blueprint that cannot be instantiated directly. It defines an interface — a contract that all subclasses must fulfil. Subclasses that do not implement all abstract methods also cannot be instantiated. This catches design errors at instantiation time rather than at runtime.
        </Explain>
        <CodeBlock
          filename="abstract_deep.py"
          code={`from abc import ABC, abstractmethod, abstractproperty
import math

# ── Abstract class with multiple abstract methods ─────────────
class Shape(ABC):
    """Abstract base class for all shapes."""

    @abstractmethod
    def area(self):
        """All shapes must implement area()."""
        ...

    @abstractmethod
    def perimeter(self):
        """All shapes must implement perimeter()."""
        ...

    # Concrete method — subclasses inherit this for free
    def describe(self):
        return (f"{self.__class__.__name__}: "
                f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")

# ── Trying to instantiate abstract class ─────────────────────
try:
    s = Shape()
except TypeError as e:
    print(e)   # Can't instantiate abstract class Shape...

# ── Concrete subclasses ───────────────────────────────────────
class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

class Triangle(Shape):
    def __init__(self, a, b, c):
        self.a, self.b, self.c = a, b, c

    def area(self):
        s = (self.a + self.b + self.c) / 2   # semi-perimeter
        return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))

    def perimeter(self):
        return self.a + self.b + self.c

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)]
for shape in shapes:
    print(shape.describe())

# ── Real use case: Payment processor interface ────────────────
class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount, currency="USD"):
        """Charge the customer."""
        ...

    @abstractmethod
    def refund(self, transaction_id, amount):
        """Refund a previous charge."""
        ...

    @abstractmethod
    def get_balance(self):
        """Return available balance."""
        ...

    # Concrete method available to all processors
    def charge_with_fee(self, amount, fee_pct=2.9):
        fee = amount * fee_pct / 100
        return self.charge(amount + fee)

class StripeProcessor(PaymentProcessor):
    def charge(self, amount, currency="USD"):
        print(f"Stripe: charging {amount} {currency}")
        return "txn_stripe_123"

    def refund(self, transaction_id, amount):
        print(f"Stripe: refunding {amount} on {transaction_id}")

    def get_balance(self):
        return 10_000.00

class PayPalProcessor(PaymentProcessor):
    def charge(self, amount, currency="USD"):
        print(f"PayPal: charging {amount} {currency}")
        return "pp_txn_456"

    def refund(self, transaction_id, amount):
        print(f"PayPal: refunding {amount} on {transaction_id}")

    def get_balance(self):
        return 5_000.00

# Polymorphic use — same interface, different implementations
for processor in [StripeProcessor(), PayPalProcessor()]:
    txn = processor.charge_with_fee(100)
    print(f"Balance: {processor.get_balance()}")`}
        />
      </Section>

      {/* Practice Exercises */}
      <Section title="Class Practice Exercises">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border p-6 my-6"

        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg"></span>
            <h4 className="font-semibold text-(--fg) text-base">Practice: Shape Hierarchy (Abstract)</h4>
          </div>
          <p className="text-(--fg-muted) text-sm mb-4 leading-relaxed">
            Build a Shape abstract base class with abstract methods area() and perimeter(). Add at least three concrete shapes. Add a compare_areas() function that takes two shapes and prints which has the larger area.
          </p>
          <p className="text-xs text-(--fg-subtle) font-semibold mb-2 uppercase tracking-wider">Solution</p>
          <CodeBlock
            filename="shape_hierarchy.py"
            code={`from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self): ...

    @abstractmethod
    def perimeter(self): ...

    def __gt__(self, other):
        return self.area() > other.area()

    def __repr__(self):
        return f"{self.__class__.__name__}(area={self.area():.2f})"

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r ** 2
    def perimeter(self): return 2 * math.pi * self.r

class Square(Shape):
    def __init__(self, side): self.side = side
    def area(self): return self.side ** 2
    def perimeter(self): return 4 * self.side

class RightTriangle(Shape):
    def __init__(self, a, b):
        self.a, self.b = a, b
        self.hyp = math.sqrt(a**2 + b**2)
    def area(self): return 0.5 * self.a * self.b
    def perimeter(self): return self.a + self.b + self.hyp

def compare_areas(s1, s2):
    if s1 > s2:
        print(f"{s1} is larger than {s2}")
    elif s2 > s1:
        print(f"{s2} is larger than {s1}")
    else:
        print("Equal areas")

compare_areas(Circle(5), Square(8))
compare_areas(Square(4), RightTriangle(3, 4))

# Sort shapes by area
shapes = [Circle(3), Square(5), RightTriangle(6, 8), Circle(1)]
for s in sorted(shapes, key=lambda x: x.area()):
    print(s)`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border p-6 my-6"

        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg"></span>
            <h4 className="font-semibold text-(--fg) text-base">Practice: BankAccount with Full OOP</h4>
          </div>
          <p className="text-(--fg-muted) text-sm mb-4 leading-relaxed">
            Implement a BankAccount class with encapsulation (private balance), a deposit/withdraw method with validation, a transaction history property, and operator overloading so two accounts can be compared by balance.
          </p>
          <p className="text-xs text-(--fg-subtle) font-semibold mb-2 uppercase tracking-wider">Solution</p>
          <CodeBlock
            filename="bank_account.py"
            code={`from functools import total_ordering
from datetime import datetime

@total_ordering
class BankAccount:
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self.__balance = initial_balance    # private
        self.__history = []

    @property
    def balance(self):
        return self.__balance

    @property
    def history(self):
        return list(self.__history)   # return a copy

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.__balance += amount
        self.__history.append((datetime.now(), "deposit", amount))
        return self

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Withdrawal must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount
        self.__history.append((datetime.now(), "withdraw", amount))
        return self

    def transfer(self, other, amount):
        self.withdraw(amount)
        other.deposit(amount)
        return self

    def __repr__(self):
        return f"BankAccount(owner={self.owner!r}, balance={self.__balance})"

    def __eq__(self, other):
        return self.__balance == other.balance

    def __lt__(self, other):
        return self.__balance < other.balance

alice = BankAccount("Alice", 1000)
bob   = BankAccount("Bob", 500)

alice.deposit(200).deposit(50)   # method chaining
alice.transfer(bob, 300)

print(alice)        # balance: 950
print(bob)          # balance: 800
print(alice > bob)  # True

for ts, action, amount in alice.history:
    print(f"  {action}: {amount}")`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border p-6 my-6"

        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg"></span>
            <h4 className="font-semibold text-(--fg) text-base">Practice: Custom Iterable Class</h4>
          </div>
          <p className="text-(--fg-muted) text-sm mb-4 leading-relaxed">
            Create a NumberRange class that acts like range() — it accepts start, stop, and step, and is iterable with for loops. Also support len(), indexing with [], and the in operator.
          </p>
          <p className="text-xs text-(--fg-subtle) font-semibold mb-2 uppercase tracking-wider">Solution</p>
          <CodeBlock
            filename="custom_iterable.py"
            code={`class NumberRange:
    def __init__(self, start, stop, step=1):
        if step == 0:
            raise ValueError("step cannot be zero")
        self.start = start
        self.stop = stop
        self.step = step

    def _values(self):
        """Generate the values in this range."""
        current = self.start
        while (self.step > 0 and current < self.stop) or \
              (self.step < 0 and current > self.stop):
            yield current
            current += self.step

    def __iter__(self):
        return self._values()

    def __len__(self):
        if self.step > 0:
            return max(0, (self.stop - self.start + self.step - 1) // self.step)
        return max(0, (self.start - self.stop - self.step - 1) // (-self.step))

    def __getitem__(self, index):
        lst = list(self._values())
        return lst[index]

    def __contains__(self, value):
        return value in self._values()

    def __repr__(self):
        return f"NumberRange({self.start}, {self.stop}, {self.step})"

r = NumberRange(1, 10, 2)
print(list(r))       # [1, 3, 5, 7, 9]
print(len(r))        # 5
print(r[0], r[-1])   # 1 9
print(5 in r)        # True
print(4 in r)        # False

# Countdown
for n in NumberRange(10, 0, -2):
    print(n, end=" ")   # 10 8 6 4 2`}
          />
        </motion.div>
      </Section>
    </PageLayout>
  );
}
