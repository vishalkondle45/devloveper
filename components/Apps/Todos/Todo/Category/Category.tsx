import {
  CheckIcon,
  Combobox,
  ComboboxDropdown,
  ComboboxDropdownTarget,
  ComboboxEmpty,
  ComboboxEventsTarget,
  ComboboxOption,
  ComboboxOptions,
  Group,
  Pill,
  PillGroup,
  PillsInput,
  PillsInputField,
  rem,
  useCombobox,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconTag } from "@tabler/icons-react";
import { Types } from "mongoose";
import { useState } from "react";
import { TodoUpdateTypes } from "../../Todo.types";

const categories = [
  {
    value: "blue",
    label: "🔵 Blue category",
  },
  {
    value: "green",
    label: "🟢 Green category",
  },
  {
    value: "red",
    label: "🔴 Red category",
  },
  {
    value: "purple",
    label: "🟣 Purple category",
  },
  {
    value: "orange",
    label: "🟠 Orange category",
  },
  {
    value: "yellow",
    label: "🟡 Yellow category",
  },
];

export default function Category({
  update,
}: {
  update: (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => Promise<void>;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  // const [value, setValue] = useState<string[]>([]);
  const [value, setValue] = useDebouncedState<any>([], 200);

  const handleValueSelect = (val: string) =>
    setValue((current: any) =>
      current.includes(val)
        ? current.filter((v: any) => v !== val)
        : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current: any) => current.filter((v: any) => v !== val));

  const values = value.map((item: any) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {categories.find((i) => i.value === item)?.label}
    </Pill>
  ));

  const options = categories
    .filter((item) =>
      item.value.toLowerCase().includes(search.trim().toLowerCase())
    )
    .map((item) => (
      <ComboboxOption
        value={item.value}
        key={item.value}
        active={value.includes(item.value)}
      >
        <Group gap="sm">
          {value.includes(item.value) ? <CheckIcon size={12} /> : null}
          <span>{item.label}</span>
        </Group>
      </ComboboxOption>
    ));

  return (
    <>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <ComboboxDropdownTarget>
          <PillsInput
            px={0}
            variant="transparent"
            leftSection={
              <IconTag style={{ width: rem(18), height: rem(18) }} />
            }
            styles={{ section: { justifyContent: "left" } }}
            onClick={() => combobox.openDropdown()}
          >
            <PillGroup>
              {values}
              <ComboboxEventsTarget>
                <PillsInputField
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder="Pick a category"
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </ComboboxEventsTarget>
            </PillGroup>
          </PillsInput>
        </ComboboxDropdownTarget>

        <ComboboxDropdown>
          <ComboboxOptions>
            {options.length > 0 ? (
              options
            ) : (
              <ComboboxEmpty>Nothing found...</ComboboxEmpty>
            )}
          </ComboboxOptions>
        </ComboboxDropdown>
      </Combobox>
    </>
  );
}
