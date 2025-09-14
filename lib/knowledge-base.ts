export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: "6",
    title: "Processos de Recrutamento e Seleção",
    content: `2. Política de Admissão e Integração (Onboarding)
2.1. Contratação e Documentação:

Todo novo colaborador receberá uma Carta de Oferta (Offer Letter) detalhando cargo, remuneração, benefícios, data de início e demais condições, que deve ser assinada digitalmente antes do primeiro dia.

No Day 1, o colaborador participará da sessão presencial "Welcome [Nome da Empresa]", onde receberá seu kit de boas-vindas e terá sua CTPS anotada e devolvida imediatamente. O registro no eSocial é realizado pelo RH em até 24 horas após a admissão.

2.2. Período de Experiência (90 dias):

Os primeiros 90 dias são um período de integração mútua.

Serão realizados check-ins formais aos 30, 60 e 85 dias entre o colaborador, seu gestor e um representante do RH para alinhamento de expectativas e feedback estruturado.

A qualquer momento dentro deste período, a empresa ou o colaborador podem rescindir o contrato sem justa causa, com aviso prévio de 7 dias (conforme art. 443, §1º da CLT).

3. Regime de Trabalho e Jornada
3.1. Regime Híbrido Flex (Aplicável aos escritórios de São Paulo e Rio de Janeiro):

Os colaboradores estão divididos em duas categorias:

Híbrido Fixo: Devem trabalhar presencialmente 3 dias fixos por semana (definidos pelo líder do departamento para garantir a coesão da equipe).

Híbrido Flex: Têm liberdade para escolher quais 2 dias por semana trabalham no escritório. Os outros 3 dias são remotos.

O escritório funciona no modelo hot desk. Estações de trabalho devem ser reservadas com 24h de antecedência via app #[NomeDoAppDeReservas].

Reuniões internas com mais de 5 participantes devem ser agendadas, preferencialmente, nos "Dios de Conexão" (terças e quartas-feiras).

3.2. Controle de Jornada:

A jornada padrão é de 9h às 18h, com intervalo de 1h para almoço.

O controle é realizado via sistema de ponto eletrônico biométrico para os dias presenciais e via app validado pelo MTE (#[NomeDoApp]) para os dias remotos. O colaborador é integralmente responsável por bater seus pontos.

Horas extras devem ser pré-aprovadas pelo gestor via sistema de solicitação (SolicitaRH) com pelo menos 24h de antecedência. São remuneradas com acréscimo de 75% (superior ao mínimo legal), e o pagamento ocorrerá no folha do mês subsequente.

4. Remuneração e Benefícios
4.1. Estrutura Salarial:

Nossos cargos são enquadrados em um sistema de bandas salariais definidas por benchmark de mercado (consultorias [Nome da Consultoria 1] e [Nome da Consultoria 2]) e complexidade.

Os reajustes salariais coletivos ocorrem anualmente em março. A progressão dentro da banda (ou promoção para outra banda) é feita por mérito e resultado, analisada trimestralmente.

4.2. Pacote de Benefícios (Tangerine Package):

Plano de Saúde: Unimed Nacional, plano empresarial, com coparticipação de 20% para consultas e exames. A adesão é opcional, com custo zero para o colaborador no plano titular.

Vale-Alimentação: R$ 980,00 (isentos de encargos até o limite legal), administrado pelo cartão Alelo.

Auxílio Home Office: Pagamento mensal de R$ 150,00 para custeio de despesas (internet, energia) para colaboradores em regime híbrido ou remoto.

Programa de Participação nos Resultados (PPR): Pagamento semestral, atrelado ao atingimento de KPIs corporativos e individuais. As regras de cálculo são comunicadas transparentemente no início de cada semestre.

5. Desenvolvimento e Performance
5.1. Ciclo de Avaliação de Desempenho (CAD):

Realizamos ciclos semestrais de avaliação (Jan-Jun e Jul-Dez).

O modelo é 360º, com feedbacks do gestor, pares e autoavaliação, baseado em objetivos (OKRs) e competências comportamentais.

O resultado do CAD é o insumo principal para bonificação, promoções e planos de desenvolvimento individual (PDI).

5.2. Orçamento de Desenvolvimento:

Todo colaborador tem direito a um orçamento anual de R$ 3.000,00 para investir em cursos, certificações, livros ou conferências de sua escolha, após aprovação do gestor.

6. Afastamentos e Licenças
Licença-Maternidade: 6 meses integralmente remunerados (sendo 4 meses por lei e 2 meses por política da empresa).

Licença-Paternidade: 40 dias integralmente remunerados (sendo 20 dias por lei e 20 dias por política da empresa).

Licença-Saúde (Health Leave): Afastamentos superiores a 15 dias por doença são acompanhados de perto pelo RH para oferecer suporte e planejar o retorno ao trabalho de forma gradual e segura.

7. Conduta e Desligamento
7.1. Código de Ética:

Violações como assédio moral ou sexual, discriminação, e vazamento de informações confidenciais são passíveis de dispensa imediata por justa causa, após apuração por comitê ético.

7.2. Processo de Desligamento:

Em caso de demissão sem justa causa, o colaborador será convidado para uma Saída Conversada, uma reunião confidencial com RH e gestor para feedback e tratativas do desligamento.

Oferecemos outplacement como benefício padrão em demissões sem justa causa para todos os cargos de liderança (coordenador para cima).

A devolução de equipamentos e o offboarding de sistemas são gerenciados via checklist automatizado no sistema Onfly`,
    category: "Recrutamento e Seleção",
    tags: ["recrutamento", "seleção", "contratação", "rh", "processo seletivo", "entrevista", "candidatos"],
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-06"),
  },
  {
    id: "7",
    title: "Tecnologia da Informação",
    content: `Base de Conhecimento Suporte de TI Uso de Equipamentos e Ativos

Propriedade e Finalidade do Equipamento

Todos os equipamentos de informática incluindo notebooks desktops monitores acessórios periféricos smartphones e softwares são propriedade exclusiva da empresa Estes itens são fornecidos como ferramentas essenciais para a execução de atividades profissionais específicas O uso deve ser estritamente confidencial e restrito a assuntos corporativos O colaborador é formalmente responsável pela custódia o uso adequado e a proteção física e digital de todos os ativos de TI que lhe forem designados

Configuração e Segurança do Notebook

O equipamento é entregue previamente configurado com o sistema operacional padrão da empresa pacote de software corporativo e ferramentas de segurança obrigatórias todas conectadas ao domínio corporativo central É expressamente proibido desinstalar ou modificar qualquer software de segurança como antivírus EDR ou firewall É vetada a instalação de qualquer software não autorizado incluindo jogos aplicativos de download P2P ou programas sem licença válida A prática de jailbreak ou root no dispositivo é uma violação grave da política de segurança O uso de dispositivos de armazenamento USB pessoais é permitido apenas após uma verificação antivírus obrigatória realizada através da ferramenta corporativa designada

Utilização em Ambiente Remoto

Para acesso remoto seguro é obrigatória a conexão através da Rede Virtual Privada VPN corporativa com autenticação multifator MFA sempre habilitada O colaborador deve manter o equipamento em um ambiente físico seguro protegido de exposição a calor excessivo umidade ou qualquer risco potencial de dano físico Durante períodos de inatividade mesmo que curtos o usuário deve travar a estação de trabalho utilizando o comando Windows L ou realizar logout completo da sessão

Transporte do Equipamento

Para o transporte do notebook corporativo é obrigatório o uso da mochila ou case de proteção oficial fornecido pela empresa É estritamente proibido deixar o equipamento desacompanhado em veículos particulares ou públicos inclusive no porta-malas trancado de um carro

Utilização do Smartphone Corporativo

O dispositivo móvel é gerenciado por uma solução de Mobile Device Management MDM que aplica políticas de segurança consistentes Um perfil corporativo separado é configurado para isolar e proteger os dados da empresa que são criptografados e podem ser apagados remotamente em caso de necessidade O dispositivo deve ser utilizado prioritariamente para acesso ao e-mail corporativo aplicativos de comunicação oficial como Teams ou Slack e para autenticação multifator O uso para chamadas de voz e dados pessoais é permitido dentro de limites razoáveis de fair use

Procedimentos de Manutenção

É terminantemente proibido ao usuário realizar qualquer procedimento técnico de manutenção interna no hardware包括 abrir o equipamento ou tentar consertar componentes A reinstalação do sistema operacional formatação do disco ou a alteração de configurações de BIOS UEFI são ações restritas ao departamento de TI Todas as solicitações de suporte técnico devem ser abertas exclusivamente através do Sistema de Chamados oficial Para problemas de urgência crítica que impliquem em falha total de hardware e impeçam completamente o trabalho o usuário deve além de abrir o chamado contatar o suporte através do canal de urgências predefinido

Procedimentos para Perda ou Roubo

Em caso de perda furto ou roubo do equipamento a notificação ao Suporte de TI e ao Departamento de Segurança ou RH deve ser imediata obrigatoriamente dentro de um prazo máximo de duas horas após a ocorrência É obrigatória a realização de um Boletim de Ocorrência policial para documentar o evento Danos físicos acidentais ao equipamento como quedas ou derramamento de líquidos devem ser reportados imediatamente através do Sistema de Chamados para avaliação técnica Danos resultantes de uso negligente ou que violem explicitamente as políticas internas poderão resultar em responsabilização financeira do colaborador após análise técnica e decisão da área responsável

Política de Backup de Dados

A responsabilidade pelo salvamento adequado dos arquivos de trabalho é do colaborador que deve utilizar exclusivamente as pastas sincronizadas do OneDrive for Business ou outra solução em nuvem corporativa equivalente O armazenamento de arquivos críticos exclusivamente na área de trabalho documentos locais ou no disco C local do notebook é considerado uma prática de alto risco A empresa não se responsabiliza pela recuperação de dados perdidos que não tenham sido salvos no local de armazenamento em nuvem designado

Devolução de Equipamentos

Em caso de desligamento da empresa transferência de departamento ou troca de equipamento o colaborador deve devolver integralmente todos os ativos de TI listados em seu Termo de Entrega original A devolução será formalizada mediante conferência física e assinatura de um Termo de Devolução por um técnico de TI autorizado O atraso na devolução ou a falta de qualquer item listado resultará na retenção do valor de mercado do ativo em sua rescisão até a completa regularização da situação`,
    category: "Normas do RH",
    tags: ["normas", "rh", "férias", "desligamento", "horários", "afastamento", "benefícios", "procedimentos"],
    createdAt: new Date("2024-01-07"),
    updatedAt: new Date("2024-01-07"),
  },
  {
    id: "8",
    title: "Financeiro",
    content: `Departamento financeiro

Gestão de Despesas e Reembolsos

Todos os colaboradores devem utilizar o cartão corporativo para cobrir despesas relacionadas a projetos e operações da empresa sendo estritamente proibida a aquisição de itens pessoais Os gastos devem ser previamente autorizados através do sistema de gestão com a devida seleção do centro de custo e do código do projeto correspondente Para solicitar o reembolso de despesas pagas com recursos pessoais o colaborador deve apresentar dentro de um prazo máximo de trinta dias a nota fiscal original em seu nome e o comprovante de pagamento Todas as solicitações de reembolso devem ser aprovadas pelo gestor imediato e depois submetidas à análise do departamento financeiro através da plataforma digital Designamos até cinco dias úteis para processar e liberar os valores aprovados

Processamento de Faturas e Pagamentos

Os fornecedores devem enviar as faturas exclusivamente para o endereço de email específico do departamento financeiro sendo fundamental que incluam a ordem de compra aprovada e os dados bancários corretos O prazo padrão para o processamento de pagamentos é de trinta dias a partir da data de recebimento da fatura que esteja completa e em conformidade Para pagamentos antecipados é necessária uma justificativa formal e a aprovação expressa da diretoria O setor financeiro realiza pagamentos às terças e quintas-feiras

Relatórios e Conciliação

Cada gestor de departamento tem a obrigação de revisar e validar mensalmente até o quinto dia útil todos os relatórios de despesas associadas ao seu centro de custo Qualquer discrepância ou transação não reconhecida deve ser comunicada imediatamente à equipe financeira através de um chamado específico no sistema A conciliação bancária é realizada diariamente e qualquer inconsistência é tratada como prioridade máxima

Política de Viagens e Eventos

A reserva de passagens aéras e hotéis para viagens corporativas deve ser realizada obrigatoriamente através da agência de viagens credenciada pela empresa para garantir as tarifas negociadas e a cobertura do seguro viagem O limite diário para despesas alimentares durante viagens nacionais é definido com base na localidade e deve ser estritamente respeitado Todas as despesas de viagem devem ser prestadas contas e aprovadas no sistema dentro de cinco dias úteis após o retorno

Orçamento e Previsão

O processo de elaboração do orçamento anual é iniciado no mês de outubro com a participação obrigatória de todos os gestores de área As previsões de gastos devem ser atualizadas trimestralmente no sistema de gestão para garantir a precisão do planejamento financeiro da empresa Desvios significativos em relação ao orçamento aprovado devem ser comunicados e justificados formalmente ao departamento financeiro com a maior antecedência possível

Conformidade Fiscal e Tributária

É responsabilidade de cada colaborador garantir que todas as despesas submetidas estejam em estrita conformidade com as políticas internas e a legislação tributária vigente O departamento financeiro realiza auditorias regulares e aleatórias nas despesas reportadas O não cumprimento das políticas pode resultar na rejeição do reembolso e em medidas disciplinares`,
    category: "Rotinas do RH",
    tags: ["financeiro", "conta", "pagamento", "dinheiro", "receber"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "9",
    title: "Legislação Trabalhista - Manual Completo",
    content: `Base de Conhecimento Jurídico Diretrizes e Processos

Gestão de Contratos e Documentos

Todos os contratos acordos e documentos legais devem ser obrigatoriamente analisados previamente pelo departamento jurídico antes de qualquer assinatura ou formalização A minuta padrão para contratos de prestação de serviços deve ser utilizada como base para todas as novas negociações salvo em casos excepcionais que demandem personalização específica Os prazos de vigência as cláusulas de confidencialidade e as condições de rescisão devem ser revisadas com atenção redobrada Os documentos firmados devem ser armazenados em repositório seguro com acesso restrito e controle de versões

Conformidade Legal e Regulatória

O departamento monitora continuamente as alterações na legislação que impactem as operações da empresa e comunica as áreas affectedadas em tempo hábil A política de conformidade deve ser revisada anualmente com training obrigatório para os colaboradores das áreas de maior exposição legal Todas as solicitações de dados pessoais devem observar estritamente as diretrizes da LGPD sendo necessário o registro do consentimento quando aplicável

Demandas e Litígios

Todas as notificações judiciais extrajudiciais ou intimações recebidas por qualquer setor devem ser imediatamente encaminhadas ao jurídico sob pena de prejuízo processual As demandas internas devem ser formalizadas via sistema com descrição detalhada do fato prazo e envolvidos O acompanhamento de processos judiciais é realizado através de software específico com atualizações mensais para as áreas relacionadas

Propriedade Intelectual e Marcaria

A utilização de marcas logotipos e conteúdos de terceiros exige análise prévia de viabilidade e direito de uso Registros de novas marcas ou patentes devem ser solicitados com antecedência mínima de sessenta dias em relação ao lançamento público ou divulgação Qualquer uso não autorizado de propriedade intelectual da empresa deve ser reportado imediatamente para as devidas providências

Relacionamento com Escritórios Externos

A contratação de advogados ou escritórios externos depende de aprovação prévia do jurídico e deve seguir o processo de due diligence estabelecido As petições e pareceres elaborados por terceiros devem ser revisados e aprovados pelo departamento antes de sua juntada ou apresentação em qualquer instância

Política de Sigilo e Confidencialidade

Todos os colaboradores com acesso a informações sensíveis devem assinar termo de confidencialidade específico atualizado anualmente O compartilhamento de dados estratégicos ou contratuais com pessoas não autorizadas constitui violação grave sujeita a medidas disciplinares O jurídico é o responsável único pela gestão de vazamentos de informação

Canais de Solicitação e Comunicação

As demandas ao jurídico devem ser canalizadas exclusivamente através da plataforma de gestão de requisições com preenchimento completo dos campos obrigatórios Urgências legais definidas como prazos processuais inferiores a setenta e duas horas devem ser comunicadas adicionalmente por telefone para o diretor jurídico`,
    category: "Leis Trabalhistas",
    tags: [
      "legislação",
      "trabalhista",
      "clt",
      "contratos",
      "jornada",
      "férias",
      "13º salário",
      "desligamento",
      "licenças",
      "segurança",
      "saúde",
    ],
    createdAt: new Date("2024-01-09"),
    updatedAt: new Date("2024-01-09"),
  },
]

