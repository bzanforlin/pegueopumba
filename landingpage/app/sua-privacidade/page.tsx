import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Sua Privacidade - Pegue o Pumba",
  description: "Política de privacidade do sistema de alerta de javalis Pegue o Pumba",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-primary">Pegue o Pumba</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-16 px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Sua Privacidade</h1>
          <p className="text-xl text-muted-foreground">
            Entenda como protegemos e utilizamos suas informações no sistema de alerta de javalis.
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Coleta de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Coletamos apenas as informações essenciais para o funcionamento do sistema de alertas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong>Número de telefone:</strong> Para envio de alertas via SMS ou WhatsApp
                </li>
                <li>
                  <strong>Coordenadas geográficas:</strong> Para determinar sua área de interesse e enviar alertas
                  relevantes
                </li>
                <li>
                  <strong>Dados de localização de ocorrências:</strong> Reportados pela comunidade para mapear atividade
                  de javalis
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Como Usamos Seus Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Seus dados são utilizados exclusivamente para:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Enviar alertas quando javalis são reportados em um raio de 10km da sua localização</li>
                <li>Criar um mapa colaborativo de ocorrências de javalis</li>
                <li>Conectar você com equipes de caçadores registrados (funcionalidade futura)</li>
                <li>Melhorar o sistema de alertas com base em padrões de atividade</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Proteção dos Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Implementamos medidas de segurança para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Acesso restrito apenas a administradores autorizados</li>
                <li>Não compartilhamos dados pessoais com terceiros</li>
                <li>Armazenamento seguro em servidores protegidos</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Seus Direitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Solicitar a exclusão dos seus dados a qualquer momento</li>
                <li>Atualizar suas informações de contato e localização</li>
                <li>Cancelar o recebimento de alertas</li>
                <li>Acessar informações sobre como seus dados são utilizados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Non-Profit Nature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Iniciativa Sem Fins Lucrativos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                O Pegue o Pumba é uma iniciativa coletiva e independente sem fins lucrativos. Não vendemos, alugamos ou
                comercializamos seus dados pessoais. Todos os dados coletados são utilizados exclusivamente para o
                funcionamento do sistema de alertas e proteção da comunidade contra javalis.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Para dúvidas sobre privacidade, exclusão de dados ou outras questões relacionadas ao tratamento das suas
                informações, entre em contato conosco através do WhatsApp ou pelos canais oficiais do projeto.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Última atualização:</strong> Janeiro de 2025
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Voltar à Página Inicial
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
