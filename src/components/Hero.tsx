"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeaderAndHero() {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const router = useRouter();

  return (
    <Box bg={bgColor} minHeight="100dvh" display="flex" flexDirection="column">
      {/* Header */}
      <Box as="header" py={4} boxShadow="sm">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading
              as="h1"
              fontSize="2xl"
              fontWeight="bold"
              color={headingColor}
            >
              SmartCart
            </Heading>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => router.push("/authenticate")}
            >
              Anmelden
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        as="section"
        flex="1"
        display="flex"
        alignItems="center"
        py={{ base: 8, md: 0 }}
      >
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
          >
            <VStack align="flex-start" spacing={6} maxW="600px">
              <Heading
                as="h2"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                lineHeight="1.2"
                color={headingColor}
              >
                Einfach. Schnell. Effizient.
              </Heading>
              <Text fontSize="lg" color={textColor}>
                Unsere App vereinfacht Ihren Einkaufsalltag. Fügen Sie Artikel
                hinzu, löschen Sie sie und verwalten Sie Ihre persönliche
                Einkaufsliste mit nur wenigen Klicks. Unkompliziert und
                benutzerfreundlich - für einen stressfreien Einkauf.
              </Text>
              <HStack>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} as={StarIcon} color="yellow.400" />
                ))}
                <Text fontWeight="bold" color={textColor}>
                  10k+ zukünftige Bewertungen
                </Text>
              </HStack>
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => router.push("/authenticate")}
                >
                  Anmelden
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  onClick={() => router.push("/authenticate?register=true")}
                >
                  Registrieren
                </Button>
              </HStack>
            </VStack>
            <Box
              position="relative"
              width={{ base: "100%", md: "50%" }}
              height="400px"
              mt={{ base: 8, md: 0 }}
              bgImage={{
                base: "none",
                md: "url('/uuundulate.svg?height=400&width=500')",
              }}
              bgSize="cover"
              bgPosition="center"
            >
              <Box
                position="relative"
                height="400px"
                mt={{ base: 8, md: 0 }}
                width={{ base: "100%", md: "50%" }}
                bgGradient="linear(to-b, white 20%, #3182CE 100%)"
                borderRadius="3xl"
                marginInline="auto"
                shadow="sm"
                p={6}
              >
                <Image
                  src="/doggo.png"
                  alt="App-Vorschau"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
