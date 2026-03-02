export const nodejsConcepts = [
    {
        id: "node-event-loop",
        title: "Node.js Event Loop & Libuv",
        description: "How Node.js handles async I/O using libuv's event loop with multiple phases",
        category: "nodejs",
        icon: "🔁",
        difficulty: "advanced",
        mermaid: `graph TD
    A["📥 Incoming Request"] --> B["⏱️ Timers Phase<br/>setTimeout, setInterval"]
    B --> C["📋 Pending Callbacks<br/>I/O callbacks deferred"]
    C --> D["🔍 Poll Phase<br/>retrieve new I/O events"]
    D --> E["✅ Check Phase<br/>setImmediate callbacks"]
    E --> F["🔒 Close Callbacks<br/>socket.on close"]
    F --> B
    D --> G["💤 If no events:<br/>wait for callbacks"]
    G --> D

    style B fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#1f3b2f,stroke:#34d399,color:#fff
    style F fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Incoming Request",
                explanation: "Node.js is single-threaded for JavaScript execution but uses libuv's thread pool for I/O operations (file system, DNS, etc). When a request arrives, it enters the event loop.",
                code: `const http = require('http');
const server = http.createServer((req, res) => {
  // Each request enters the event loop
  // Non-blocking by default
  res.end('Hello World');
});
server.listen(3000);`,
                language: "javascript"
            },
            {
                node: "B",
                title: "Timers Phase",
                explanation: "Executes callbacks scheduled by setTimeout() and setInterval(). Note: the delay is a MINIMUM time, not a guaranteed time. If the poll phase takes long, timers may fire later than scheduled.",
                code: `setTimeout(() => {
  console.log('Timer fired!');
}, 100);
// Guaranteed to wait AT LEAST 100ms
// May wait longer if event loop is busy`,
                language: "javascript"
            },
            {
                node: "D",
                title: "Poll Phase",
                explanation: "The poll phase is where Node spends most of its time. It processes I/O events (network, file system). If the poll queue is empty and no timers are scheduled, Node will wait here for new events.",
                code: `const fs = require('fs');
fs.readFile('/file.txt', (err, data) => {
  // This callback executes in the Poll phase
  console.log(data.toString());
});`,
                language: "javascript"
            },
            {
                node: "E",
                title: "Check Phase (setImmediate)",
                explanation: "setImmediate callbacks execute in this phase, right after the poll phase completes. setImmediate vs setTimeout(fn, 0): setImmediate fires after poll, setTimeout fires in timers phase. Inside an I/O callback, setImmediate always fires first.",
                code: `const fs = require('fs');
fs.readFile('/file.txt', () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Output: immediate → timeout (always)
});`,
                language: "javascript"
            }
        ]
    },
    {
        id: "middleware-pipeline",
        title: "Express Middleware Pipeline",
        description: "How requests flow through middleware functions in Express.js",
        category: "nodejs",
        icon: "🔗",
        difficulty: "beginner",
        mermaid: `graph TD
    A["📥 HTTP Request<br/>hits server"] --> B["🔐 Auth Middleware<br/>verify token"]
    B --> C{"Authenticated?"}
    C -->|No| D["❌ 401 Unauthorized<br/>response sent"]
    C -->|Yes| E["📝 Logger Middleware<br/>log request details"]
    E --> F["📦 Body Parser<br/>parse JSON body"]
    F --> G["✅ Validation<br/>check request data"]
    G --> H{"Valid?"}
    H -->|No| I["❌ 400 Bad Request"]
    H -->|Yes| J["🎯 Route Handler<br/>business logic"]
    J --> K["📤 Response<br/>send to client"]
    K --> L["📝 Response Logger<br/>log status code"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style J fill:#1f3b2f,stroke:#34d399,color:#fff
    style K fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Request Enters Express",
                explanation: "When an HTTP request arrives, Express creates req and res objects and begins passing them through the middleware stack in the ORDER they were registered with app.use() or app.METHOD().",
                code: `const express = require('express');
const app = express();

// Middleware registered in ORDER
app.use(cors());
app.use(authMiddleware);
app.use(express.json());
app.use('/api', router);

app.listen(3000);`,
                language: "javascript"
            },
            {
                node: "B",
                title: "Authentication Middleware",
                explanation: "Each middleware function receives (req, res, next). It can: (1) modify req/res, (2) end the request-response cycle, or (3) call next() to pass control to the next middleware. If next() is NOT called, the request hangs.",
                code: `function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;  // Attach to req object
    next();           // Pass to next middleware
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
    // No next() → request cycle ends here
  }
}`,
                language: "javascript"
            },
            {
                node: "F",
                title: "Body Parser Middleware",
                explanation: "express.json() is a built-in middleware that parses incoming JSON payloads. It reads the request body stream, parses the JSON, and attaches the result to req.body. Without it, req.body is undefined.",
                code: `app.use(express.json());
