import Dropdown from "../molecules/Dropdown";
import { Controller } from "react-hook-form";
import Input from "../atoms/Input";
import useQueryParams from "@/app/hooks/network/useQueryParams";

interface FilterBarProps {
  sortOptions: string[];
  filterOptions: string[];
  control: any;
  errors: any;
  filterBy: string;
  sortBy: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterBy,
  sortBy,
  sortOptions,
  filterOptions,
  control,
  errors,
}) => {
  const { updateQuery } = useQueryParams();

  return (
    <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-md">
      <Input
        name="name"
        type="text"
        placeholder="Item Name"
        control={control}
        validation={{ required: true }}
        error={errors.name?.message}
        onChange={(e) => updateQuery({ name: e.target.value })}
      />

      <Controller
        name={filterBy}
        control={control}
        render={({ field }) => (
          <Dropdown
            label={`Filter by ${field.value ? field.value : filterBy}`}
            options={filterOptions}
            {...field}
            onChange={(value) => {
              field.onChange(value);
              updateQuery({ filterBy: value });
            }}
          />
        )}
      />

      <Controller
        name={sortBy}
        control={control}
        render={({ field }) => (
          <Dropdown
            label={`Sort by ${field.value ? field.value : sortBy}`}
            options={sortOptions}
            {...field}
            onChange={(value) => {
              field.onChange(value);
              updateQuery({ sort: value });
            }}
          />
        )}
      />
    </div>
  );
};

export default FilterBar;
