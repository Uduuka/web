import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  MouseEvent,
} from "react";

interface SearchInputProps {
  /** Array of items to search through (strings or objects with a display key) */
  items: string[];
  /** Placeholder text for the input */
  placeholder?: string;
  /** Callback when an item is selected */
  onSelect?: (item: string) => void;
  /** Optional custom class name */
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  items = [],
  placeholder = "Search...",
  onSelect,
  className,
}) => {
  const [query, setQuery] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Filter items whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems([]);
      setShowDropdown(false);
      return;
    }

    const filtered = items.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredItems(filtered);
    setSelectedIndex(filtered.length > 0 ? 0 : -1);
    setShowDropdown(filtered.length > 0);
  }, [query, items]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filteredItems.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        const itemToSelect =
          selectedIndex >= 0 ? filteredItems[selectedIndex] : filteredItems[0];
        selectItem(itemToSelect);
        break;

      case "Escape":
        e.preventDefault();
        setQuery("");
        setShowDropdown(false);
        inputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  // Select an item (used by Enter or click)
  const selectItem = (item: string) => {
    setQuery(item);
    setShowDropdown(false);
    onSelect?.(item);
    inputRef.current?.focus();
  };

  // Handle item click
  const handleItemClick = (item: string) => (e: MouseEvent<HTMLLIElement>) => {
    selectItem(item);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%" }}
      ref={dropdownRef as any}
    >
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          outline: "none",
          boxSizing: "border-box",
        }}
        onFocus={() =>
          query && filteredItems.length > 0 && setShowDropdown(true)
        }
      />

      {showDropdown && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: "4px 0 0",
            padding: 0,
            listStyle: "none",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          {filteredItems.map((item, index) => (
            <li
              key={item}
              onClick={handleItemClick(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                backgroundColor:
                  index === selectedIndex ? "#f0f7ff" : "transparent",
                fontWeight: index === selectedIndex ? "500" : "normal",
                transition: "background-color 0.15s",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
