import { Html, Head, Font, Preview, Heading, Row, Section, Text } from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>

        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your Mystiq verification code is {otp}</Preview>

      <Section
        style={{
          backgroundColor: "#f4f4f7",
          padding: "40px 0",
        }}
      >
        <Section
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "10px",
          }}
        >
          <Row>
            <Heading
              as="h2"
              style={{
                color: "#111827",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Hello {username},
            </Heading>
          </Row>

          <Row>
            <Text
              style={{
                fontSize: "16px",
                color: "#374151",
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              Thank you for registering on Mystiq. Use the verification code below to complete your signup.
            </Text>
          </Row>

          <Row>
            <Text
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                letterSpacing: "8px",
                textAlign: "center",
                color: "#2563eb",
                margin: "30px 0",
              }}
            >
              {otp}
            </Text>
          </Row>

          <Row>
            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textAlign: "center",
                lineHeight: "22px",
              }}
            >
              If you did not request this code, you can safely ignore this email.
            </Text>
          </Row>
        </Section>
      </Section>
    </Html>
  );
}
