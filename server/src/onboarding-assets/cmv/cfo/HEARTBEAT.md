# HEARTBEAT.md — Ciclo do CFO Especialista CMV

## Ciclo semanal — Segunda-feira 08:00

### 1. Calcular CMV da semana

Usar skill `calcular-cmv` com período `semana`:
- CMV teórico (fichas técnicas × vendas)
- CMV real (compras + estoque)
- Desvio entre os dois
- CMV por prato (top 5 mais custosos)

### 2. Comparar com semana anterior

```
variação_semanal = CMV_esta_semana - CMV_semana_anterior
tendência = média das últimas 4 semanas
```

### 3. Gerar relatório semanal

Formato:
```
## Relatório CMV — Semana de DD/MM a DD/MM

| Métrica | Esta semana | Semana anterior | Variação |
|---------|-------------|-----------------|----------|
| CMV%    | X%          | Y%              | ±Zpp     |
| CMV R$  | R$X         | R$Y             | ±R$Z     |

**Top 3 pratos por CMV%:**
1. [prato] — XX%
2. [prato] — XX%
3. [prato] — XX%

**Desvio teórico/real:** Xpp [dentro do limite / atenção / alerta]

**Ação recomendada:** [uma ação concreta]
```

### 4. Criar alertas se necessário

Se CMV acima da meta ou desvio relevante: criar issue `priority: high` atribuída ao CEO.

---

## Ciclo diário — Sob demanda

Quando acordado por:
- CEO solicitando análise de CMV
- Purchases reportando alta de preço relevante
- Dono perguntando diretamente sobre CMV

Executar análise do período solicitado e responder com dados reais.

---

## Regras do ciclo

- Relatório semanal sempre às 08:00 segunda — antes do briefing do CEO (07:00 é o CEO, 08:00 é você)
- Se não há dados suficientes no período, registrar o gap e pedir ao dono que registre compras
- Nunca escalar alerta sem quantificar o impacto em reais
