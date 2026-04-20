import { ChefHat, TrendingDown, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

export default function CmvDashboard() {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <ChefHat className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Gestão de CMV</h1>
      </div>
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Saúde Financeira</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-border rounded-lg p-4">
            <TrendingDown className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">—</p>
            <p className="text-sm text-muted-foreground">CMV atual</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">—</p>
            <p className="text-sm text-muted-foreground">Margem estimada</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <DollarSign className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">—</p>
            <p className="text-sm text-muted-foreground">Ticket médio</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <BarChart3 className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">—</p>
            <p className="text-sm text-muted-foreground">Faturamento</p>
          </div>
        </div>
      </section>
      <div className="border border-border rounded-lg p-6 text-center">
        <ChefHat className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium">Aguardando dados de CMV</p>
        <p className="text-sm text-muted-foreground mt-1">
          Os agentes vão calcular seu CMV automaticamente após registrar as primeiras compras.
        </p>
      </div>
    </div>
  );
}
