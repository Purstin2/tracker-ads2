import { useState, useMemo } from "react";
import { useOffers } from "@/hooks/useOffers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  ShoppingCart,
  Zap,
  Target,
  Activity,
  ArrowUpRight,
  Sparkles,
  Eye,
  Plus
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NewOfferForm from "@/components/NewOfferForm";
import { Offer } from "@/types/offer";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { calculateScore } from "@/services/scoreService";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Componente de Métrica Moderna
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  gradient: string;
  description?: string;
}

const MetricCard = ({ title, value, change, trend, icon: Icon, gradient, description }: MetricCardProps) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      {/* Glassmorphism Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {change && (
                <span className={cn(
                  "flex items-center text-sm font-medium",
                  trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
                )}>
                  {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                   trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                  {Math.abs(change)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          
          {/* Icon com Glow Effect */}
          <div className={`p-3 rounded-xl ${gradient} bg-opacity-20 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de Quick Action
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
}

const QuickAction = ({ title, description, icon: Icon, color, href, badge }: QuickActionProps) => {
  return (
    <Link to={href} className="group">
      <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {badge && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {badge}
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          
          <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
            Acessar <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Componente de Score Visual
interface ScoreVisualizationProps {
  data: Array<{ name: string; value: number; color: string }>;
}

const ScoreVisualization = ({ data }: ScoreVisualizationProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span>Performance das Ofertas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie Chart */}
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-sm">{item.value}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.name}</p>
                {total > 0 && (
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {((item.value / total) * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Index = () => {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const { offers, loading, pinnedOffers, favoriteOffers, archivedOffers, refreshOffers } = useOffers();
  const isMobile = useIsMobile();

  const handleCreateOfferSuccess = () => {
    setIsCreatingOffer(false);
    refreshOffers();
  };

  const handleNewOfferClick = () => {
    setIsCreatingOffer(true);
  };

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const activeOffers = offers.filter(offer => !archivedOffers.has(offer.id));
    
    const totalActiveAds = activeOffers.reduce((total, offer) => {
      const latestData = offer.adData[offer.adData.length - 1];
      return latestData ? total + latestData.activeAds : total;
    }, 0);

    const totalPageAds = activeOffers.reduce((total, offer) => total + (offer.totalPageAds || 0), 0);

    // Calculate trend
    const todayTotal = totalActiveAds;
    let yesterdayTotal = 0;
    activeOffers.forEach(offer => {
      const dataLength = offer.adData.length;
      if (dataLength >= 2) {
        const yesterdayData = offer.adData[dataLength - 2];
        if (yesterdayData) {
          yesterdayTotal += yesterdayData.activeAds;
        }
      }
    });

    const trendPercentage = yesterdayTotal ? Math.abs((todayTotal - yesterdayTotal) / yesterdayTotal * 100) : 0;
    const trendDirection = todayTotal > yesterdayTotal ? 'up' : todayTotal < yesterdayTotal ? 'down' : 'neutral';

    // Score distribution
    const scoreDistribution = {
      high: activeOffers.filter(offer => calculateScore(offer).result === 'high').length,
      medium: activeOffers.filter(offer => calculateScore(offer).result === 'medium').length,
      low: activeOffers.filter(offer => calculateScore(offer).result === 'low').length
    };

    // Chart data for trend
    const chartData = (() => {
      const dates = new Set<string>();
      activeOffers.forEach(offer => {
        offer.adData.forEach(data => {
          dates.add(data.date);
        });
      });

      const sortedDates = Array.from(dates).sort();
      
      return sortedDates.slice(-7).map(date => {
        let totalAds = 0;
        activeOffers.forEach(offer => {
          const adDataForDate = offer.adData.find(d => d.date === date);
          if (adDataForDate) {
            totalAds += adDataForDate.activeAds;
          }
        });
        
        return {
          date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          totalAds
        };
      });
    })();

    return {
      totalOffers: activeOffers.length,
      totalActiveAds,
      totalPageAds,
      trendPercentage,
      trendDirection,
      scoreDistribution,
      chartData,
      daysMonitored: chartData.length,
      pinnedCount: pinnedOffers.size,
      favoriteCount: favoriteOffers.size
    };
  }, [offers, archivedOffers, pinnedOffers, favoriteOffers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas ofertas e monitore performance
            </p>
          </div>
          
          <Button 
            onClick={handleNewOfferClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
            Nova Oferta
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Ofertas"
            value={stats.totalOffers}
            icon={BarChart3}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            description={`${stats.pinnedCount} fixadas, ${stats.favoriteCount} favoritas`}
          />
          
          <MetricCard
            title="Anúncios Ativos"
            value={stats.totalActiveAds}
            change={stats.trendPercentage}
            trend={stats.trendDirection}
            icon={Activity}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            description="Comparado com ontem"
          />
          
          <MetricCard
            title="Anúncios das Páginas"
            value={stats.totalPageAds}
            icon={ShoppingCart}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            description="Total em todas as páginas"
          />
          
          <MetricCard
            title="Dias Monitorados"
            value={stats.daysMonitored}
            icon={Calendar}
            gradient="bg-gradient-to-br from-orange-500 to-amber-600"
            description="Últimos 7 dias com dados"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trend Chart */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Evolução dos Anúncios</span>
                  <span className="text-sm text-muted-foreground">(7 dias)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.chartData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalAds" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorAds)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Visualization */}
          <div className="space-y-6">
            <ScoreVisualization 
              data={[
                { name: "Alta", value: stats.scoreDistribution.high, color: "#10B981" },
                { name: "Média", value: stats.scoreDistribution.medium, color: "#F59E0B" },
                { name: "Baixa", value: stats.scoreDistribution.low, color: "#EF4444" }
              ]}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-semibold">Acesso Rápido</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction
              title="Gerenciar Ofertas"
              description="Visualize e edite todas as suas ofertas ativas"
              icon={Eye}
              color="from-blue-500 to-blue-600"
              href="/offers"
              badge="Novo"
            />
            
            <QuickAction
              title="Análises Detalhadas"
              description="Relatórios avançados e insights de performance"
              icon={BarChart3}
              color="from-purple-500 to-purple-600"
              href="/analytics"
            />
            
            <QuickAction
              title="Notas e Lembretes"
              description="Mantenha suas anotações organizadas"
              icon={Calendar}
              color="from-green-500 to-green-600"
              href="/notes"
            />
          </div>
        </div>
      </div>

      {/* New Offer Dialog */}
      <Dialog open={isCreatingOffer} onOpenChange={setIsCreatingOffer}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 p-0 border-0 shadow-2xl">
          <NewOfferForm 
            onSuccess={handleCreateOfferSuccess}
            onCancel={() => setIsCreatingOffer(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;