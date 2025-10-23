interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
}

export default function QuantityInput({
  value,
  onChange,
  error,
  min = 1,
  max = 999,
}: QuantityInputProps) {
  const handleChange = (newValue: number) => {
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center space-x-4 px-3 py-2 rounded-lg border ${
          error
            ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/20"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
        } shadow-sm transition-colors duration-200`}
      >
        <button
          type="button"
          onClick={() => handleChange(value - 1)}
          className={`text-2xl text-red-500 hover:text-red-800 dark:text-red-400 dark:hover:text-gray-200 transition ${
            value <= min ? "cursor-not-allowed text-gray-300 dark:text-gray-600 hover:text-gray-300 dark:hover:text-gray-600" : ""
          }`}
          disabled={value <= min}
        >
          −
        </button>

        <span className="text-lg font-medium text-gray-800 dark:text-gray-100 min-w-[2ch] text-center select-none">
          {value}
        </span>

        <button
          type="button"
          onClick={() => handleChange(value + 1)}
          className={`text-2xl text-green-500 hover:text-green-800 dark:text-green-400 dark:hover:text-gray-200 transition ${
            max !== undefined && value >= max ? "cursor-not-allowed text-gray-300 dark:text-gray-600 hover:text-gray-300 dark:hover:text-gray-600" : ""
          }`}
          disabled={max !== undefined && value >= max}
        >
          +
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
