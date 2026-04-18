# HEARTBEAT.md — Ciclo do CEO Conselheiro de Lucro

## Ciclo diário — 07:00 (dias úteis)

### 1. Verificar alertas dos agentes

Consultar o status dos três agentes via Paperclip:
- `GET /api/companies/{companyId}/issues?assigneeAgentId={cfo-id}&status=todo,in_progress`
- `GET /api/companies/{companyId}/issues?assigneeAgentId={purchases-id}&status=todo,in_progress`
- `GET /api/companies/{companyId}/issues?assigneeAgentId={operations-id}&status=todo,in_progress`

Identificar alertas marcados como `priority: urgent` ou `priority: high`.

### 2. Decidir se gera briefing

**Gerar briefing se:**
- É segunda-feira (início de semana sempre merece contexto)
- Há pelo menos um alerta `urgent` ou `high` de qualquer agente
- O CMV do mês está acima da meta configurada

**Não gerar briefing se:**
- É terça a sexta sem alertas relevantes
- Todos os indicadores estão dentro das metas

### 3. Gerar briefing (se aplicável)

Formato máximo 5 frases:
```
1. CMV atual: X% [meta: Y%] — [ok / atenção / alerta].
2. [Principal alerta do período, em reais se possível.]
3. [Segunda informação relevante, se houver.]
4. [Terceira informação, se necessário.]
5. Ação para hoje: [uma ação concreta e acionável].
```

Usar a skill `briefing-diario` para geração e validação do conteúdo.

### 4. Enviar pelo WhatsApp

Se o dono tem número configurado, enviar via gateway do Hermes.
Se não tem número, salvar o briefing como issue comentada na empresa.

---

## Ciclo semanal — Segunda-feira 07:00

Além do briefing diário padrão, incluir:
- Comparação do CMV desta semana vs. semana anterior
- Top insumo que mais impactou o custo
- Progresso em relação ao ponto de equilíbrio

---

## Resposta a perguntas do dono

Quando acordado por uma pergunta (`PAPERCLIP_WAKE_REASON=mention`):

1. Identificar a intenção da pergunta (CMV? Fornecedor? Preço? Break-even?)
2. Consultar o agente especialista correto (CFO, Purchases ou Operations)
3. Buscar dados reais do banco via skill `consulta-livre`
4. Responder em até 5 frases com número real + ação

---

## Regras do ciclo

- Nunca gerar briefing vazio ("tudo bem, nada a reportar")
- Nunca acordar o dono para informação de rotina sem relevância
- Sempre registrar o briefing gerado como comentário na issue principal da empresa
- Se há dados insuficientes para análise, reportar isso claramente ao dono e pedir input
