"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TransactionFilters, TransactionType } from "../types";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersComponent({ 
  filters, 
  onFiltersChange 
}: TransactionFiltersProps) {
  const [isDateFromOpen, setIsDateFromOpen] = useState(false);
  const [isDateToOpen, setIsDateToOpen] = useState(false);

  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "" && value !== null
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtry</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Wyczyść
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search by description */}
          <div className="space-y-2">
            <Label htmlFor="search">Szukaj</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Opis transakcji..."
                value={filters.description || ""}
                onChange={(e) => handleFilterChange("description", e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Transaction type */}
          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <Select
              value={filters.type || ""}
              onValueChange={(value) => 
                handleFilterChange("type", value === "" ? undefined : value as TransactionType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Wszystkie typy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Wszystkie typy</SelectItem>
                <SelectItem value="INCOME">Przychód</SelectItem>
                <SelectItem value="EXPENSE">Wydatek</SelectItem>
                <SelectItem value="TRANSFER_IN">Przelew przychodzący</SelectItem>
                <SelectItem value="TRANSFER_OUT">Przelew wychodzący</SelectItem>
                <SelectItem value="INVESTMENT">Inwestycja</SelectItem>
                <SelectItem value="DIVIDEND">Dywidenda</SelectItem>
                <SelectItem value="INTEREST">Odsetki</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date from */}
          <div className="space-y-2">
            <Label>Data od</Label>
            <Popover open={isDateFromOpen} onOpenChange={setIsDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? 
                    format(new Date(filters.dateFrom), "PPP", { locale: pl }) : 
                    "Wybierz datę"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                  onSelect={(date) => {
                    handleFilterChange("dateFrom", date);
                    setIsDateFromOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date to */}
          <div className="space-y-2">
            <Label>Data do</Label>
            <Popover open={isDateToOpen} onOpenChange={setIsDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? 
                    format(new Date(filters.dateTo), "PPP", { locale: pl }) : 
                    "Wybierz datę"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                  onSelect={(date) => {
                    handleFilterChange("dateTo", date);
                    setIsDateToOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
          <Input
            id="tags"
            placeholder="np. jedzenie, praca, zakupy"
            value={filters.tags?.join(", ") || ""}
            onChange={(e) => {
              const tags = e.target.value
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
              handleFilterChange("tags", tags.length > 0 ? tags : undefined);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
