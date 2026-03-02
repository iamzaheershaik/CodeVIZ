export const reactConcepts = [
    {
        id: "virtual-dom",
        title: "Virtual DOM & Reconciliation",
        description: "How React efficiently updates the real DOM using a virtual representation and diffing algorithm",
        category: "react",
        icon: "🌳",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["🔄 State/Props Change"] --> B["🌳 New Virtual DOM<br/>tree created"]
    B --> C["⚖️ Diffing Algorithm<br/>compare old vs new"]
    C --> D{"Differences<br/>found?"}
    D -->|No| E["✅ No DOM update<br/>needed"]
    D -->|Yes| F["📋 Calculate<br/>minimal changes"]
    F --> G["🎯 Batch Updates<br/>group changes together"]
    G --> H["🖥️ Apply to Real DOM<br/>minimal mutations"]
    H --> I["🎨 Browser Repaints<br/>user sees changes"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style C fill:#3b1f5e,stroke:#a855f7,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff
    style H fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            {
                node: "A",
                title: "State or Props Change",
                explanation: "When setState or a state updater function is called, React schedules a re-render. This doesn't immediately update the DOM — React batches state updates to minimize work.",
                code: `function Counter() {
  const [count, setCount] = useState(0);
  // Calling setCount triggers re-render
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`,
                language: "jsx"
            },
            {
                node: "B",
                title: "New Virtual DOM Tree",
                explanation: "React calls your component function again with the new state. This produces a new Virtual DOM tree — a lightweight JavaScript object representation of what the UI should look like. Creating this is fast because it's just JS objects, not real DOM nodes.",
                code: `// Virtual DOM is just plain objects:
{
  type: 'button',
  props: {
    onClick: handleClick,
    children: '1' // new count value
  }
}`,
                language: "javascript"
            },
            {
                node: "C",
                title: "Diffing Algorithm",
                explanation: "React compares the new Virtual DOM tree with the previous one using its reconciliation algorithm. It uses two heuristics: (1) elements of different types produce different trees, (2) the 'key' prop hints at which children are stable across renders.",
                code: `// React compares:
// OLD: <div className="red">Hello</div>
// NEW: <div className="blue">Hello</div>
// Result: Only update className attribute

// If type changes, entire subtree is replaced:
// OLD: <div>content</div>
// NEW: <span>content</span>
// Result: Destroy <div>, create <span>`,
                language: "jsx"
            },
            {
                node: "G",
                title: "Batch Updates",
                explanation: "React groups multiple state updates into a single re-render for performance. In React 18+ with automatic batching, even async operations are batched. This prevents unnecessary intermediate renders.",
                code: `function handleClick() {
  setName('Zaheer');    // doesn't re-render yet
  setAge(25);           // doesn't re-render yet
  setCity('Mumbai');    // doesn't re-render yet
  // React batches → ONE re-render with all 3 changes
}`,
                language: "javascript"
            },
            {
                node: "H",
                title: "Minimal DOM Mutations",
                explanation: "React applies only the calculated differences to the real DOM. Instead of replacing entire sections, it makes surgical updates — changing a text node here, an attribute there. This is why React is fast.",
                code: `// For a className change, React does:
element.className = 'blue';
// NOT: parent.removeChild(old); parent.appendChild(new);

// For lists with keys:
// React reorders existing DOM nodes
// instead of recreating them`,
                language: "javascript"
            }
        ]
    },
    {
        id: "hooks-lifecycle",
        title: "React Hooks Lifecycle",
        description: "Understanding useState, useEffect, and the component lifecycle with hooks",
        category: "react",
        icon: "🪝",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["🆕 Component Mounts<br/>first render"] --> B["📦 useState<br/>initializes state"]
    B --> C["🎨 Render<br/>returns JSX"]
    C --> D["🖥️ DOM Updated<br/>browser paints"]
    D --> E["⚡ useEffect runs<br/>after paint"]
    E --> F{"State or<br/>Props change?"}
    F -->|Yes| G["🔄 Re-render<br/>component function runs"]
    G --> C
    F -->|No| H["⏳ Waiting for<br/>next update"]
    H --> F
    E --> I["🧹 Cleanup function<br/>runs before next effect"]
    G --> I
    I --> E

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style B fill:#3b1f5e,stroke:#a855f7,color:#fff
    style E fill:#3b2f1f,stroke:#fb923c,color:#fff
    style I fill:#1f3b3b,stroke:#22d3ee,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Component Mounts",
                explanation: "When React renders a component for the first time, it's called 'mounting'. The component function body executes, hooks are called in order, and React builds the initial Virtual DOM.",
                code: `function UserProfile({ userId }) {
  // This entire function runs on mount
  console.log("Rendering UserProfile");
  // ... hooks and JSX
}`,
                language: "jsx"
            },
            {
                node: "B",
                title: "useState Initialization",
                explanation: "useState initializes state values on mount. The initial value is only used on the FIRST render — subsequent renders use the preserved state. React stores hook values in a linked list tied to the component.",
                code: `const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// Initial values: user=null, loading=true
// On re-renders, these return current state`,
                language: "javascript"
            },
            {
                node: "E",
                title: "useEffect Execution",
                explanation: "useEffect runs AFTER the component renders and the DOM is painted. This is key — it doesn't block the browser from painting. The dependency array controls WHEN the effect re-runs.",
                code: `useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
// [] → run once on mount
// [userId] → run when userId changes
// no array → run every render`,
                language: "javascript"
            },
            {
                node: "I",
                title: "Cleanup Function",
                explanation: "Returning a function from useEffect creates a cleanup. It runs before the effect re-runs and when the component unmounts. Essential for preventing memory leaks from subscriptions, timers, or event listeners.",
                code: `useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = (e) => setData(e.data);

  return () => {
    ws.close(); // Cleanup! Prevents leak
  };
}, [url]);`,
                language: "javascript"
            },
            {
                node: "G",
                title: "Re-render Cycle",
                explanation: "When state changes via setState or props change from parent, the component function runs again. React preserves hook state between renders. The new JSX output is diffed against the previous Virtual DOM.",
                code: `// Each button click:
// 1. setCount updates state
// 2. Component function re-runs
// 3. New JSX generated
// 4. React diffs and updates DOM
// 5. useEffect checks dependencies

<button onClick={() => setCount(c => c + 1)}>
  Count: {count}
</button>`,
                language: "jsx"
            }
        ]
    },
    {
        id: "state-management",
        title: "State Management Flow",
        description: "How data flows through React apps: local state, lifting state, Context, and reducers",
        category: "react",
        icon: "📊",
        difficulty: "intermediate",
        mermaid: `graph TD
    A["🏠 Local State<br/>useState in component"] --> B{"Need to share<br/>with siblings?"}
    B -->|No| C["✅ Keep local<br/>simplest approach"]
    B -->|Yes| D["⬆️ Lift State Up<br/>to common parent"]
    D --> E{"Prop drilling<br/>too deep?"}
    E -->|No| F["✅ Pass as props<br/>data flows down"]
    E -->|Yes| G["🌐 Context API<br/>createContext + Provider"]
    G --> H{"Complex state<br/>logic?"}
    H -->|No| I["✅ Context + useState"]
    H -->|Yes| J["🔀 useReducer<br/>predictable updates"]
    J --> K["📦 dispatch(action)<br/>→ reducer → new state"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style D fill:#3b1f5e,stroke:#a855f7,color:#fff
    style G fill:#3b2f1f,stroke:#fb923c,color:#fff
    style J fill:#1f3b2f,stroke:#34d399,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Local Component State",
                explanation: "Start with local state using useState. If only one component needs the data, keep it local. This is the simplest and most performant approach — don't over-engineer.",
                code: `function SearchBar() {
  const [query, setQuery] = useState("");
  // Only SearchBar needs this state
  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
}`,
                language: "jsx"
            },
            {
                node: "D",
                title: "Lifting State Up",
                explanation: "When sibling components need to share state, lift it to their closest common parent. The parent owns the state and passes it down as props. This is React's primary data flow pattern.",
                code: `function Parent() {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
      />
      <ProductList filter={filter} />
    </>
  );
}`,
                language: "jsx"
            },
            {
                node: "G",
                title: "Context API",
                explanation: "When props need to pass through many component levels (prop drilling), use Context. It provides a way to share values between components without explicitly passing through every level of the tree.",
                code: `const ThemeContext = createContext('dark');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <DeepNestedChild />
    </ThemeContext.Provider>
  );
}
// Any child can access:
const { theme } = useContext(ThemeContext);`,
                language: "jsx"
            },
            {
                node: "J",
                title: "useReducer for Complex State",
                explanation: "When state logic is complex (multiple sub-values, next state depends on previous), useReducer is clearer. It follows a Redux-like pattern: dispatch an action → reducer calculates new state.",
                code: `const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(t =>
        t.id === action.id ? { ...t, done: !t.done } : t
      )};
    default: return state;
  }
};

