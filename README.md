# Fe Fisio

Site da **Fe Fisio**, consultório de Fisioterapia Dermato Funcional e Home Care da Dra. Fernanda Lima da Rosa (CREFITO-3 nº 17213-F), em São Caetano do Sul/SP. Domínio previsto: [fefisio.com.br](https://fefisio.com.br).

> Status: **protótipo para revisão**. Textos e layout ainda podem mudar.

## Estrutura

```
index.html            página única (hero, sobre, tratamentos, home care, como funciona, contato)
assets/css/style.css  estilos (paleta oliva, bronze e creme; Cormorant Garamond + Jost)
assets/js/main.js     efeitos de rolagem (sem bibliotecas)
assets/img/           logo, monograma, foto, favicon e imagem de compartilhamento
```

É um site estático: HTML, CSS e JavaScript puros, sem etapa de build.

## Ver localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação

Qualquer hospedagem de site estático serve (GitHub Pages, Netlify, Cloudflare Pages ou a hospedagem do domínio). Basta publicar a raiz do repositório.

## Regras de conteúdo (COFFITO)

- Sem preços, promoções ou fotos de antes e depois.
- Sem promessa de resultado.
- CREFITO-3 nº 17213-F visível no site.
- Usar "especialista" só para títulos registrados no COFFITO.
