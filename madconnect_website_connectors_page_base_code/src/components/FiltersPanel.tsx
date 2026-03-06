interface FilterSection {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

interface FiltersPanelProps {
  sections: FilterSection[];
  onReset: () => void;
}

export function FiltersPanel({ sections, onReset }: FiltersPanelProps) {
  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="filter-by-label">Filter by...</div>
        <div className="reset-filters-link" onClick={onReset}>
          Reset filters
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="filter-section">
          <div className="filter-category">{section.title}</div>
          {section.options.map((option) => (
            <div
              key={option}
              className={`filter-results ${section.selectedValues.includes(option) ? "selected" : ""}`}
              onClick={() => section.onToggle(option)}
            >
              {option}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FiltersPanel;
