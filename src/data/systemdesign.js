export const systemDesignConcepts = [
    {
        id: "load-balancer",
        title: "Load Balancer",
        description: "How load balancers distribute traffic across multiple servers",
        category: "systemdesign",
        icon: "⚖️",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["👥 Clients"] --> B["⚖️ Load Balancer"]
    B --> C["🖥️ Server 1 ✅"]
    B --> D["🖥️ Server 2 ✅"]
    B --> E["🖥️ Server 3 ❌"]
    B --> F["🖥️ Server 4 ✅"]
    C --> G["📊 Health Checks"]
    G --> B

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style C fill:#1f3b2f,stroke:#34d399,color:#fff
    style E fill:#3b1f1f,stroke:#f87171,color:#fff`,
        steps: [
            { node: "A", title: "Single Server Bottleneck", explanation: "A single server has limited capacity. Load balancers distribute requests across multiple servers (horizontal scaling).", code: `// Popular LBs: Nginx, HAProxy, AWS ALB`, language: "text" },
            { node: "B", title: "Algorithms", explanation: "Round Robin cycles through servers. Least Connections picks the least busy. IP Hash routes same client to same server. Weighted distributes based on capacity.", code: `upstream backend {\n    least_conn;\n    server 10.0.0.1 weight=3;\n    server 10.0.0.2 weight=1;\n}`, language: "text" },
            { node: "G", title: "Health Checks", explanation: "LB periodically pings /health endpoint. Unhealthy servers are removed from pool. When recovered, they're added back.", code: `app.get('/health', (req, res) => {\n  const ok = checkDB() && checkRedis();\n  res.status(ok ? 200 : 503).json({ status: ok ? 'healthy' : 'unhealthy' });\n});`, language: "javascript" }
        ]
    },
    {
        id: "caching-strategies",
        title: "Caching Strategies",
        description: "How caching works at different layers with invalidation patterns",
        category: "systemdesign",
        icon: "⚡",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["📥 Request"] --> B["🌐 CDN Cache"]
    B -->|Hit| C["⚡ Return cached"]
    B -->|Miss| D["🖥️ App Server"]
    D --> E["💾 Redis Cache"]
    E -->|Hit| F["⚡ Return from memory"]
    E -->|Miss| G["🗄️ Database"]
    G --> H["💾 Store in cache"]
    H --> F

    style B fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style E fill:#3b1f5e,stroke:#a855f7,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            { node: "B", title: "CDN Caching", explanation: "CDNs cache content at edge servers near users. Static assets served from nearest location. Reduces latency from 200ms to 20ms.", code: `Cache-Control: public, max-age=31536000`, language: "text" },
            { node: "E", title: "Application Cache (Redis)", explanation: "Redis stores frequently accessed data in memory. DB queries taking 50ms served from Redis in 1ms.", code: `async function getUser(id) {\n  const cached = await redis.get('user:' + id);\n  if (cached) return JSON.parse(cached);\n  const user = await db.query('SELECT * FROM users WHERE id=?', [id]);\n  await redis.setEx('user:' + id, 3600, JSON.stringify(user));\n  return user;\n}`, language: "javascript" },
            { node: "G", title: "Cache Invalidation", explanation: "TTL-based: expires after N seconds. Event-based: invalidate when data changes. Cache-Aside is most common pattern.", code: `async function updateUser(id, data) {\n  await db.update('users', id, data);\n  await redis.del('user:' + id); // Invalidate!\n}`, language: "javascript" }
        ]
    },
    {
        id: "database-scaling",
        title: "Database Scaling",
        description: "Sharding and replication strategies for databases",
        category: "systemdesign",
        icon: "🗄️",
        difficulty: "advanced",
        mermaid: `graph TD
    A["📈 Growing DB"] --> B{"Approach?"}
    B --> C["⬆️ Vertical Scale"]
    B --> D["➡️ Horizontal Scale"]
    D --> E["📋 Replication"]
    D --> F["✂️ Sharding"]
    E --> G["👑 Primary writes"]
    E --> H["📖 Replica reads"]
    F --> I["Shard 1: A-M"]
    F --> J["Shard 2: N-Z"]

    style C fill:#3b2f1f,stroke:#fb923c,color:#fff
    style E fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style F fill:#3b1f5e,stroke:#a855f7,color:#fff`,
        steps: [
            { node: "C", title: "Vertical Scaling", explanation: "Add more CPU/RAM to existing server. Simple but has a ceiling. Good for first 10x growth.", code: `// 4 CPU → 16 CPU, 16GB → 128GB RAM\n// Limits: hardware max, single point of failure`, language: "text" },
            { node: "E", title: "Replication", explanation: "Primary handles writes, replicas handle reads. Most apps are 90% reads, so this dramatically improves throughput.", code: `// Reads → Replica DB (N servers)\n// Writes → Primary DB (1 server)`, language: "text" },
            { node: "F", title: "Sharding", explanation: "Split data across multiple databases. Shard key determines storage location. Enables unlimited scaling but adds complexity.", code: `function getShard(userId) {\n  return userId % NUM_SHARDS;\n}`, language: "javascript" }
        ]
    },
    {
        id: "microservices",
        title: "Microservices Architecture",
        description: "Decomposing a monolith into independently deployable services",
        category: "systemdesign",
        icon: "🏗️",
        difficulty: "advanced",
        mermaid: `graph TD
    A["🌐 API Gateway"] --> B["👤 User Service"]
    A --> C["📦 Product Service"]
    A --> D["🛒 Order Service"]
    D --> E["📨 Message Queue"]
    E --> F["📧 Notification"]
    B --> G["🗄️ User DB"]
    C --> H["🗄️ Product DB"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            { node: "A", title: "API Gateway", explanation: "Single entry point handling auth, rate limiting, and request routing. Clients don't know about individual services.", code: `/api/users/* → User Service\n/api/products/* → Product Service\n/api/orders/* → Order Service`, language: "text" },
            { node: "B", title: "Service Independence", explanation: "Each service owns its domain, has its own database, and deploys independently. Different tech stacks per service.", code: `// User Service: Node.js + PostgreSQL\n// Product Service: Python + MongoDB\n// Order Service: Java + MySQL`, language: "text" },
            { node: "E", title: "Async Communication", explanation: "Services communicate via message queues (RabbitMQ, Kafka). If a service is down, messages queue up and process when it recovers.", code: `await queue.publish('order.created', {\n  orderId: '123', userId: '456'\n});`, language: "javascript" }
        ]
    }
];
