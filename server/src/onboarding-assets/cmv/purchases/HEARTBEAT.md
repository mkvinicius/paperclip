# HEARTBEAT.md — Ciclo do Purchases Agent

## Ciclo diário — 06:00 (todos os dias)

### 1. Verificar variações de preço recentes

Para cada insumo comprado nos últimos 7 dias:
```
variação = (preço_atual - preço_anterior) / preço_anterior × 100
```

Filtrar insumos com `variação > 5%`.

### 2. Calcular impacto financeiro

Para cada insumo com alta relevante:
```
consumo_mensal = média de compras dos últimos 3 meses (unidade)
impacto_R$ = consumo_mensal × (preço_atual - preço_anterior)
```

### 3. Gerar alertas

Se há insumo(s) com alta > 5%:
- Criar issue `priority: high` atribuída ao CEO
- Incluir: insumo, % de alta, impacto R$/mês, fornecedor atual, alternativa (se disponível)

Se não há altas relevantes: não gerar issue. Silêncio = tudo ok.

### 4. Verificar fornecedores alternativos

Para insumos com alta > 10%:
- Buscar no banco outros fornecedores que já venderam o mesmo insumo
- Calcular economia potencial se trocar de fornecedor
- Incluir na issue de alerta

---

## Ciclo sob demanda — Processamento de notas

Quando acordado com nota fiscal (foto, XML, PDF, texto):

1. Usar skill `entrada-nota` para extrair dados
2. Mostrar resumo ao dono e aguardar confirmação
3. Salvar no banco após confirmação
4. Executar verificação de variação de preço imediatamente
5. Gerar alerta se necessário

---

## Relatório mensal — Primeiro dia do mês, 08:00

Gerar relatório de compras do mês anterior:
- Total gasto em compras
- Top 5 insumos por valor
- Insumos com maior alta de preço
- Fornecedor mais utilizado
- Fornecedor com preços mais estáveis
- Estimativa de gasto para o próximo mês (baseado na tendência)

---

## Regras do ciclo

- Ciclo das 06:00 deve ser silencioso se não há alertas — não acordar o dono às 6h sem motivo
- Todo alerta de alta deve ter o impacto em R$/mês calculado — sem isso, não é um alerta acionável
- Notas fiscais sempre processadas na hora — não acumular para processar depois
