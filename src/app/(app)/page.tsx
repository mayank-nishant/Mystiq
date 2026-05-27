"use client";

import { Mail } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Autoplay from "embla-carousel-autoplay";

import messages from "@/messages.json";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 px-4 py-12 text-white md:px-24">
        {/* Hero Section */}
        <section className="mb-8 text-center md:mb-12">
          <h1 className="text-3xl font-bold md:text-5xl">Dive into the World of Anonymous Messages</h1>

          <p className="mt-3 text-base text-gray-300 md:mt-4 md:text-lg">Mystiq — Where your identity remains a secret.</p>
        </section>

        {/* Carousel */}
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="relative w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-white text-black shadow-lg">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-start space-x-4">
                      <Mail className="mt-1 h-5 w-5 shrink-0 text-blue-500" />

                      <div>
                        <p className="text-sm md:text-base">{message.content}</p>

                        <p className="mt-2 text-xs text-gray-500">{message.received}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="bg-white text-black border shadow-md hover:bg-gray-100" />

          <CarouselNext className="bg-white text-black border shadow-md hover:bg-gray-100" />
        </Carousel>
      </main>

      <footer className="bg-gray-900 p-4 text-center text-white md:p-6">© {new Date().getFullYear()} Mystiq. All rights reserved.</footer>
    </>
  );
}
