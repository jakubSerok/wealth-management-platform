"use client";

import { ProfileForm } from "./ProfileForm";
import { TransactionGrid } from "./TransactionGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface ProfileStatsProps {
  netWorth: any[];
  lastYearNetWorth: any[];
  totalDividends: number;
  monthlyData: { month: string; value: number }[];
  monthlyDividends: { month: string; amount: number }[];
  recentTransactions: any[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function ProfileStats({
  netWorth,
  lastYearNetWorth,
  totalDividends,
  monthlyData,
  monthlyDividends,
  recentTransactions,
}: ProfileStatsProps) {
  // Prepare data for charts
  const pieData = netWorth.map((item) => ({
    name: item.type,
    value: Number(item._sum.balance) || 0,
  }));

  const lastYearPieData = lastYearNetWorth.map((item) => ({
    name: item.type,
    value: Number(item._sum.balance) || 0,
  }));

  const totalNetWorth = pieData.reduce((sum, item) => sum + item.value, 0);
  const totalLastYearNetWorth = lastYearPieData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Calculate year-over-year percentage change
  const yearOverYearChange =
    totalLastYearNetWorth > 0
      ? ((totalNetWorth - totalLastYearNetWorth) / totalLastYearNetWorth) * 100
      : 0;

  // Calculate dividend growth (mock comparison for now - could be enhanced with last year data)
  const dividendGrowth = totalDividends > 0 ? 8.2 : 0; // Could be calculated with last year's dividends

  // Use real data from backend instead of mock data
  const growthData = monthlyData;
  const dividendData = monthlyDividends;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Worth
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalNetWorth)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  yearOverYearChange >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {yearOverYearChange >= 0 ? "+" : ""}
                {yearOverYearChange.toFixed(1)}%
              </span>{" "}
              from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Year Dividends
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDividends)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  dividendGrowth >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {dividendGrowth >= 0 ? "+" : ""}
                {dividendGrowth.toFixed(1)}%
              </span>{" "}
              from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accounts</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{netWorth.length}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Net Worth Growth</CardTitle>
            <CardDescription>
              Your net worth over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: "#8884d8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Account Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Account Distribution</CardTitle>
            <CardDescription>Your assets by account type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Dividends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Dividends</CardTitle>
            <CardDescription>
              Dividend income over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dividendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Breakdown of your accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {netWorth.map((account, index) => (
                <div
                  key={account.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{account.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatCurrency(Number(account._sum.balance) || 0)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {(
                        ((Number(account._sum.balance) || 0) / totalNetWorth) *
                        100
                      ).toFixed(1)}
                      %
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="mt-6">
          <TransactionGrid
            transactions={recentTransactions}
            title="Ostatnie Transakcje"
            showAccountInfo={true}
          />
        </div>
      </div>
    </div>
  );
}
