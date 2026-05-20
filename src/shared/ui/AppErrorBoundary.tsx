import { Component, type ErrorInfo, type ReactNode } from "react";
import { Text, YStack } from "tamagui";

import { useAppPreferences } from "@/src/shared/theme";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

function AppErrorFallback({ error }: { error: Error }) {
  const { colors } = useAppPreferences();

  return (
    <YStack
      gap="$3"
      p="$6"
      style={{
        alignItems: "center",
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text fontSize="$6" fontWeight="900" style={{ color: colors.text, textAlign: "center" }}>
        Nao foi possivel renderizar esta tela
      </Text>
      <Text fontSize="$3" lineHeight="$4" style={{ color: colors.textMuted, maxWidth: 520, textAlign: "center" }}>
        Recarregue a pagina. Se o erro continuar, verifique o componente indicado no console.
      </Text>
      <Text fontSize="$2" style={{ color: colors.danger, maxWidth: 520, textAlign: "center" }}>
        {error.message}
      </Text>
    </YStack>
  );
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App render error", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      return <AppErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