// Now in route handlers:
app.post('/api/users', (req, res) => {
  console.log(req.body); // { name: "Zaheer" }
  // Without express.json(), req.body = undefined
});`,
                language: "javascript"
            },
            {
                node: "J",
                title: "Route Handler",
                explanation: "The route handler is the 'final' middleware that processes the business logic. It matches the request method and path. Route handlers typically end the cycle by sending a response.",
                code: `app.post('/api/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err); // Pass to error middleware
  }
});

// Error middleware (4 params)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`,
                language: "javascript"
            }
        ]
    },
    {
        id: "streams",
        title: "Node.js Streams",
        description: "Processing data piece by piece without loading everything into memory",
        category: "nodejs",
        icon: "🌊",
        difficulty: "advanced",
        mermaid: `graph TD
    A["📖 Readable Stream<br/>data source"] --> B["📦 Chunk emitted<br/>push data pieces"]
    B --> C["🔧 Transform Stream<br/>modify data in transit"]
    C --> D["✍️ Writable Stream<br/>data destination"]
    D --> E["✅ Done<br/>stream ends"]
    A --> F["📋 Events:<br/>data, end, error"]
    B --> G["⏸️ Backpressure<br/>consumer is slow"]
    G --> H["⏯️ Pause/Resume<br/>flow control"]
    H --> B

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style D fill:#1f3b2f,stroke:#34d399,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Readable Streams",
                explanation: "Readable streams are sources of data. Instead of reading an entire file into memory, streams process data in chunks. This is essential for large files or real-time data.",
                code: `const fs = require('fs');

// WITHOUT streams — loads entire file into memory
const data = fs.readFileSync('huge-file.csv'); // 2GB in RAM!

// WITH streams — processes chunks
const stream = fs.createReadStream('huge-file.csv');
stream.on('data', (chunk) => {
  // Each chunk is ~64KB
  processChunk(chunk);
});`,
                language: "javascript"
            },
            {
                node: "C",
                title: "Transform Streams",
                explanation: "Transform streams sit between readable and writable streams, modifying data as it passes through. Common examples: compression (gzip), encryption, parsing CSV to JSON.",
                code: `const { Transform } = require('stream');
const zlib = require('zlib');

// Pipe: read → compress → write
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())    // Transform
  .pipe(fs.createWriteStream('output.gz'));`,
                language: "javascript"
            },
            {
                node: "G",
                title: "Backpressure",
                explanation: "If the writable stream can't keep up with the readable stream, backpressure occurs. Node.js handles this automatically with .pipe(). The readable stream pauses until the writable catches up.",
                code: `const readable = fs.createReadStream('big.file');
const writable = fs.createWriteStream('copy.file');

// .pipe() handles backpressure automatically
readable.pipe(writable);

// Manual handling:
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause();  // Slow down!
    writable.once('drain', () => readable.resume());
  }
});`,
                language: "javascript"
            }
        ]
    },
    {
        id: "cluster-module",
        title: "Node.js Cluster & Worker Threads",
        description: "Scaling Node.js across CPU cores using cluster module and worker threads",
        category: "nodejs",
        icon: "🖥️",
        difficulty: "advanced",
        mermaid: `graph TD
    A["🏭 Master Process<br/>cluster.fork()"] --> B["👷 Worker 1<br/>CPU Core 1"]
    A --> C["👷 Worker 2<br/>CPU Core 2"]
    A --> D["👷 Worker 3<br/>CPU Core 3"]
    A --> E["👷 Worker 4<br/>CPU Core 4"]
    F["📥 Incoming<br/>Requests"] --> A
    A --> G["⚖️ Load Balancer<br/>round-robin"]
    G --> B
    G --> C
    G --> D
    B --> H["💀 Worker dies"]
    H --> I["🔄 Master respawns<br/>new worker"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style G fill:#3b1f5e,stroke:#a855f7,color:#fff
    style B fill:#1f3b2f,stroke:#34d399,color:#fff
    style I fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Master Process",
                explanation: "Node.js is single-threaded, but the cluster module lets you create child processes (workers) that share the same server port. The master process manages workers and distributes incoming connections.",
                code: `const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log('Master process, forking ' + numCPUs + ' workers');

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Create a worker
  }
}`,
                language: "javascript"
            },
            {
                node: "G",
                title: "Load Balancing",
                explanation: "The master process distributes incoming connections to workers using round-robin scheduling (on Linux/macOS). Each worker runs in its own process with its own memory space and V8 instance.",
                code: `if (cluster.isWorker) {
  const http = require('http');
  http.createServer((req, res) => {
    res.end('Handled by worker ' + process.pid);
  }).listen(3000);
  // All workers share port 3000!
}`,
                language: "javascript"
            },
            {
                node: "I",
                title: "Graceful Restart",
                explanation: "The master can detect when a worker crashes and spawn a replacement. This provides zero-downtime resilience. PM2 is a popular process manager that handles this automatically.",
                code: `cluster.on('exit', (worker, code, signal) => {
  console.log('Worker ' + worker.process.pid + ' died');
  console.log('Forking a new worker...');
  cluster.fork(); // Respawn!
});`,
                language: "javascript"
            }
        ]
    }
];
