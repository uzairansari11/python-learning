"use client";

import PageLayout from "../components/PageLayout";
import CodeBlock from "../components/CodeBlock";
import Section, { SubSection, Explain, Callout } from "../components/Section";

export default function ErrorHandlingPage() {
  return (
    <PageLayout title="Error Handling"
      subtitle="Robust applications anticipate failures. Python's exception system lets you handle errors gracefully instead of crashing."
    >
      {/* try/except/else/finally */}
      <Section title="try / except / else / finally">
        <Explain>
          The full exception handling block has four clauses: <code>try</code> (run this),
          <code>except</code> (handle errors), <code>else</code> (run if no error), and
          <code>finally</code> (always run, for cleanup).
        </Explain>
        <CodeBlock
          filename="error_handling.py"
          code={`def divide(a, b):
    try:
        result = a / b          # code that might raise an exception
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"Error: Invalid types — {e}")
        return None
    else:
        # Runs ONLY if no exception was raised
        print(f"Success! {a} / {b} = {result}")
        return result
    finally:
        # Runs ALWAYS — even if there's an exception or a return
        print("divide() completed (with or without error)")

divide(10, 2)
# Success! 10 / 2 = 5.0
# divide() completed (with or without error)

divide(10, 0)
# Error: Cannot divide by zero!
# divide() completed (with or without error)

divide("10", 2)
# Error: Invalid types — unsupported operand type(s) for /: 'str' and 'int'
# divide() completed (with or without error)`}
        />
        <Callout type="info">
          Use <code>else</code> for code that should only run when the <code>try</code> block succeeded.
          Use <code>finally</code> for cleanup like closing files, releasing locks, or disconnecting from databases.
        </Callout>
      </Section>

      {/* Common Exceptions */}
      <Section title="Common Built-in Exceptions">
        <Explain>
          Python has a rich hierarchy of built-in exceptions. Knowing which exception
          to expect for which operation is key to writing good error handling.
        </Explain>
        <CodeBlock
          code={`# ValueError — wrong value, right type
int("abc")          # ValueError: invalid literal for int() with base 10: 'abc'
[].remove(99)       # ValueError: list.remove(x): x not in list

# TypeError — wrong type entirely
"hello" + 5         # TypeError: can only concatenate str (not "int") to str
len(42)             # TypeError: object of type 'int' has no len()

# KeyError — dictionary key doesn't exist
d = {"a": 1}
d["b"]              # KeyError: 'b'

# IndexError — list index out of range
lst = [1, 2, 3]
lst[10]             # IndexError: list index out of range

# AttributeError — object has no such attribute
"hello".nonexistent # AttributeError: 'str' object has no attribute 'nonexistent'

# FileNotFoundError — file doesn't exist
open("ghost.txt")   # FileNotFoundError: [Errno 2] No such file or directory

# ZeroDivisionError
10 / 0              # ZeroDivisionError: division by zero

# Catching multiple exceptions
try:
    value = int(input("Enter a number: "))
    result = 100 / value
    print(f"100 / {value} = {result}")
except ValueError:
    print("Please enter a valid integer")
except ZeroDivisionError:
    print("Please enter a non-zero number")
except Exception as e:
    # Catch-all (use sparingly — be specific when possible)
    print(f"Unexpected error: {type(e).__name__}: {e}")`}
        />
      </Section>

      {/* raise */}
      <Section title="raise — Trigger Exceptions Intentionally">
        <Explain>
          Use <code>raise</code> to throw an exception when your code detects an invalid state.
          This is how you enforce business rules and validate inputs in your functions.
        </Explain>
        <CodeBlock
          code={`def set_age(age):
    if not isinstance(age, int):
        raise TypeError(f"Age must be an integer, got {type(age).__name__}")
    if age < 0:
        raise ValueError(f"Age cannot be negative, got {age}")
    if age > 150:
        raise ValueError(f"Age {age} seems unrealistic")
    return age

# Good input
print(set_age(25))   # 25

# Bad inputs — each raises an exception
# set_age("thirty")  # TypeError: Age must be an integer, got str
# set_age(-5)        # ValueError: Age cannot be negative, got -5

# Re-raise an exception after handling it
def process_file(path):
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        print(f"Log: File not found: {path}")
        raise  # re-raise the same exception to let the caller handle it`}
        />
      </Section>

      {/* Custom Exceptions */}
      <Section title="Custom Exceptions">
        <Explain>
          Create your own exception classes by inheriting from <code>Exception</code> (or a
          more specific built-in). This makes your API clearer and lets callers handle your
          errors specifically.
        </Explain>
        <CodeBlock
          code={`# Base custom exception for our app
class AppError(Exception):
    """Base class for all application errors."""
    pass

class ValidationError(AppError):
    """Raised when user input fails validation."""
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"Validation error on '{field}': {message}")

class DatabaseError(AppError):
    """Raised when a database operation fails."""
    def __init__(self, operation, detail):
        self.operation = operation
        super().__init__(f"Database {operation} failed: {detail}")

class NotFoundError(AppError):
    """Raised when a resource is not found."""
    def __init__(self, resource, identifier):
        super().__init__(f"{resource} with id={identifier!r} not found")


# Use them
def create_user(username, email):
    if len(username) < 3:
        raise ValidationError("username", "Must be at least 3 characters")
    if "@" not in email:
        raise ValidationError("email", "Must contain @")
    return {"username": username, "email": email}

try:
    user = create_user("ab", "not-an-email")
except ValidationError as e:
    print(f"Field: {e.field}")   # Field: username
    print(f"Error: {e}")        # Error: Validation error on 'username': Must be at least 3 characters
except AppError as e:
    print(f"App error: {e}")`}
        />
      </Section>

      {/* Exception Chaining */}
      <Section title="Exception Chaining">
        <Explain>
          When you raise a new exception while handling another, Python automatically chains them.
          You can also explicitly chain using <code>raise NewError() from original_error</code> to
          preserve the original cause.
        </Explain>
        <CodeBlock
          code={`class ConfigError(Exception):
    pass

def load_config(path):
    try:
        with open(path) as f:
            import json
            return json.load(f)
    except FileNotFoundError as e:
        raise ConfigError(f"Config file not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ConfigError(f"Config file is invalid JSON: {path}") from e

try:
    config = load_config("missing.json")
except ConfigError as e:
    print(f"Config error: {e}")
    print(f"Caused by: {e.__cause__}")

# Suppress the chain with 'from None' (when the original cause is irrelevant)
def safe_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        raise ValueError(f"Cannot convert {value!r} to int") from None`}
        />
      </Section>

      {/* Logging */}
      <Section title="Logging vs print for Errors">
        <Explain>
          <code>print()</code> is for development. In production, use the <code>logging</code>
          module — it gives you severity levels, timestamps, file output, and filtering without
          changing your code.
        </Explain>
        <CodeBlock
          code={`import logging

# Configure logging (do this once at app startup)
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(),               # console output
        logging.FileHandler("app.log"),        # file output
    ],
)

logger = logging.getLogger(__name__)

def process_payment(amount, user_id):
    logger.debug(f"Processing payment: amount={amount}, user={user_id}")

    if amount <= 0:
        logger.warning(f"Invalid payment amount {amount} for user {user_id}")
        raise ValueError("Amount must be positive")

    try:
        # simulate payment gateway call
        if amount > 10000:
            raise ConnectionError("Payment gateway timeout")
        logger.info(f"Payment of \${amount} processed for user {user_id}")
        return True
    except ConnectionError as e:
        logger.error(f"Payment failed for user {user_id}: {e}", exc_info=True)
        raise

# Log levels (from least to most severe):
# DEBUG    → detailed diagnostic info
# INFO     → confirmation things are working
# WARNING  → something unexpected but handled
# ERROR    → serious problem, function failed
# CRITICAL → severe error, program may not continue`}
        />
        <Callout type="tip">
          Django uses the same <code>logging</code> module. Configure it in <code>settings.py</code> under
          the <code>LOGGING</code> dict and your entire app gets structured, filterable logs.
        </Callout>
      </Section>
    </PageLayout>
  );
}
