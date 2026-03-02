export const networkingConcepts = [
    {
        id: "tcp-handshake",
        title: "TCP 3-Way Handshake",
        description: "How TCP establishes a reliable connection between client and server",
        category: "networking",
        icon: "🤝",
        difficulty: "beginner",
        mermaid: `graph TD
    A["🖥️ Client<br/>wants to connect"] --> B["📤 SYN<br/>seq=x"]
    B --> C["🖥️ Server<br/>receives SYN"]
    C --> D["📤 SYN-ACK<br/>seq=y, ack=x+1"]
    D --> E["🖥️ Client<br/>receives SYN-ACK"]
    E --> F["📤 ACK<br/>ack=y+1"]
    F --> G["✅ Connection<br/>ESTABLISHED"]
    G --> H["📊 Data Transfer<br/>begins"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style D fill:#1f3b3b,stroke:#22d3ee,color:#fff
    style G fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            {
                node: "B",
                title: "Step 1: SYN (Synchronize)",
                explanation: "The client initiates the connection by sending a SYN (synchronize) segment. It includes a random initial sequence number (ISN), used to track bytes in the conversation. The client enters SYN_SENT state.",
                code: `// Conceptual representation:
TCP Segment {
  SYN: 1,
  sequence_number: 1000,  // random ISN
  // "Hey server, I want to talk"
  // "I'll start counting bytes from 1000"
}`,
                language: "javascript"
            },
            {
                node: "D",
                title: "Step 2: SYN-ACK",
                explanation: "The server responds with SYN-ACK: acknowledging the client's sequence number (ack=client_ISN+1) and sending its own ISN. This confirms the server received the client's request and is ready. The server enters SYN_RECEIVED state.",
                code: `// Server responds:
TCP Segment {
  SYN: 1,
  ACK: 1,
  sequence_number: 5000,   // server's ISN
  acknowledgment: 1001,    // client's ISN + 1
  // "Got it! I'll start from 5000"
}`,
                language: "javascript"
            },
            {
                node: "F",
                title: "Step 3: ACK",
                explanation: "The client acknowledges the server's sequence number. Both sides now have confirmed sequence numbers. The connection is ESTABLISHED and data can flow in both directions (full-duplex).",
                code: `// Client confirms:
TCP Segment {
  ACK: 1,
  sequence_number: 1001,
  acknowledgment: 5001,    // server's ISN + 1
  // "We're good! Let's exchange data"
}
// Connection is now ESTABLISHED`,
                language: "javascript"
            },
            {
                node: "G",
                title: "Why 3-Way?",
                explanation: "Three steps are needed to ensure BOTH sides can send AND receive. The SYN confirms client→server works. The SYN-ACK confirms server→client works. The final ACK confirms the client received server's SYN. This prevents issues with old duplicate SYN packets.",
                code: `// Without 3-way handshake:
// Old SYN packet arrives at server
// Server thinks it's a new connection
// Server allocates resources wastefully

// 3-way handshake prevents this because
// the client must ACK with correct seq num`,
                language: "javascript"
            }
        ]
    },
    {
        id: "dns-resolution",
        title: "DNS Resolution Process",
        description: "How domain names are resolved to IP addresses through the DNS hierarchy",
        category: "networking",
        icon: "🔍",
        difficulty: "beginner",
        mermaid: `graph TD
    A["🌐 Browser types<br/>www.example.com"] --> B["💾 Browser Cache<br/>check local"]
    B --> C{"Cached?"}
    C -->|Yes| D["✅ Use cached IP"]
    C -->|No| E["🖥️ OS Resolver<br/>check hosts file"]
    E --> F{"Found?"}
    F -->|Yes| D
    F -->|No| G["📡 Recursive DNS<br/>Resolver (ISP)"]
    G --> H["🌍 Root Server<br/>.com .org .net"]
    H --> I["📋 TLD Server<br/>.com nameserver"]
    I --> J["🏢 Authoritative<br/>NS for example.com"]
    J --> K["📍 Returns IP<br/>93.184.216.34"]
    K --> G
    G --> L["💾 Cache result<br/>with TTL"]
    L --> D

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style G fill:#3b1f5e,stroke:#a855f7,color:#fff
    style H fill:#3b2f1f,stroke:#fb923c,color:#fff
    style J fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            {
                node: "A",
                title: "User Types a URL",
                explanation: "When you type a URL like www.example.com, the browser needs to find the server's IP address. Computers communicate using IP addresses (like 93.184.216.34), not human-readable domain names.",
                code: `// What you type:
https://www.example.com/page

// What the browser needs:
IP: 93.184.216.34
Port: 443 (HTTPS)`,
                language: "text"
            },
            {
                node: "B",
                title: "Browser & OS Cache",
                explanation: "Before making any network request, the browser checks its DNS cache (recent lookups), then the OS resolver checks the system's hosts file (/etc/hosts). If found, no network lookup is needed — this is the fastest path.",
                code: `// Browser cache: recently visited domains
// OS hosts file (manual overrides):
# /etc/hosts
127.0.0.1    localhost
192.168.1.50 dev-server.local`,
                language: "text"
            },
            {
                node: "G",
                title: "Recursive DNS Resolver",
                explanation: "If not cached, the query goes to a recursive resolver (usually your ISP or public DNS like 8.8.8.8). This server does the heavy lifting — it queries the DNS hierarchy on your behalf and caches the result.",
                code: `// Your DNS resolver (configured in OS)
// Common public DNS servers:
// Google:     8.8.8.8,  8.8.4.4
// Cloudflare: 1.1.1.1,  1.0.0.1
// OpenDNS:    208.67.222.222

// Check your DNS: nslookup example.com`,
                language: "text"
            },
            {
                node: "H",
                title: "Root → TLD → Authoritative",
                explanation: "The resolver walks down the DNS tree: (1) Root servers know where .com/.org servers are, (2) TLD servers for .com know which authoritative nameservers handle example.com, (3) The authoritative server has the actual IP address.",
                code: `// DNS hierarchy:
//   . (root)
//   ├── .com (TLD)
//   │   ├── example.com → 93.184.216.34
//   │   ├── google.com  → 142.250.80.46
//   │   └── ...
//   ├── .org (TLD)
//   └── .net (TLD)

// 13 root server clusters worldwide
// Anycast routing for redundancy`,
                language: "text"
            },
            {
                node: "L",
                title: "Caching with TTL",
                explanation: "The resolved IP is cached at every level with a TTL (Time To Live) value. The domain owner sets the TTL. Short TTL = faster updates but more DNS queries. Long TTL = better performance but slower propagation of changes.",
                code: `// DNS Record with TTL:
example.com.  3600  IN  A  93.184.216.34
// TTL: 3600 seconds = 1 hour
// After 1 hour, cache expires → new lookup

// Common TTL values:
// 300  (5 min)  - frequently changing
// 3600 (1 hour) - normal
// 86400 (1 day) - rarely changing`,
                language: "text"
            }
        ]
    },
    {
        id: "http-lifecycle",
        title: "HTTP Request/Response Lifecycle",
        description: "The complete journey of an HTTP request from browser to server and back",
        category: "networking",
        icon: "🔄",
        difficulty: "beginner",
        mermaid: `graph TD
    A["🌐 Browser<br/>URL entered"] --> B["🔍 DNS Lookup<br/>resolve domain"]
    B --> C["🤝 TCP Handshake<br/>establish connection"]
    C --> D["🔒 TLS Handshake<br/>HTTPS encryption"]
    D --> E["📤 HTTP Request<br/>GET /page HTTP/1.1"]
    E --> F["🖥️ Server<br/>processes request"]
    F --> G["📥 HTTP Response<br/>200 OK + body"]
    G --> H["🎨 Browser<br/>parses HTML"]
    H --> I["📦 Load Resources<br/>CSS, JS, images"]
    I --> J["🖥️ Render Page<br/>user sees content"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style F fill:#1f3b2f,stroke:#34d399,color:#fff
    style J fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Request Initiated",
                explanation: "When you enter a URL or click a link, the browser begins the request process. It first parses the URL to extract the protocol (https), domain (example.com), port (443), and path (/page).",
                code: `// URL anatomy:
https://www.example.com:443/api/users?page=1#top
│       │                │   │        │      │
protocol  domain        port  path    query  fragment`,
                language: "text"
            },
            {
                node: "C",
                title: "TCP + TLS Handshake",
                explanation: "After DNS resolution, the browser establishes a TCP connection (3-way handshake), then negotiates TLS encryption for HTTPS. Modern browsers use HTTP/2 which multiplexes multiple requests over a single connection.",
                code: `// TCP: SYN → SYN-ACK → ACK (3 packets)
// TLS 1.3: Client Hello → Server Hello + cert → Finish
// Total: ~2-3 round trips before data

// HTTP/2 improvements:
// - Single connection for all requests
// - Header compression (HPACK)
// - Server push`,
                language: "text"
            },
            {
                node: "E",
                title: "HTTP Request Sent",
                explanation: "The browser sends the HTTP request with method, path, headers, and optionally a body. Headers include cookies, accepted content types, caching directives, and more.",
                code: `GET /api/users HTTP/1.1
Host: www.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
Cookie: session=abc123
User-Agent: Chrome/120.0
Cache-Control: no-cache`,
                language: "http"
            },
            {
                node: "G",
                title: "Server Response",
                explanation: "The server processes the request and sends back a response with a status code, headers, and body. Status codes indicate the result: 2xx success, 3xx redirect, 4xx client error, 5xx server error.",
                code: `HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600
Content-Length: 256

{"users": [
  {"id": 1, "name": "Zaheer"},
  {"id": 2, "name": "Sara"}
]}

// Common status codes:
// 200 OK | 201 Created | 301 Redirect
// 400 Bad Request | 401 Unauthorized
// 404 Not Found | 500 Server Error`,
                language: "http"
            }
        ]
    },
    {
        id: "osi-model",
        title: "OSI Model — 7 Layers",
        description: "The Open Systems Interconnection model for understanding network communication",
        category: "networking",
        icon: "📚",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["7️⃣ Application Layer<br/>HTTP, FTP, SMTP, DNS"] --> B["6️⃣ Presentation Layer<br/>SSL/TLS, JPEG, ASCII"]
    B --> C["5️⃣ Session Layer<br/>Sockets, sessions"]
    C --> D["4️⃣ Transport Layer<br/>TCP, UDP"]
    D --> E["3️⃣ Network Layer<br/>IP, ICMP, routing"]
    E --> F["2️⃣ Data Link Layer<br/>Ethernet, MAC, switches"]
    F --> G["1️⃣ Physical Layer<br/>cables, radio, signals"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#1f3b2f,stroke:#34d399,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Layer 7: Application",
                explanation: "The layer closest to the user. Protocols here include HTTP (web), SMTP (email), FTP (file transfer), DNS (name resolution). This is where web developers typically work — your Express routes and API endpoints operate at this layer.",
                code: `// Application layer protocols you use daily:
HTTP/HTTPS  - Web browsing, REST APIs
WebSocket   - Real-time communication
SMTP/IMAP   - Email
FTP/SFTP    - File transfer
DNS         - Domain name resolution
SSH         - Secure remote access`,
                language: "text"
            },
            {
                node: "D",
                title: "Layer 4: Transport",
                explanation: "TCP provides reliable, ordered delivery with error checking and flow control. UDP provides fast, connectionless delivery without guarantees. TCP is used for web/email; UDP for video streaming, gaming, DNS queries.",
                code: `// TCP (Transmission Control Protocol)
// ✅ Reliable, ordered, error-checked
// ❌ Slower (overhead)
// Use: HTTP, email, file transfer

// UDP (User Datagram Protocol)
// ✅ Fast, low latency
// ❌ No delivery guarantee
// Use: Video streaming, gaming, DNS`,
                language: "text"
            },
            {
                node: "E",
                title: "Layer 3: Network",
                explanation: "Responsible for routing packets between different networks using IP addresses. Routers operate at this layer. IP (Internet Protocol) handles addressing and routing. ICMP is used for diagnostics (ping, traceroute).",
                code: `// IP addresses identify hosts on the network:
IPv4: 192.168.1.100    (32-bit, ~4 billion)
IPv6: 2001:0db8::8a2e  (128-bit, virtually unlimited)

// Subnet mask determines network vs host:
192.168.1.0/24
// Network: 192.168.1.x
// Host range: 1-254`,
                language: "text"
            },
            {
                node: "G",
                title: "Layer 1: Physical",
                explanation: "The physical transmission of raw bits over a medium. This includes ethernet cables (Cat5/Cat6), fiber optic cables, Wi-Fi radio waves, and Bluetooth. All digital data ultimately becomes electrical signals, light pulses, or radio waves.",
                code: `// Physical media types:
Ethernet (Cat6)  - 10 Gbps, copper
Fiber Optic      - 100+ Gbps, light
Wi-Fi 6 (802.11ax) - ~9.6 Gbps, radio
5G Cellular      - ~10 Gbps, radio

// Data at this layer = voltage changes,
// light pulses, or electromagnetic waves`,
                language: "text"
            }
        ]
    }
];
