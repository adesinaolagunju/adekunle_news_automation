"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { CountryManager } from "@/components/categories/CountryManager";
import { FilterRuleManager } from "@/components/categories/FilterRuleManager";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-wire-text">
          Categories & Filters
        </h1>
        <p className="text-sm text-wire-muted">
          Control which news categories, countries, and content are eligible for posting.
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="rules">Filter rules</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <CategoryManager />
        </TabsContent>
        <TabsContent value="countries" className="mt-4">
          <CountryManager />
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <FilterRuleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
