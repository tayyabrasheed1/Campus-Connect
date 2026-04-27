import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import AlertMessage from "../common/AlertMessage";
import { assistantApi } from "../../services/api";

const AssistantSearch = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [guidance, setGuidance] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setGuidance("");
        setError("");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const { data } = await assistantApi.queryFaqs({ query: query.trim() });
        setResults(data.results || []);
        setGuidance(data.guidance || "");
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to search assistant");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <section className="card assistant-card">
      <h3>Campus Assistant</h3>
      <input
        type="text"
        placeholder="Search FAQs, events, support..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {isLoading ? <Loader label="Searching..." /> : null}
      <AlertMessage type="error" message={error} />

      {!isLoading && query && !error && results.length === 0 ? (
        <p className="muted">No results found</p>
      ) : null}
      {!isLoading && guidance ? <p className="muted">{guidance}</p> : null}

      <div className="assistant-results">
        {results.map((item) => (
          <article key={item._id} className="assistant-item">
            <p className="chip">{item.category} · {item.sourceType || "faq"}</p>
            <h4>{item.question}</h4>
            <p>{item.answer}</p>
            {item.policyCode ? <p className="muted">Policy Ref: {item.policyCode}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AssistantSearch;
