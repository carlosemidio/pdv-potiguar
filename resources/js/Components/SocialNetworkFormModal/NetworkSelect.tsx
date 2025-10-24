import { networksIcons } from "@/utils/networksIcons";
import Select from "react-select";

const options = networksIcons.map((network) => ({
  value: network.slug,
  label: (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <network.icon />
      {network.name}
    </div>
  ),
}));

interface NetworkSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function NetworkSelect({ value, onChange, error, disabled }: NetworkSelectProps) {
  return (
    <Select
      options={options}
      placeholder="Selecione uma rede social"
      value={options.find((option) => option.value === value) || null}
      onChange={(selectedOption) => {
        if (onChange && selectedOption) {
          onChange(selectedOption.value);
        }
      }}
      isDisabled={disabled}
      classNamePrefix="react-select"
      isSearchable
    />
  );
}
