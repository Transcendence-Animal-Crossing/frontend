import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/styles/global-style';
import { theme } from '@/styles/theme';
import { SessionProvider } from 'next-auth/react';
import { SocketProvider } from '@/utils/SocketProvider';
import { EventEmitterProvider } from '@/utils/EventEmitterProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SocketProvider>
        <EventEmitterProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Component {...pageProps} />
          </ThemeProvider>
        </EventEmitterProvider>
      </SocketProvider>
    </SessionProvider>
  );
}

export default MyApp;