const [state, dispatch] = useReducer(reducer, { todos: [] });
dispatch({ type: 'ADD_TODO', payload: newTodo });`,
                language: "javascript"
            }
        ]
    },
    {
        id: "component-rendering",
        title: "Component Rendering & Optimization",
        description: "Understanding when and why React re-renders, and how to optimize performance",
        category: "react",
        icon: "⚡",
        difficulty: "advanced",
        mermaid: `graph TD
    A["🔄 Parent Re-renders"] --> B["👶 ALL Children<br/>re-render by default"]
    B --> C{"Using<br/>React.memo?"}
    C -->|No| D["🔄 Child re-renders<br/>even if props same"]
    C -->|Yes| E{"Props<br/>changed?"}
    E -->|No| F["⏭️ Skip re-render<br/>use cached result"]
    E -->|Yes| D
    D --> G["🎯 Optimize with"]
    G --> H["useMemo<br/>memoize values"]
    G --> I["useCallback<br/>memoize functions"]
    G --> J["Virtualization<br/>render visible only"]

    style A fill:#1e3a5f,stroke:#4f8cff,color:#fff
    style F fill:#1f3b2f,stroke:#34d399,color:#fff
    style H fill:#3b1f5e,stroke:#a855f7,color:#fff
    style I fill:#3b2f1f,stroke:#fb923c,color:#fff`,
        steps: [
            {
                node: "A",
                title: "Re-render Triggers",
                explanation: "A component re-renders when: (1) its state changes, (2) its parent re-renders, or (3) a Context it consumes changes. Understanding these triggers is key to optimization.",
                code: `function Parent() {
  const [count, setCount] = useState(0);
  // When count changes, Parent re-renders
  // AND all its children re-render too!
  return (
    <div>
      <ExpensiveChild />  {/* re-renders! */}
      <AnotherChild />    {/* re-renders! */}
    </div>
  );
}`,
                language: "jsx"
            },
            {
                node: "C",
                title: "React.memo",
                explanation: "React.memo is a higher-order component that memoizes the render result. The wrapped component only re-renders if its props have changed (shallow comparison). Use it for components that render often with the same props.",
                code: `const ExpensiveChild = React.memo(({ data }) => {
  // Only re-renders if 'data' prop changes
  return <div>{heavyComputation(data)}</div>;
});

// Now when Parent re-renders but data hasn't
// changed, ExpensiveChild is skipped!`,
                language: "jsx"
            },
            {
                node: "H",
                title: "useMemo for Values",
                explanation: "useMemo caches the result of an expensive computation. It only recalculates when dependencies change. Use it for derived data, heavy calculations, or preserving object references for React.memo children.",
                code: `function Dashboard({ items }) {
  const stats = useMemo(() => {
    // Only recalculates when items change
    return {
      total: items.length,
      avg: items.reduce((a, b) => a + b, 0) / items.length,
      max: Math.max(...items)
    };
  }, [items]);

  return <StatsPanel stats={stats} />;
}`,
                language: "jsx"
            },
            {
                node: "I",
                title: "useCallback for Functions",
                explanation: "useCallback returns a memoized version of a callback. Without it, a new function reference is created every render, causing React.memo children to always re-render.",
                code: `function Parent() {
  const [count, setCount] = useState(0);

  // Without useCallback: new function every render
  // With useCallback: same reference if deps unchanged
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no dependencies needed

  return <MemoizedButton onClick={handleClick} />;
}`,
                language: "jsx"
            }
        ]
    }
];
