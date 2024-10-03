"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const schema = z
  .object({
    email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
    password: z
      .string()
      .min(6, { message: "Passwort muss mindestens 6 Zeichen lang sein" }),
    confirmPass: z.string().optional(),
  })
  .refine((data) => !data.confirmPass || data.password === data.confirmPass, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPass"],
  });

type FormData = z.infer<typeof schema>;

const Authenticate: React.FC = () => {
  const [register, setRegister] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const headingColor = useColorModeValue("blue.600", "blue.300");
  const inputBgColor = useColorModeValue("gray.100", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const registerParam = searchParams.get("register");
    if (registerParam === "true") {
      setRegister(true);
    }
  }, [searchParams]);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      let userCredential: UserCredential;
      if (register) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
      }
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Authentifizierungsfehler",
        description: "Es gab einen Fehler bei der Anmeldung.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Google-Anmeldungsfehler",
        description: "Es gab einen Fehler bei der Google-Anmeldung.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      bg={`linear-gradient(to bottom, ${bgColor}, #3182CE)`}
      backgroundImage="url('/uundulate.svg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container maxWidth="md" centerContent>
        <Box
          width="100%"
          maxWidth="400px"
          padding="20px"
          borderRadius="md"
          boxShadow="md"
          bg={bgColor}
        >
          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            mb={6}
            color={headingColor}
          >
            {register ? "Registrieren" : "Anmelden"}
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel color={textColor}>E-Mail</FormLabel>
                <Input
                  {...registerField("email")}
                  type="email"
                  bg={inputBgColor}
                  color={inputColor}
                />
                <Text color="red.500" fontSize="sm">
                  {errors.email?.message}
                </Text>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel color={textColor}>Passwort</FormLabel>
                <Input
                  {...registerField("password")}
                  type="password"
                  bg={inputBgColor}
                  color={inputColor}
                />
                <Text color="red.500" fontSize="sm">
                  {errors.password?.message}
                </Text>
              </FormControl>
              {register && (
                <FormControl isInvalid={!!errors.confirmPass}>
                  <FormLabel color={textColor}>Passwort bestätigen</FormLabel>
                  <Input
                    {...registerField("confirmPass")}
                    type="password"
                    bg={inputBgColor}
                    color={inputColor}
                  />
                  <Text color="red.500" fontSize="sm">
                    {errors.confirmPass?.message}
                  </Text>
                </FormControl>
              )}
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                _hover={{ bg: "blue.600" }}
              >
                {register ? "Registrieren" : "Anmelden"}
              </Button>
            </VStack>
          </form>
          <Button
            onClick={signInWithGoogle}
            colorScheme="gray"
            width="full"
            mt={4}
            _hover={{ bg: "gray.300" }}
          >
            Mit Google anmelden
          </Button>
          <Text mt={4} textAlign="center" color={textColor}>
            {register
              ? "Haben Sie bereits ein Konto?"
              : "Haben Sie kein Konto?"}
            <Button
              variant="link"
              onClick={() => setRegister(!register)}
              ml={2}
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              {register ? "Anmelden" : "Registrieren"}
            </Button>
          </Text>
        </Box>
      </Container>
    </Flex>
  );
};

export default Authenticate;
