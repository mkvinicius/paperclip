import {
  ChefHat,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Truck,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { ChartCard } from "@/components/ActivityCharts";
import { useCompany } from "../context/CompanyContext";
import { cn } from "../lib/utils";

/* ---------- types (replace with API shapes when endpoints exist) ---------- */

type CmvSnapshot = {
  actualCmvBps: number;        // e.g. 3420 = 34.20%
  theoreticalCmvBps: number;   // e.g. 3200 = 32.00% (meta teórica)
  faturamentoCents: number;
};

type CmvAlert = {
  id: string;
  severity: "low" | "medium" | "high" | "urgent";
  message: string;
  impactCents: number | null;
};

type SupplierRow = {
  id: string;
  name: string;
  items: number;
  recentChange: string | null;
  stability: "stable" | "volatile";
};

type TrendPoint = { label: string; bps: number };

/* ---------- helpers ---------- */

function fmtBRL(cents: number) {
  return `R$ ${(cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPct(bps: number) {
  return `${(bps / 100).toFixed(1)}%`;
}

/* ---------- sub-components ---------- */

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</h2>
      {subtitle && <p className="text-[11px] text-muted-foreground/60 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function CmvStatusChip({ actualBps, targetBps }: { actualBps: number; targetBps: number }) {
  const diff = actualBps - targetBps;
  const status = diff <= 0 ? "ok" : diff <= 200 ? "atenção" : "alerta";
  return <StatusBadge status={status} />;
}

function AlertRow({ alert }: { alert: CmvAlert }) {
  const Icon = alert.severity === "low" ? CheckCircle2 : AlertTriangle;
  const colorClass: Record<CmvAlert["severity"], string> = {
    low: "text-muted-foreground",
    medium: "text-amber-600 dark:text-amber-400",
    high: "text-orange-600 dark:text-orange-400",
    urgent: "text-destructive",
  };
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", colorClass[alert.severity])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm">{alert.message}</p>
        {alert.impactCents !== null && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Impacto estimado: {fmtBRL(alert.impactCents)}/mês
          </p>
        )}
      </div>
      <StatusBadge status={alert.severity} />
    </div>
  );
}

function SupplierTable({ suppliers }: { suppliers: SupplierRow[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto_auto] text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-4 py-2 border-b border-border bg-muted/30">
        <span>Fornecedor</span>
        <span className="px-4 text-center">Insumos</span>
        <span className="px-4 text-center">Variação</span>
        <span className="text-right">Status</span>
      </div>
      {suppliers.map((s) => (
        <div
          key={s.id}
          className="grid grid-cols-[1fr_auto_auto_auto] px-4 py-2.5 border-b border-border last:border-0 items-center text-sm"
        >
          <span className="font-medium truncate">{s.name}</span>
          <span className="px-4 text-center text-muted-foreground tabular-nums">{s.items}</span>
          <span
            className={cn(
              "px-4 text-center text-xs font-medium tabular-nums",
              s.recentChange?.startsWith("+")
                ? "text-destructive"
                : s.recentChange
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground",
            )}
          >
            {s.recentChange ?? "—"}
          </span>
          <div className="flex justify-end">
            <StatusBadge status={s.stability === "stable" ? "estável" : "volátil"} />
          </div>
        </div>
      ))}
    </div>
  );
}

function CmvTrendBars({ points, targetBps }: { points: TrendPoint[]; targetBps: number }) {
  const maxBps = Math.max(...points.map((p) => p.bps), targetBps + 400);
  return (
    <div>
      <div className="flex items-end gap-[3px] h-20">
        {points.map((p, i) => {
          const height = Math.round((p.bps / maxBps) * 100);
          const over = p.bps > targetBps;
          return (
            <div key={i} className="flex-1" title={`${p.label}: ${fmtPct(p.bps)}`}>
              <div
                className={cn("w-full rounded-t-sm", over ? "bg-orange-400 dark:bg-orange-500" : "bg-foreground/25")}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[3px] mt-1.5">
        {points.map((p, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[9px] text-muted-foreground">{p.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/25 shrink-0" />
          Dentro da meta
        </span>
        <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 dark:bg-orange-500 shrink-0" />
          Acima da meta
        </span>
        <span className="text-[9px] text-muted-foreground ml-auto">Meta: {fmtPct(targetBps)}</span>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export function CmvDashboard() {
  const { selectedCompanyId } = useCompany();

  // TODO: replace these with useQuery calls when CMV API endpoints are available.
  // e.g.: const { data: snapshot } = useQuery({ queryKey: ["cmv", "snapshot", selectedCompanyId], ... });
  const snapshot = null as CmvSnapshot | null;
  const alerts: CmvAlert[] = [];
  const suppliers: SupplierRow[] = [];
  const trendPoints: TrendPoint[] = [];
  const cmvTargetBps = 3200;

  const hasData = snapshot !== null;

  if (!selectedCompanyId) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <EmptyState icon={ChefHat} message="Selecione uma empresa para ver o dashboard de CMV." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <ChefHat className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Gestão de CMV</h1>
        {hasData && (
          <CmvStatusChip actualBps={snapshot!.actualCmvBps} targetBps={snapshot!.theoreticalCmvBps} />
        )}
      </div>

      <div className="flex-1 p-6 space-y-8">

        {/* Painel 1 — Saúde Financeira */}
        <section>
          <SectionHeader title="Saúde Financeira" subtitle="Indicadores do período atual" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="border border-border rounded-lg overflow-hidden">
              <MetricCard
                icon={TrendingDown}
                value={hasData ? fmtPct(snapshot!.actualCmvBps) : "—"}
                label="CMV atual"
                description={hasData ? `Meta: ${fmtPct(snapshot!.theoreticalCmvBps)}` : "Sem dados ainda"}
              />
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <MetricCard
                icon={TrendingUp}
                value={hasData ? fmtPct(10000 - snapshot!.actualCmvBps) : "—"}
                label="Margem estimada"
                description="Margem bruta"
              />
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <MetricCard
                icon={DollarSign}
                value="—"
                label="Ticket médio"
                description="Disponível em breve"
              />
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <MetricCard
                icon={BarChart3}
                value={hasData ? fmtBRL(snapshot!.faturamentoCents) : "—"}
                label="Faturamento"
                description="Mês atual"
              />
            </div>
          </div>
        </section>

        {/* Painel 2 — Alertas */}
        <section>
          <SectionHeader
            title="Alertas"
            subtitle="Insumos com alta de preço, pratos acima da meta, desvio CMV teórico vs real"
          />
          <div className="border border-border rounded-lg">
            {alerts.length === 0 ? (
              <EmptyState
                icon={AlertTriangle}
                message="Nenhum alerta ativo. Tudo dentro da meta."
              />
            ) : (
              <div className="px-4">
                {alerts.map((a) => (
                  <AlertRow key={a.id} alert={a} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Painel 3 — Fornecedores */}
        <section>
          <SectionHeader
            title="Fornecedores"
            subtitle="Variação de preço e ranking por estabilidade"
          />
          {suppliers.length === 0 ? (
            <div className="border border-border rounded-lg">
              <EmptyState
                icon={Truck}
                message="Nenhum fornecedor cadastrado. Registre sua primeira nota fiscal para começar."
              />
            </div>
          ) : (
            <SupplierTable suppliers={suppliers} />
          )}
        </section>

        {/* Painel 4 — Tendência e Recomendações */}
        <section>
          <SectionHeader title="Tendência e Recomendações" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="CMV ao longo do tempo" subtitle="Últimos 6 meses">
              {trendPoints.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  Nenhum dado de CMV registrado ainda.
                </p>
              ) : (
                <CmvTrendBars points={trendPoints} targetBps={cmvTargetBps} />
              )}
            </ChartCard>

            <ChartCard title="Ação prioritária" subtitle="Gerada pelo CEO Agent">
              <p className="text-xs text-muted-foreground py-6 text-center">
                O CEO Agent vai recomendar ações baseadas nos seus dados assim que você registrar as primeiras compras.
              </p>
            </ChartCard>
          </div>
        </section>

        {/* Getting started callout — visible until first snapshot */}
        {!hasData && (
          <div className="border border-dashed border-border rounded-lg p-6 text-center space-y-2">
            <ChefHat className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium">Configure seu sistema de CMV</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Registre suas primeiras notas fiscais de compra e o agente CEO vai calcular automaticamente seu CMV, ponto de equilíbrio e primeiro briefing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
