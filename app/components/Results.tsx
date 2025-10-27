'use client';

export default function Results() {
  const results = [
    { picture: 'Lou at Yankee Stadium', votes: 128 },
    { picture: 'Farewell Speech', votes: 173 }
  ];

  return (
    <section className="results-section">
      <h2 className="results-title">Weekly Matchup Results</h2>
      <table className="results-table" aria-label="Matchup results">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.picture}</td>
              <td>{result.votes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
