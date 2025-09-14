# Desafio Unitá - Time Applausos
## Sumário

## 🚀 Como rodar o projeto
Siga os passos abaixo para executar o projeto localmente:
```bash
# 1. Clone o repositório
git clone link_deste_repositório

# 2. Acesse a pasta do projeto
cd seu-projeto

# 3. Crie o arquivo .env na raiz do projeto e insira sua chave da API da Open AI
# Exemplo:
# OPENAI_API_KEY=sua_chave_aqui

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

## Desafio Proposto

> Criar um **agente de suporte interativo** capaz de responder perguntas de usuários com base em uma **base de conhecimento** prévia e, nos casos em que não houver resposta disponível, registrar automaticamente um chamado em um **mini sistema de chamados.**

## 🔍 Buscamos entender melhor o problema: Comunicação Corporativa

Atualmente, **54% das empresas** enfrentam **dificuldades** em se **comunicar** com seus colaboradores. [Eu Capacito](https://www.eucapacito.com.br/mercado/54-das-empresas-possuem-dificuldade-em-se-comunicar-com-seus-colaboradores-aponta-pesquisa/?utm_source=chatgpt.com). Outro desafio crítico é a baixa mensuração de resultados: **40% das empresas não acompanham indicadores** de comunicação interna, dificultando a tomada de decisões baseada em dados.

- Os setores não se conversam, o que gera **retrabalho** e **lentidão**

Além disso, **58,8% das empresas não possuem** programas estruturados de **diálogo**, evidenciando a falta de processos e ferramentas eficazes de comunicação interna. 

- Cada usuário tem um comportamento **específico**: gestores, equipes de operação e colaboradores comuns precisam se comunicar por **meios diferentes** e da forma **mais simples** possível.

Diante desse cenário, o problema central que queremos solucionar é:

👉 Como as empresas podem adotar uma solução de suporte interno mais interativa e estratégica, que engaje os colaboradores e ainda permita mensuração clara de resultados?

## Nossa Solução  

### Vídeo demonstrando a solução 
[Link no youtube:] (https://youtu.be/teJ6g_JrBWk)


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Video with README</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5rem;
        }
        
        .subtitle {
            color: #7f8c8d;
            font-size: 1.2rem;
        }
        
        .content {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .video-container {
            flex: 1;
            min-width: 300px;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
        }
        
        .video-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .info-container {
            flex: 1;
            min-width: 300px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .info-section {
            margin-bottom: 25px;
        }
        
        .info-section h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-section p {
            margin-bottom: 15px;
            color: #34495e;
        }
        
        .info-section ul, .info-section ol {
            padding-left: 20px;
            margin-bottom: 15px;
        }
        
        .info-section li {
            margin-bottom: 8px;
        }
        
        .code-block {
            background: #2d3436;
            color: #f5f6fa;
            padding: 15px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            margin: 15px 0;
        }
        
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }
        
        .tag {
            background: #3498db;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        footer {
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            margin-top: 20px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
        }
        
        .social-links a {
            color: #2c3e50;
            font-size: 1.5rem;
            transition: color 0.3s;
        }
        
        .social-links a:hover {
            color: #3498db;
        }
        
        @media (max-width: 768px) {
            .content {
                flex-direction: column;
            }
            
            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>YouTube Video Embed</h1>
            <p class="subtitle">A beautiful layout for showcasing your YouTube content</p>
        </header>
        
        <div class="content">
            <div class="video-container">
                <div class="video-wrapper">
                    <iframe src="https://www.youtube.com/embed/teJ6g_JrBWk" 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
            
            <div class="info-container">
                <div class="info-section">
                    <h2><i class="fas fa-info-circle"></i> About This Video</h2>
                    <p>This video demonstrates how to create an elegant YouTube video embed with a README-style layout using HTML and CSS. The design is fully responsive and will look great on all devices.</p>
                    <p>You can use this template to showcase your own videos along with detailed information, code examples, and resources.</p>
                </div>
                
                <div class="info-section">
                    <h2><i class="fas fa-code"></i> Implementation</h2>
                    <p>To embed a YouTube video, you can use the following code:</p>
                    <div class="code-block">
                        &lt;div class="video-wrapper"&gt;<br>
                        &nbsp;&nbsp;&lt;iframe src="https://www.youtube.com/embed/VIDEO_ID" &gt;&lt;/iframe&gt;<br>
                        &lt;/div&gt;
                    </div>
                    <p>Replace <strong>VIDEO_ID</strong> with your actual YouTube video ID.</p>
                </div>
                
                <div class="info-section">
                    <h2><i class="fas fa-feather-alt"></i> Features</h2>
                    <ul>
                        <li>Fully responsive design</li>
                        <li>Modern gradient background</li>
                        <li>README-style documentation layout</li>
                        <li>Code snippet display</li>
                        <li>Social media links</li>
                        <li>Clean and professional appearance</li>
                    </ul>
                </div>
                
                <div class="tags">
                    <span class="tag">YouTube</span>
                    <span class="tag">Embed</span>
                    <span class="tag">HTML</span>
                    <span class="tag">CSS</span>
                    <span class="tag">README</span>
                </div>
            </div>
        </div>
        
        <footer>
            <p>Created with <i class="fas fa-heart" style="color: #e74c3c;"></i> by DevDesign</p>
            <div class="social-links">
                <a href="#"><i class="fab fa-github"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
        </footer>
    </div>
</body>
</html>

Propomos a criação de um **assistente de suporte inteligente** que utiliza IA para responder perguntas de colaboradores com base em uma **base de conhecimento corporativa** responsável por auxiliar colaboradores no dia a dia com mais agilidade e produtividade e abrir chamados. 

> Apenas 4% das empresas documentam seus processos de forma consistente, enquanto 50% o fazem apenas ocasionalmente, segundo pesquisa da BPTrends citada pela [Atlassian](https://www.atlassian.com/br/work-management/knowledge-sharing/documentation).

A API acessa uma **base de conhecimento dinâmica**, que evolui continuamente: sempre que não houver resposta disponível, o sistema abre um chamado, registra a solução validada e a incorpora à base.  

👉 A IA também aprimora o texto da resposta do chamado e incluir o artigo de forma padronizada na Base de Conhecimento.

## Design Mínimo do MVP
<img width="1999" height="1967" alt="design-system-applausos" src="https://github.com/user-attachments/assets/0c4dfd7f-aa9d-44c0-981e-ecca78c67fd6" />

Com isso:  

- As respostas ficam cada vez **mais completas**;  
- A abertura de novos chamados **diminui progressivamente**;  
- A documentação da empresa permanece **atualizada e confiável**.  

A cada interação, o agente se torna **mais inteligente e estratégico** para a organização.  

## 🚀 Diferenciais da Nossa Solução  

Nossa solução vai além de um simples sistema de chamados: ela combina **IA Generativa**, **busca semântica** e recursos de acessibilidade para transformar a comunicação corporativa em um processo inteligente e ágil.

### Classificação Inteligente de Chamados com IA Generativa
Direcionamento automático para o setor correto, eliminando retrabalho e reduzindo drasticamente o tempo de triagem.

### Priorização por Análise de Sentimento
A IA interpreta o tom da mensagem e identifica a urgência, garantindo que problemas críticos sejam tratados primeiro.

### Acessibilidade por Áudio
Suporte a leitura e interação por voz, promovendo inclusão e ampliando o alcance da solução

- ✨ Comunicação Personalizada, Simples e Acessível 
Permitir que cada usuário solicite suporte da forma mais rápida e intuitiva.

### Personalização Visual
Interface flexível que se adapta à identidade da empresa, reforçando a cultura organizacional.

### Gestão Ágil em Kanban
Acompanhamento visual do fluxo de chamados, aumentando a produtividade e a colaboração entre equipes.

## Requisitos Atendidos

### Tela de Chat
- ✅ R1: O usuário poderá enviar perguntas por meio da janela de chat.
- ✅ R2: Quando a pergunta tiver resposta na base de conhecimento, o sistema deverá responder de acordo com o conteúdo do artigo.
- ✅ R3: Quando a pergunta não possuir resposta, o sistema deverá informar claramente que não
possui a resposta e registrar automaticamente um chamado no mini sistema de
chamados.
- ✅ R7: A interface deve ser clara, organizada e intuitiva.
- ✅ R8: Deve haver diferenciação visual entre mensagens enviadas pelo usuário e respostas do sistema.
- ✅ R9: A aplicação deve fornecer feedback visual para ações realizadas (ex.: confirmação de chamado registrado).
- ✅ Diferencial 5: Interface aprimorada, com experiência de chat mais próxima de soluções reais


## 🤖 Sobre o Assistente Inteligente
- ✅ R5: O sistema deve responder em tempo adequado ao uso em demonstração, sem travamentos perceptíveis.
- ✅ R6: O registro de chamados e a consulta à base de conhecimento devem ocorrer de forma ágil e estável
- ✅ Diferencial 3: Uso de modelos de IA generativa (local ou externa) ou LLM para resumir ou estruturar as respostas com base nos artigos da base de conhecimento.

👉 Escolhemos prototipar a solução usando a **OpenAI** pois ela oferece **baixa latência** e modelos bastante ajustados para tarefas de conversação. Além disso, é compatível com diferentes linguagens e frameworks e de** uso simples **via API REST, assim foi possível **incorporar rapidamente os modelos à aplicação**, ideal para prototipação.  

**A IA funciona da seguinte forma:**

1. **Busca de informações relevantes:**  
Antes de responder, a IA pesquisa os conteúdos mais importantes na base de conhecimento relacionados à pergunta do usuário.

2. **Contexto da conversa:**  
A IA mantém as últimas mensagens do usuário e do assistente (até 6) para entender o histórico da conversa e fornecer respostas coerentes.

3. **Regras de resposta rigorosas:**  
- Responde **somente com informações da base de conhecimento**.  
- Se não houver informações relevantes, retorna exatamente `"SEM_RESPOSTA_DISPONIVEL"`.  
- Não inventa respostas nem usa informações externas.  
- Quando há dados disponíveis, a resposta é **amigável, direta e concisa**.

### Board Kanban
- ✅ R4: Deve ser possível visualizar os chamados registrados em uma lista, apresentando id,
título, descrição e status.

### Base de Conhecimento
- ✅ Escopo: A base de conhecimento deverá conter, obrigatoriamente, mais de um artigo.
- ✅ Diferencial 4: Inclusão de artigos mais complexos, com conteúdo mais extenso, exigindo análise e extração de trechos relevantes.

👉 Inserimos na base um total de 4 artigos longos sobre assuntos relacionados aos setores de RH, TI, Financeiro. Nosso agente é capaz de extrair as informações importantes para responder o usuário.

### Nosso Projeto
- ✅ R10: O código e os arquivos devem estar organizados em estrutura clara e coerente.
### README
- ✅ R11: Deve haver um documento simples de instruções (README) explicando como executar a solução e realizar os testes.

Você está aqui! ☺️

### Responsividade 

- ✅ Diferencial 1: A interface poderá ser responsiva, permitindo uso em diferentes tamanhos de tela, incluindo dispositivos móveis.
### Busca Semântica
- ✅ Diferencial 2: Utilização de técnicas de resposta semântica para interpretar perguntas.

👉A nossa solução utiliza **busca semântica** para identificar conteúdos relevantes mesmo quando o usuário não utiliza exatamente os mesmos termos do artigo.

#### Como funciona?

1. A query do usuário é processada e comparada com títulos, conteúdo, tags e categorias do artigo.  
2. Um **mapa de sinônimos e termos relacionados** é usado para aumentar a relevância de resultados que têm significado próximo à pergunta.
3. Cada artigo recebe uma **pontuação de relevância** com base na correspondência semântica, e os melhores resultados são destacados.
4. A IA gera uma **resposta inteligente**, contextualizando o resultado e, se necessário, cria um chamado para suporte humano.  

### Indicadores 
- ✅ Diferencial 6: Indicadores ou métricas simples sobre o funcionamento do agente.

## 🔧 Requisitos Técnicos – Critério de Escolha das Ferramentas  
### ⚡ Next.js + Node.js  
- Escolhemos Next.js + Node.js para entregar performance excepcional, escalabilidade robusta e desenvolvimento ágil em uma stack unificada e moderna. 
### ⚡ GPT-4o mini 
- Optamos pelo modelo GPT-4o mini como o coração da nossa IA generativa devido ao equilíbrio ideal entre desempenho e precisão. 
- Velocidade superior: Respostas em tempo real (∼300ms)
- Capacidade inteligente: 128K context window para conversas longas

🎯 Melhorias Futuras
- Integração com Slack, Microsoft Teams, Jira e Trello.
- Sistema de notificações push
- Integração com ERP corporativo
- Arquitetura modular para fácil expansão
- Database scaling preparado para crescimento

## 👥 Time Applausos
Desenvolvido com ❤️ pelo Time Applausos para o Desafio Unitá.

# Quem somos? 
nossa equipe durante a edição de 2024 do Hackathon InovaApps, promovido pela UVV, onde conquistamos o 🥇 primeiro lugar com nossa proposta inovadora.

🌟 Destaques e Conquistas
🏆 Hackathon InovaApps 2024
- Primeiro lugar na competição 

👩🔬 Liga Feminina de TI da UVV
- Co-fundadoras da primeira liga feminina de TI do estado
Missão: promover e apoiar a presença feminina na tecnologia

🚀 Campus Mobile 2025
- Selecionadas para participar da edição 2025 em São Paulo
- Patrocínio UVV para representar a universidade nacionalmente

💡 Nosso Propósito
- "Unir inovação tecnológica com diversidade para criar soluções que transformam a comunicação corporativa e empoderam mulheres na tecnologia."

### 💻 **Maria Eduarda** 
**Desenvolvedora Fullstack na Autoglass**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Maria_Eduarda-%230A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/maria-fiorio-84764217b/)

### 🧠 **Isabel** 
**Cientista de Dados na Autoglass**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Isabel-%230A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/isabel-valentim-25b8581a2)

### 🛠️ **Juliany** 
**Engenheira de Software no Ifood**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Juliany-%230A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/juliany-fernandes)

