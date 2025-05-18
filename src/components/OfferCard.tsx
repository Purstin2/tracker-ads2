import { useMemo, useState } from "react";
import { calculateScore, calculateTrend } from "@/services/scoreService";
import { Offer } from "@/types/offer";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Star,
  Pin,
  Archive,
  Trash2,
  MoreVertical,
  ExternalLink,
  Calendar,
  Activity,
  Target,
  Zap,
  Eye,
  Clock,
  BarChart3
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface OfferCardProps {
  offer: Offer;
  onClick: (offer: Offer) => void;
  onPin?: (offer: Offer) => void;
  onFavorite?: (offer: Offer) => void;
  onArchive?: (offer: Offer) => void;
  onDelete?: (offer: Offer) => void;
  onRefresh?: () => void;
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  viewMode?: "grid" | "list";
}

// Componente de Score Modernizado
interface ScoreBadgeProps {
  score: { value: number; result: 'high' | 'medium' | 'low' };
  className?: string;
}

const ModernScoreBadge = ({ score, className }: ScoreBadgeProps) => {
  const getScoreConfig = () => {
    switch (score.result) {
      case 'high':
        return {
          gradient: "from-green-500 to-emerald-600",
          text: "text-white",
          glow: "shadow-green-500/25",
          icon: "🚀"
        };
      case 'medium':
        return {
          gradient: "from-yellow-500 to-orange-500",
          text: "text-white",
          glow: "shadow-yellow-500/25",
          icon: "⚡"
        };
      case 'low':
        return {
          gradient: "from-red-500 to-rose-600",
          text: "text-white",
          glow: "shadow-red-500/25",
          icon: "⚠️"
        };
    }
  };

  const config = getScoreConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            `relative flex items-center justify-center w-16 h-16 rounded-xl 
             bg-gradient-to-br ${config.gradient} ${config.text} 
             shadow-lg ${config.glow} cursor-pointer
             hover:scale-110 transition-all duration-300
             before:absolute before:inset-0 before:rounded-xl 
             before:bg-gradient-to-br before:from-white/20 before:to-transparent 
             before:opacity-0 hover:before:opacity-100 before:transition-opacity`,
            className
          )}>
            <div className="text-center">
              <div className="text-lg font-bold">{score.value}%</div>
              <div className="text-xs opacity-90">Score</div>
            </div>
            <div className="absolute -top-1 -right-1 text-xs">
              {config.icon}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Score de performance: {score.value}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente de Métrica Inline
interface InlineMetricProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const InlineMetric = ({ icon: Icon, label, value, trend, color = "text-blue-500" }: InlineMetricProps) => (
  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all">
    <Icon className={cn("w-4 h-4", color)} />
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
      <div className="flex items-center space-x-1">
        <p className="text-sm font-semibold">{value}</p>
        {trend && trend !== 'neutral' && (
          <span className={cn(
            "flex items-center",
            trend === 'up' ? "text-green-500" : "text-red-500"
          )}>
            {trend === 'up' ? 
              <TrendingUp className="w-3 h-3" /> : 
              <TrendingDown className="w-3 h-3" />
            }
          </span>
        )}
      </div>
    </div>
  </div>
);

