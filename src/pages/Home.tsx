import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, Code, Zap } from 'lucide-react';

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/50 to-white/95"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
          <div className="absolute inset-0 glow opacity-50">
            <img 
              src="/FluxeraIcon.png"
              alt="Fluxera Background"
              className="w-full h-full object-contain opacity-10"
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex items-center flex-col justify-center gap-6 mb-12 animate-fade-in">
            <div className="relative">
              <img 
                src="/FluxeraIcon.png"
                alt="Fluxera Logo"
                className="w-32 h-32 floating-icon icon-pulse"
              />
              <div className="absolute inset-0 glow"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 mb-5">
            Fluxera <br/>
            Transforme os Dados do seu SAP
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Automatize documentações, otimize códigos e analise impactos com nossa plataforma alimentada por IA de última geração.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Começar Agora
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button className="inline-flex items-center px-6 py-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
              Agendar Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-16">Recursos do Fluxera</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <img 
                  src="/FluxeraIcon.png"
                  alt="Fluxera Icon"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">Análise Inteligente</h3>
              <p className="text-muted-foreground">
                Análise automatizada de código e impacto usando algoritmos avançados de IA.
              </p>
            </div>

            <div className="fade-in p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-4 delay-100">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Documentação Automática</h3>
              <p className="text-muted-foreground">
                Geração inteligente de documentação técnica e funcional para seus projetos SAP.
              </p>
            </div>

            <div className="fade-in p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 translate-y-4 delay-200">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Otimização de Código</h3>
              <p className="text-muted-foreground">
                Sugestões inteligentes para melhorar a qualidade e performance do seu código SAP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Comece sua transformação digital</span>
            </div>
            
            <h2 className="text-4xl font-bold mb-6">
              Pronto para revolucionar sua operação SAP?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Junte-se a centenas de empresas que já estão usando o Fluxera para transformar seus processos SAP com o poder da IA.
            </p>

            <button className="inline-flex items-center px-8 py-4 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors text-lg">
              Agende uma Demonstração
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 relative">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img 
                src="/FluxeraLogo.png"
                alt="Fluxera Logo"
                className="h-6"
              />
            </div>
            
            <div className="flex gap-6 text-muted-foreground">
              <a href="#" className="hover:text-purple-600 transition-colors">Sobre</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Recursos</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Blog</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;