export function getAllCategories(): string[] {
  const categories = knowledgeBase.map((article) => article.category)
  return [...new Set(categories)]
}

export function syncUserArticlesToKnowledgeBase() {
  if (typeof window !== "undefined") {
    const userArticles = localStorage.getItem("knowledge-base")
    if (userArticles) {
      try {
        const parsed = JSON.parse(userArticles)
        // Adiciona os artigos criados pelos usuários à base de conhecimento para consultas
        const userKnowledgeArticles: KnowledgeArticle[] = parsed.map((item: any) => ({
          id: `user-${item.id}`,
          title: item.title,
          content: item.content,
          category: "Artigos de Usuários",
          tags: ["usuário", "criado", "personalizado"],
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))

        // Retorna a base de conhecimento combinada (padrão + usuários)
        return [...knowledgeBase, ...userKnowledgeArticles]
      } catch (error) {
        console.error("Erro ao sincronizar artigos de usuários:", error)
      }
    }
  }
  return knowledgeBase
}

export function getKnowledgeBaseWithUserArticles(): KnowledgeArticle[] {
  return syncUserArticlesToKnowledgeBase()
}

export function searchKnowledgeBase(query: string): KnowledgeArticle[] {
  const searchTerm = query.toLowerCase()
  const combinedKnowledgeBase = syncUserArticlesToKnowledgeBase()

  return combinedKnowledgeBase.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )
}