const OfferCard = ({ 
  offer, 
  onClick, 
  onPin,
  onFavorite,
  onArchive,
  onDelete,
  onRefresh,
  isPinned = false,
  isFavorite = false,
  isArchived = false,
  viewMode = "grid"
}: OfferCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const score = useMemo(() => calculateScore(offer), [offer]);
  const trend = useMemo(() => calculateTrend(offer), [offer]);
  
  const lastUpdate = new Date(offer.updatedAt);
  const dayCount = offer.adData.length;
  const latestAds = offer.adData[offer.adData.length - 1]?.activeAds || 0;
  
  const getTrendDirection = (): 'up' | 'down' | 'neutral' => {
    if (trend.direction === 'up') return 'up';
    if (trend.direction === 'down') return 'down';
    return 'neutral';
  };

  const openAdLibraryUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (offer.facebookAdLibraryUrl) {
      window.open(offer.facebookAdLibraryUrl, '_blank');
    }
  };

  if (viewMode === "list") {
    return (
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 cursor-pointer group border-0 shadow-md hover:shadow-xl",
          "bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800",
          isPinned && "ring-2 ring-blue-500/50 shadow-blue-500/10",
          isArchived && "opacity-60",
          "hover:scale-[1.01] hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:to-slate-700"
        )}
        onClick={() => onClick(offer)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Score Badge */}
            <ModernScoreBadge score={score} className="flex-shrink-0" />
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {isPinned && <Pin className="w-4 h-4 text-blue-500" />}
                    {isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                    <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                      {offer.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {offer.description}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {offer.facebookAdLibraryUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-60 hover:opacity-100"
                      onClick={openAdLibraryUrl}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-60 hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onPin && onPin(offer);
                      }}>
                        <Pin className="mr-2 h-4 w-4" />
                        {isPinned ? "Desafixar" : "Fixar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onFavorite && onFavorite(offer);
                      }}>
                        <Star className="mr-2 h-4 w-4" />
                        {isFavorite ? "Remover favorito" : "Favoritar"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onArchive && onArchive(offer);
                      }}>
                        <Archive className="mr-2 h-4 w-4" />
                        {isArchived ? "Desarquivar" : "Arquivar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete && onDelete(offer);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <InlineMetric
                  icon={Activity}
                  label="Anúncios"
                  value={latestAds}
                  trend={getTrendDirection()}
                  color="text-green-500"
                />
                
                {offer.totalPageAds && offer.totalPageAds > 0 && (
                  <InlineMetric
                    icon={Target}
                    label="Total Página"
                    value={offer.totalPageAds}
                    color="text-blue-500"
                  />
                )}
                
                <InlineMetric
                  icon={Calendar}
                  label="Dias"
                  value={dayCount}
                  color="text-purple-500"
                />
                
                <InlineMetric
                  icon={Clock}
                  label="Atualizado"
                  value={lastUpdate.toLocaleDateString('pt-BR')}
                  color="text-orange-500"
                />
              </div>
              
              {/* Tags */}
              {offer.keywords && offer.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {offer.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {keyword}
                    </Badge>
                  ))}
                  {offer.keywords.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{offer.keywords.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 cursor-pointer group border-0 shadow-lg hover:shadow-2xl",
        "bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700",
        isPinned && "ring-2 ring-blue-500/50 shadow-blue-500/20",
        isArchived && "opacity-60",
        "hover:scale-[1.03] hover:-translate-y-1"
      )}
      onClick={() => onClick(offer)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardContent className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {isPinned && <Pin className="w-4 h-4 text-blue-500" />}
              {isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
              <h3 className="font-bold text-xl truncate group-hover:text-blue-600 transition-colors">
                {offer.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {offer.description}
            </p>
          </div>
          
          {/* Score Badge */}
          <ModernScoreBadge score={score} />
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Anúncios Ativos</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{latestAds}</p>
                  {trend.direction !== 'stable' && (
                    <span className={cn(
                      "flex items-center text-xs",
                      trend.direction === 'up' ? "text-green-500" : "text-red-500"
                    )}>
                      {trend.direction === 'up' ? 
                        <TrendingUp className="w-3 h-3 mr-1" /> : 
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      {Math.abs(trend.percentage).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {offer.totalPageAds && offer.totalPageAds > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Página</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{offer.totalPageAds}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          )}
        </div>

        {/* Secondary Metrics */}
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2 flex-1">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-muted-foreground">{dayCount} dias</span>
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-muted-foreground text-xs">
              {lastUpdate.toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Tags */}
        {offer.keywords && offer.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {offer.keywords.slice(0, 3).map((keyword, index) => (
              <Badge 
                key={index}
                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300"
              >
                {keyword}
              </Badge>
            ))}
            {offer.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{offer.keywords.length - 3} mais
              </Badge>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex space-x-2">
            {offer.facebookAdLibraryUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                onClick={openAdLibraryUrl}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Facebook
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite && onFavorite(offer);
              }}
            >
              <Star className={cn("w-4 h-4", isFavorite && "fill-yellow-500 text-yellow-500")} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onPin && onPin(offer);
                }}>
                  <Pin className="mr-2 h-4 w-4" />
                  {isPinned ? "Desafixar" : "Fixar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onArchive && onArchive(offer);
                }}>
                  <Archive className="mr-2 h-4 w-4" />
                  {isArchived ? "Desarquivar" : "Arquivar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(offer);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Hover Action */}
        <div className={cn(
          "absolute inset-x-4 bottom-4 transform transition-all duration-300",
          isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClick(offer);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;