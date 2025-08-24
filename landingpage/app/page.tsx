"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MapPin, MessageCircle } from "lucide-react"
import OccurrenceMap from "@/components/OccurrenceMap"

export default function PegueOPumbaLanding() {
  const [phone, setPhone] = useState("")
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [coordinates, setCoordinates] = useState([{ latitude: "", longitude: "" }])
  const [isRegistered, setIsRegistered] = useState(false)
  const [secondPhone, setSecondPhone] = useState("")
  const [isSecondPhoneValid, setIsSecondPhoneValid] = useState(false)

  const validatePhone = (phoneNumber: string) => {
    const phoneRegex = /^(\+55\s?)?((\d{2})\s?)?\d{4,5}-?\d{4}$/
    return phoneRegex.test(phoneNumber.replace(/\s/g, ""))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)
    setIsPhoneValid(validatePhone(value))
  }

  const handleSecondPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSecondPhone(value)
    setIsSecondPhoneValid(validatePhone(value))
  }

  const addCoordinate = () => {
    setCoordinates([...coordinates, { latitude: "", longitude: "" }])
  }

  const updateCoordinate = (index: number, field: 'latitude' | 'longitude', value: string) => {
    const newCoordinates = [...coordinates]
    newCoordinates[index][field] = value
    setCoordinates(newCoordinates)
  }

  const removeCoordinate = (index: number) => {
    if (coordinates.length > 1) {
      const newCoordinates = coordinates.filter((_, i) => i !== index)
      setCoordinates(newCoordinates)
    }
  }

  const handleRegister = () => {
    const hasValidCoordinates = coordinates.some(coord => coord.latitude && coord.longitude)
    if (isPhoneValid && hasValidCoordinates) {
      setIsRegistered(true)
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Olá! Gostaria de reportar uma ocorrência de javalis.")
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background border-b border-border py-4 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-lg">Pegue o Pumba</span>
          </div>
          <nav className="flex space-x-6">
            <a href="#junte-se" className="text-foreground hover:text-primary transition-colors">
              Quem Somos
            </a>
            <a href="#mapa-ocorrencias" className="text-foreground hover:text-primary transition-colors">
              Mapa de Ocorrências
            </a>
            <a href="/sua-privacidade" className="text-foreground hover:text-primary transition-colors">
              Sua Privacidade
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-primary text-primary-foreground min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Os Javalis estão ameaçando a sua propriedade?</h1>
          <p className="text-2xl md:text-3xl mb-8 opacity-90">
            Receba um alerta quando alguma manada for reportada perto de você
          </p>

          {!isRegistered ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Digite seu telefone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="bg-primary-foreground text-foreground"
                />
                {phone && !isPhoneValid && (
                  <p className="text-sm text-primary-foreground/80">
                    Por favor, digite um número válido (ex: (11) 99999-9999)
                  </p>
                )}
              </div>

                                {isPhoneValid && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-sm text-primary-foreground/90">
                        Enviaremos um alerta para um raio de 10km da sua localização quando javalis forem reportados
                      </p>
                      <div className="space-y-3">
                        {coordinates.map((coord, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="grid grid-cols-2 gap-2 flex-1">
                              <Input
                                type="number"
                                placeholder="Latitude (-24.883133)"
                                value={coord.latitude}
                                onChange={(e) => updateCoordinate(index, 'latitude', e.target.value)}
                                className="bg-primary-foreground text-foreground placeholder:italic"
                                step="any"
                              />
                              <Input
                                type="number"
                                placeholder="Longitude (-53.466666)"
                                value={coord.longitude}
                                onChange={(e) => updateCoordinate(index, 'longitude', e.target.value)}
                                className="bg-primary-foreground text-foreground placeholder:italic"
                                step="any"
                              />
                            </div>
                            <div className="flex gap-1">
                              {coordinates.length > 1 && (
                                <Button
                                  onClick={() => removeCoordinate(index)}
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary-foreground text-foreground border-primary-foreground/20 hover:bg-primary-foreground/90"
                                >
                                  ×
                                </Button>
                              )}
                              {index === coordinates.length - 1 && (
                                <Button
                                  onClick={addCoordinate}
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
                                >
                                  +
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={handleRegister}
                        disabled={!coordinates.some(coord => coord.latitude && coord.longitude)}
                        className="w-full text-foreground"
                        style={{ backgroundColor: '#d6ceaa' }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Registrar para Alertas
                      </Button>
                    </div>
                  )}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-primary-foreground/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Cadastro Realizado!</h3>
                <p className="opacity-90">
                  Você receberá alertas quando javalis forem reportados próximos à sua localização.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Large Text - Left Side */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-primary leading-none">
                Pegue o Pumba
              </h2>
            </div>

            {/* Image - Right Side */}
            <div className="flex-1 lg:flex-shrink-0">
              <img
                src="/images/wild-boar-threat.jpg"
                alt="Javali agressivo mostrando presas - representando a ameaça às propriedades"
                className="w-full h-auto max-w-lg mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-medium leading-relaxed">
            Ele já está em quase metade das cidades brasileiras, destruindo plantações e florestas nativas.
          </p>
        </div>
      </section>

      {/* Mapa de Ocorrências Section */}
      <section id="mapa-ocorrencias" className="py-20 px-4 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Mapa de Ocorrências</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Visualize onde os javalis foram reportados em todo o Brasil. Cada ponto representa uma ocorrência 
              com um raio de 10km para alertas.
            </p>
          </div>
          
          <div className="mb-8">
            <OccurrenceMap />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Os círculos representam a área de 10km ao redor de cada ocorrência reportada
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-semibold mb-6">O que você pode fazer</h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <MessageCircle className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">Relate a presença de javalis</h4>
                  <p className="text-base text-muted-foreground">Ajude a mapear onde os javalis estão.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <MapPin className="h-8 w-8 text-secondary" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">Receba alertas na hora</h4>
                  <p className="text-base text-muted-foreground">Saiba quando há risco perto de você.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-8 w-8 text-accent" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">Conecte-se a caçadores registrados</h4>
                  <p className="text-base text-muted-foreground">(em breve)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4"
            >
              Receba alertas no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="junte-se" className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-card-foreground">
            Junte-se ao esforço coletivo na caça aos javalis
          </h2>
          <p className="text-2xl md:text-3xl mb-8 text-card-foreground leading-relaxed">
            Pegue o Pumba é um esforço coletivo sem fins lucrativos e independente que recebe alertas de javalis e
            reporta para quem estiver cadastrado, ajudando a proteger terras agrícolas e áreas de preservação em todo o Brasil.
          </p>
          <Button
            onClick={openWhatsApp}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Relate a presença de javalis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-lg font-semibold">Pegue o Pumba</p>
            <p className="opacity-80 max-w-md">Iniciativa comunitária para monitoramento e controle de javalis</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
