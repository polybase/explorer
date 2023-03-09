import { Container, Heading, Stack, useColorMode, Link } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { githubLight } from '@uiw/codemirror-theme-github'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { javascript } from '@polybase/codemirror-lang-javascript'

export interface StudioAppSettingsProps {
  namespace: string
}

const initCode = (namespace: string) => `import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "${namespace}",
});`

export function StudioAppSettings({ namespace }: StudioAppSettingsProps) {
  const colorMode = useColorMode()
  return (
    <Container maxW='container.lg'>
      <Stack py={8} spacing={8}>
        <Heading as='h1'>Get Started</Heading>
        <Stack>
          <Heading as='h2' fontSize='2xl'>Install SDK</Heading>
          <code>
            <pre>
              yarn add @polybase/client
            </pre>
          </code>
        </Stack>
        <Stack>
          <Heading as='h2' fontSize='2xl'>Ininitate your client</Heading>
          <CodeMirror
            theme={colorMode.colorMode === 'dark' ? vscodeDark : githubLight}
            readOnly
            value={initCode(namespace)}
            extensions={[javascript({ typescript: true })]}
            style={{
              border: `1px solid ${colorMode.colorMode === 'dark' ? '#2d2d2d' : '#e2e8f0'}`,
            }}
          />
        </Stack>
        <Stack>
          <Heading as='h2' fontSize='2xl'>Next Steps</Heading>
          <Stack fontWeight={600}>
            <Link color='purple.500' isExternal href='https://polybase.xyz/docs/collections'>Understand Collections</Link>
            <Link color='purple.500' isExternal href='https://polybase.xyz/docs/write-data'>Write Data</Link>
            <Link color='purple.500' isExternal href='https://polybase.xyz/docs/read'>Read Data</Link>
          </Stack>
        </Stack>
        <Stack>
          <Heading as='h2' fontSize='2xl'>Need Help?</Heading>
          <Stack fontWeight={600}>
            <Link color='purple.500' isExternal href='https://discord.com/invite/DrXkRpCFDX'>Join our Discord Server!</Link>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}