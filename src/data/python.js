export const pythonConcepts = [
    {
        id: "python-gil",
        title: "Python GIL (Global Interpreter Lock)",
        description: "Why Python can only execute one thread at a time and how to work around it",
        category: "python",
        icon: "🔒",
        difficulty: "advanced",
        mermaid: `graph TD
    A["🐍 Python Process<br/>CPython interpreter"] --> B["🔒 GIL<br/>Global Interpreter Lock"]
    B --> C["Thread 1<br/>has GIL ✅"]
    B --> D["Thread 2<br/>waiting ⏳"]
    B --> E["Thread 3<br/>waiting ⏳"]
    C --> F{"I/O operation?"}
    F -->|Yes| G["🔓 Release GIL<br/>other thread runs"]
    F -->|No| H["CPU-bound<br/>holds GIL"]
    G --> D
    H --> I["⚡ Use multiprocessing<br/>for CPU-bound work"]

    style B fill:#3b2f1f,stroke:#fb923c,color:#fff
    style C fill:#1f3b2f,stroke:#34d399,color:#fff
    style D fill:#3b1f1f,stroke:#f87171,color:#fff
    style I fill:#1e3a5f,stroke:#4f8cff,color:#fff`,
        steps: [
            { node: "B", title: "What is the GIL?", explanation: "The GIL is a mutex that allows only ONE thread to execute Python bytecode at a time. Even on a multi-core CPU, Python threads can't run in parallel for CPU-bound tasks. This is a CPython implementation detail, not a Python language feature.", code: `import threading\n# These threads DON'T run in parallel!\nt1 = threading.Thread(target=cpu_heavy_task)\nt2 = threading.Thread(target=cpu_heavy_task)\nt1.start(); t2.start()\n# Takes same time as running sequentially!`, language: "python" },
            { node: "F", title: "I/O vs CPU Bound", explanation: "The GIL is released during I/O operations (network, file, sleep). So threading IS useful for I/O-bound tasks like web scraping or API calls. For CPU-bound tasks, use multiprocessing instead.", code: `# I/O bound → threading works!\nimport concurrent.futures\nwith concurrent.futures.ThreadPoolExecutor() as pool:\n    results = pool.map(fetch_url, urls)\n\n# CPU bound → use multiprocessing!\nwith concurrent.futures.ProcessPoolExecutor() as pool:\n    results = pool.map(heavy_computation, data)`, language: "python" },
            { node: "I", title: "Workarounds", explanation: "Use multiprocessing for CPU-bound work (each process has its own GIL). Use asyncio for I/O-bound work. Use C extensions (NumPy, etc.) that release the GIL. Python 3.13+ introduced experimental free-threaded mode.", code: `# asyncio for I/O (single thread, no GIL issue)\nimport asyncio\nasync def main():\n    results = await asyncio.gather(\n        fetch_data(url1),\n        fetch_data(url2),\n    )\n\n# NumPy releases GIL during computation\nimport numpy as np\n# This runs at full multi-core speed!`, language: "python" }
        ]
    },
    {
        id: "python-decorators",
        title: "Python Decorators",
        description: "Functions that modify other functions — Python's powerful metaprogramming tool",
        category: "python",
        icon: "🎀",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📝 Define decorator<br/>function"] --> B["🔧 Takes function<br/>as argument"]
    B --> C["📦 Creates wrapper<br/>function inside"]
    C --> D["➕ Adds behavior<br/>before/after"]
    D --> E["↩️ Returns wrapper<br/>function"]
    E --> F["🎀 @decorator<br/>syntax sugar"]
    F --> G["✅ Original function<br/>now enhanced"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style F fill:#3b2f1f,stroke:#fb923c,color:#fff
    style G fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            { node: "A", title: "Decorator is a Function", explanation: "A decorator is a function that takes another function as input and returns a new function with added behavior. It's Python's way of modifying functions without changing their source code.", code: `def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print("Before function call")\n        result = func(*args, **kwargs)\n        print("After function call")\n        return result\n    return wrapper`, language: "python" },
            { node: "F", title: "@ Syntax Sugar", explanation: "@decorator above a function definition is equivalent to func = decorator(func). It's syntactic sugar that makes the code more readable.", code: `@my_decorator\ndef greet(name):\n    print(f"Hello, {name}!")\n\n# Same as:\n# greet = my_decorator(greet)\n\ngreet("Zaheer")\n# Output:\n# Before function call\n# Hello, Zaheer!\n# After function call`, language: "python" },
            { node: "D", title: "Practical Decorators", explanation: "Common real-world uses: timing functions, caching (memoization), authentication, logging, rate limiting, retry logic.", code: `import time\nfrom functools import lru_cache\n\n# Timing decorator\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time()-start:.2f}s")\n        return result\n    return wrapper\n\n# Built-in caching decorator\n@lru_cache(maxsize=128)\ndef fibonacci(n):\n    if n < 2: return n\n    return fibonacci(n-1) + fibonacci(n-2)`, language: "python" }
        ]
    },
    {
        id: "python-generators",
        title: "Python Generators & Iterators",
        description: "Lazy evaluation with yield — process data without loading everything into memory",
        category: "python",
        icon: "🔄",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📝 Function with yield<br/>= generator function"] --> B["🏭 Calling it returns<br/>generator object"]
    B --> C["▶️ next() called<br/>resumes execution"]
    C --> D["⏸️ yield value<br/>pauses, returns value"]
    D --> E["▶️ next() again<br/>resumes from yield"]
    E --> F{"More yields?"}
    F -->|Yes| D
    F -->|No| G["🛑 StopIteration<br/>generator exhausted"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style C fill:#1f3b2f,stroke:#34d399,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            { node: "A", title: "Generator Function", explanation: "A function with 'yield' instead of 'return' becomes a generator function. Unlike regular functions that compute all values at once, generators produce values lazily — one at a time, on demand.", code: `def count_up(n):\n    i = 0\n    while i < n:\n        yield i  # Pauses here, returns i\n        i += 1   # Resumes here on next()\n\n# Calling it creates a generator object\ngen = count_up(3)\nprint(next(gen))  # 0\nprint(next(gen))  # 1\nprint(next(gen))  # 2`, language: "python" },
            { node: "D", title: "yield Pauses Execution", explanation: "yield is like a pausable return. The function's state (local variables, position) is preserved between calls. This is why generators are memory-efficient — they don't store all values.", code: `# List: stores ALL values in memory\nnums = [x**2 for x in range(1_000_000)]  # ~8MB\n\n# Generator: computes on demand\nnums = (x**2 for x in range(1_000_000))  # ~120 bytes!\n\n# Process huge files line by line:\ndef read_huge_file(path):\n    with open(path) as f:\n        for line in f:\n            yield line.strip()`, language: "python" },
            { node: "G", title: "Practical Uses", explanation: "Generators are ideal for large datasets, infinite sequences, data pipelines, and streaming. Python's built-in range(), map(), filter() all return iterators/generators.", code: `# Infinite sequence\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Data pipeline (chained generators)\ndef pipeline(filename):\n    lines = read_lines(filename)\n    parsed = (json.loads(l) for l in lines)\n    filtered = (r for r in parsed if r['active'])\n    return (r['name'] for r in filtered)`, language: "python" }
        ]
    },
    {
        id: "python-context-managers",
        title: "Context Managers (with statement)",
        description: "Automatic resource management — ensuring cleanup code always runs",
        category: "python",
        icon: "🚪",
        difficulty: "beginner",
        mermaid: `graph TD
    A["📝 with statement<br/>enters context"] --> B["🚪 __enter__<br/>setup / acquire"]
    B --> C["💻 Execute body<br/>use resource"]
    C --> D{"Exception?"}
    D -->|Yes| E["🚪 __exit__<br/>cleanup runs anyway"]
    D -->|No| F["🚪 __exit__<br/>cleanup runs"]
    E --> G["🛡️ Resource is<br/>safely released"]
    F --> G

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#1f3b2f,stroke:#34d399,color:#fff
    style E fill:#3b1f1f,stroke:#f87171,color:#fff
    style G fill:#3b1f5e,stroke:#a855f7,color:#fff`,
        steps: [
            { node: "A", title: "The Problem: Resource Leaks", explanation: "When working with files, connections, or locks, you MUST close them after use. Without proper cleanup, resources leak — files stay locked, connections exhaust the pool, memory isn't freed.", code: `# BAD: resource leak if error occurs\nf = open('data.txt')\ndata = f.read()  # What if this throws?\nf.close()  # Never reached!\n\n# GOOD: with statement guarantees cleanup\nwith open('data.txt') as f:\n    data = f.read()\n# f.close() called automatically!`, language: "python" },
            { node: "B", title: "__enter__ and __exit__", explanation: "Context managers implement __enter__ (setup) and __exit__ (cleanup). The with statement calls __enter__ at the start and __exit__ at the end — even if an exception occurs.", code: `class DatabaseConnection:\n    def __enter__(self):\n        self.conn = connect_to_db()\n        return self.conn\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.conn.close()  # Always runs!\n        return False  # Don't suppress exceptions\n\nwith DatabaseConnection() as db:\n    db.execute("SELECT * FROM users")`, language: "python" },
            { node: "G", title: "contextlib Shortcuts", explanation: "Python's contextlib module provides @contextmanager decorator — write context managers as generators with a single yield. Much simpler than implementing __enter__/__exit__.", code: `from contextlib import contextmanager\n\n@contextmanager\ndef timer(label):\n    start = time.time()\n    yield  # Body of 'with' block runs here\n    elapsed = time.time() - start\n    print(f"{label}: {elapsed:.2f}s")\n\nwith timer("Data processing"):\n    process_large_dataset()`, language: "python" }
        ]
    }
];
