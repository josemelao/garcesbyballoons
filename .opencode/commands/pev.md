---
description: Pipeline PEV (Plan > Execute > Verify) para landing pages — planeja, executa e verifica em sequência, sem diálogo entre fases.
---

Carregue a skill `pev-workflow` com a ferramenta `skill` (id: `pev-workflow`) e siga o workflow PEV de forma linear para o pedido abaixo.

Regras de execução:

- Imprima o cabeçalho de estado (`## PLAN 📋`, `## EXECUTE ⚙️`, `## VERIFY ✅`) antes de cada fase.
- Não peça confirmação nem abra diálogo entre as fases; siga direto.
- Fase de plano: só o checklist de arquivos, sem código.
- Fase de execução: só o código.
- Fase de verificação: cheque acessibilidade/HTML semântico, responsividade e layout quebrado; se houver erro, volte uma vez para a execução.

Pedido: $ARGUMENTS
