"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNewsStore } from "@/store/useNewsStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useCountryStore } from "@/store/useCountryStore";

export function NewsFilters() {
  const setFilters = useNewsStore((s) => s.setFilters);
  const categories = useCategoryStore((s) => s.items);
  const fetchCategories = useCategoryStore((s) => s.fetchAll);
  const countries = useCountryStore((s) => s.items);
  const fetchCountries = useCountryStore((s) => s.fetchAll);

  useEffect(() => {
    fetchCategories();
    fetchCountries();
  }, [fetchCategories, fetchCountries]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wire-muted" />
        <Input
          placeholder="Search title or summary…"
          className="pl-8"
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
        />
      </div>

      <Select onValueChange={(v) => setFilters({ category: v === "all" ? undefined : v })}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.name}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => setFilters({ country: v === "all" ? undefined : v })}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All countries" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All countries</SelectItem>
          {countries.map((c) => (
            <SelectItem key={c.id} value={c.name}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(v) =>
          setFilters({ processed: v === "all" ? undefined : v === "true" })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="true">Processed</SelectItem>
          <SelectItem value="false">Unprocessed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
