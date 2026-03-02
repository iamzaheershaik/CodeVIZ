export const javascriptConcepts = [
    {
        id: "js-event-loop",
        title: "The JavaScript Event Loop",
        description: "How JavaScript handles multiple tasks even though it can only do one thing at a time",
        category: "javascript",
        icon: "🔄",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📝 Your Code<br/>runs line by line"] --> B["📚 Call Stack<br/>one task at a time"]
    B --> C{"Async task?"}
    C -->|No| D["✅ Run it now<br/>on the stack"]
    C -->|Yes| E["🌐 Web APIs<br/>browser handles it"]
    E --> F["⏰ Timer / Fetch<br/>working in background"]
    F --> G["📬 Callback Queue<br/>waiting in line"]
    G --> H{"Call Stack<br/>empty?"}
    H -->|No| I["⏳ Wait<br/>keep checking"]
    I --> H
    H -->|Yes| J["🚀 Move to Stack<br/>now it runs!"]
    J --> B

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#3b2f1f,stroke:#fb923c,color:#fff
    style G fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style J fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            { node: "A", title: "What is the Event Loop?", explanation: "Imagine you're a chef in a kitchen. You can only cook ONE dish at a time with your hands. But what if someone orders a cake that needs 30 minutes in the oven? Do you just stand there waiting? No! You put it in the oven and start cooking the next order. The Event Loop is JavaScript's way of doing the same thing — handling multiple tasks despite only being able to do one thing at a time.", code: `// JavaScript runs your code line by line\nconsole.log("First");   // Runs immediately\nconsole.log("Second");  // Runs next\nconsole.log("Third");   // Runs last`, language: "javascript" },
            { node: "B", title: "The Call Stack — Your Hands", explanation: "The Call Stack is like your hands in the kitchen — it's where the actual work happens. JavaScript can only do ONE thing at a time on the Call Stack. When you call a function, it goes ON TOP of the stack. When the function finishes, it gets REMOVED from the top. Think of it like a stack of plates — you always work with the top one first.", code: `function greet() {\n  console.log("Hello!");\n}\nfunction start() {\n  greet(); // greet goes on top of the stack\n}\nstart(); // start goes on the stack first`, language: "javascript" },
            { node: "C", title: "Sync vs Async — Is This Quick?", explanation: "When JavaScript sees a task, it asks: 'Can I do this RIGHT NOW, or will it take a long time?' Simple math like 2+2? Do it now! But fetching data from the internet? That could take seconds. JavaScript doesn't want to freeze and wait, so it sends slow tasks somewhere else. This is the difference between synchronous (do it now) and asynchronous (do it later).", code: `// SYNC — runs instantly on the stack\nconst sum = 2 + 2; // Done!\n\n// ASYNC — takes time, can't block!\nfetch('https://api.example.com/data')\n// This would freeze everything if it waited!\n// So JavaScript sends it to the browser...`, language: "javascript" },
            { node: "D", title: "Synchronous Code — Run It Now!", explanation: "If the task is simple and fast (like adding numbers, updating a variable, or showing a message), JavaScript runs it immediately on the Call Stack. No waiting, no delegation. It just does it and moves to the next line. Most of your code runs this way — only special tasks like timers, network requests, and file operations are async.", code: `// All of these run immediately, one after another\nlet name = "Zaheer";\nlet greeting = "Hello, " + name;\nconsole.log(greeting); // "Hello, Zaheer"\nlet x = 10 * 5;\nconsole.log(x);        // 50`, language: "javascript" },
            { node: "E", title: "Web APIs — The Kitchen Helpers", explanation: "When JavaScript encounters an async task, it sends it to the Web APIs — these are like kitchen helpers (oven, dishwasher, food processor). The browser provides these helpers: setTimeout (timer), fetch (network), DOM events (clicks), etc. They work IN THE BACKGROUND while JavaScript continues running other code. JavaScript doesn't wait — it delegates and moves on!", code: `console.log("1. Start cooking");\n\nsetTimeout(() => {\n  console.log("3. Oven timer done!");\n}, 2000); // Sent to Web API timer\n\nconsole.log("2. Cook next dish");\n// Output: 1, 2, 3 (not 1, 3, 2!)`, language: "javascript" },
            { node: "F", title: "Background Processing", explanation: "While JavaScript is busy running your synchronous code, the Web APIs are quietly working in the background. The timer is counting down. The fetch request is traveling across the internet. The event listener is watching for clicks. They're all working simultaneously — JavaScript just doesn't know about them yet until they finish.", code: `// JavaScript moves on immediately\nfetch('https://api.example.com/users')\n  .then(data => console.log(data));\n\n// While fetch is traveling across the internet...\n// JavaScript is already running this:\nconsole.log("I didn't wait for fetch!");`, language: "javascript" },
            { node: "G", title: "The Callback Queue — The Waiting Line", explanation: "Think of a restaurant's order window. When a dish is done cooking, it goes on the window shelf and waits for the waiter to pick it up. The Callback Queue works the same way. When a Web API task finishes (timer expires, data arrives), its callback function joins the queue. But it can't run yet — it has to wait in line until the Call Stack is empty!", code: `// After 2 seconds, this callback joins the queue:\nsetTimeout(() => {\n  console.log("I'm in the queue, waiting...");\n}, 2000);\n\n// Even setTimeout(fn, 0) waits for the stack!\nsetTimeout(() => {\n  console.log("Even 0ms waits for the stack!");\n}, 0);\nconsole.log("Stack runs first!");`, language: "javascript" },
            { node: "H", title: "The Event Loop's One Job", explanation: "The Event Loop is like a waiter who does ONE simple thing over and over: it looks at the Call Stack and asks 'Are you empty?' If the stack is busy, the Event Loop waits and checks again. If the stack IS empty, it grabs the FIRST callback from the queue and puts it on the stack. That's it! Check stack → if empty → move callback → repeat forever.", code: `// The Event Loop cycle (pseudocode):\nwhile (true) {\n  if (callStack.isEmpty()) {\n    const callback = callbackQueue.dequeue();\n    if (callback) {\n      callStack.push(callback);\n    }\n  }\n  // Keep checking forever!\n}`, language: "javascript" },
            { node: "I", title: "Why setTimeout(fn, 0) Isn't Instant", explanation: "This is the most common trick question in JavaScript interviews! Even if you set setTimeout to 0 milliseconds, the callback STILL goes to the queue and waits. It doesn't run immediately — it waits for all synchronous code to finish first. The 0ms means 'as soon as possible, but only AFTER the stack is clear.' This proves the Event Loop is real!", code: `console.log("A");\n\nsetTimeout(() => {\n  console.log("B"); // Queue — runs LAST\n}, 0);\n\nconsole.log("C");\n\n// Output: A, C, B\n// Even though B has 0ms delay,\n// it waits for A and C to finish!`, language: "javascript" },
            { node: "J", title: "Putting It All Together", explanation: "Let's trace a full example: (1) console.log('Start') runs on the stack. (2) setTimeout sends its callback to Web APIs. (3) Promise creates a microtask. (4) console.log('End') runs on the stack. (5) Stack is empty! Event Loop checks microtask queue first (Promise), then callback queue (setTimeout). This is why the order might surprise you!", code: `console.log("1. Start");\n\nsetTimeout(() => console.log("4. Timeout"), 0);\n\nPromise.resolve().then(() => console.log("3. Promise"));\n\nconsole.log("2. End");\n\n// Output: 1, 2, 3, 4\n// Promises (microtasks) run before setTimeout!`, language: "javascript" }
        ]
    },
    {
        id: "js-closures",
        title: "JavaScript Closures",
        description: "How functions remember variables from where they were created — like a backpack they carry everywhere",
        category: "javascript",
        icon: "🎒",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["🏠 Outer Function<br/>creates a room"] --> B["📦 Variables inside<br/>furniture in the room"]
    B --> C["👶 Inner Function<br/>born in this room"]
    C --> D["🎒 Closure Created<br/>inner remembers the room"]
    A --> E["🚪 Outer Finishes<br/>room should be gone"]
    E --> F{"Inner still<br/>exists?"}
    F -->|Yes| G["🎒 Keeps the backpack<br/>variables stay alive!"]
    F -->|No| H["🗑️ Garbage collected<br/>memory freed"]
    G --> I["🔒 Private data<br/>only inner can access"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style D fill:#1f3b2f,stroke:#34d399,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff
    style I fill:#1e3a5f,stroke:#4f8cff,color:#fff`,
        steps: [
            { node: "A", title: "What is a Closure?", explanation: "Imagine you're born in a house. Even after you grow up and move out, you REMEMBER everything in that house — the furniture, the photos, the secret cookie jar. A closure is exactly this: a function that remembers the variables from the place where it was created, even after that place no longer exists. It's like carrying a backpack with memories.", code: `function createGreeter(name) {\n  // This is the 'house' — the outer function\n  // 'name' is furniture in the house\n  return function() {\n    // This inner function REMEMBERS 'name'\n    console.log("Hello, " + name + "!");\n  };\n}`, language: "javascript" },
            { node: "B", title: "The Outer Function's Variables", explanation: "The outer function creates variables — think of these as items in a room. Normally, when a function finishes running, all its variables get thrown away (garbage collected). But closures change this! If an inner function uses those variables, JavaScript keeps them alive. It's like the house keeping its furniture because someone still lives there.", code: `function counter() {\n  let count = 0;  // This variable lives in the 'room'\n  \n  return function increment() {\n    count++;      // Inner function USES count\n    return count; // So count stays alive!\n  };\n}`, language: "javascript" },
            { node: "C", title: "The Inner Function is Born", explanation: "When you define a function INSIDE another function, the inner function is 'born' in that environment. It can see everything around it — all the variables, parameters, even other functions. It's like a kid growing up in a house — they know where everything is. This is called the 'lexical scope' — where the function is WRITTEN determines what it can see.", code: `function bakery(flavor) {\n  const recipe = "secret";\n  \n  function makeCake() {\n    // I can see flavor AND recipe!\n    console.log(\`Making \${flavor} cake\`);\n    console.log(\`Using \${recipe} recipe\`);\n  }\n  \n  return makeCake;\n}`, language: "javascript" },
            { node: "D", title: "The Closure is Created", explanation: "The moment the inner function is returned or passed somewhere else, a closure is formed. The inner function takes a 'snapshot' of all the variables it needs and carries them in its backpack. Even if the outer function is done and gone, the inner function still has access to those variables. This is the magical part of closures!", code: `const myCounter = counter();\n// counter() finished running.\n// But 'count' is NOT destroyed!\n\nconsole.log(myCounter()); // 1\nconsole.log(myCounter()); // 2\nconsole.log(myCounter()); // 3\n// 'count' is still alive inside the closure!`, language: "javascript" },
            { node: "E", title: "Outer Function Finishes", explanation: "Normally when a function finishes, JavaScript cleans up all its variables to free memory. It's like demolishing a building after everyone moves out. But with closures, the outer function finishes but its variables DON'T get cleaned up. Why? Because the inner function is still using them! Think of it as a tenant who won't let the landlord demolish the building.", code: `function outer() {\n  let secret = 42;\n  // outer finishes, but...\n  return function inner() {\n    // ...inner keeps 'secret' alive!\n    return secret;\n  };\n}\nconst getSecret = outer();\n// outer is done, but secret lives on!\nconsole.log(getSecret()); // 42`, language: "javascript" },
            { node: "G", title: "Each Closure Gets Its Own Backpack", explanation: "Here's something cool: every time you call the outer function, you create a BRAND NEW closure with its own separate copy of variables. It's like giving each student their own backpack — they don't share. Two closures created from the same function are completely independent of each other.", code: `const counter1 = counter(); // Own backpack\nconst counter2 = counter(); // Different backpack\n\nconsole.log(counter1()); // 1\nconsole.log(counter1()); // 2\nconsole.log(counter2()); // 1  ← starts fresh!\nconsole.log(counter2()); // 2\n// They don't share their count!`, language: "javascript" },
            { node: "I", title: "Private Variables with Closures", explanation: "Closures give us something powerful: PRIVATE variables. In the real world, a bank keeps your balance private — only their system can change it. Closures work the same way. The inner function is the ONLY way to access the variables — no one else can reach them. This is one of the most practical uses of closures.", code: `function createBankAccount(initial) {\n  let balance = initial; // PRIVATE!\n  \n  return {\n    deposit(amount) {\n      balance += amount;\n      return balance;\n    },\n    getBalance() {\n      return balance;\n    }\n  };\n}\n\nconst account = createBankAccount(100);\naccount.deposit(50);         // 150\nconsole.log(account.balance); // undefined! Private!\nconsole.log(account.getBalance()); // 150`, language: "javascript" },
            { node: "I", title: "Common Closure Pitfall: Loops", explanation: "The classic interview gotcha! When you use var in a loop with setTimeout, all timeouts share the SAME variable (because var is function-scoped, not block-scoped). By the time the timeouts run, the loop is done and the variable has its final value. Fix it with let (creates a new scope each iteration) or with a closure that captures each value.", code: `// BUG: prints 3, 3, 3\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n\n// FIX with let: prints 0, 1, 2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n\n// FIX with closure: prints 0, 1, 2\nfor (var i = 0; i < 3; i++) {\n  ((j) => setTimeout(() => console.log(j), 100))(i);\n}`, language: "javascript" }
        ]
    },
    {
        id: "js-promises",
        title: "Promises & Async/Await",
        description: "How JavaScript handles tasks that take time — like ordering food and waiting for delivery",
        category: "javascript",
        icon: "🤝",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📱 You Order Food<br/>new Promise created"] --> B["⏳ Pending<br/>restaurant is cooking"]
    B --> C{"Food ready?"}
    C -->|Success| D["✅ Fulfilled<br/>food delivered!"]
    C -->|Problem| E["❌ Rejected<br/>order cancelled"]
    D --> F[".then()<br/>eat the food!"]
    E --> G[".catch()<br/>handle the problem"]
    F --> H[".then() chain<br/>dessert after dinner"]
    H --> I["🎯 async/await<br/>cleaner way to wait"]
    I --> J["try/catch<br/>handle errors nicely"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b2f1f,stroke:#fb923c,color:#fff
    style D fill:#1f3b2f,stroke:#34d399,color:#fff
    style E fill:#3b1f1f,stroke:#f87171,color:#fff
    style I fill:#3b1f5e,stroke:#a855f7,color:#fff`,
        steps: [
            { node: "A", title: "What is a Promise?", explanation: "Imagine you order food on a delivery app. The app immediately gives you a receipt (a Promise). The food isn't here yet, but the receipt PROMISES that one of two things will happen: either the food arrives (success), or the order gets cancelled (failure). A Promise in JavaScript is the same — it's an object that represents a future result that doesn't exist yet.", code: `// Creating a Promise is like placing an order\nconst foodOrder = new Promise((resolve, reject) => {\n  // The restaurant is cooking...\n  // We'll call resolve() when food is ready\n  // or reject() if something goes wrong\n});`, language: "javascript" },
            { node: "B", title: "Pending — Waiting for the Result", explanation: "After you place the order, you're in a 'pending' state. The food isn't here and it hasn't been cancelled — it's just being prepared. A Promise starts in this pending state. JavaScript doesn't stop and wait — it moves on to other code while the Promise is pending. That's the whole point! You can do other things while waiting.", code: `const promise = new Promise((resolve, reject) => {\n  // Simulating a 2-second API call\n  setTimeout(() => {\n    resolve("Data loaded!");\n  }, 2000);\n});\n\nconsole.log(promise); // Promise { <pending> }\n// JavaScript doesn't wait — runs next line immediately`, language: "javascript" },
            { node: "D", title: "Fulfilled — It Worked!", explanation: "When the async task succeeds, we call resolve() which changes the Promise from 'pending' to 'fulfilled'. It's like the delivery driver arriving at your door with the food. The Promise now has a value — the result of the operation. Once fulfilled, it can never change back to pending or become rejected. It's permanent.", code: `const orderPizza = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve("🍕 Your pizza is here!");\n    // Promise is now FULFILLED with this value\n  }, 2000);\n});`, language: "javascript" },
            { node: "E", title: "Rejected — Something Went Wrong", explanation: "Sometimes things go wrong — the restaurant is closed, they're out of ingredients, the driver got lost. When the async task fails, we call reject() which changes the Promise to 'rejected'. It's like getting a notification saying 'Sorry, your order was cancelled.' The Promise now has an error instead of a value.", code: `const riskyOrder = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    const restaurantOpen = false;\n    if (restaurantOpen) {\n      resolve("Food is ready!");\n    } else {\n      reject("Sorry, restaurant is closed!");\n    }\n  }, 1000);\n});`, language: "javascript" },
            { node: "F", title: ".then() — What To Do When It Works", explanation: "The .then() method is like saying 'When my food arrives, HERE'S what I'll do.' You give .then() a function, and that function receives the result (the food). It only runs when the Promise is fulfilled — never when it's rejected. Think of it as your plan for when the delivery arrives.", code: `orderPizza\n  .then((food) => {\n    console.log(food); // "🍕 Your pizza is here!"\n    console.log("Time to eat!");\n  });`, language: "javascript" },
            { node: "G", title: ".catch() — Handling Problems", explanation: ".catch() is your backup plan for when things go wrong. It catches rejected Promises — like having a plan for when the restaurant cancels your order (maybe order from somewhere else?). ALWAYS add .catch() to your Promises, otherwise errors will silently disappear and you'll have bugs that are impossible to find.", code: `riskyOrder\n  .then((food) => {\n    console.log("Eating: " + food);\n  })\n  .catch((error) => {\n    console.log("Problem: " + error);\n    console.log("Let's cook at home instead!");\n  });`, language: "javascript" },
            { node: "H", title: "Promise Chaining — One After Another", explanation: "What if you want to do multiple async things in ORDER? Like: fetch user → then fetch their posts → then fetch comments. Each .then() returns a new Promise, so you can chain them. It's like a relay race — each runner passes the baton to the next. The result of one .then() becomes the input to the next.", code: `fetch('/api/user/1')\n  .then(res => res.json())         // Step 1: parse JSON\n  .then(user => fetch(user.postsUrl)) // Step 2: get posts\n  .then(res => res.json())         // Step 3: parse posts\n  .then(posts => {\n    console.log("All posts:", posts); // Step 4: use them!\n  })\n  .catch(err => console.log("Something broke:", err));`, language: "javascript" },
            { node: "I", title: "async/await — The Modern Way", explanation: "Promise chains with .then() can get messy. async/await is like writing a recipe step-by-step instead of nesting instructions. The 'async' keyword marks a function as asynchronous. The 'await' keyword PAUSES the function until a Promise resolves — it's like saying 'wait here until the food arrives, then continue.' The code LOOKS synchronous but runs asynchronously!", code: `// Instead of .then() chains:\nasync function getUser() {\n  const response = await fetch('/api/user/1');\n  const user = await response.json();\n  const posts = await fetch(user.postsUrl);\n  const postsData = await posts.json();\n  console.log(postsData);\n}\n// So much cleaner! Reads like a story.`, language: "javascript" },
            { node: "J", title: "Error Handling with try/catch", explanation: "With async/await, you handle errors using try/catch instead of .catch(). Wrap your await calls in a try block, and if ANY of them fail, the catch block runs. It's exactly like try/catch for regular code, which makes error handling feel natural and consistent.", code: `async function loadData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    console.log("Got it!", data);\n  } catch (error) {\n    // Any error from ANY await lands here\n    console.log("Oops:", error.message);\n  }\n}\n\nloadData();`, language: "javascript" },
            { node: "I", title: "Running Promises in Parallel", explanation: "Sometimes you need to fetch multiple things that DON'T depend on each other — like loading a user's profile, notifications, and settings all at once. Promise.all() runs them all simultaneously and waits for ALL of them. It's like ordering pizza, drinks, and dessert at the same time instead of one after another. Much faster!", code: `async function loadDashboard() {\n  // All three start at the SAME time!\n  const [user, notifications, settings] = \n    await Promise.all([\n      fetch('/api/user').then(r => r.json()),\n      fetch('/api/notifications').then(r => r.json()),\n      fetch('/api/settings').then(r => r.json()),\n    ]);\n  \n  // All three are ready now!\n  console.log(user, notifications, settings);\n}`, language: "javascript" }
        ]
    },
    {
        id: "js-prototypes",
        title: "Prototypal Inheritance",
        description: "How JavaScript objects share abilities through a chain of prototypes — like a family tree of skills",
        category: "javascript",
        icon: "🧬",
        difficulty: "advanced",
        mermaid: `graph TD
    A["🏗️ Object.prototype<br/>grandparent of all objects"] --> B["toString, valueOf<br/>basic abilities everyone has"]
    A --> C["🐕 Animal.prototype<br/>shared animal abilities"]
    C --> D["eat(), sleep()<br/>all animals can do this"]
    C --> E["🐕 dog1 object<br/>name: Buddy"]
    C --> F["🐕 dog2 object<br/>name: Max"]
    E --> G["dog1.eat()<br/>looks up the chain!"]
    G --> H{"Found on dog1?"}
    H -->|No| I{"Found on<br/>Animal.prototype?"}
    I -->|Yes| J["✅ Uses it!"]
    I -->|No| K["⬆️ Keep looking<br/>up the chain"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#1f3b2f,stroke:#34d399,color:#fff
    style J fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            { node: "A", title: "What is a Prototype?", explanation: "Think of a family tree. Your grandma knows how to bake cookies. Your mom learned it from grandma. And you learned it from mom. You don't need to reinvent cookie baking — you INHERITED the skill through the family tree. In JavaScript, objects work the same way. Every object has a hidden link to another object called its 'prototype', and it can use that prototype's methods as if they were its own.", code: `const dog = { name: "Buddy" };\n\n// dog has a secret link to Object.prototype\n// That's why dog.toString() works even though\n// we never defined toString on dog!\nconsole.log(dog.toString()); // "[object Object]"`, language: "javascript" },
            { node: "C", title: "Creating a Prototype Chain", explanation: "You can create your own family tree of objects. Think of it like creating a 'template' that other objects can inherit from. When you create Animal with eat() and sleep(), every individual animal can use those methods without having their own copy. It saves memory and keeps code organized — define it once, use it everywhere.", code: `function Animal(name) {\n  this.name = name;\n}\n\n// Add shared abilities to the prototype\nAnimal.prototype.eat = function() {\n  console.log(this.name + " is eating");\n};\nAnimal.prototype.sleep = function() {\n  console.log(this.name + " is sleeping");\n};`, language: "javascript" },
            { node: "E", title: "Creating Instances", explanation: "When you create a new Animal with 'new', JavaScript does something special: it creates a fresh object and links its prototype to Animal.prototype. It's like being born into a family — you automatically know everything your family knows. The 'new' keyword sets up this family connection automatically.", code: `const dog1 = new Animal("Buddy");\nconst dog2 = new Animal("Max");\n\n// Both can eat(), even though eat() is NOT on them!\ndog1.eat();  // "Buddy is eating"\ndog2.eat();  // "Max is eating"\n\n// eat() lives on Animal.prototype, shared by all`, language: "javascript" },
            { node: "G", title: "The Prototype Lookup Chain", explanation: "When you call dog1.eat(), JavaScript first looks at dog1 itself: 'Do you have eat()?' No. Then it follows the hidden link to Animal.prototype: 'Do YOU have eat()?' Yes! Use it. If it wasn't there either, it would keep going up to Object.prototype, then finally to null (the end of the chain). This 'looking up the chain' is how inheritance works!", code: `// dog1.eat() lookup:\n// 1. dog1 → does it have eat()? NO\n// 2. Animal.prototype → has eat()? YES! ✅\n// Uses Animal.prototype.eat()\n\n// dog1.toString() lookup:\n// 1. dog1 → NO\n// 2. Animal.prototype → NO\n// 3. Object.prototype → YES! ✅`, language: "javascript" },
            { node: "J", title: "Modern Classes (Sugar Syntax)", explanation: "ES6 classes are just a cleaner way to write the same prototype-based inheritance. Under the hood, it's still prototypes and chains — classes are just 'syntactic sugar' that makes the code look more familiar to people coming from other languages. The extends keyword sets up the prototype chain for you.", code: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  eat() {\n    console.log(this.name + " is eating");\n  }\n}\n\nclass Dog extends Animal {\n  bark() {\n    console.log(this.name + " says Woof!");\n  }\n}\n\nconst buddy = new Dog("Buddy");\nbuddy.eat();  // Inherited from Animal!\nbuddy.bark(); // Dog's own method`, language: "javascript" },
            { node: "K", title: "Object.create and Direct Linking", explanation: "Object.create() lets you create an object with a specific prototype directly — no constructor function needed. It's the most direct way to set up the prototype chain. You're literally saying 'create a new object and make THIS object its parent in the family tree.'", code: `const animal = {\n  eat() { console.log(this.name + " eats"); },\n  sleep() { console.log(this.name + " sleeps"); }\n};\n\n// Create dog with animal as its prototype\nconst dog = Object.create(animal);\ndog.name = "Buddy";\ndog.eat();   // "Buddy eats" — inherited!\n\nconsole.log(Object.getPrototypeOf(dog) === animal);\n// true — animal IS dog's prototype`, language: "javascript" },
            { node: "A", title: "The Full Picture", explanation: "Here's the complete prototype chain for any object: your object → its prototype → that prototype's prototype → ... → Object.prototype → null. When you access any property, JavaScript walks this entire chain looking for it. If it reaches null without finding it, you get undefined. This is the foundation of all JavaScript inheritance!", code: `class Animal { eat() {} }\nclass Dog extends Animal { bark() {} }\nconst buddy = new Dog("Buddy");\n\n// buddy → Dog.prototype → Animal.prototype\n//       → Object.prototype → null\n\nconsole.log(buddy instanceof Dog);    // true\nconsole.log(buddy instanceof Animal); // true\nconsole.log(buddy instanceof Object); // true`, language: "javascript" }
        ]
    },
    {
        id: "js-hoisting",
        title: "Hoisting & Temporal Dead Zone",
        description: "Why JavaScript lets you use some things before declaring them — and why others throw errors",
        category: "javascript",
        icon: "⬆️",
        difficulty: "beginner",
        mermaid: `graph TD
    A["📝 JavaScript reads<br/>your code"] --> B["⬆️ Creation Phase<br/>scan for declarations"]
    B --> C["var hoisted<br/>set to undefined"]
    B --> D["let/const hoisted<br/>but NOT initialized"]
    B --> E["functions hoisted<br/>fully available!"]
    C --> F["✅ Can use var<br/>before declaration"]
    D --> G["🚫 TDZ Error!<br/>cannot access yet"]
    E --> H["✅ Can call function<br/>before it appears"]
    F --> I["Execution Phase<br/>runs line by line"]
    G --> I
    H --> I

    style B fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b2f1f,stroke:#fb923c,color:#fff
    style D fill:#3b1f1f,stroke:#f87171,color:#fff
    style E fill:#1f3b2f,stroke:#34d399,color:#fff
    style G fill:#3b1f1f,stroke:#f87171,color:#fff`,
        steps: [
            { node: "A", title: "JavaScript Reads Code in Two Passes", explanation: "Here's a secret: JavaScript doesn't just run your code top-to-bottom once. It actually reads through it TWICE. First pass (Creation Phase): it scans for all variable and function declarations and sets them up in memory. Second pass (Execution Phase): it runs your code line by line. This two-pass system is why 'hoisting' exists!", code: `// You might think this crashes...\nconsole.log(x);    // undefined (not an error!)\nvar x = 5;\nconsole.log(x);    // 5\n\n// JavaScript did TWO passes:\n// Pass 1: Found 'var x', set x = undefined\n// Pass 2: console.log(x) → undefined, x = 5, log → 5`, language: "javascript" },
            { node: "B", title: "The Creation Phase — Setting the Stage", explanation: "In the creation phase, JavaScript is like a stage manager before a play. It walks through the entire script and prepares everything that will be needed: 'Okay, we'll need a variable called x... a function called greet... a constant called API_URL...' It sets up spots in memory for all of them. This is 'hoisting' — declarations are 'lifted' to the top.", code: `// What you write:\nfunction greet() { return "Hi!"; }\nvar name = "Zaheer";\nlet age = 25;\n\n// What JavaScript sees in Creation Phase:\n// 1. greet → full function stored ✅\n// 2. name → undefined (placeholder)\n// 3. age → exists but UNINITIALIZED`, language: "javascript" },
            { node: "C", title: "var — Hoisted with undefined", explanation: "Variables declared with 'var' are hoisted and automatically given the value 'undefined'. It's like reserving a seat at a restaurant with a 'Reserved' sign — the seat exists, but nobody's sitting there yet. That's why accessing a var before its declaration gives you undefined instead of an error.", code: `console.log(food);  // undefined (exists but empty)\nvar food = "Pizza";\nconsole.log(food);  // "Pizza"\n\n// It's as if JavaScript rewrote it to:\nvar food;           // Hoisted! value = undefined\nconsole.log(food);  // undefined\nfood = "Pizza";     // NOW it gets its value\nconsole.log(food);  // "Pizza"`, language: "javascript" },
            { node: "D", title: "let/const — Hoisted but FROZEN", explanation: "let and const ARE hoisted too  — but they're NOT initialized to undefined. They exist in a 'Temporal Dead Zone' (TDZ) from the start of the block until the declaration line. It's like a package that's been delivered to your building but the receptionist won't give it to you until you show your ID (reach the declaration line).", code: `// TDZ starts here for 'age'\nconsole.log(age);  // ReferenceError! ❌\n// ^ You're in the Temporal Dead Zone!\n\nlet age = 25;\n// TDZ ends here — 'age' is now accessible\nconsole.log(age);  // 25 ✅`, language: "javascript" },
            { node: "E", title: "Function Declarations — Fully Hoisted!", explanation: "Function declarations get the VIP treatment — they're fully hoisted with their entire body. You can call them BEFORE they appear in your code. It's like a magician who can perform before even arriving on stage. This is why you can organize your code with helper functions at the bottom and main logic at the top.", code: `// This works perfectly!\nconst result = add(3, 5);\nconsole.log(result);  // 8\n\n// Function is defined BELOW but works ABOVE!\nfunction add(a, b) {\n  return a + b;\n}\n// The entire function was hoisted to the top!`, language: "javascript" },
            { node: "F", title: "Function Expressions are NOT Fully Hoisted", explanation: "But be careful! If you assign a function to a variable using const/let/var, the VARIABLE is hoisted but the FUNCTION is not. It follows the rules of the variable keyword you used. So const myFunc = ... puts myFunc in the TDZ. And var myFunc = ... makes it undefined until the assignment.", code: `// Function expression with const\nconsole.log(multiply); // ReferenceError (TDZ)\nconst multiply = (a, b) => a * b;\n\n// Function expression with var\nconsole.log(divide);   // undefined (not a function!)\ndivide(10, 2);         // TypeError: divide is not a function\nvar divide = (a, b) => a / b;`, language: "javascript" },
            { node: "G", title: "The Temporal Dead Zone Explained", explanation: "The TDZ exists to catch bugs early. With var, using a variable before declaring it silently gives undefined — a hidden bug that's hard to find. With let/const, JavaScript says 'STOP! You're trying to use something that isn't ready yet!' It's like a safety net. The TDZ lasts from the start of the block to the actual let/const line.", code: `{\n  // TDZ for 'x' starts at the { above\n  \n  console.log(typeof x); // ReferenceError!\n  // Even typeof throws in the TDZ\n  \n  let x = 10;\n  // TDZ ends here\n  \n  console.log(x); // 10 ✅\n}`, language: "javascript" },
            { node: "I", title: "Best Practices — Avoid Hoisting Confusion", explanation: "The best way to avoid hoisting confusion: (1) Always use let/const instead of var. (2) Declare variables at the TOP of their scope. (3) Define functions before calling them. (4) Remember that function declarations are fully hoisted but expressions are not. Following these rules means hoisting will never surprise you!", code: `// ✅ GOOD: Declare at the top\nconst API_URL = "https://api.example.com";\nlet userData = null;\n\n// ✅ GOOD: Define helper functions (declarations)\nfunction fetchData() { /* ... */ }\nfunction processData() { /* ... */ }\n\n// Then use everything below\nfetchData();\n// Never wonder "is this hoisted?" because\n// everything is declared before use!`, language: "javascript" }
        ]
    },
    {
        id: "js-arrays-internal",
        title: "Arrays — Internal Working",
        description: "How JavaScript arrays actually work inside the V8 engine: memory allocation, call stack, and heap",
        category: "javascript",
        icon: "🧠",
        difficulty: "advanced",
        mermaid: `graph TD
    A["📝 let arr = [1,2,3]<br/>you write this code"] --> B["📚 Call Stack<br/>variable 'arr' created"]
    B --> C["🔗 Reference stored<br/>arr points to heap"]
    C --> D["🧠 Heap Memory<br/>actual array lives here"]
    D --> E["📦 Contiguous block<br/>elements stored in order"]
    E --> F["[0]:1 [1]:2 [2]:3<br/>indexed memory slots"]
    F --> G["arr.push(4)<br/>add new element"]
    G --> H{"Space<br/>available?"}
    H -->|Yes| I["✅ Write to next slot<br/>fast operation"]
    H -->|No| J["🔄 Reallocate<br/>copy to bigger block"]
    J --> I

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style F fill:#1f3b2f,stroke:#34d399,color:#fff
    style J fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A", title: "You Write: let arr = [1, 2, 3]",
                explanation: "When you type let arr = [1, 2, 3], JavaScript starts its two-part process. The variable 'arr' needs to be stored somewhere (the Call Stack), and the actual array data needs to go somewhere else (the Heap). Think of it like writing someone's address in your phone — your phone (stack) holds the shortcut, but the actual house (heap) is somewhere else.",
                code: `let arr = [1, 2, 3];\n// What happens internally:\n// 1. 'arr' goes on the Call Stack\n// 2. [1, 2, 3] is created on the Heap\n// 3. 'arr' stores the MEMORY ADDRESS of the array`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "arr", value: "→ 0x3e8" }] }],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 1 }, { v: 2 }, { v: 3 }], isNew: true }],
                    output: []
                }
            },
            {
                node: "B", title: "Call Stack — Variable Reference",
                explanation: "The Call Stack stores PRIMITIVE values (numbers, booleans, strings) directly. But arrays are OBJECTS — they're too big and dynamic to fit on the stack. So the stack only stores a REFERENCE (memory address) pointing to where the array actually lives in the Heap. It's like your contacts app storing a phone number, not the actual person!",
                code: `// On the Call Stack:\n// arr = 0x3e8 (a memory address, not the array!)\n\n// Primitive vs Reference:\nlet num = 42;        // Stored DIRECTLY on stack\nlet arr = [1, 2, 3]; // Only ADDRESS on stack\n                      // Array data is on heap`, language: "javascript",
                memory: {
                    stack: [
                        { name: "Global Execution Context", vars: [{ name: "num", value: "42" }, { name: "arr", value: "→ 0x3e8" }], refTo: 0 }
                    ],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 1 }, { v: 2 }, { v: 3 }] }],
                    output: []
                }
            },
            {
                node: "C", title: "Why References Matter — Copies vs Sharing",
                explanation: "Here's something that surprises beginners: when you do let arr2 = arr, you're NOT copying the array. You're copying the ADDRESS. Both arr and arr2 now point to the SAME array in the heap. It's like two people having the same house key — if one rearranges the furniture, the other sees the change too!",
                code: `let arr = [1, 2, 3];\nlet arr2 = arr; // Copies the ADDRESS, not the array!\n\narr2.push(4);\nconsole.log(arr);  // [1, 2, 3, 4] ← ALSO changed!\nconsole.log(arr2); // [1, 2, 3, 4]\n// Both point to the SAME array!`, language: "javascript",
                memory: {
                    stack: [
                        { name: "Global Execution Context", vars: [{ name: "arr", value: "→ 0x3e8" }, { name: "arr2", value: "→ 0x3e8" }], refTo: 0 }
                    ],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4, highlight: true }] }],
                    output: ["[1, 2, 3, 4]", "[1, 2, 3, 4]"]
                }
            },
            {
                node: "D", title: "Heap Memory — Where Arrays Live",
                explanation: "The Heap is a large pool of memory where objects, arrays, and functions live. Unlike the stack (which is organized like a stack of plates), the heap is more like a parking lot — objects can be stored anywhere, and you find them by their address. The V8 engine manages this memory, allocating and freeing space as needed.",
                code: `// The Heap stores complex data:\nlet users = ["Alice", "Bob"];    // Array → Heap\nlet config = { theme: "dark" };  // Object → Heap\nlet greet = () => "Hello!";       // Function → Heap\n\n// The Stack only has addresses:\n// users  → 0x3e8\n// config → 0x3f0\n// greet  → 0x3f8`, language: "javascript",
                memory: {
                    stack: [
                        { name: "Global Execution Context", vars: [{ name: "users", value: "→ 0x3e8" }, { name: "config", value: "→ 0x3f0" }] }
                    ],
                    heap: [
                        { address: "0x3e8", type: "Array", values: [{ v: '"Alice"' }, { v: '"Bob"' }] },
                        { address: "0x3f0", type: "Object", props: [{ k: "theme", v: '"dark"' }], isNew: true }
                    ],
                    output: []
                }
            },
            {
                node: "E", title: "Array Elements in Memory",
                explanation: "V8 stores array elements in a contiguous (side-by-side) block of memory when they're the same type (all numbers, all strings). This is like books on a shelf — each one has an INDEX (0, 1, 2...) and you can jump directly to any book by its position. This is why arr[2] is so fast — V8 calculates the exact memory location using: startAddress + (index × elementSize).",
                code: `let scores = [10, 20, 30, 40, 50];\n\n// In memory (contiguous):\n// Address:  0x3e8  0x3f0  0x3f8  0x400  0x408\n// Index:    [0]    [1]    [2]    [3]    [4]\n// Value:    10     20     30     40     50\n\n// Accessing scores[3] is instant!\n// V8 calculates: 0x3e8 + (3 × 8) = 0x400 → 40`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "scores", value: "→ 0x3e8" }] }],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 10 }, { v: 20 }, { v: 30 }, { v: 40, highlight: true }, { v: 50 }] }],
                    output: []
                }
            },
            {
                node: "F", title: "arr.push() — Adding Elements",
                explanation: "When you push() a new element, V8 first checks: is there room at the end of the array's memory block? If yes, it writes the value there — super fast! If not, V8 needs to allocate a BIGGER block of memory, copy everything over, then add the new element. To avoid doing this often, V8 pre-allocates extra space (usually doubles the capacity).",
                code: `let arr = [1, 2, 3];\n// Internal: capacity=4, length=3 (1 empty slot)\n\narr.push(4); // Fits! Fast write to empty slot\n// Internal: capacity=4, length=4 (full!)\n\narr.push(5); // No room! V8 must:\n// 1. Allocate new block (capacity=8)\n// 2. Copy [1,2,3,4] to new block\n// 3. Add 5\n// 4. Update arr's address`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "arr", value: "→ 0x3e8" }] }],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5, highlight: true }], isNew: true }],
                    output: []
                }
            },
            {
                node: "G", title: "Function Calls and Arrays on the Stack",
                explanation: "When you call a function that uses an array, a NEW frame is added to the call stack. The function's local variables live in that frame. If you pass an array to a function, the function gets a COPY of the reference (address), not a copy of the array. So modifying the array inside the function affects the original!",
                code: `function addItem(list, item) {\n  list.push(item);\n  console.log("Added:", item);\n}\n\nlet fruits = ["apple"];\naddItem(fruits, "banana");\nconsole.log(fruits); // ["apple", "banana"]\n// 'list' and 'fruits' pointed to the SAME array!`, language: "javascript",
                memory: {
                    stack: [
                        { name: "Global Execution Context", vars: [{ name: "fruits", value: "→ 0x3e8" }], refTo: 0 },
                        { name: "addItem()", vars: [{ name: "list", value: "→ 0x3e8" }, { name: "item", value: '"banana"' }], refTo: 0 }
                    ],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: '"apple"' }, { v: '"banana"', highlight: true }] }],
                    output: ['Added: banana']
                }
            },
            {
                node: "H", title: "arr.splice() — Shifting Memory",
                explanation: "splice() is expensive! When you remove an element from the middle, V8 has to SHIFT all elements after it to fill the gap. It's like removing a book from the middle of a shelf — every book to the right slides left. For an array of 1 million elements, removing index 0 means moving 999,999 elements!",
                code: `let arr = [10, 20, 30, 40, 50];\narr.splice(1, 1); // Remove index 1 (value 20)\n// Before: [10, 20, 30, 40, 50]\n// After:  [10, 30, 40, 50]\n// V8 shifted 30, 40, 50 left by one position!\n\n// That's why:\n// push/pop = O(1) — fast, end of array\n// shift/unshift/splice = O(n) — slow, moves everything`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "arr", value: "→ 0x3e8" }] }],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 10 }, { v: 30, highlight: true }, { v: 40, highlight: true }, { v: 50, highlight: true }] }],
                    output: []
                }
            },
            {
                node: "I", title: "Garbage Collection — Cleaning Up",
                explanation: "When no variable points to an array anymore, V8's garbage collector reclaims the memory. It periodically scans the heap and asks: 'Does anyone still have a reference to this?' If not, it frees the memory. This is automatic — you don't need to manually delete things like in C/C++. But it's good to set unused arrays to null to help the GC.",
                code: `let data = [1, 2, 3, 4, 5];\n// data → 0x3e8 → [1,2,3,4,5]\n\ndata = null;\n// Now NOTHING points to 0x3e8\n// V8's Garbage Collector will eventually:\n// 1. Detect the array is unreachable\n// 2. Free the memory at 0x3e8\n// 3. That memory can be reused!`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "data", value: "null" }] }],
                    heap: [],
                    output: []
                }
            },
            {
                node: "J", title: "Putting It All Together",
                explanation: "Here's the full picture: Variables on the STACK hold references. Arrays live on the HEAP in contiguous memory. push/pop are fast (end of array). splice/shift are slow (moves elements). Passing arrays to functions passes the reference. Garbage collection frees unused memory. Understanding this helps you write faster, memory-efficient code!",
                code: `// Performance tips based on internals:\n\n// ✅ FAST: push/pop (end of array)\narr.push(x);  // O(1)\narr.pop();    // O(1)\n\n// ❌ SLOW: shift/unshift (start of array)\narr.shift();     // O(n) — shifts everything!\narr.unshift(x);  // O(n)\n\n// ✅ FAST: direct index access\narr[500];  // O(1) — instant lookup\n\n// 🗑️ Help the GC\nlargeArray = null; // Free memory`, language: "javascript",
                memory: {
                    stack: [{ name: "Global Execution Context", vars: [{ name: "arr", value: "→ 0x3e8" }] }],
                    heap: [{ address: "0x3e8", type: "Array", values: [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }] }],
                    output: ["push/pop = O(1) ✅", "shift/splice = O(n) ❌", "arr[i] = O(1) ✅"]
                }
            }
        ]
    }
];
