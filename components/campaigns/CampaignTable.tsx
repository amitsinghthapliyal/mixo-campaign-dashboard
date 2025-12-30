"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Campaign } from "@/types/campaign";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface CampaignTableProps {
  campaigns: Campaign[];
  pageSize: number;
  total: number;
}

export function CampaignTable({ campaigns, pageSize }: CampaignTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Campaign["status"]>(
    "all"
  );
  const [sortKey, setSortKey] = useState<"name" | "budget" | "created_at">(
    "created_at"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const router = useRouter();

  /* ---------------- FILTER & SORT ---------------- */
  const filteredAndSorted = useMemo(() => {
    const result = campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sorting logic
    result.sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortKey) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case "budget":
          aValue = a.budget;
          bValue = b.budget;
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;

        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    });

    return result;
  }, [campaigns, search, statusFilter, sortKey, sortDirection]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / pageSize)
  );

  // Calculate current page - reset to 1 if current page is out of bounds
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAndSorted.length);

  const paginated = useMemo(() => {
    return filteredAndSorted.slice(startIndex, endIndex);
  }, [filteredAndSorted, startIndex, endIndex]);

  // Handle search with page reset
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset page synchronously
  };

  // Handle status filter with page reset
  const handleStatusFilter = (value: "all" | Campaign["status"]) => {
    setStatusFilter(value);
    setPage(1); // Reset page synchronously
  };

  // Handle sort with page reset
  const handleSort = useCallback(
    (key: "name" | "budget" | "created_at") => {
      if (sortKey === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDirection("desc");
      }
      setPage(1); // Reset page synchronously
    },
    [sortKey, sortDirection]
  );

  // Handle page change
  const goToPreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Ensure page is valid when component renders
  if (page !== currentPage) {
    setPage(currentPage);
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search campaign..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sorting buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("name")}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Name
            {sortKey === "name" && (
              <span className="text-xs">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("budget")}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Budget
            {sortKey === "budget" && (
              <span className="text-xs">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort("created_at")}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Date
            {sortKey === "created_at" && (
              <span className="text-xs">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Daily Budget</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  {search || statusFilter !== "all"
                    ? "No campaigns match your filters"
                    : "No campaigns found"}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>

                  <TableCell>
                    <CampaignStatusBadge status={c.status} />
                  </TableCell>

                  <TableCell>${c.budget.toLocaleString()}</TableCell>

                  <TableCell>${c.daily_budget.toLocaleString()}</TableCell>

                  <TableCell>
                    {c.platforms.map((p) => (
                      <Badge
                        key={p}
                        variant="secondary"
                        className="mr-1 capitalize"
                      >
                        {p}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell>
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* View Details Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/campaigns/${c.id}`)}
                        >
                          View
                        </DropdownMenuItem>
                        {c.status === "active" && (
                          <DropdownMenuItem>Pause</DropdownMenuItem>
                        )}
                        {c.status === "paused" && (
                          <DropdownMenuItem>Resume</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredAndSorted.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {filteredAndSorted.length}{" "}
            campaigns
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={goToPreviousPage}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem className="text-sm">
                Page {currentPage} of {totalPages}
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={goToNextPage}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
