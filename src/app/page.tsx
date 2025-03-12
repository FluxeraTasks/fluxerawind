import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bot, Brain, Building2, GitMerge, LineChart, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import fluxeraIcon from "@/public/FluxeraIcon.png";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#7c3aed_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c3aed_100%)]" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={fluxeraIcon}
                alt="Fluxera Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span className="text-xl font-bold">Fluxera</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm font-medium hover:text-primary">
                Features
              </Link>
              <Link href="#ai" className="text-sm font-medium hover:text-primary">
                IA
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                Preços
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20">
            <div className="mx-auto max-w-3xl space-y-8 text-center animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Gestão de Projetos Potencializada por Inteligência Artificial
              </h1>
              <p className="mx-auto max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
                Organize, documente e gerencie seus projetos com o poder da IA. 
                Transforme dados em insights e garanta o sucesso dos seus projetos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    Começar Agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="relative py-24">
          <div className="container space-y-12">
            <div className="mx-auto max-w-[58rem] space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Tudo que você precisa para gerenciar projetos
              </h2>
              <p className="text-muted-foreground">
                Uma plataforma completa que une organização, documentação e inteligência.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="card group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section id="ai" className="relative py-24">
          <div className="container relative space-y-12">
            <div className="mx-auto max-w-[58rem] space-y-4 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Inteligência Artificial a seu favor
              </h2>
              <p className="text-muted-foreground">
                Deixe a IA ajudar você a tomar melhores decisões e otimizar seus processos.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {aiFeatures.map((feature) => (
                <div 
                  key={feature.title} 
                  className="card group flex gap-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          <div className="container">
            <div className="mx-auto max-w-[58rem] text-center space-y-8">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Pronto para transformar sua gestão de projetos?
              </h2>
              <p className="text-muted-foreground text-lg">
                Comece gratuitamente e descubra como o Fluxera pode ajudar sua empresa.
              </p>
              <div>
                <Link href="/sign-up">
                  <Button size="lg" className="gap-2">
                    Criar Conta Grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t py-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src={fluxeraIcon}
                alt="Fluxera Logo"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-xl font-bold">Fluxera</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestão de projetos inteligente para empresas modernas
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-sm font-bold">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary">Preços</Link></li>
                <li><Link href="#demo" className="hover:text-primary">Demo</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">Sobre</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Carreiras</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Termos</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Workspaces Organizados",
    description: "Organize todas as informações da sua empresa em espaços de trabalho intuitivos e seguros.",
    icon: <Building2 className="h-6 w-6 text-primary" />,
  },
  {
    title: "Gestão de Projetos",
    description: "Controle seus projetos com metodologias ágeis e acompanhe o progresso em tempo real.",
    icon: <Workflow className="h-6 w-6 text-primary" />,
  },
  {
    title: "Features e User Stories",
    description: "Gerencie user stories e features seguindo as melhores práticas do SCRUM.",
    icon: <GitMerge className="h-6 w-6 text-primary" />,
  },
  {
    title: "Artefatos Inteligentes",
    description: "Documente e organize entregáveis com suporte da IA para melhor rastreabilidade.",
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    title: "Análise de Impacto",
    description: "Visualize o impacto das mudanças e tome decisões baseadas em dados.",
    icon: <LineChart className="h-6 w-6 text-primary" />,
  },
  {
    title: "Reaproveitamento",
    description: "Reutilize features e artefatos entre projetos para maior eficiência.",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
]

const aiFeatures = [
  {
    title: "Assistente de Documentação",
    description: "IA que ajuda a criar e manter documentação clara e consistente para seus projetos.",
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    title: "Análise Preditiva",
    description: "Preveja riscos e oportunidades com base em dados históricos dos seus projetos.",
    icon: <LineChart className="h-6 w-6 text-primary" />,
  },
  {
    title: "Recomendações Inteligentes",
    description: "Receba sugestões de features e artefatos similares para reutilização.",
    icon: <Brain className="h-6 w-6 text-primary" />,
  },
  {
    title: "Automação de Processos",
    description: "Automatize tarefas repetitivas e foque no que realmente importa.",
    icon: <Workflow className="h-6 w-6 text-primary" />,
  },
]
