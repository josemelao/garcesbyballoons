/* ==========================================================================
   GARCÊS by Balloons — CONFIGURAÇÃO CENTRAL
   --------------------------------------------------------------------------
   Este é o único arquivo que você precisa editar antes de publicar.
   Enquanto os campos de contato estiverem vazios, o site entra em
   MODO DE PRÉ-VISUALIZAÇÃO: exibe um aviso no topo e NÃO envia nada para
   nenhum contato fictício.
   ========================================================================== */
window.GARCES_CONFIG = {

  /* --------------------------------------------------------------------
     1. WhatsApp — formato internacional, APENAS DÍGITOS.
        Exemplo: Brasil (61) 99999-9999  ->  "5561999999999"
        Deixe "" enquanto o número não estiver definido.
     -------------------------------------------------------------------- */
  whatsapp: '',

  /* --------------------------------------------------------------------
     2. Como o telefone deve aparecer escrito na página.
        Exemplo: "(61) 99999-9999"
        Se ficar vazio, usa o número de "whatsapp" já formatado.
     -------------------------------------------------------------------- */
  telefoneExibicao: '',

  /* --------------------------------------------------------------------
     3. E-mail de contato. Exemplo: "contato@dominio.com.br"
     -------------------------------------------------------------------- */
  email: '',

  /* --------------------------------------------------------------------
     4. Instagram — URL completa. Exemplo: "https://instagram.com/usuario"
     -------------------------------------------------------------------- */
  instagram: '',

  /* --------------------------------------------------------------------
     5. Endpoint que recebe o formulário (OPCIONAL).
        Exemplo (Formspree): "https://formspree.io/f/xxxxxxxx"
        Se preenchido, o formulário envia os dados por POST (JSON) para cá
        e o usuário recebe confirmação na própria página.
        Se ficar vazio e houver WhatsApp, o formulário abre o WhatsApp.
        Se os dois estiverem vazios, o formulário avisa que o envio ainda
        não foi configurado (nada é enviado).
     -------------------------------------------------------------------- */
  formEndpoint: '',

  /* --------------------------------------------------------------------
     6. Dados fixos da marca (já fornecidos — não invente outros).
     -------------------------------------------------------------------- */
  marca: 'Garcês by Balloons',
  responsavel: 'Caleb Garcês',
  cidade: 'Cidade Ocidental – GO',
  regioesAtendidas: 'Cidade Ocidental–GO, cidades próximas e Distrito Federal'
};
