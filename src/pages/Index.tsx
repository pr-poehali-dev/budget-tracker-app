import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
};

type Budget = {
  category: string;
  limit: number;
  spent: number;
};

const mockTransactions: Transaction[] = [
  { id: '1', date: '2025-10-22', description: 'Продукты Пятёрочка', category: 'Продукты', amount: -3500, type: 'expense' },
  { id: '2', date: '2025-10-21', description: 'Зарплата', category: 'Доход', amount: 85000, type: 'income' },
  { id: '3', date: '2025-10-20', description: 'АЗС Газпром', category: 'Транспорт', amount: -2800, type: 'expense' },
  { id: '4', date: '2025-10-19', description: 'Ресторан', category: 'Развлечения', amount: -4200, type: 'expense' },
  { id: '5', date: '2025-10-18', description: 'Аптека', category: 'Здоровье', amount: -1250, type: 'expense' },
  { id: '6', date: '2025-10-17', description: 'Коммунальные услуги', category: 'ЖКХ', amount: -5600, type: 'expense' },
];

const mockBudgets: Budget[] = [
  { category: 'Продукты', limit: 25000, spent: 18500 },
  { category: 'Транспорт', limit: 15000, spent: 8300 },
  { category: 'Развлечения', limit: 10000, spent: 4200 },
  { category: 'ЖКХ', limit: 12000, spent: 5600 },
];

const categories = ['Продукты', 'Транспорт', 'Развлечения', 'ЖКХ', 'Здоровье', 'Доход', 'Прочее'];

export default function Index() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [budgets] = useState<Budget[]>(mockBudgets);
  const [activeTab, setActiveTab] = useState('dashboard');

  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0));

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Icon name="Wallet" className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Family Budget</h1>
                <p className="text-sm text-muted-foreground">Семейный бюджет</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="Settings" size={16} className="mr-2" />
              T-Bank API
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid mb-6">
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Дашборд</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Icon name="ArrowLeftRight" size={16} />
              <span className="hidden sm:inline">Транзакции</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="TrendingUp" size={16} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="gap-2">
              <Icon name="Target" size={16} />
              <span className="hidden sm:inline">Бюджеты</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Icon name="Tags" size={16} />
              <span className="hidden sm:inline">Категории</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-0">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs uppercase tracking-wider font-medium">Общий баланс</CardDescription>
                  <CardTitle className="text-3xl font-bold font-mono">
                    {totalBalance.toLocaleString('ru-RU')} ₽
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Icon name="TrendingUp" size={14} className="mr-1 text-accent" />
                    <span>Обновлено сегодня</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs uppercase tracking-wider font-medium">Доходы</CardDescription>
                  <CardTitle className="text-3xl font-bold font-mono text-accent">
                    +{totalIncome.toLocaleString('ru-RU')} ₽
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Icon name="ArrowUp" size={14} className="mr-1" />
                    <span>За октябрь 2025</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs uppercase tracking-wider font-medium">Расходы</CardDescription>
                  <CardTitle className="text-3xl font-bold font-mono text-destructive">
                    -{totalExpenses.toLocaleString('ru-RU')} ₽
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Icon name="ArrowDown" size={14} className="mr-1" />
                    <span>За октябрь 2025</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Расходы по категориям</CardTitle>
                  <CardDescription>Топ-5 категорий за месяц</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCategories.map(([category, amount], index) => {
                    const percentage = (amount / totalExpenses) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary" style={{ opacity: 1 - index * 0.15 }} />
                            <span className="font-medium">{category}</span>
                          </div>
                          <span className="font-mono font-semibold">{amount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${percentage}%`, opacity: 1 - index * 0.15 }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {percentage.toFixed(1)}% от общих расходов
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Последние транзакции</CardTitle>
                  <CardDescription>5 недавних операций</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-accent/10' : 'bg-destructive/10'
                          }`}>
                            <Icon
                              name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'}
                              size={18}
                              className={transaction.type === 'income' ? 'text-accent' : 'text-destructive'}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono font-semibold ${
                            transaction.type === 'income' ? 'text-accent' : 'text-foreground'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4 mt-0">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Все транзакции</CardTitle>
                    <CardDescription>История операций по счёту</CardDescription>
                  </div>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <Input placeholder="Поиск по описанию..." className="w-full" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="income">Доход</SelectItem>
                      <SelectItem value="expense">Расход</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-mono font-semibold ${
                            transaction.type === 'income' ? 'text-accent' : 'text-foreground'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-0">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Аналитика расходов</CardTitle>
                <CardDescription>Детальная статистика по категориям</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Средний чек</p>
                    <p className="text-2xl font-bold font-mono">
                      {(totalExpenses / transactions.filter(t => t.type === 'expense').length).toFixed(0)} ₽
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Транзакций в месяц</p>
                    <p className="text-2xl font-bold font-mono">
                      {transactions.filter(t => t.type === 'expense').length}
                    </p>
                  </div>
                </div>
                {topCategories.map(([category, amount]) => {
                  const percentage = (amount / totalExpenses) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm font-mono font-semibold">{amount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(1)}%</span>
                        <span>{(amount / transactions.filter(t => t.category === category).length).toFixed(0)} ₽ средний чек</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4 mt-0">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Бюджеты категорий</CardTitle>
                    <CardDescription>Планируемые лимиты расходов</CardDescription>
                  </div>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать бюджет
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const isOverLimit = percentage > 100;
                  const isWarning = percentage > 80 && percentage <= 100;

                  return (
                    <div key={budget.category} className="p-4 rounded-lg border border-border/50 bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{budget.category}</h3>
                        <Badge variant={isOverLimit ? 'destructive' : isWarning ? 'outline' : 'secondary'}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isOverLimit ? 'bg-destructive' : isWarning ? 'bg-yellow-500' : 'bg-accent'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono text-muted-foreground">
                          {budget.spent.toLocaleString('ru-RU')} ₽ из {budget.limit.toLocaleString('ru-RU')} ₽
                        </span>
                        <span className="font-mono font-semibold">
                          {(budget.limit - budget.spent).toLocaleString('ru-RU')} ₽ осталось
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4 mt-0">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Категории расходов</CardTitle>
                    <CardDescription>Управление категориями транзакций</CardDescription>
                  </div>
                  <Button size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить категорию
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const total = categoryData[category] || 0;
                    const count = transactions.filter(t => t.category === category).length;
                    
                    return (
                      <div
                        key={category}
                        className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{category}</h3>
                          <Icon name="Tag" size={16} className="text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold font-mono">{total.toLocaleString('ru-RU')} ₽</p>
                        <p className="text-xs text-muted-foreground mt-1">{count} транзакций</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}