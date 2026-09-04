# Pinho Arquitetura — Concept

Protótipo visual e funcional de um novo website para a Pinho Arquitetura.

## Correr localmente

```bash
npm install
npm run dev
```

Abrir o endereço indicado pelo Vite (normalmente http://localhost:5173).

## Área de administração

Abrir:

`/admin`

O protótipo permite:
- criar, editar e apagar projectos;
- editar título, localização, ano, categoria, estado e descrição;
- definir projectos em destaque;
- gerir capa e galeria de imagens;
- ordenar imagens da galeria;
- editar a ficha do projecto;
- gerir Drawings, Models, Credits e Featured on;
- editar nome do atelier, textos e contactos.

### Importante

Este é um **protótipo para apresentação ao cliente**. Os dados ficam guardados em `localStorage` no browser. O upload de imagens é convertido em Data URL e também fica local.

Para produção, a mesma interface deverá ser ligada a:
- base de dados (por exemplo PostgreSQL/Supabase/Neon/TiDB);
- storage de imagens (Vercel Blob, Cloudinary ou Supabase Storage);
- autenticação real para `/admin`;
- optimização/resize das imagens;
- domínio existente `pinhoarquitetura.com`.

## Contactos

Foi possível confirmar publicamente apenas que a Pinho Arquitetura está sediada em Aveiro e o perfil de LinkedIn da empresa. Email e telefone ficam propositadamente em branco no conteúdo inicial e podem ser preenchidos no Admin para não inventar dados.

## Imagens

As fotografias deste protótipo são imagens de demonstração remotas (Unsplash). Devem ser substituídas pelas fotografias reais das obras antes de qualquer publicação pública.


Contactos
Pagina de enviar email sozinho???