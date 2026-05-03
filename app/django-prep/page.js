"use client";

import { motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import { Callout } from "../components/Section";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ComparisonPair({ pythonTitle, djangoTitle, pythonCode, djangoCode, emoji, explanation }) {
  return (
    <motion.div
      variants={cardVariants}
      className="mb-12"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{pythonTitle}</h3>
          <p className="text-sm text-(--fg-subtle)">{explanation}</p>
        </div>
      </div>

      {/* Side-by-side grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Python side */}
        <div
          className="rounded-xl border overflow-hidden"
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2 border-b"
          >
            <span className="text-sm font-semibold fg">{pythonTitle}</span>
          </div>
          <div className="code-wrapper overflow-x-auto">
            <CodeBlock code={pythonCode} />
          </div>
        </div>

        {/* Django side */}
        <div
          className="rounded-xl border overflow-hidden"
        >
          <div
            className="px-4 py-2.5 flex items-center gap-2 border-b"
          >
            <span className="text-sm font-semibold text-[#4caf50]">{djangoTitle}</span>
          </div>
          <div className="code-wrapper overflow-x-auto">
            <CodeBlock code={djangoCode} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DjangoPrepPage() {
  return (
    <PageLayout title="Django Prep"
      subtitle="Every Python concept you've learned maps directly to Django. Here's the connection made explicit."
    >
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 p-5 rounded-xl border"
        style={{
                    }}
      >
        <p className="text-(--fg-muted) leading-relaxed">
          Django is a high-level Python web framework. It&apos;s not magic — every feature is built on the
          exact Python concepts you&apos;ve learned. Below, each concept is shown side-by-side: pure Python
          on the left, how Django uses it on the right.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <ComparisonPair pythonTitle="OOP & Classes"
          djangoTitle="Django Models"
          explanation="Python classes become database tables in Django. Each attribute becomes a column."
          pythonCode={`class Person:
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

    def greet(self):
        return f"Hi, I'm {self.name}"

p = Person("Alice", 30, "alice@example.com")
print(p.greet())`}
          djangoCode={`from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.EmailField(unique=True)

    def greet(self):
        return f"Hi, I'm {self.name}"

    class Meta:
        ordering = ["name"]

# Django auto-creates: id, CREATE TABLE, etc.
# Person.objects.create(name="Alice", age=30, email="alice@example.com")`}
        />

        <ComparisonPair pythonTitle="Decorators"
          djangoTitle="@login_required & @csrf_exempt"
          explanation="Django ships decorators for views. The pattern is identical to what you built in the decorators section."
          pythonCode={`import functools

def login_required(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user.is_authenticated:
            redirect("/login")
            return
        return func(*args, **kwargs)
    return wrapper

@login_required
def dashboard(request):
    return "Welcome to your dashboard"`}
          djangoCode={`from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

# Exact same decorator pattern!
@login_required
def dashboard(request):
    return HttpResponse(f"Welcome, {request.user.username}")

# Stack multiple decorators
@login_required
@csrf_exempt
def api_endpoint(request):
    return HttpResponse("API response")`}
        />

        <ComparisonPair pythonTitle="**kwargs"
          djangoTitle="URL kwargs & View kwargs"
          explanation="Django passes URL parameters as **kwargs to view functions — the exact same pattern."
          pythonCode={`def create_profile(**kwargs):
    name = kwargs.get("name", "Anonymous")
    age = kwargs.get("age", 0)
    print(f"Name: {name}, Age: {age}")

create_profile(name="Alice", age=30)

# URL-style routing in pure Python
def route(path, **path_params):
    # path = "/users/42/posts/7"
    # path_params = {"user_id": 42, "post_id": 7}
    return f"Viewing post {path_params['post_id']}"`}
          djangoCode={`# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("users/<int:user_id>/posts/<int:post_id>/", views.post_detail),
    path("blog/<slug:slug>/", views.blog_detail),
]

# views.py — URL params arrive as kwargs!
def post_detail(request, user_id, post_id):
    # user_id and post_id come from the URL
    post = Post.objects.get(id=post_id, author_id=user_id)
    return HttpResponse(f"Post: {post.title}")`}
        />

        <ComparisonPair pythonTitle="Context Managers"
          djangoTitle="Django Database Transactions"
          explanation="Python's with statement powers Django's atomic transaction blocks."
          pythonCode={`# Custom context manager using class
class DatabaseConnection:
    def __enter__(self):
        self.conn = connect_to_db()
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()
        self.conn.close()

with DatabaseConnection() as conn:
    conn.execute("INSERT INTO users ...")
    conn.execute("UPDATE accounts ...")`}
          djangoCode={`from django.db import transaction

# Django's atomic() is a context manager!
def transfer_funds(from_account, to_account, amount):
    with transaction.atomic():
        # Both operations succeed or both are rolled back
        from_account.balance -= amount
        from_account.save()

        to_account.balance += amount
        to_account.save()

# Also available as a decorator
@transaction.atomic
def create_order(cart, user):
    order = Order.objects.create(user=user)
    for item in cart.items.all():
        OrderItem.objects.create(order=order, product=item)`}
        />

        <ComparisonPair pythonTitle="Error Handling"
          djangoTitle="Django Custom Error Views"
          explanation="Python's exception classes map to Django's HTTP error handlers."
          pythonCode={`# Custom exceptions
class NotFoundError(Exception):
    pass

class PermissionError(Exception):
    pass

def get_user(user_id):
    user = db.find(user_id)
    if user is None:
        raise NotFoundError(f"User {user_id} not found")
    return user

try:
    user = get_user(999)
except NotFoundError as e:
    print(f"404: {e}")`}
          djangoCode={`from django.http import Http404
from django.core.exceptions import PermissionDenied

# Django's built-in exceptions
def get_user_view(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        raise Http404(f"User {user_id} not found")
    return HttpResponse(user.name)

# Custom 404 and 500 handlers in urls.py:
# handler404 = "myapp.views.custom_404"
# handler500 = "myapp.views.custom_500"

def custom_404(request, exception):
    return render(request, "404.html", status=404)`}
        />

        <ComparisonPair pythonTitle="Python Modules & Packages"
          djangoTitle="Django Apps"
          explanation="A Python package (directory with __init__.py) becomes a Django app."
          pythonCode={`# Python package structure
# mypackage/
#   __init__.py
#   models.py
#   utils.py
#   services.py

# __init__.py
from .models import User
from .utils import format_name

# Import from anywhere
from mypackage import User
from mypackage.services import send_email

# Each module is just a .py file
# No magic — just files in folders!`}
          djangoCode={`# Django app structure (same concept!)
# users/              ← this IS a Python package
#   __init__.py
#   models.py         ← defines DB models
#   views.py          ← handles HTTP requests
#   urls.py           ← URL routing
#   admin.py          ← admin interface
#   serializers.py    ← DRF serializers

# settings.py
INSTALLED_APPS = [
    "users",           # your app
    "django.contrib.auth",  # built-in app
]

# Create a new app
# $ python manage.py startapp blog`}
        />

        <ComparisonPair pythonTitle="Class Properties & __init__"
          djangoTitle="Django Forms & Serializers"
          explanation="Django Forms mirror class-based data validation — same OOP concepts, different context."
          pythonCode={`class UserRegistration:
    def __init__(self, data):
        self.username = data.get("username", "")
        self.email = data.get("email", "")
        self.password = data.get("password", "")
        self._errors = {}

    def validate(self):
        if len(self.username) < 3:
            self._errors["username"] = "Too short"
        if "@" not in self.email:
            self._errors["email"] = "Invalid email"
        return len(self._errors) == 0

data = {"username": "ab", "email": "bad"}
form = UserRegistration(data)
if not form.validate():
    print(form._errors)`}
          djangoCode={`from django import forms
from django.contrib.auth.models import User

class UserRegistrationForm(forms.Form):
    username = forms.CharField(min_length=3)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)

    def clean_username(self):
        username = self.cleaned_data["username"]
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username taken")
        return username

# In a view:
form = UserRegistrationForm(request.POST)
if form.is_valid():
    # cleaned_data is your validated data
    user = User.objects.create_user(**form.cleaned_data)`}
        />
      </motion.div>

      {/* Summary table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-4 p-6 rounded-2xl border"
        style={{
                    }}
      >
        <h3 className="text-xl font-bold gradient-text mb-5">Quick Reference: Python → Django</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default">
                <th className="text-left py-2 pr-6 fg font-semibold">Python Concept</th>
                <th className="text-left py-2 pr-6 text-[#4caf50] font-semibold">Django Feature</th>
                <th className="text-left py-2 text-(--fg-subtle) font-semibold">Where</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a4a]">
              {[
                ["Classes", "Models", "models.py"],
                ["Inheritance", "Model inheritance, CBVs", "models.py, views.py"],
                ["Decorators", "@login_required, @permission_required", "views.py"],
                ["**kwargs", "URL path parameters", "urls.py → views.py"],
                ["Context Managers", "transaction.atomic()", "views.py, services.py"],
                ["Custom Exceptions", "Http404, PermissionDenied", "views.py"],
                ["Modules/Packages", "Django Apps", "INSTALLED_APPS"],
                ["File Handling", "FileField, ImageField, MEDIA_ROOT", "models.py, settings.py"],
                ["Logging", "Django logging config", "settings.py"],
                ["List Comprehensions", "QuerySet filters & annotations", "views.py, ORM"],
              ].map(([concept, feature, location]) => (
                <tr key={concept} className="text-(--fg-muted)">
                  <td className="py-2.5 pr-6">
                    <code className="fg text-xs surface-muted px-2 py-0.5 rounded">
                      {concept}
                    </code>
                  </td>
                  <td className="py-2.5 pr-6 text-(--fg-muted)">{feature}</td>
                  <td className="py-2.5 text-(--fg-subtle) font-mono text-xs">{location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Final callout */}
      <Callout type="tip">
        You already know everything you need to start building with Django. The framework
        is just organized Python with conventions. Run <code>pip install django</code> and
        <code>django-admin startproject mysite</code> to begin your first project!
      </Callout>
    </PageLayout>
  );
}
