# Estudo de Consumo de CSV em Aplicação Web

Este projeto é um estudo prático focado na integração de dados entre um arquivo CSV remoto (como a exportação pública de uma planilha online do Google Sheets) e uma interface web sem o uso de bancos de dados ou frameworks pesados.

---

## Foco do Estudo

* **Consumo de Dados Remotos:** Leitura e parseamento de arquivos CSV via HTTP Fetch API no frontend.
* **Resiliência e Fallback:** Alternância automática de fontes de dados. Caso a URL remota (.env) esteja indisponível, o sistema utiliza o arquivo local `exemplo.csv`.
* **Manipulação Assíncrona:** Renderização dinâmica de dados estruturados e manipulação de estado na DOM usando JavaScript puro (Vanilla JS).

---

## Estrutura dos Arquivos

* `index.html`: Estrutura base da interface e navegação.
* `script.js`: Lógica de roteamento, requisição Fetch do CSV, parse e renderização dos cards.
* `style.css`: Estilização e layout responsivo.
* `exemplo.csv`: Base de dados local para desenvolvimento/fallback.
* `.env`: Arquivo de variáveis de ambiente com a URL de produção do CSV.
* `.env.example`: Modelo do arquivo de configuração de variáveis.

---

## Como Executar o Projeto

1. Clone o repositório ou baixe os arquivos em sua máquina.
2. (Opcional) Configure o link da planilha online:
   * Faça uma cópia do arquivo `.env.example` e renomeie para `.env`.
   * Insira a URL direta para download do CSV na variável `SPREADSHEET_URL`.
3. Inicie um servidor local para testar (ex: extensão Live Server no VS Code, ou execute via Python):
   ```bash
   python -m http.server 8000
   ```
4. Acesse `http://localhost:8000` no seu navegador.

---

## Formato do Arquivo CSV

O CSV consumido pelo sistema deve seguir a ordem de colunas abaixo:

```csv
nome,data,horario,local,distancia,status,link
"Corrida Exemplo","15/10/2024","07:00","Praça Central","5km e 10km","Aberto","https://exemplo.com"
```